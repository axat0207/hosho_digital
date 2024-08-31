"use client";

import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { Bell, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/ui/layouts/AppLayout";

interface Notification {
  id: string;
  sender: string;
  title: string;
  message: string;
  timestamp: string;
}

const NotificationPage: React.FC = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    isAdmin: false,
  });
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const adminResponse = await fetch("https://hosho-digital-be.onrender.com/api/v1/notifications/admin");
        const adminData = await adminResponse.json();
        const formattedAdminNotifications = adminData.map((notif: any) => ({
          id: notif.id,
          sender: notif.isAdmin ? "Finance Head" : "Unknown",
          title: notif.title,
          message: notif.message,
          timestamp: new Date(notif.createdAt).toLocaleString(),
        }));

        const userResponse = await fetch("https://hosho-digital-be.onrender.com/api/v1/notifications/user");
        const userData = await userResponse.json();
        const formattedUserNotifications = userData.map((notif: any) => ({
          id: notif.id,
          sender: notif.isAdmin ? "Finance Head" : "Principal",
          title: notif.title,
          message: notif.message,
          timestamp: new Date(notif.createdAt).toLocaleString(),
        }));

        const combinedNotifications = [...formattedAdminNotifications, ...formattedUserNotifications];
        combinedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setNotifications(combinedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handlePostNotification = async () => {
    if (!newNotification.title || !newNotification.message) return;

    setIsPosting(true);
    try {
      const endpoint = "https://hosho-digital-be.onrender.com/api/v1/notifications/"
  

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          title: newNotification.title,
          message: newNotification.message,
          isAdmin: newNotification.isAdmin,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post notification");
      }

      const result = await response.json();
      setNotifications((prev) => [
        {
          id: result.id,
          sender: "Principal",
          title: result.title,
          message: result.message,
          timestamp: new Date(result.createdAt).toLocaleString(),
        },
        ...prev,
      ]);
      setNewNotification({ title: "", message: "", isAdmin: false });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error posting notification:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const getIconForSender = (sender: string) => {
    switch (sender) {
      case "Finance Head":
        return <ShieldCheck className="text-[#725AC1]" size={24} />;
      case "Principal":
        return <UserCheck className="text-[#725AC1]" size={24} />;
      default:
        return <Bell className="text-[#725AC1]" size={24} />;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center text-[#725AC1] mb-6">Notifications</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-6 px-6 py-3 bg-[#725AC1] text-white font-semibold rounded-md hover:bg-[#5a47a3] transition-colors duration-300"
          >
            Post Notification
          </button>

          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-[#725AC1] scrollbar-track-[#E0D6F6] p-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center bg-[#E0D6F6] mb-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex-shrink-0 mr-4 ">
                    {getIconForSender(notification.sender)}
                  </div>
                  <div className="flex-1 relative">
                    <p className="text-sm text-gray-700 font-semibold">{notification.title}</p>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    <div className="text-xs absolute right-1 text-gray-700 top-[50px]">
                      ~{notification.sender}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications available.</p>
            )}
          </div>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Post Notification
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="flex mb-4">
                      <button
                        onClick={() => setActiveTab("admin")}
                        className={`w-1/2 px-4 py-2 ${activeTab === "admin" ? "bg-[#725AC1] text-white" : "bg-gray-200 text-gray-700"} rounded-l-md border border-[#725AC1] transition-colors duration-300`}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => setActiveTab("student")}
                        className={`w-1/2 px-4 py-2 ${activeTab === "student" ? "bg-[#725AC1] text-white" : "bg-gray-200 text-gray-700"} rounded-r-md border border-[#725AC1] transition-colors duration-300`}
                      >
                        For Students
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification((prev) => ({ ...prev, title: e.target.value, isAdmin: activeTab === "admin" }))}
                      className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#725AC1] transition-shadow duration-300"
                    />
                    <textarea
                      placeholder="Message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value, isAdmin: activeTab === "admin" }))}
                      className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#725AC1] transition-shadow duration-300"
                    ></textarea>
                    <button
                      onClick={handlePostNotification}
                      disabled={isPosting}
                      className="w-full px-4 py-2 bg-[#725AC1] text-white font-semibold rounded-md hover:bg-[#5a47a3] disabled:opacity-50 transition-opacity duration-300"
                    >
                      {isPosting ? "Posting..." : "Post Notification"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
};

export default NotificationPage;
