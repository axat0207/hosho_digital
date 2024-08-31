import ScholarshipTracking from "@/components/students/ScolarshipTracking";
import AppLayout from "@/components/ui/layouts/AppLayout";
import React from "react";

const page = () => {
  return (
    <div>
      <AppLayout>
        <ScholarshipTracking />
      </AppLayout>
    </div>
  );
};

export default page;
