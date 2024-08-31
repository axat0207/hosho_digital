"use client";

import { useState, useEffect } from "react";
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

const tabData = [
  {
    title: "Accepted",
    value: "accepted",
    url: "https://hosho-digital-be.onrender.com/api/v1/scholarships/accepted",
  },
  {
    title: "Pending",
    value: "pending",
    url: "https://hosho-digital-be.onrender.com/api/v1/scholarships/pending",
  },
  {
    title: "Rejected",
    value: "rejected",
    url: "https://hosho-digital-be.onrender.com/api/v1/scholarships/rejected",
  },
];

const FinanceHeadDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabData[0].value);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const tab = tabData.find(tab => tab.value === activeTab);
        if (tab) {
          const response = await fetch(tab.url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [activeTab]);

  return (
    <AppLayout>
      <div className="p-6 bg-[#f0f4ff] shadow-md rounded-lg mt-10">
        {/* Simple Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabData.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab.value
                  ? "bg-[#725AC1] text-white"
                  : "bg-[#e5e5f7] text-[#725AC1] hover:bg-[#d4d4f5]"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#725AC1] text-white">
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Roll No</th>
                  <th className="p-3 border-b">Branch</th>
                  <th className="p-3 border-b">HOD Verified</th>
                  <th className="p-3 border-b">Principal Verified</th>
                  <th className="p-3 border-b">Amount Sanction</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Created At</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[#f0f0f5] even:bg-[#fafafa]"
                  >
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{app.name}</td>
                    <td className="p-3 border-b">{app.rollNo}</td>
                    <td className="p-3 border-b">{app.branch}</td>
                    <td className="p-3 border-b text-center">
                      {app.approvedByHod ? "Yes" : "No"}
                    </td>
                    <td className="p-3 border-b text-center">
                      {app.approvedByPrincipal ? "Yes" : "No"}
                    </td>
                    <td className="p-3 border-b">
                      {app.amountSanction !== null
                        ? `₹${app.amountSanction}`
                        : "-"}
                    </td>
                    <td className="p-3 border-b">{app.status}</td>
                    <td className="p-3 border-b">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceHeadDashboard;
