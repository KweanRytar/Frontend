import React from "react";
import { IoDocumentSharp } from "react-icons/io5";

const DocumentSummary = ({ title, time, sender, type, onClick }) => {
  const isIncoming = type === "incoming";

  const styles = {
    icon: isIncoming
      ? "bg-blue-100 text-blue-600"
      : "bg-green-100 text-green-600",
    badge: isIncoming
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700",
    label: isIncoming ? "Incoming" : "Outgoing",
  };

  const shortenTitle = (text, max = 45) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-2xl p-4
                 shadow-sm hover:shadow-md
                 hover:-translate-y-0.5
                 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}
        >
          <IoDocumentSharp className="text-lg" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {shortenTitle(title)}
          </h4>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {sender}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {time}
            </span>

            <span
              className={`text-[10px] px-2 py-1 rounded-full font-medium ${styles.badge}`}
            >
              {styles.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSummary;
