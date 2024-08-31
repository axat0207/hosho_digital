'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from '@clerk/nextjs';

const HeroSection = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  
  const router = useRouter();

  const handleTrack = () => {
    router.push('/student/application-track');
  };

  const handleUpload = () => {
    router.push('/student/upload-documents');
  };

  return (
    <div className="flex flex-col justify-center items-start h-[80vh] p-5 lg:ml-20 ml-8">
      <div className="text-4xl lg:text-5xl flex gap-2 text-white ">
        <div className="font-light">Welcome,</div>
        <span className="font-bold text-purple-700">{user?.fullName}</span>
      </div>
      <div className="mt-2 tracking-wide text-lg lg:text-xl text-gray-300">
        Please upload documents to avail for scholarship.
      </div>
      <div className="flex gap-4 mt-10 flex-wrap">
        <button 
          onClick={handleUpload} 
          className="relative inline-block m-3 px-6 py-3 text-center text-lg pb-2 tracking-wide text-[#725AC1] bg-transparent cursor-pointer transition ease-out duration-500 border-2 border-[#725AC1] rounded-lg shadow-[inset_0_0_0_0_#725AC1] hover:text-white hover:shadow-[inset_0_-100px_0_0_#725AC1] active:scale-90"
        >
          Upload Documents
        </button>
        <button 
          onClick={handleTrack} 
          className="relative inline-block m-3 px-6 py-3 text-center text-lg pb-2 tracking-wide text-[#725AC1] bg-transparent cursor-pointer transition ease-out duration-500 border-2 border-[#725AC1] rounded-lg shadow-[inset_0_0_0_0_#725AC1] hover:text-white hover:shadow-[inset_0_-100px_0_0_#725AC1] active:scale-90"
        >
          Track Status
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
