"use client";

import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/ui/layouts/AppLayout";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

const UploadDocuments: NextPage = () => {
  const host = "https://hosho-digital-be.onrender.com/api/v1";
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  // Step 1 states
  const [name, setName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");

  // Step 2 states
  const [aadhaarCard, setAadhaarCard] = useState<File | null>(null);
  const [incomeCertificate, setIncomeCertificate] = useState<File | null>(null);
  const [marksheetOrCollegeId, setMarksheetOrCollegeId] = useState<File | null>(
    null
  );

  const router = useRouter();
  const { userId } = useAuth();

  // Handle input changes for Step 1
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  // Handle file input changes for Step 2
  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setter(e.target.files[0]);
      }
    };

  // Validate Step 1 fields and proceed to Step 2
  const handleNext = () => {
    if (!name.trim() || !department || !rollNo.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setStep(2);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!aadhaarCard || !incomeCertificate || !marksheetOrCollegeId) {
      toast.error("Please upload all required documents.");
      return;
    }
  
    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("branch", department);
    formData.append("rollNo", rollNo);
    formData.append("studentId", userId);
    formData.append("aadharCard", aadhaarCard);
    formData.append("incomeCertificate", incomeCertificate);
    formData.append("marksheet", marksheetOrCollegeId);
  
    setLoading(true); // Start loading
  
    try {
      const response = await fetch(`${host}/student/upload-documents`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response
        const applicationId = responseData?.application?.id; // Extract application ID
        console.log({ applicationId });
  
        // Save applicationId in local storage
        localStorage.setItem("applicationId", applicationId);
  
        toast.success("Application added successfully!");
        router.push("/student/application-track");
      } else {
        const errorData = await response.json();
        
        // Check for specific error related to unique constraint violation
        if (errorData.error && errorData.error.includes("Unique constraint failed on the fields: (`studentId`)")) {
          toast.error("Application already exists. Redirecting to application tracking page...");
          router.push("/student/application-track");
        } else {
          toast.error(
            `Failed to upload files: ${errorData.message || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("An error occurred during file upload.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  // Render file preview
  const renderFilePreview = (file: File | null) => {
    return file ? (
      <div className="mt-2 text-sm text-[#725AC1]">{file.name}</div>
    ) : (
      <div className="mt-2 text-sm text-gray-500">No file chosen</div>
    );
  };

  return (
    <AppLayout>
      <div className="mt-10 flex items-center justify-center px-4">
        <div className="max-w-lg w-full mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-[#725AC1] text-center">
                Student Information
              </h2>
              <div className="space-y-4">
                {/* Name Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="font-semibold text-[#725AC1]"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleInputChange(setName)}
                    placeholder="Enter your name"
                    className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#725AC1]"
                    aria-required="true"
                  />
                </div>

                {/* Department Dropdown */}
                <div className="flex flex-col">
                  <label
                    htmlFor="department"
                    className="font-semibold text-[#725AC1]"
                  >
                    Department:
                  </label>
                  <select
                    id="department"
                    value={department}
                    onChange={handleInputChange(setDepartment)}
                    className="mt-2 p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#725AC1]"
                    aria-required="true"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science and Engineering">
                      Computer Science and Engineering
                    </option>
                    <option value="Informational Technology">
                      Informational Technology
                    </option>
                    <option value="Electronics and Communication Engineering">
                      Electronics and Communication Engineering
                    </option>
                    <option value="Electrical Engineering">
                      Electrical Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                {/* Roll Number Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="rollNo"
                    className="font-semibold text-[#725AC1]"
                  >
                    Roll Number:
                  </label>
                  <input
                    type="text"
                    id="rollNo"
                    value={rollNo}
                    onChange={handleInputChange(setRollNo)}
                    placeholder="Enter your roll number"
                    className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#725AC1]"
                    aria-required="true"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 bg-[#725AC1] text-white font-semibold rounded-lg hover:bg-[#5e48a6] transition-colors duration-300 mt-4"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-[#725AC1] text-center">
                Upload Documents
              </h2>
              <div className="space-y-4">
                {/* Aadhaar Card */}
                <div className="flex flex-col">
                  <label
                    htmlFor="aadhaarCard"
                    className="font-semibold text-[#725AC1]"
                  >
                    Aadhaar Card:
                  </label>
                  <input
                    type="file"
                    id="aadhaarCard"
                    accept="image/*, .pdf"
                    onChange={handleFileChange(setAadhaarCard)}
                    className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#E0D6F6] file:text-[#725AC1] hover:file:bg-[#C2B0E8]"
                    aria-required="true"
                  />
                  {renderFilePreview(aadhaarCard)}
                </div>

                {/* Income Certificate */}
                <div className="flex flex-col">
                  <label
                    htmlFor="incomeCertificate"
                    className="font-semibold text-[#725AC1]"
                  >
                    Income Certificate:
                  </label>
                  <input
                    type="file"
                    id="incomeCertificate"
                    accept="image/*, .pdf"
                    onChange={handleFileChange(setIncomeCertificate)}
                    className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#E0D6F6] file:text-[#725AC1] hover:file:bg-[#C2B0E8]"
                    aria-required="true"
                  />
                  {renderFilePreview(incomeCertificate)}
                </div>

                {/* Marksheet/College ID */}
                <div className="flex flex-col">
                  <label
                    htmlFor="marksheetOrCollegeId"
                    className="font-semibold text-[#725AC1]"
                  >
                    Marksheet/College ID:
                  </label>
                  <input
                    type="file"
                    id="marksheetOrCollegeId"
                    accept="image/*, .pdf"
                    onChange={handleFileChange(setMarksheetOrCollegeId)}
                    className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#E0D6F6] file:text-[#725AC1] hover:file:bg-[#C2B0E8]"
                    aria-required="true"
                  />
                  {renderFilePreview(marksheetOrCollegeId)}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-6 bg-gray-200 text-[#725AC1] font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="py-3 px-6 bg-[#725AC1] text-white font-semibold rounded-lg hover:bg-[#5e48a6] transition-colors duration-300"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Submitting..." : "Submit"}{" "}
                  {/* Show loading text */}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadDocuments;
