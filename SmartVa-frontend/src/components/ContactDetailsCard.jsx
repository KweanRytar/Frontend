import React, { useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import EditContact from "./EditContact";
import DeleteModal from "./DeleteModal";
import { useDeleteContactMutation } from "../redux/Contact/ContactSlice";

const ContactDetailsCard = ({ contact, unDisplayDetails }) => {
  const modalRef = useRef(null);
  const [deleteContact] = useDeleteContactMutation();
  const [viewEditContacts, setViewEditContacts] = useState(false);

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

          <div className="flex gap-3 flex-wrap">
            <button
              className="px-4 py-2 rounded-xl 
                         bg-gray-200 dark:bg-gray-700
                         text-gray-700 dark:text-gray-200
                         text-sm font-medium transition hover:bg-gray-300"
            >
              Send Email
            </button>

            <button
              className="px-4 py-2 rounded-xl 
                         bg-gray-200 dark:bg-gray-700
                         text-gray-700 dark:text-gray-200
                         text-sm font-medium transition hover:bg-gray-300"
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
