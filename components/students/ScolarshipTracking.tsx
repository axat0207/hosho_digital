'use client'
import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, DollarSign, IndianRupee } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import AppLayout from '@/components/ui/layouts/AppLayout';
import Link from 'next/link';

interface ScholarshipStatus {
  approvedByHod: boolean;
  approvedByPrincipal: boolean;
  approvedByFinanceHead: boolean;
  amountSanction: number | null;
}

const ScholarshipTracking: React.FC = () => {
  // const { userId } = useAuth();
  const [status, setStatus] = useState<ScholarshipStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const applicationId = localStorage.getItem("applicationId");
  useEffect(() => {
    if (applicationId) {
      fetch(`https://hosho-digital-be.onrender.com/api/v1/student/tracking-status/${applicationId}`)
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.trackingStatus);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching scholarship status:', error);
          setLoading(false);
        });
    }
  }, [applicationId]);

  if (loading) {
    return <div className='text-white text-center mt-10 text-4xl'>Loading...</div>;
  }

  if (!status) {
    return <div className='text-white text-center mt-10 text-xl'>Application Not found! Please fill Application and Upload Documents <hr className='invisible'/>
    <Link className='underline italic ' href={'/student/upload-documents'}>Upload Documents</Link>
    </div>;
  }

  const steps = [
    { label: 'HOD Approval', completed: status.approvedByHod },
    { label: 'Principal Approval', completed: status.approvedByPrincipal },
    { label: 'Finance Approval', completed: status.approvedByFinanceHead },
    { label: 'Amount Sanctioned', completed: status.amountSanction !== null },
  ];

  return (
    
      <div className="max-w-3xl mt-20 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#725AC1] text-white py-4 px-6">
          <h2 className="text-2xl font-bold">Scholarship Status</h2>
          <p className="text-sm">Application ID: {applicationId}</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-[#725AC1]' : 'bg-gray-300'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="text-white" size={20} />
                    ) : (
                      <Clock className="text-gray-600" size={20} />
                    )}
                  </div>
                  <p className="text-sm mt-2 text-center">{step.label}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 ${steps[index + 1].completed ? 'bg-[#725AC1]' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          {status.amountSanction !== null && (
            <div className="mt-8 p-4 bg-[#E0D6F6] rounded-lg flex items-center justify-between">
              <span className="font-semibold text-[#725AC1]">Amount Sanctioned:</span>
              <div className="flex items-center text-[#725AC1]">
                <IndianRupee size={20} />
                <span className="text-xl font-bold ml-1">{status.amountSanction.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default ScholarshipTracking;
