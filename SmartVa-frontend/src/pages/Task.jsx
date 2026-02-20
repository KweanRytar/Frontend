import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { MdAddTask } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import NewTask from "../components/NewTask.jsx";
import EditTasks from "../components/EditTasks.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import DelegatesView from "../components/DelegatesView.jsx";

import {
  useGetEmergencyTasksQuery,
  useGetTasksDueTodayQuery,
  useGetTasksDueIn72HoursQuery,
  useGetOverdueTasksQuery,
  useGetTasksByNameQuery,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
} from "../redux/Task/TaskSlice.js";

const Task = () => {
  const today = new Date().toISOString();
  const [taskView, setTaskView] = useState(true);
  const [delegateView, setDelegateView] = useState(false);
  const [createNewTask, setCreateNewTask] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [editData, setEditData] = useState({});
  const [url, setUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeButton, setActiveButton] = useState("All");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const { data: allTaskData } = useGetAllTasksQuery();
  const { data: dueTodayData } = useGetTasksDueTodayQuery(today);
  const { data: dueIn72HoursData } = useGetTasksDueIn72HoursQuery();
  const { data: overdueData } = useGetOverdueTasksQuery();
  const { data: emergencyData } = useGetEmergencyTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const { data: taskByNameData } = useGetTasksByNameQuery(searchTerm, { skip: !searchTerm });

  const buttons = ["All", "Due Today", "Overdue", "Emergency", "72HRS Due"];

  const filteredTasks = useMemo(() => {
    if (searchTerm && taskByNameData) return taskByNameData.tasks || [];
    switch (activeButton) {
      case "Due Today":
        return dueTodayData?.tasks || [];
      case "Overdue":
        return overdueData?.tasks || [];
      case "Emergency":
        return emergencyData?.tasks || [];
      case "72HRS Due":
        return dueIn72HoursData?.tasks || [];
      default:
        return allTaskData?.tasks || [];
    }
  }, [
    activeButton,
    allTaskData,
    dueTodayData,
    overdueData,
    emergencyData,
    dueIn72HoursData,
    searchTerm,
    taskByNameData,
  ]);

  const finalFilteredTasks = useMemo(() => {
    let filtered = [...filteredTasks];
    if (status) filtered = filtered.filter(task => task.status?.toLowerCase() === status.toLowerCase());
    if (priority) filtered = filtered.filter(task => task.priority?.toLowerCase() === priority.toLowerCase());
    return filtered;
  }, [filteredTasks, status, priority]);

  const handlingDelete = async (taskId) => {
    try {
      const res = await deleteTask(taskId).unwrap();
      toast.success(res.message || "Task deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6 md:p-10">
      {/* Header Buttons */}
      <div className="flex flex-col sm:flex-row justify-start gap-4 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-500 text-white`}
          onClick={() => {
            setTaskView(true);
            setDelegateView(false);
          }}
        >
          <MdAddTask />
          Tasks
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-500 text-white`}
          onClick={() => {
            setTaskView(false);
            setDelegateView(true);
          }}
        >
          <IoPeople />
          Delegates
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-500 text-white`}
          onClick={() => setCreateNewTask(!createNewTask)}
        >
          <FaPlus />
          New Task
        </button>
      </div>

      {/* TASK VIEW */}
      {taskView && (
        <section className="flex flex-col gap-6">
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {buttons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    setActiveButton(btn);
                    setSearchTerm("");
                  }}
                  className={`px-3 py-2 rounded-2xl border-2 border-gray-300 w-full transition ${
                    activeButton === btn ? "bg-green-500 text-white border-0" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-green-500 dark:text-white"
              >
                <option value="">Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="inprogress">In Progress</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-green-500 dark:text-white"
              >
                <option value="">Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalFilteredTasks.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
                No tasks found.
              </p>
            ) : (
              finalFilteredTasks.map((task) => (
                <div key={task._id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.priority === "high"
                        ? "bg-red-200 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Info */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Link
                      to={`/task-details/${task._id}`}
                      className="px-3 py-1 rounded-2xl border border-gray-400 hover:bg-green-500 hover:text-white transition"
                    >
                      View
                    </Link>

                    <button
                      className="px-3 py-1 rounded-2xl border border-gray-400 hover:bg-green-500 hover:text-white transition"
                      onClick={() => {
                        setEditData(task);
                        setUrl(task._id);
                        setEditTask(true);
                      }}
                    >
                      Edit
                    </button>

                    <DeleteModal
                      handlingDelete={() => handlingDelete(task._id)}
                      dialogMessage={`Are you sure you want to delete ${task.title}?`}
                    />
                  </div>

                  {/* Delegates */}
                  {task.delegate?.length > 0 && (
                    <div className="mt-2">
                      {task.delegate.map((user) => (
                        <div key={user.userId} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{user.name}</span>
                          <span>{user.email}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status */}
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "In Progress"
                        ? "bg-yellow-200 text-yellow-800"
                        : task.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* MODALS */}
      {createNewTask && <NewTask close={() => setCreateNewTask(false)} />}
      {editTask && <EditTasks {...editData} url={url} onCancel={() => setEditTask(false)} />}
      {delegateView && <DelegatesView delegateview={() => setDelegateView(false)} taskView={() => setTaskView(true)} newTask={() => setCreateNewTask(true)} />}
    </div>
  );
};

export default Task;