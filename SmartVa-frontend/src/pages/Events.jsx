import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import CreateEvent from "../components/CreateEvent";
import EditEvent from "../components/EditEvent";
import {
  useGetEventsQuery,
  useGetEventsForTodayQuery,
  useGetEventByNameQuery,
  useCancelEventMutation
} from '../redux/event/EventSlice'
import { toast } from "react-toastify";
import ConfirmAction from "../components/ConfirmAction";

const Events = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editEvent, setEditEvent] = useState()
  const [eventToEdit, setEventToEdit] = useState()

  // Fetch events depending on filterType / search
  const { data: allEvents, isLoading, isError } = useGetEventsQuery();
  const { data: todayEvents } =    useGetEventsForTodayQuery();
  const { data: searchResult } = useGetEventByNameQuery(searchTerm, {
    skip: !searchTerm, // Skip if searchTerm is empty
  });

  // cancel event rtk instance
  const [cancelEvent] = useCancelEventMutation();

  // Decide which events to show
  let eventsToShow = allEvents?.events || [];
  if (filterType === "day") eventsToShow = todayEvents?.events || [];
  if (filterType === "month") {
    const currentMonth = new Date().getMonth();
    eventsToShow = eventsToShow.filter(
      (event) => new Date(event.startTime).getMonth() === currentMonth
    );
  }
  if (filterType === "year") {
    const currentYear = new Date().getFullYear();
    eventsToShow = eventsToShow.filter(
      (event) => new Date(event.startTime).getFullYear() === currentYear
    );

  }
  if (searchTerm) eventsToShow = searchResult?.event ? [searchResult.event] : [];

  const confirm = ConfirmAction()

  // cancel event handler
  const cancelEventHandler = async (id) => {

    confirm.show(
      async ()=>{

         try {
       const res = await cancelEvent(id).unwrap()
        if(res.success){
          toast.success(res.message || "Event cancelled successfully");
          // Optionally, redirect to another page after cancellation
          // navigate('/event');
          navigate(-1);
        }
      } catch (error) {
        toast.error(error?.data?.message || "Failed to cancel event");
        
      }

      }
    )
    
     
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16 md:mt-22">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="mb-8 text-2xl inline">Events</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 rounded-md cursor-pointer px-3 h-8 flex items-center text-white"
        >
          <FaPlus className="inline text-white" />
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search events..."
          className="flex-1 p-2 focus:outline-none rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 rounded-md border dark:bg-gray-600 dark:border-gray-500"
        >
          <option value="all">All</option>
          <option value="day">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Loading/Error States */}
      {isLoading && <p className="text-gray-600 mt-6">Loading events...</p>}
      {isError && (
        <p className="text-red-500 mt-6">Failed to load events. Try again.</p>
      )}

      {/* Event List */}
      {!isLoading && !isError && eventsToShow.length === 0 ? (
        <p className="text-gray-600 mt-6">No events found.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {eventsToShow.map((event) => (
            <li
              key={event._id}
              className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-bold text-green-500">{event.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Venue: {event.venue}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                VA: {event.vaName}
              </p>
              <div className="text-sm text-gray-500 mt-4">
                Time:{" "}
                {new Date(event.startTime).toLocaleString()} →{" "}
                {new Date(event.endTime).toLocaleString()}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/event-details/${event._id}`, {state: {event}})}
                 
                  className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white"
                >
                  View
                </button>

                <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white"
                onClick={()=>{
                  setEventToEdit(event)
                  setEditEvent(true)}}
                >
                  Edit
                </button>

                <button 
                className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500"
                onClick={()=> cancelEventHandler(event._id) }                >
                  {event.startTime > new Date() ? 'cancel': 'delete' }
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showCreateModal && (
        <CreateEvent close={() => setShowCreateModal(false)} />
      )}

      {editEvent && (
        <EditEvent event={eventToEdit} close={()=> setEditEvent(false)}/>
      )}
    </div>
  );
};

export default Events;
