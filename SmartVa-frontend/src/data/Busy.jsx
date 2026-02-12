// src/components/Calendar.js
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from 'dayjs';
import axios from "axios";
import '../style/calendar.css'
import { toast } from "react-toastify";

const Busy  = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseurl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

  // Fetch events for the visible range
  const fetchEventsInRange = async (start, end) => {
    try {
      setLoading(true);
      const res = await axios.get(
  `${baseurl}/allEvents?start=${start}&end=${end}`,
  { withCredentials: true }
);
;
      const map = res.data.events.map(e => ({
        id: e._id,
        title: e.title,
        start: e.startTime,
        end: e.endTime,
        
      })); // expects array of events
      console.log(map);
      setEvents(map);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Triggered whenever view or month/week/day changes
  const handleDatesSet = (arg) => {
    const start = dayjs(arg.start).toISOString();
    const end = dayjs(arg.end).toISOString();
    fetchEventsInRange(start, end);
  };

  // Handle clicking an event
 const handleClick = (clickInfo) => {
  toast.info(
    <div style={{ lineHeight: "1.5" }}>
      <p><strong>Title:</strong> {clickInfo.event.title}</p>
      <p><strong>Time:</strong> {clickInfo.event.start?.toLocaleString()} - {clickInfo.event.end?.toLocaleString()}</p>
    </div>,
    { 
      position: "top-right", 
      autoClose: 9000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true 
    }
  );
};

  return (
    <div className="calendar-wrapper">
      {loading && <p className="text-center">Loading events...</p>}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
         dayHeaderClassNames={({ date, view }) =>
    document.documentElement.classList.contains('dark')
      ? 'text-blue-400'
      : 'text-gray-700'
  }
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        datesSet={handleDatesSet} // lazy loading
        eventClick={handleClick}
        eventContent={(arg) => {
          const view = arg.view.type;

          if (view === "dayGridMonth") {
            // Month view → red dot with hover popup
            return (
              <div className="relative group">
                <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto my-1"></div>
                <div className="hidden group-hover:block absolute z-10 bg-white text-red-500 p-2 border shadow-md rounded-md text-sm">
                  <strong>{arg.event.title}</strong>
                  <br />
                  {new Date(arg.event.start).toLocaleTimeString()} -{" "}
                  {new Date(arg.event.end).toLocaleTimeString()}
                </div>
              </div>
            );
          } else if (view === "timeGridWeek") {
            // Week view → simple badge with hover details
            return (
              <div className="group text-sm bg-green-200 p-1 rounded">
                Busy
                <div className="hidden group-hover:block absolute bg-white text-black dark:text-white p-2 rounded shadow-md z-10">
                  {arg.event.title}
                </div>
              </div>
            );
          } else if (view === "timeGridDay") {
            // Day view → detailed info
            return (
              <div >
                
                  <strong >
                    {new Date(arg.event.start).toLocaleTimeString()} -   {new Date(arg.event.end).toLocaleTimeString()}: {arg.event.title}
                    </strong>{" "}
                  
               
                
                 
                
                
               
                  
                
              </div>
            );
          }
        }}
        height="auto"
      />
    </div>
  );
};

export default Busy;
