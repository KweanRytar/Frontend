// src/pages/VisitorDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  useGetVisitorByIdQuery,
  useDeleteVisitorMutation,
} from "../redux/visitor/visitorSlice";
import EditVisitor from "../components/EditVisitor";
import DeleteModal from "../components/DeleteModal";
import {
  useSendGeneralMessageMutation,
  useSendGeneralReminderMutation,
} from "../redux/General/generalMessage";
import { toast } from "react-toastify";

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const visitorFromState = location.state?.visitor;

  //  Correct skip logic
  const {
    data: fetchedVisitor,
    isLoading,
    isError,
  } = useGetVisitorByIdQuery(id, { skip: !!visitorFromState });

  const visitor = visitorFromState || fetchedVisitor?.visitor;

  const [deleteVisitor] = useDeleteVisitorMutation();
  const [sendGeneralMessage, { isLoading: isSendingMessage }] =
    useSendGeneralMessageMutation();
  const [sendGeneralReminder, { isLoading: isSendingReminder }] =
    useSendGeneralReminderMutation();

  const [editVisitor, setEditVisitor] = useState(false);
  const [viewMessageModal, setViewMessageModal] = useState(false);
  const [viewReminderModal, setViewReminderModal] = useState(false);

  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [time, setTime] = useState("");

  if (isLoading) {
    return (
      <div className="p-8 text-center text-yellow-500 font-semibold mt-24">
        Fetching visitor...
      </div>
    );
  }

  if (!visitor || isError) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold mt-24">
        An error occurred. Visitor not found.
      </div>
    );
  }

  //  Delete visitor
  const handleDeleteVisitor = async () => {
    try {
      const res = await deleteVisitor(id).unwrap();
      toast.success(res?.message || "Visitor deleted");
      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.message || "Could not delete visitor");
    }
  };

  // ✅ Send Email
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await sendGeneralMessage({
        title: messageTitle,
        message,
        email: visitor.email, 
      }).unwrap();

      toast.success(response?.message);
      setViewMessageModal(false);
      setMessage("");
      setMessageTitle("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  // ✅ Send Reminder
  const handleSendReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await sendGeneralReminder({
        reason,
        time,
        receiverEmail: visitor.email,
        receiverName: visitor.name,
      }).unwrap();

      toast.success(response?.message);
      setViewReminderModal(false);
      setReason("");
      setTime("");
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
        <h1 className="text-2xl font-bold text-green-500">
          {visitor.name}
        </h1>

        {/* Visitor Details */}
        <div className="mt-4 space-y-2">
          <p>
            <strong>Purpose:</strong> {visitor.message}
          </p>
          <p>
            <strong>Phone:</strong> {visitor.phone}
          </p>
          <p>
            <strong>Email:</strong> {visitor.email}
          </p>
        </div>

        {/* Meta */}
        <div className="text-sm text-gray-500 mt-6">
          <p>
            Visited On:{" "}
            {new Date(visitor.createdAt).toDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => setEditVisitor(true)}
            className="rounded-md border-2 border-gray-500 p-2 hover:bg-gray-500 hover:text-white"
          >
            Edit
          </button>

          <DeleteModal
            dialogMessage={`Are you sure you want to delete ${visitor.name}?`}
            handlingDelete={handleDeleteVisitor}
          />

          <button
            onClick={() => setViewMessageModal(true)}
            className="px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold shadow-md hover:bg-green-600"
          >
            Send Email
          </button>

          <button
            onClick={() => setViewReminderModal(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-500 text-white text-sm font-semibold shadow-md hover:bg-purple-600"
          >
            Send Reminder
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editVisitor && (
        <EditVisitor
          visitor={visitor}
          close={() => setEditVisitor(false)}
        />
      )}

      {/* Send Email Modal */}
      {viewMessageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setViewMessageModal(false)}
        >
          <form
            onSubmit={handleSendMessage}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-2">
              Send Message
            </h2>
            <p className="mb-6">
              Send a message to {visitor.name}
            </p>

            <input
              type="text"
              placeholder="Title"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
              required
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md h-24"
              required
            />

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={isSendingMessage}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                {isSendingMessage ? "Sending..." : "Send"}
              </button>

              <button
                type="button"
                onClick={() => setViewMessageModal(false)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Send Reminder Modal */}
      {viewReminderModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setViewReminderModal(false)}
        >
          <form
            onSubmit={handleSendReminder}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-2">
              Send Reminder
            </h2>
            <p className="mb-6">
              Send a reminder to {visitor.name}
            </p>

            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
              required
            />

            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={isSendingReminder}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                {isSendingReminder ? "Sending..." : "Send"}
              </button>

              <button
                type="button"
                onClick={() => setViewReminderModal(false)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VisitorDetails;