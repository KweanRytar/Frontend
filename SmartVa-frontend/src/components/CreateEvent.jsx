// src/components/CreateEvent.jsx
import React, { useState } from "react";
import { useCreateNewEventMutation } from "../redux/dashboard/OverviewSlice";
import {toast} from 'react-toastify'


const CreateEvent = ({ close }) => {
  const [formData, setFormData] = useState({
    title: "",
    vaName: "",
    startTime: "",
    endTime: "",
    venue: "",
    reminder: false,
    reminderTime: "",
    concernedMembers: [{ name: "", email: "" }],
  });

const [createEvent, { isLoading, data}] = useCreateNewEventMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.concernedMembers];
    updated[index][field] = value;
    setFormData({ ...formData, concernedMembers: updated });
  };

  const addMember = () => {
    setFormData({
      ...formData,
      concernedMembers: [...formData.concernedMembers, { name: "", email: "" }],
    });
  };

  const removeMember = (index) => {
    const updated = formData.concernedMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, concernedMembers: updated });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Convert times to ISO strings for backend consistency
  const payload = {
    ...formData,
    startTime: new Date(formData.startTime).toISOString(),
    endTime: new Date(formData.endTime).toISOString(),
    reminderTime: formData.reminder && formData.reminderTime
      ? new Date(formData.reminderTime).toISOString()
      : null,
  };

  try {
    const response = await createEvent(payload).unwrap();
    // reset form if successful
    if(response.success){
      // Reset form if it went successfully
  
  setFormData({
    title: "",
    vaName: "",
    startTime: "",
    endTime: "",
    venue: "",
    reminder: false,
    reminderTime: "",
    concernedMembers: [],
  });
    }
    toast.success( response?.message);
    close();
  } catch (err) {
    toast.error("Error creating event" + ' ' + err?.data?.message);
  }

  
};
    
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white 
                      rounded-2xl shadow-lg w-full max-w-4xl 
                      p-6 mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title + VA Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">VA Name</label>
              <input
                type="text"
                name="vaName"
                value={formData.vaName}
                onChange={handleChange}
                placeholder="VA Name"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
          </div>

          {/* Time + Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Venue"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
          </div>

          {/* Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="reminder"
                checked={formData.reminder}
                onChange={handleChange}
              />
              <label className="font-semibold">Set Reminder</label>
            </div>
            {formData.reminder && (
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Reminder Time</label>
                <input
                  type="datetime-local"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleChange}
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                />
              </div>
            )}
          </div>

          {/* Concerned Members */}
          <div>
            <strong className="block mb-2 text-lg">Concerned Members</strong>
            {formData.concernedMembers.map((member, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) =>
                    handleMemberChange(index, "name", e.target.value)
                  }
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) =>
                    handleMemberChange(index, "email", e.target.value)
                  }
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                />
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMember}
              className="bg-blue-500 text-white p-2 rounded-md mt-2"
            >
              Add Member
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md flex-1"
            disabled={isLoading}
            >
            {  isLoading ? 'creating..' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={close}
              className="bg-gray-500 text-white p-2 rounded-md flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
