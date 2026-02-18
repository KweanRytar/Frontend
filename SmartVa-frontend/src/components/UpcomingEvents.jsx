import React from "react";
import { MdEventBusy } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const UpcomingEvents = ({ event }) => {
  const navigate = useNavigate();

  const formattedDate = dayjs(event.startTime).format(
    "MMM D, YYYY • h:mm A"
  );

  const isPast = dayjs(event.startTime).isBefore(dayjs());

  return (
    <div
      className={`group bg-white dark:bg-gray-800
                  border rounded-2xl p-5
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                  flex flex-col justify-between
                  ${
                    isPast
                      ? "border-gray-300 dark:border-gray-700 opacity-70"
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
                        isPast
                          ? "bg-gray-100 text-gray-500"
                          : "bg-[#008235]/10 text-[#008235]"
                      }`}
        >
          <MdEventBusy className="text-xl" />
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {event.title}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            
            {/* Date */}
            <div className="flex items-center gap-2">
              <IoIosTime className="text-base" />
              <span>{formattedDate}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FaLocationArrow className="text-xs" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex items-center justify-between">
        
        {/* Status Badge */}
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium
                      ${
                        isPast
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
        >
          {isPast ? "Past Event" : "Upcoming"}
        </span>

        {/* View Button */}
        <button
          onClick={() =>
            navigate(`/event-details/${event._id}`, { state: { event } })
          }
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

export default UpcomingEvents;
