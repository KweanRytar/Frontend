import React from "react";
import { motion } from "framer-motion";

const EventDashboard = ({ eventsData }) => {
  const allEvents       = eventsData?.events         || [];
  const urgent30min     = eventsData?.eventsIn30Minutes || [];
  const next24Hours     = eventsData?.eventsIn24Hours   || [];
  const next7Days       = eventsData?.eventsIn7Days     || [];

  const getPriorityStyles = (type) => {
    switch (type) {
      case "urgent":
        return {
          badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
          border: "border-red-200 dark:border-red-800/60",
          bg: "bg-red-50/40 dark:bg-red-950/20",
        };
      case "soon":
        return {
          badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-800/60",
          bg: "bg-amber-50/40 dark:bg-amber-950/20",
        };
      case "week":
        return {
          badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-800/60",
          bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
        };
      default:
        return {
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800/60",
          bg: "bg-blue-50/40 dark:bg-blue-950/20",
        };
    }
  };

  const renderEventCard = (events, title, description, type) => {
    const styles = getPriorityStyles(type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`
          rounded-2xl border ${styles.border} ${styles.bg}
          p-5 shadow-sm hover:shadow-md transition-all duration-300
        `}
      >
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-gray-200/60 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>

        {/* Events list */}
        {events.length === 0 ? (
          <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm italic">
            No events in this timeframe
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {events.map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ scale: 1.015, x: 2 }}
                className="
                  bg-white dark:bg-gray-800/80
                  rounded-xl p-4 border border-gray-200/70 dark:border-gray-700/60
                  transition-all duration-200
                "
              >
                <div className="mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(event.startTime).toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    •{" "}
                    {new Date(event.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs mt-3">
                  <span
                    className={`px-2.5 py-1 rounded-full font-medium ${styles.badge}`}
                  >
                    {event.creatorName || "Unknown"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {event.creatorEmail || "—"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      {/* Optional small header – you can remove if redundant in Profile */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Your Scheduled Events
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upcoming priorities and all scheduled activities
        </p>
      </div>

      {/* Responsive grid – adapts from 1 → 2 → 3–4 columns */}
      <div className="
        grid grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-2 
        xl:grid-cols-4 
        gap-5 lg:gap-6
      ">
        {renderEventCard(
          urgent30min,
          "Next 30 Minutes",
          "Requires immediate attention",
          "urgent"
        )}

        {renderEventCard(
          next24Hours,
          "Next 24 Hours",
          "Prepare today",
          "soon"
        )}

        {renderEventCard(
          next7Days,
          "Next 7 Days",
          "Medium-term planning",
          "week"
        )}

        {renderEventCard(
          allEvents,
          "All Events",
          "Complete history & schedule",
          "all"
        )}
      </div>
    </div>
  );
};

export default EventDashboard;