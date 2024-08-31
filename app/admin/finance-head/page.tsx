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

const FinanceHeadApplications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Application[]>([]);
  const [filteredData, setFilteredData] = useState<Application[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(3);
  const [amountSanctions, setAmountSanctions] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleAmountChange = (id: string, amount: number) => {
    setAmountSanctions((prev) => ({
      ...prev,
      [id]: amount,
    }));
  };

  const handleAmountSanction = async (id: string) => {
    const amountToSanction = amountSanctions[id];

    if (amountToSanction == null || amountToSanction <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      console.log({id})
      console.log(JSON.stringify({
        approve: true,
        amount: amountToSanction,
      }),)
      const response = await fetch(
        `https://hosho-digital-be.onrender.com/api/v1/scholarship-application/${id}/approve/finance-head`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approve: true,
            amount: amountToSanction,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setData((prevData) =>
        prevData.map((application) =>
          application.id === id
            ? {
                ...application,
                amountSanction: amountToSanction,
                approvedByFinanceHead: true,
              }
            : application
        )
      );
      toast.success("Amount sanctioned successfully.");
    } catch (error) {
      console.error("Failed to sanction amount:", error);
      toast.error("Failed to sanction amount.");
    }
  };

  return (
    <AppLayout>
      <div className="p-6 bg-white shadow-md rounded-lg mt-10 opacity-90">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-[#725AC1]">Finance Head Applications</h1>
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
                <th className="border-b p-2">HOD Verified</th>
                <th className="border-b p-2">Principal Verified</th>
                <th className="border-b p-2">Amount Sanction</th>
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
                    <td className="border-b p-2">{indexOfFirstEntry + index + 1}</td>
                    <td className="border-b p-2">{item.name}</td>
                    <td className="border-b p-2">{item.rollNo}</td>
                    <td className="border-b p-2">{item.branch}</td>
                    <td className="border-b p-2 text-center">
                      {item.approvedByHod ? "Yes" : "No"}
                    </td>
                    <td className="border-b p-2 text-center">
                      {item.approvedByPrincipal ? "Yes" : "No"}
                    </td>
                    <td className="border-b p-2">
                      {item.amountSanction !== null ? (
                        `₹${item.amountSanction}`
                      ) : (
                        <input
                          type="number"
                          className="p-2 border rounded text-sm w-full"
                          placeholder="Enter Amount"
                          value={amountSanctions[item.id] ?? ""}
                          onChange={(e) =>
                            handleAmountChange(item.id, Number(e.target.value))
                          }
                        />
                      )}
                    </td>
                    <td className="border-b p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                          >
                            {item.approvedByFinanceHead ? "Approved" : "Pending"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border rounded shadow-md">
                          <DropdownMenuLabel className="font-semibold text-gray-700">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleAmountSanction(item.id)}
                          >
                            Sanction Amount
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="border-b p-2">{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {indexOfFirstEntry + 1} to {indexOfLastEntry} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex space-x-2">
            {Array.from(
              { length: Math.ceil(filteredData.length / entriesPerPage) },
              (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 ${
                    currentPage === i + 1
                      ? "bg-[#725AC1] text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } rounded-md`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceHeadApplications;
