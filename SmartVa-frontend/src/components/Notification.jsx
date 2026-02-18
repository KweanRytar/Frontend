import React from "react";
import { IoIosNotifications } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useDeleteNotificationMutation } from "../redux/dashboard/OverviewSlice";

// Helper: format time nicely
const formatTime = (createdAt) => {
  if (!createdAt) return "Just now";

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "Just now";

  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


const Notification = ({ message, id, createdAt , onDelete}) => {
  const [deleteNotification, { isLoading }] =
    useDeleteNotificationMutation();

  const handleDelete = async () => {
    try {
      await deleteNotification(id).unwrap();

      // Update localStorage for new notification count
      const prevCount = parseInt(localStorage.getItem('prevNotificationCount')) || 0;
      const newCount = Math.max(prevCount - 1, 0);
      localStorage.setItem('prevNotificationCount', newCount);

      // Notify parent to update badge if needed
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all mt-4">
      {/* Icon */}
      <div className="bg-green-100 dark:bg-green-900 rounded-xl p-2 h-10 w-10 flex items-center justify-center shrink-0">
        <IoIosNotifications className="text-xl text-green-700 dark:text-green-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between items-start gap-4">
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">
            {message}
          </p>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Delete notification"
          >
            <MdCancel size={18} />
          </button>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 dark:text-gray-400">
          {formatTime(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default Notification;
