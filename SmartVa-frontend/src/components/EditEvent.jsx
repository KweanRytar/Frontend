import React, { useState } from "react";
import { useUpdateEventMutation } from "../redux/event/EventSlice";
import { toast } from "react-toastify";

const EditEvent = ({ event, close }) => {
  const [formData, setFormData] = useState({
    title: event.title ?? "",
    vaName: event.vaName ?? "",
    startTime: event.startTime
      ? new Date(event.startTime).toISOString().slice(0, 16)
      : "",
    endTime: event.endTime
      ? new Date(event.endTime).toISOString().slice(0, 16)
      : "",
    venue: event.venue ?? "",
    reminder: event.reminder ?? false,
    reminderTime: event.reminderTime
      ? new Date(event.reminderTime).toISOString().slice(0, 16)
      : "",
    concernedMembers:
      event.concernedMembers?.length > 0
        ? event.concernedMembers.map(m => ({ name: m.name, email: m.email }))
        : [{ name: "", email: "" }],
  });

  const [updateEvent, { isLoading }] = useUpdateEventMutation();

  /* ---------------- handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleReminder = (checked) => {
    setFormData(prev => ({
      ...prev,
      reminder: checked,
      reminderTime: checked ? prev.reminderTime : "",
    }));
  };

  const handleConcernedMemberChange = (index, field, value) => {
    const updated = [...formData.concernedMembers];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, concernedMembers: updated }));
  };

  const addConcernedMember = () => {
    setFormData(prev => ({
      ...prev,
      concernedMembers: [...prev.concernedMembers, { name: "", email: "" }],
    }));
  };

  const removeConcernedMember = (index) => {
    setFormData(prev => ({
      ...prev,
      concernedMembers: prev.concernedMembers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      reminder: Boolean(formData.reminder),
      reminderTime: formData.reminder ? formData.reminderTime : null,
    };

    try {
      await updateEvent({ id: event._id, data: payload }).unwrap();
      toast.success("Event updated successfully");
      close();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update event");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title + VA */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
            />
            <input
              name="vaName"
              value={formData.vaName}
              onChange={handleChange}
              placeholder="VA Name"
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
            />
          </div>

          {/* Time + Venue */}
          <div className="grid md:grid-cols-3 gap-4">
            <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4" />
            <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"/>
            <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4" />
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.reminder}
              onChange={(e) => toggleReminder(e.target.checked)}
            />
            <span>Enable Reminder</span>
          </div>

          {formData.reminder && (
            <input
              type="datetime-local"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
            />
          )}

          {/* Concerned Members */}
          <div>
           <strong className="block mb-2 text-lg">Concerned Members</strong>
            {formData.concernedMembers.map((m, i) => (
              <div key={i} className="grid md:grid-cols-3 gap-3 mb-2">
                <input value={m.name} onChange={(e) => handleConcernedMemberChange(i, "name", e.target.value)} placeholder="Name" className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4" />
                <input value={m.email} onChange={(e) => handleConcernedMemberChange(i, "email", e.target.value)} placeholder="Email" className="input" />
                <button type="button" onClick={() => removeConcernedMember(i)} className="bg-red-500 text-white p-2 rounded-md">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addConcernedMember} className="bg-blue-500 text-white p-2 rounded-md mt-2">
              Add Member
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button type="submit" disabled={isLoading} className="bg-green-500 text-white p-2 rounded-md flex-1">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={close} className="bg-gray-500 text-white p-2 rounded-md flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
