import React from "react";
import { IoDocumentSharp } from "react-icons/io5";

const DocumentSummary = ({ title, time, sender, type }) => {
  const styles =
    type === "incoming"
      ? {
          bg: "bg-blue-100",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
          label: "Incoming",
        }
      : {
          bg: "bg-green-100",
          text: "text-green-700",
          badge: "bg-green-100 text-green-700",
          label: "Outgoing",
        };

  // truncate title safely
  const shortenTitle = (text, max = 50) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <div className="flex flex-col items-center gap-3 bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition w-fit">
      
      {/* Icon */}
      <div
        className={`relative rounded-2xl p-4 h-20 w-20 flex items-center justify-center ${styles.bg}`}
      >
        <IoDocumentSharp className={`text-4xl ${styles.text}`} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 text-center">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
          {shortenTitle(title)}
        </h4>

        <div className="text-xs text-gray-500 dark:text-gray-300">
          <span>{time}</span>
          <span className="block truncate">From: {sender}</span>
        </div>
      </div>

      {/* Type Badge */}
      <span
        className={`text-xs px-3 py-1 rounded-full font-medium ${styles.badge}`}
      >
        {styles.label}
      </span>
    </div>
  );
};

export default DocumentSummary;
