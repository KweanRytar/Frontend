import React, { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router";

const TodayTask = ({ title, dueDate, id }) => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className={`group bg-white dark:bg-gray-800
                  border rounded-2xl p-5
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                  flex flex-col justify-between
                  ${
                    isCompleted
                      ? "border-green-400/40"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
    >
      {/* TOP SECTION */}
      <div className="flex items-start gap-4">
        
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl
                      flex items-center justify-center
                      ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : "bg-[#008235]/10 text-[#008235]"
                      }`}
        >
          <SlCalender className="text-xl" />
        </div>

        {/* Title + Date */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold truncate
                        ${
                          isCompleted
                            ? "line-through text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
          >
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Due: {formatDate(dueDate)}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex items-center justify-between">
        
        {/* Toggle */}
        <button
          onClick={() => setIsCompleted((prev) => !prev)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition
                      ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
        >
          {isCompleted ? "Completed" : "Mark Complete"}
        </button>

        {/* View Button */}
        <button
          onClick={() => navigate(`/task-details/${id}`)}
          className="px-4 py-2 rounded-xl 
                     bg-[#008235] hover:bg-[#0a6e2e]
                     text-white text-sm font-medium 
                     transition duration-200 shadow-sm"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default TodayTask;
