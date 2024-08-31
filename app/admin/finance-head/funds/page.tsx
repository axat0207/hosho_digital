"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/ui/layouts/AppLayout";

const FinanceDepartmentFunds: React.FC = () => {
  const [fundsData, setFundsData] = useState({
    totalAmount: 0,
    totalAmountSanctioned: 0,
    remainingAmount: 0,
    difference: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundsData = async () => {
      try {
        const response = await fetch("https://hosho-digital-be.onrender.com/api/v1/getAmountDetails");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFundsData(data);
      } catch (err) {
        setError("Failed to load funds data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundsData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-semibold text-[#725AC1]">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500 text-2xl">{error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 bg-[#f0f4ff] shadow-md rounded-lg mt-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#725AC1] mb-8">
          Finance Department Funds
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-[#725AC1]">Total Amount</h2>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              ₹{fundsData.totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-[#725AC1]">Total Amount Sanctioned</h2>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              ₹{fundsData.totalAmountSanctioned.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-[#725AC1]">Remaining Amount</h2>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              ₹{fundsData.remainingAmount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-[#725AC1]">Difference</h2>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              ₹{fundsData.difference.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceDepartmentFunds;
