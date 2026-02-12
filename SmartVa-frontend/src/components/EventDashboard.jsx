import React from "react";
import { motion } from "framer-motion";

const EventDashboard = ({ eventsData }) => {
  const allEvents = eventsData?.events || [];
  const eventsIn30Minutes = eventsData?.eventsIn30Minutes || [];
  const eventsIn24Hours = eventsData?.eventsIn24Hours || [];
  const eventsIn7Days = eventsData?.eventsIn7Days || [];

  const getPriorityStyles = (type) => {
    switch (type) {
      case "urgent":
        return {
          badge: "bg-red-100 text-red-600",
          border: "border-red-200",
        };
      case "soon":
        return {
          badge: "bg-amber-100 text-amber-600",
          border: "border-amber-200",
        };
      case "week":
        return {
          badge: "bg-emerald-100 text-emerald-600",
          border: "border-emerald-200",
        };
      default:
        return {
          badge: "bg-blue-100 text-blue-600",
          border: "border-blue-200",
        };
    }
  };

  const renderEventCard = (events, title, description, type) => {
    const styles = getPriorityStyles(type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-gray-900 border ${styles.border} 
                    rounded-2xl p-6 shadow-sm hover:shadow-lg 
                    transition-all duration-300`}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>

        {/* Content */}
        {events.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            No events available.
          </div>
        ) : (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {events.map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 dark:bg-gray-800 
                           rounded-xl p-4 flex flex-col gap-3 
                           transition-all duration-200"
              >
                {/* Title */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {event.title}
                  </h4>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.startTime).toDateString()} •{" "}
                    {new Date(event.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Creator Info */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${styles.badge}`}
                  >
                    {event.creatorName}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {event.creatorEmail}
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
    <div className="min-h-screen px-4 md:px-10 py-10 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Event Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Overview of your scheduled events and priorities.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderEventCard(
          eventsIn30Minutes,
          "Urgent (Next 30 Minutes)",
          "Immediate attention required.",
          "urgent"
        )}

        {renderEventCard(
          eventsIn24Hours,
          "Next 24 Hours",
          "Prepare for these upcoming events.",
          "soon"
        )}

        {renderEventCard(
          eventsIn7Days,
          "Next 7 Days",
          "Start planning ahead.",
          "week"
        )}

        {renderEventCard(
          allEvents,
          "All Scheduled Events",
          "Complete overview of all events.",
          "all"
        )}
      </div>
    </div>
  );
};

export default EventDashboard;
