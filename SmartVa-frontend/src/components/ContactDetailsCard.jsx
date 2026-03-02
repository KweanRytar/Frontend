import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import EditContact from "./EditContact";
import DeleteModal from "./DeleteModal";
import { useDeleteContactMutation } from "../redux/Contact/ContactSlice";
import { useSendGeneralMessageMutation, useSendGeneralReminderMutation } from "../redux/General/generalMessage";

const ContactDetailsCard = ({ contact, unDisplayDetails }) => {
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [time, setTime] = useState("");

  // variables for message/reminder
  const [contactEmail, setContactEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const modalRef = useRef(null);
  const [deleteContact] = useDeleteContactMutation();
  const [viewEditContacts, setViewEditContacts] = useState(false);
  const [viewMessageModal, setViewMessageModal] = useState(false);
  const [viewReminderModal, setViewReminderModal] = useState(false);


  const [sendGeneralMessage, { isLoading: isSendingMessage }] =
    useSendGeneralMessageMutation();
  const [sendGeneralReminder, { isLoading: isSendingReminder }] =
    useSendGeneralReminderMutation();

  
  // Prevent scroll + ESC close
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") unDisplayDetails();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [unDisplayDetails]);

  const handleOutsideClick = (e) => {
if(viewMessageModal || viewReminderModal) return;

    if (modalRef.current && !modalRef.current.contains(e.target)) {
      unDisplayDetails();
    }
  };

  const formatDate = (t) => new Date(t).toLocaleDateString();

  const handlingDelete = async (contactId) => {
    try {
      const res = await deleteContact(contactId).unwrap();
      return res?.message;
    } catch (error) {
      return error?.data?.message || "Failed to delete contact";
    }
  };

  if (!contact) return null;

  // handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    try {
      const response = await sendGeneralMessage({
        title: messageTitle,
        message,
        email: contactEmail,
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
    setIsSendingReminder(true);
    try {
      const response = await sendGeneralReminder({
        reason,
        time,
        receiverEmail,
        receiverName,
      }).unwrap();
      toast.success(response?.message);
      setViewReminderModal(false);
      setIsSendingReminder(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reminder");
      setIsSendingReminder(false);
    }
  };
  
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-black/40 backdrop-blur-sm p-4"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 
                   w-full max-w-4xl 
                   max-h-[90vh] 
                   overflow-hidden
                   rounded-2xl shadow-2xl 
                   border border-gray-200 dark:border-gray-700
                   flex flex-col"
      >
        {/* HEADER */}
        <div className="px-6 sm:px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#008235] dark:text-[#a4f5c2] break-words">
              {contact.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {contact.companyName || "—"}
            </p>
          </div>

          <button
            onClick={unDisplayDetails}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <MdCancel size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            
            <InfoField label="Email" value={contact.email} />
            <InfoField label="Phone" value={`0${contact.phoneNumber}`} />
            <InfoField label="Position" value={contact.position} />
            <InfoField
              label="Connected On"
              value={formatDate(contact.createdAt)}
            />
            <InfoField
              label="Last Modified"
              value={formatDate(contact.updatedAt)}
            />

          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:justify-between">
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setViewEditContacts(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl 
                         bg-[#008235] hover:bg-[#0a6e2e]
                         text-white text-sm font-medium transition shadow"
            >
              <CiEdit />
              Edit
            </button>

            <DeleteModal
              dialogMessage={`Delete ${contact.name}?`}
              handlingDelete={() => handlingDelete(contact._id)}
            />
          </div>

          <div className="flex  flex-wrap flex-col lg:flex-row">
            <button
              onClick={() => {
                setViewMessageModal(true);
                setContactEmail(contact.email);
              }}
              className="px-5 py-2.5 rounded-xl 
              bg-green-500 
              text-white text-sm font-semibold 
              shadow-md transition-all duration-300 
              hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5
              active:scale-95"
              disabled={isSendingMessage}
            >
              Send Email
            </button>

            <button
              onClick={() => {
                
                setViewReminderModal(true);
                setReceiverEmail(contact.email);
                setReceiverName(contact.name);
              }}
              className="px-5 py-2.5 rounded-xl 
               bg-purple-500 
               text-white text-sm font-semibold 
               shadow-md transition-all duration-300 
               hover:bg-purple-600 hover:shadow-lg hover:-translate-y-0.5
               active:scale-95"
              disabled={isSendingReminder}
            >
              Send Reminder
            </button>
          </div>
        </div>
      </div>

      {viewEditContacts && (
        <EditContact
          contact={contact}
          close={() => setViewEditContacts(false)}
        />
      )}

      {viewMessageModal && (
        <form
        onClick={(e)=>e.stopPropagation()}
          onSubmit={handleSendMessage}
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              Send Message
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Send a message to {contact.name}
            </p>
            <input
              type="text"
              placeholder="title"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md h-24"
            />
            <div className="flex justify-between mt-4">

               <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
              disabled={isSendingMessage}
            >
              Send
            </button>
            <button type="button" onClick={()=>setViewMessageModal(false)} className="bg-red-500 text-white p-2 rounded-md">Cancel</button>
            </div>
           
          </div>
        </form>
      )}
{viewReminderModal && (
  <form onSubmit={handleSendReminder}  className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  onClick={(e)=>e.stopPropagation()}
  >
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Send Reminder</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Send a reminder to {receiverName}</p>
    <input type="text" placeholder="reason" value={reason} onChange={(e)=>setReason(e.target.value)}  className="w-full p-2 border border-gray-300 rounded-md" />
    <input type="datetime-local" placeholder="time" value={time} onChange={(e)=>setTime(e.target.value)}  className="w-full p-2 border border-gray-300 rounded-md" />
  
  <div className="flex justify-between mt-4">
    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md" disabled={isSendingReminder}>Send</button>
    <button type="button" onClick={()=>setViewReminderModal(false)} className="bg-red-500 text-white p-2 rounded-md">Cancel</button>
  </div>
  
    
    </div>
  </form>
)}

    </div>
  );
};

// Reusable field component
const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-800 
                  p-4 rounded-xl 
                  border border-gray-200 dark:border-gray-700">
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
      {label}
    </p>
    <p className="font-medium break-words">
      {value || "—"}
    </p>
  </div>
);

export default ContactDetailsCard;
