import React from "react";
import Navbar from "./Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen">
      <Navbar />
      {children}
    </div>
  );
}

