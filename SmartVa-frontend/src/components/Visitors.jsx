import React from "react";
import { IoIosContact, IoIosTime } from "react-icons/io";

const VisitorsCard = ({ name, time, purpose, details }) => {
  const formattedTime = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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
      {/* TOP SECTION */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl
                     bg-[#008235]/10 text-[#008235]
                     flex items-center justify-center"
        >
          <IoIosContact className="text-xl" />
        </div>

        {/* Visitor Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </h3>

          <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {/* Time */}
            <div className="flex items-center gap-2">
              <IoIosTime className="text-base" />
              <span>{formattedTime}</span>
            </div>

            {/* Purpose */}
            <div className="truncate">{purpose}</div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex justify-between items-center">
      

        {/* View Button */}
        <span className="px-2 py-1 text-[10px] rounded-full font-medium bg-[#008235]/20 text-[#008235] flex items-center gap-1">
          View
        </span>
      </div>
    </div>
  );
};

export default VisitorsCard;
