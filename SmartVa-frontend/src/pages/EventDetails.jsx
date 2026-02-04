// src/pages/EventDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useGetEventByIdQuery, useCancelEventMutation } from "../redux/event/EventSlice";
import EditEvent from "../components/EditEvent";
import { toast } from "react-toastify";
import ConfirmAction from "../components/ConfirmAction";



const EventDetails = () => {
  const { id } = useParams();
  const location = useLocation(); 

  const navigate = useNavigate();

  const confirm = ConfirmAction();

  const [editEvent, setEditEvent] = useState(false);
  const [eventToEdit, setEventToEdit] = useState();

   const eventFromState = location.state?.event;

  // extract event from database if not found in location
  const { data: fetchedEvent, isLoading, isError } = useGetEventByIdQuery(id, {
    skip: !!eventFromState,
  });

  // call rtk function to cancel event
  const [cancelEvent] = useCancelEventMutation();


 
  

  const event = eventFromState || fetchedEvent?.event;

  if (!event) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Event not found.
      </div>
    );
  }
 // cancel event handler
  const handleCancel = async (id) => {

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
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
        {/* Back Button */}
        <Link
          to="/event"
          className="inline-block mb-4 text-sm text-green-500 hover:underline"
        >
          ← Back to Events
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-bold text-green-500">{event.title}</h1>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <p>
            <strong>VA Name:</strong> {event.vaName}
          </p>
          <p>
            <strong>Date:</strong> {new Date(event.startTime).toDateString()}<small> , {new Date(event.startTime).toTimeString()}</small>
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>Reminder:</strong>{" "}
            {event.reminder ? "Yes" : "No"}
            {event.reminderTime &&
              ` (at ${new Date(event.reminderTime).toLocaleString()})`}
          </p>
        </div>

        {/* Concerned Members */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-green-500">
            Concerned Members
          </h2>
          {event.concernedMembers.length === 0 ? (
            <p className="text-gray-500">No concerned members.</p>
          ) : (
            <ul className="list-disc pl-6 space-y-1">
              {event.concernedMembers.map((member, idx) => (
                <li key={idx}>
                  {member.name} - <span className="text-gray-500">{member.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mt-6">
          <p>Created: {new Date(event.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(event.updatedAt).toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() =>{
              setEventToEdit(event);
              setEditEvent(true);
            }}
            className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white"
          >
            edit
          </button>
          <button
            onClick={()=>handleCancel(event._id)}
            className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500"
          >
            {event.startTime > new Date() ? 'cancel': 'delete' }
          </button>
        </div>
      </div>
            {editEvent && (
        <EditEvent
          event={eventToEdit}
          close={() => setEditEvent(false)}
        />
      )}

    </div>
  );
};

export default EventDetails;
