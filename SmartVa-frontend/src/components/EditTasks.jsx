import React, { useState } from "react";
import { useUpdateTaskMutation } from "../redux/Task/TaskSlice";
import { toast } from "react-toastify";

const EditTasks = ({
  title,
  description,
  status,
  priority,
  dueDate,
  delegate = [],
  subTasks = [],
  onCancel,
  url,
}) => {
  // Normalize main delegates
  const normalizedDelegates =
    Array.isArray(delegate) && delegate.length > 0
      ? delegate.map((d) => ({ email: d.email || "" }))
      : [{ email: "" }];

  const [taskData, setTaskData] = useState({
    title: title || "",
    description: description || "",
    priority: priority || "Low",
    status: status || "Pending",
    dueDate: dueDate ? new Date(dueDate).toISOString().split("T")[0] : "",
    delegate: normalizedDelegates,
    subTasks:
      subTasks.length > 0
        ? subTasks.map((s) => ({
            title: s.title || "",
            description: s.description || "",
            dueDate: s.dueDate
              ? new Date(s.dueDate).toISOString().split("T")[0]
              : "",
            status: s.status || "Pending",
            priority: s.priority || "Low",
            delegate:
              s.delegate && s.delegate.length > 0
                ? s.delegate.map((d) => ({ email: d.email || "" }))
                : [{ email: "" }],
          }))
        : [
            {
              title: "",
              description: "",
              dueDate: "",
              status: "Pending",
              priority: "Low",
              delegate: [{ email: "" }],
            },
          ],
  });

  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  // MAIN TASK DELEGATES
  const handleMainDelegateChange = (index, value) => {
    const updated = [...taskData.delegate];
    updated[index].email = value;
    setTaskData({ ...taskData, delegate: updated });
  };

  const addMainDelegate = () => {
    setTaskData({
      ...taskData,
      delegate: [...taskData.delegate, { email: "" }],
    });
  };

  const removeMainDelegate = (index) => {
    const updated = taskData.delegate.filter((_, i) => i !== index);
    setTaskData({ ...taskData, delegate: updated });
  };

  // SUBTASKS
  const handleSubtaskChange = (index, field, value) => {
    const updated = [...taskData.subTasks];
    updated[index][field] = value;
    setTaskData({ ...taskData, subTasks: updated });
  };

  const addSubtask = () => {
    setTaskData({
      ...taskData,
      subTasks: [
        ...taskData.subTasks,
        {
          title: "",
          description: "",
          dueDate: "",
          status: "Pending",
          priority: "Low",
          delegate: [{ email: "" }],
        },
      ],
    });
  };

  const removeSubtask = (index) => {
    const updated = taskData.subTasks.filter((_, i) => i !== index);
    setTaskData({ ...taskData, subTasks: updated });
  };

  // SUBTASK DELEGATES
  const handleSubtaskDelegateChange = (subIndex, delegateIndex, value) => {
    const updated = [...taskData.subTasks];
    updated[subIndex].delegate[delegateIndex].email = value;
    setTaskData({ ...taskData, subTasks: updated });
  };

  const addSubtaskDelegate = (subIndex) => {
    const updated = [...taskData.subTasks];
    updated[subIndex].delegate.push({ email: "" });
    setTaskData({ ...taskData, subTasks: updated });
  };

  const removeSubtaskDelegate = (subIndex, delegateIndex) => {
    const updated = [...taskData.subTasks];
    updated[subIndex].delegate = updated[subIndex].delegate.filter(
      (_, i) => i !== delegateIndex
    );
    setTaskData({ ...taskData, subTasks: updated });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...taskData,
      dueDate: taskData.dueDate
        ? new Date(taskData.dueDate).toISOString()
        : null,
      delegate: taskData.delegate.filter((d) => d.email?.trim()),
      subTasks: taskData.subTasks.map((sub) => ({
        ...sub,
        dueDate: sub.dueDate ? new Date(sub.dueDate).toISOString() : null,
        delegate: sub.delegate.filter((d) => d.email?.trim()),
      })),
    };

    try {
      const response = await updateTask({ id: url, payload }).unwrap();
      toast.success(response.message || "Task updated successfully!");
      onCancel();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-4xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Task Title"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Description</label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Task Description"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-24 p-4"
              />
            </div>
          </div>

          {/* Status, Priority, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Status</label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Priority</label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
          </div>

          {/* Main Task Delegates */}
          <div className="flex flex-col mt-4">
            <label className="mb-1 font-semibold">Delegates (Email)</label>
            {taskData.delegate.map((d, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="Delegate Email"
                  value={d.email}
                  onChange={(e) =>
                    handleMainDelegateChange(index, e.target.value)
                  }
                  className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4 flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeMainDelegate(index)}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMainDelegate}
              className="bg-blue-500 text-white p-2 rounded-md mt-2"
            >
              Add Delegate
            </button>
          </div>

          {/* Subtasks */}
          <div>
            <strong className="block mb-2 text-lg">Subtasks</strong>
            {taskData.subTasks.map((subtask, subIndex) => (
              <div key={subIndex} className="border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Subtask Title"
                    value={subtask.title}
                    onChange={(e) =>
                      handleSubtaskChange(subIndex, "title", e.target.value)
                    }
                    className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                  />
                  <input
                    type="date"
                    value={subtask.dueDate}
                    onChange={(e) =>
                      handleSubtaskChange(subIndex, "dueDate", e.target.value)
                    }
                    className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                  />
                  <input
                    type="text"
                    placeholder="Subtask Description"
                    value={subtask.description}
                    onChange={(e) =>
                      handleSubtaskChange(subIndex, "description", e.target.value)
                    }
                    className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                  />
                  <select
                    value={subtask.status}
                    onChange={(e) =>
                      handleSubtaskChange(subIndex, "status", e.target.value)
                    }
                    className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    value={subtask.priority}
                    onChange={(e) =>
                      handleSubtaskChange(subIndex, "priority", e.target.value)
                    }
                    className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-14 p-4"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Subtask Delegates */}
                <div>
                  <p className="font-semibold">Delegates (Email)</p>
                  {subtask.delegate.map((d, delegateIndex) => (
                    <div
                      key={delegateIndex}
                      className="flex gap-2 mb-2"
                    >
                      <input
                        type="email"
                        placeholder="Delegate Email"
                        value={d.email}
                        onChange={(e) =>
                          handleSubtaskDelegateChange(
                            subIndex,
                            delegateIndex,
                            e.target.value
                          )
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeSubtaskDelegate(subIndex, delegateIndex)
                        }
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSubtaskDelegate(subIndex)}
                    className="bg-blue-500 text-white p-2 rounded-md mt-2"
                  >
                    Add Delegate
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeSubtask(subIndex)}
                  className="bg-red-600 text-white p-2 rounded-md mt-3"
                >
                  Remove Subtask
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSubtask}
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
            >
              Add Subtask
            </button>
          </div>

          {/* Submit + Cancel */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-md flex-1"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
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

export default EditTasks;
