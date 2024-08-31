"use client";
import { SignedIn, UserButton, useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const userRole = user?.unsafeMetadata?.role as any;
      console.log({ userRole });
      setRole(userRole);
    }
  }, [isLoaded, isSignedIn, user, router]);

  const roleBasedNavLinks = () => {
    switch (role) {
      case "finance_head":
        return (
          <>
            <Link
              href="/admin/finance-head/list-all"
              className="px-3 py-2 text-[#725AC1] transition-colors duration-300 transform rounded-md hover:bg-[#725AC1] hover:text-white"
            >
              View All Applicants
            </Link>
            <Link
              href="/admin/finance-head/funds"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Funds
            </Link>
            <Link
              href="/admin/finance-head/notification"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Notifications
            </Link>
          </>
        );
      case "principal":
        return (
          <>
            <Link
              href="/admin/principal/list-all"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              View All Applicants
            </Link>
            <Link
              href="/admin/principal/funds"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Funds
            </Link>
            <Link
              href="/admin/principal/notification"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Notifications
            </Link>
          </>
        );
      case "hod":
        return (
          <>
            <Link
              href="/admin/principal/list-all"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              View All Applicants
            </Link>
            <Link
              href="/admin/hod/notification"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Notifications
            </Link>
          </>
        );
      default:
        return (
          <div className="space-y-2">
            <Link
              href="/student/upload-documents"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Apply For Scholarship
            </Link>
            <Link
              href="/student/application-track"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Track Status
            </Link>
            <Link
              href="/student/notification"
              className="px-3 py-2 my-1 text-[#725AC1] transition-colors duration-300 transform rounded-md lg:mx-2 lg:my-0 hover:bg-[#725AC1] hover:text-white"
            >
              Notification
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="relative bg-white shadow lg:opacity-70 dark:bg-gray-800 lg:shadow-none">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="text-[#725AC1] font-extrabold tracking-wider text-3xl">
                Scloro!
              </div>
            </Link>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              isOpen
                ? "translate-x-0 opacity-100"
                : "opacity-0 -translate-x-full"
            } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              {roleBasedNavLinks()}
            </div>

            <div className="flex items-center mt-4 lg:mt-0">
              <button
                className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
                aria-label="show notifications"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="flex items-center focus:outline-none"
                aria-label="toggle profile dropdown"
              >
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
