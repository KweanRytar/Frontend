import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const EventDashboard = ({ eventsData }) => {
  const navigate = useNavigate();

  // Destructure event categories
  const allEvents = eventsData?.events || [];
  const eventsIn30Minutes = eventsData?.eventsIn30Minutes || [];
  const eventsIn24Hours = eventsData?.eventsIn24Hours || [];
  const eventsIn7Days = eventsData?.eventsIn7Days || [];

  // Helper for rendering each card
  const renderEventCard = (events, title, vibeColor, message) => (
    <div className={`bg-${vibeColor}-100 dark:bg-${vibeColor}-700 p-4 rounded-2xl shadow-md`}>
      <h3 className={`text-xl font-bold text-${vibeColor}-700 dark:text-${vibeColor}-200 mb-2`}>{title}</h3>
      <p className="text-sm mb-3">{message}</p>
      {events.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No events.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event._id}
              className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.startTime).toString().slice(0, 15)} at {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <p
                
                className={`mr-2 bg-${vibeColor}-500 hover:bg-${vibeColor}-600 text-white px-3 py-1 rounded-xl text-sm`}
              >
                {`created by ${event.creatorName}`}
              </p>

              {/* email of event creator */}
              <p
                className={`bg-${vibeColor}-500 hover:bg-${vibeColor}-600 text-white px-3 py-1 rounded-xl text-sm`}
              >
                {`contact: ${event.creatorEmail}`}
              </p>
              

            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {renderEventCard(
        eventsIn30Minutes,
        "Urgent Events (Next 30 min)",
        "red",
        "You must act now! These events are starting very soon."
      )}
      {renderEventCard(
        eventsIn24Hours,
        "Upcoming Events (Next 24h)",
        "orange",
        "Few hours left to prepare for these events."
      )}
      {renderEventCard(
        eventsIn7Days,
        "Events in 7 Days",
        "green",
        "Start planning now to be fully prepared."
      )}
      {renderEventCard(
        allEvents,
        "All Events",
        "blue",
        "Overview of all your scheduled events."
      )}
    </div>
  );
};

export default EventDashboard;
