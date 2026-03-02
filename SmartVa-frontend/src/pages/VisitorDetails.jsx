// src/pages/VisitorDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useGetVisitorByIdQuery,useDeleteVisitorMutation } from "../redux/visitor/visitorSlice";
import EditVisitor from "../components/EditVisitor";
import DeleteModal from "../components/DeleteModal";
import { useSendGeneralMessageMutation, useSendGeneralReminderMutation } from "../redux/General/generalMessage";


const VisitorDetails = () => {

  const [deleteVisitor] = useDeleteVisitorMutation();
  const [sendGeneralMessage] = useSendGeneralMessageMutation();
  const [sendGeneralReminder] = useSendGeneralReminderMutation();
   const { id } = useParams();
  const location = useLocation()

  // extract visitor from location 
const visitorFromState = location.state?.visitor

const {data: fetchedVisitor, isLoading, isError} = useGetVisitorByIdQuery(id, {skip: !visitorFromState})

 
const visitor = visitorFromState || fetchedVisitor?.visitor

const navigate = useNavigate();

const [editVisitor, setEditVisitor] = useState()
const [viewMessageModal, setViewMessageModal] = useState(false);
const [viewReminderModal, setViewReminderModal] = useState(false);
const [messageTitle, setMessageTitle] = useState("");
const [message, setMessage] = useState("");
const [visitorName, setVisitorName] = useState("");
const [visitorEmail, setVisitorEmail] = useState("");
const [reason, setReason] = useState("");
const [time, setTime] = useState("");
const [receiverEmail, setReceiverEmail] = useState("");
const [receiverName, setReceiverName] = useState("");



  

  if (!visitor || isError) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold mt-24">
        An Error occured, Visitor not found.
      </div>
    );
  }

  if(isLoading){
    return(
       <div className="p-8 text-center text-yellow-500 font-semibold">
        fetching visitor...
      </div>
    )
  }


  // handle delete visitor
  const handleDeleteVisitor = async () => {
    try {
      const res = await deleteVisitor(id).unwrap();
      return res.message;
    } catch (error) {
      return error?.data?.message || "Could not delete visitor";
    }
  }

  // handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await sendGeneralMessage({
        title: messageTitle,
        message,
        visitorEmail,
      }).unwrap();
      toast.success(response?.message);
      setViewMessageModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  // handle send reminder
  const handleSendReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await sendGeneralReminder({
        reason,
        time,
        receiverEmail,
        receiverName,
      }).unwrap();
      toast.success(response?.message);
      setViewReminderModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reminder");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16 md:mt-22">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
        
        {/* Back Button */}
        <Link
          to="/visitor"
          className="inline-block mb-4 text-sm text-green-500 hover:underline"
        >
          ← Back to Visitors
        </Link>

        {/* Visitor Name */}
        <h1 className="text-2xl font-bold text-green-500">{visitor.name}</h1>

        {/* Visitor Details */}
        <div className="mt-4 space-y-2">
          <p><strong>Purpose:</strong> {visitor.message}</p>
         
          <p><strong>Phone:</strong> {visitor.phone}</p>
          <p><strong>Email:</strong> {visitor.email}</p>
        
        </div>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mt-6">
          <p>Visited On: {new Date(visitor.createdAt).toDateString()}</p>
          
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setEditVisitor(true)}
            className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
          >
            Edit
          </button>
          <DeleteModal dialogMessage={`Are you sure you want to delete the visitor named ${visitor.name} who visited on ${visitor.createdAt}`} handlingDelete={()=>{
            handleDeleteVisitor(visitor._id)
            navigate(-1)
          }} />
        <div className="flex gap-3 flex-wrap">
            <button
              className="px-4 py-2 rounded-xl 
                         bg-gray-200 dark:bg-gray-700
                         text-gray-700 dark:text-gray-200
                         text-sm font-medium transition hover:bg-gray-300"
             onClick={()=>{
              setViewMessageModal(true);
              setVisitorName(visitor.name);
              setVisitorEmail(visitor.email);
             }}
            >
              Send Email
            </button>

            <button
              className="px-4 py-2 rounded-xl 
                         bg-gray-200 dark:bg-gray-700
                         text-gray-700 dark:text-gray-200
                         text-sm font-medium transition hover:bg-gray-300"
              onClick={() => {
                setViewReminderModal(true);
                setReceiverName(visitor.name);
                setReceiverEmail(visitor.email);
              }}
            >
              Send Reminder
            </button>
          </div>
        </div>
      </div>
     {editVisitor && (
      <EditVisitor visitor={visitor} close={()=>setEditVisitor(false)}/>
     )}


     {viewMessageModal && (
      <form onSubmit={handleSendMessage}  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Send Message</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Send a message to {visitorName}</p>
        <input type="text" placeholder="title" value={messageTitle} onChange={(e)=>setMessageTitle(e.target.value)}  className="w-full p-2 border border-gray-300 rounded-md" />
        <textarea placeholder="message" value={message} onChange={(e)=>setMessage(e.target.value)}  className="w-full p-2 border border-gray-300 rounded-md h-24" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Send</button>
        </div>
      </form>
     )}
     {viewReminderModal && (
      <form onSubmit={handleSendReminder}  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Send Reminder</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Send a reminder to {receiverName}</p>
          <input type="text" placeholder="reason" value={reason} onChange={(e)=>setReason(e.target.value)}  className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="datetime-local" placeholder="time" value={time} onChange={(e)=>setTime(e.target.value)}  className="w-full p-2 border border-gray-300 rounded-md" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Send</button>
        </div>
      </form>
    )}
  </div>
);
};
export default VisitorDetails;
