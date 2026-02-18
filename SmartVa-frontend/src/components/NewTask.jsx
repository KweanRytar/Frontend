import React, { useState } from "react";
import { useCreateTaskMutation } from "../redux/Task/TaskSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const NewTask = ({ close }) => {
  const navigate = useNavigate();
  
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
    dueDate: "",
    delegate: "", // only email for main task
    subTasks: [
      {
        title: "",
        dueDate: "",
        description: "",
        status: "Pending",
        priority: "Low",
        delegate: [""], // array of emails
      },
    ],
  });

  const [createNewTask, { isLoading }] = useCreateTaskMutation();

  // Main task changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleMainDelegateChange = (value) => {
    setTaskData({ ...taskData, delegate: value });
  };

  // Subtask changes
  const handleSubtaskChange = (index, field, value) => {
    const updated = [...taskData.subTasks];
    updated[index][field] = value;
    setTaskData({ ...taskData, subTasks: updated });
  };

  // Subtask delegate changes
  const handleDelegateChange = (subIndex, delegateIndex, value) => {
    const updated = [...taskData.subTasks];
    updated[subIndex].delegate[delegateIndex] = value;
    setTaskData({ ...taskData, subTasks: updated });
  };

  const addSubtask = () => {
    setTaskData({
      ...taskData,
      subTasks: [
        ...taskData.subTasks,
        { title: "", dueDate: "", description: "", status: "Pending", priority: "Low", delegate: [""] },
      ],
    });
  };

  const removeSubtask = (index) => {
    const updated = taskData.subTasks.filter((_, i) => i !== index);
    setTaskData({ ...taskData, subTasks: updated });
  };

  const addDelegate = (subIndex) => {
    const updated = [...taskData.subTasks];
    updated[subIndex].delegate.push("");
    setTaskData({ ...taskData, subTasks: updated });
  };

  const removeDelegate = (subIndex, delegateIndex) => {
    const updated = [...taskData.subTasks];
    updated[subIndex].delegate = updated[subIndex].delegate.filter((_, i) => i !== delegateIndex);
    setTaskData({ ...taskData, subTasks: updated });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      subTasks: taskData.subTasks.map((sub) => ({
        ...sub,
        dueDate: sub.dueDate ? new Date(sub.dueDate).toISOString() : null,
      })),
    };

    try {
      const response = await createNewTask(payload).unwrap();
      toast.success(response?.message || "Task created successfully!");
      close();

      // Reset form
      setTaskData({
        title: "",
        description: "",
        status: "Pending",
        priority: "Low",
        dueDate: "",
        delegate: "",
        subTasks: [{ title: "", dueDate: "", description: "", status: "Pending", priority: "Low", delegate: [""] }],
      });

      navigate("/task");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-4xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>

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

          {/* Main Delegate (email only) */}
          <div className="flex flex-col mt-4">
            <label className="mb-1 font-semibold">Delegate Email</label>
            <input
              type="email"
              placeholder="Delegate Email"
              value={taskData.delegate}
              onChange={(e) => handleMainDelegateChange(e.target.value)}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              required
            />
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

                {/* Subtask delegates (email only) */}
                <div>
                  <p className="font-semibold">Delegates Emails</p>
                  {subtask.delegate.map((email, delegateIndex) => (
                    <div key={delegateIndex} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
                      <input
                        type="email"
                        placeholder="Delegate Email"
                        value={email}
                        onChange={(e) =>
                          handleDelegateChange(subIndex, delegateIndex, e.target.value)
                        }
                        className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4 flex-1"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeDelegate(subIndex, delegateIndex)}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDelegate(subIndex)}
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

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-md flex-1"
            >
              {isLoading ? "Creating..." : "Create Task"}
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

export default NewTask;
