"use client";
import React, { useState, useEffect } from "react";
import { Bell, UserCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/ui/layouts/AppLayout";

interface Notification {
  id: string;
  sender: "HOD" | "Principal" | "System";
  message: string;
  timestamp: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const applicationId = localStorage.getItem("applicationId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch public notifications
        const publicResponse = await fetch(
          "https://hosho-digital-be.onrender.com/api/v1/notifications/user"
        );
        const publicNotificationsData = await publicResponse.json();
        const publicNotifications = publicNotificationsData.map((notif: any) => ({
          id: notif.id,
          sender: "System",
          message: notif.message,
          timestamp: new Date(notif.createdAt).toLocaleString(),
        }));

        const combinedNotifications = [...publicNotifications];

        // Fetch HOD feedback
        const hodResponse = await fetch(
          `https://hosho-digital-be.onrender.com/api/v1/notifications/hod/${applicationId}`
        );
        const hodFeedbackData = await hodResponse.json();
        if (hodFeedbackData && hodFeedbackData.hodFeedback) {
          const hodNotification = {
            id: `hod-${applicationId}`,
            sender: "HOD",
            message: hodFeedbackData.hodFeedback,
            timestamp: new Date().toLocaleString(),
          };
          combinedNotifications.push(hodNotification);
        }

        // Fetch Principal feedback
        const principalResponse = await fetch(
          `https://hosho-digital-be.onrender.com/api/v1/notifications/principal/${applicationId}`
        );
        const principalFeedbackData = await principalResponse.json();
        if (principalFeedbackData && principalFeedbackData.principalFeedback) {
          const principalNotification = {
            id: `principal-${applicationId}`,
            sender: "Principal",
            message: principalFeedbackData.principalFeedback,
            timestamp: new Date().toLocaleString(),
          };
          combinedNotifications.push(principalNotification);
        }

        // Sort notifications so that the latest one comes first
        combinedNotifications.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setNotifications(combinedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [applicationId]);

  const getIconForSender = (sender: Notification["sender"]) => {
    switch (sender) {
      case "HOD":
        return <UserCheck className="text-[#725AC1]" size={24} />;
      case "Principal":
        return <ShieldCheck className="text-[#725AC1]" size={24} />;
      case "System":
      default:
        return <Bell className="text-[#725AC1]" size={24} />;
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center text-[#725AC1] mb-6">
            Notifications
          </h2>

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
