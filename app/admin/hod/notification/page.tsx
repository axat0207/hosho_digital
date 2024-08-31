'use client'
import React, { useState, useEffect } from "react";
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
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    isAdmin: false,
  });
  const [isPosting, setIsPosting] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const adminResponse = await fetch("https://hosho-digital-be.onrender.com/api/v1/notifications/admin");
        const adminData = await adminResponse.json();
        const formattedAdminNotifications = adminData.map((notif: any) => ({
          id: notif.id,
          sender: notif.isAdmin ? "Finance Head" : "Principal",
          title: notif.title,
          message: notif.message,
          timestamp: new Date(notif.createdAt).toLocaleString(),
        }));

        setNotifications(formattedAdminNotifications);
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
      const response = await fetch("https://hosho-digital-be.onrender.com/api/v1/notifications", {
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

      setNewNotification({ title: "", message: "", isAdmin: false });
      const result = await response.json();
      setNotifications((prev) => [
        {
          id: result.id,
          sender: newNotification.isAdmin ? "Finance Head" : "Principal",
          title: result.title,
          message: result.message,
          timestamp: new Date(result.createdAt).toLocaleString(),
        },
        ...prev,
      ]);
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
                  <div className="flex-shrink-0 mr-4">
                    {getIconForSender(notification.sender)}
                  </div>
                  <div className="flex-1 relative">
                    <p className="text-sm text-gray-700 font-semibold">{notification.title}</p>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    <div className="text-xs absolute right-4 text-gray-700 top-[30px]">
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
    </AppLayout>
  );
};

export default NotificationPage;
