import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useMessageDelegateMutation } from "../redux/Task/TaskSlice";
import { toast } from "react-toastify";

const MessageDelegate = ({onClose, taskId, delegateEmail}) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [messageDelegate, { isLoading }] = useMessageDelegateMutation();

    const handleSubmit = async ()=>{
        if(!message.trim()){
            toast.error("Message cannot be empty");
            return;
        }
        try{
            const response = await messageDelegate({ message, delegateEmail, subject}).unwrap();
            toast.success(response?.message);
            setMessage("");
            onClose();
        } catch(error){
            toast.error(error?.data?.message || "Error sending message");
        }
    }
  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          Message Delegate
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Send a message to { delegateEmail}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
             <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="6"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 rounded-xl text-white transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageDelegate