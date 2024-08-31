"use client";
import AppLayout from "@/components/ui/layouts/AppLayout";
import React from "react";
import { useUser } from "@clerk/nextjs";

const AdminDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
console.log(user?.unsafeMetadata)
  const handleRoleSelection = async (role : string) => {
    if (user && isLoaded && isSignedIn) {
      await user.update({
        unsafeMetadata: { role },
      });
      console.log(`Role set to ${role}`);
    }
  };

  return (
    <div>
      <AppLayout>
        <div className="flex flex-col">
          <div className="text-white mt-10 opacity-70 font-bold text-center text-3xl w-full">
            Please Select Role
          </div>
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => handleRoleSelection("HOD")}
              className="relative inline-block m-3 px-6 py-3 text-center text-lg tracking-wide text-[#725AC1] bg-transparent cursor-pointer transition ease-out duration-500 border-2 border-[#725AC1] rounded-lg shadow-[inset_0_0_0_0_#725AC1] hover:text-white hover:shadow-[inset_0_-100px_0_0_#725AC1] active:scale-90"
            >
              Login as HOD
            </button>

            <button
              onClick={() => handleRoleSelection("Principal")}
              className="relative inline-block m-3 px-6 py-3 text-center text-lg tracking-wide text-[#725AC1] bg-transparent cursor-pointer transition ease-out duration-500 border-2 border-[#725AC1] rounded-lg shadow-[inset_0_0_0_0_#725AC1] hover:text-white hover:shadow-[inset_0_-100px_0_0_#725AC1] active:scale-90"
            >
              Login as Principal
            </button>
            
            <button
              onClick={() => handleRoleSelection("Finance")}
              className="relative inline-block m-3 px-6 py-3 text-center text-lg pb-2 tracking-wide text-[#725AC1] bg-transparent cursor-pointer transition ease-out duration-500 border-2 border-[#725AC1] rounded-lg shadow-[inset_0_0_0_0_#725AC1] hover:text-white hover:shadow-[inset_0_-100px_0_0_#725AC1] active:scale-90"
            >
              Login as Finance Head
            </button>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default AdminDashboard;
