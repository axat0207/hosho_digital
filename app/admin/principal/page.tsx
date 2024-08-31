"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import AppLayout from "@/components/ui/layouts/AppLayout";
import Image from "next/image";

interface Application {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  aadharCard: string;
  marksheet: string;
  incomeCertificate: string;
  approvedByHod: boolean;
  approvedByFinanceHead: boolean;
  approvedByPrincipal: boolean;
  hodFeedback: string | null;
  principalFeedback: string | null;
  amountSanction: number | null;
  status: string;
  createdAt: string;
  studentId: string;
}

const PrincipalApplicationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Application[]>([]);
  const [filteredData, setFilteredData] = useState<Application[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(3);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [documentModal, setDocumentModal] = useState<boolean>(false);
  const [viewDocument, setViewDocument] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://hosho-digital-be.onrender.com/api/v1/admin/get-applications"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (Array.isArray(result)) {
          setData(result);
          setFilteredData(result);
        } else {
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = Array.isArray(filteredData)
    ? filteredData.slice(indexOfFirstEntry, indexOfLastEntry)
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEntriesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
  };

  const handleViewDocument = (documentUrl: string) => {
    setViewDocument(documentUrl);
    setDocumentModal(true);
  };

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const approve = status === "approved";
      const response = await fetch(
        `https://hosho-digital-be.onrender.com/api/v1/scholarship-application/${id}/approve/principal`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approve,
            principalFeedback: feedback,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setData((prevData) =>
        prevData.map((application) =>
          application.id === id
            ? { ...application, status, principalFeedback: feedback }
            : application
        )
      );
      toast.success(
        `Application ${
          status === "approved" ? "approved" : "rejected"
        } successfully.`
      );
      setSelectedApplication(null);
      setFeedback("");
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedApplication) {
      handleStatusChange(
        selectedApplication.id,
        selectedApplication.status === "approved" ? "approved" : "rejected"
      );
    }
  };

  return (
    <AppLayout>
      <div className="p-6 bg-white shadow-md rounded-lg mt-10 opacity-90">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-[#725AC1]">
            Principal Applications
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="entries" className="text-sm text-gray-700">
              Show
            </label>
            <select
              id="entries"
              className="p-2 border rounded text-sm"
              value={entriesPerPage}
              onChange={handleEntriesChange}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="p-2 border rounded text-sm w-full"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#725AC1] text-white">
                <th className="border-b p-2">#</th>
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Roll No</th>
                <th className="border-b p-2">Branch</th>
                <th className="border-b p-2">Documents</th>
                <th className="border-b p-2">HOD Verified</th>
                <th className="border-b p-2">Principal Feedback</th>
                <th className="border-b p-2">Status</th>
                <th className="border-b p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                currentEntries.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#f0f0f5]">
                    <td className="border-b p-2">
                      {indexOfFirstEntry + index + 1}
                    </td>
                    <td className="border-b p-2">{item.name}</td>
                    <td className="border-b p-2">{item.rollNo}</td>
                    <td className="border-b p-2">{item.branch}</td>
                    <td className="border-b p-2">
                      <button
                        className="text-blue-500 underline"
                        onClick={() => handleViewDocument(item.aadharCard)}
                      >
                        Aadhar
                      </button>
                      ,
                      <button
                        className="text-blue-500 underline ml-2"
                        onClick={() => handleViewDocument(item.marksheet)}
                      >
                        Marksheet
                      </button>
                      ,
                      <button
                        className="text-blue-500 underline ml-2"
                        onClick={() =>
                          handleViewDocument(item.incomeCertificate)
                        }
                      >
                        Income Certificate
                      </button>
                    </td>
                    <td className="border-b p-2">
                      {item.approvedByHod ? "Yes" : "No"}
                    </td>
                    <td className="border-b p-2">
                      <input
                        type="text"
                        value={
                          selectedApplication?.id === item.id
                            ? feedback
                            : item.principalFeedback || ""
                        }
                        onChange={(e) => {
                          setSelectedApplication(item);
                          setFeedback(e.target.value);
                        }}
                        className="p-2 border rounded text-sm w-full"
                        placeholder="Feedback"
                      />
                    </td>
                    <td className="border-b p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline">
                            {item.status || "Pending"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, "approved")
                            }
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, "rejected")
                            }
                          >
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="border-b p-2">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstEntry + 1} to{" "}
            {Math.min(indexOfLastEntry, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex space-x-2">
            {Array.from({
              length: Math.ceil(filteredData.length / entriesPerPage),
            }).map((_, i) => (
              <button
                key={i}
                className={`p-2 border rounded ${
                  currentPage === i + 1 ? "bg-[#725AC1] text-white" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {documentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 relative flex flex-col items-center justify-center">
            <button
              onClick={() => setDocumentModal(false)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800"
            >
              X
            </button>
            {documentModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 relative flex flex-col items-center justify-center">
                  <button
                    onClick={() => setDocumentModal(false)}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800"
                  >
                    X
                  </button>
                  {documentModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 relative flex flex-col items-center justify-center">
                        {/* Close Button */}
                        <button
                          onClick={() => setDocumentModal(false)}
                          className="absolute top-4  z-50 right-4 p-3 text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                          aria-label="Close"
                        >
                          X
                        </button>

                        {/* Image and New Tab Button */}
                        {viewDocument && (
                          <>
                            <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
                              <Image
                                alt="documents"
                                src={viewDocument}
                                className="object-cover w-full h-full"
                                layout="fill" // Use this prop for full coverage
                              />
                            </div>
                            <a
                              href={viewDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 px-6 py-3 bg-[#725AC1] text-white rounded-lg hover:bg-[#5e4b9c] transition"
                            >
                              Open in New Tab
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default PrincipalApplicationsTable;
