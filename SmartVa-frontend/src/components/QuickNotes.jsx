import React from "react";
import { IoNewspaper } from "react-icons/io5";

const QuickNotes = ({ time, title, shortendDescription, details }) => {
  const formatDate = (t) => new Date(t).toLocaleDateString();

  return (
    <div
      onClick={details}
      className="cursor-pointer group
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-2xl p-4
                 shadow-sm hover:shadow-md
                 transition-all duration-200
                 flex flex-col justify-between"
    >
      {/* HEADER: Icon + Title + Date */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#008235]/10 text-[#008235] flex items-center justify-center">
          <IoNewspaper className="text-xl" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">
            {formatDate(time)}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-300 line-clamp-3">
        {shortendDescription}
      </p>

      {/* FOOTER: Type Badge */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] text-gray-400 font-medium">
          Quick Note
        </span>

        <span className="text-[10px] px-2 py-1 rounded-full bg-[#008235]/20 text-[#008235] font-medium">
          View
        </span>
      </div>
    </div>
  );
};

export default QuickNotes;
