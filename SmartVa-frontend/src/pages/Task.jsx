import React, { useState, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { MdAddTask } from "react-icons/md";
import NewTask from "../components/NewTask.jsx";
import EditTasks from "../components/EditTasks.jsx";
import { Link } from "react-router-dom";
import DeleteModal from "../components/DeleteModal.jsx";
import DelegatesView from "../components/DelegatesView.jsx";
import {
  useGetEmergencyTasksQuery,
} from "../redux/dashboard/OverviewSlice.js";
import {
  useGetTaskDueTodayQuery,
  useGetOverdueTasksQuery,
  useGetTaskDueIn72HoursQuery,
  useGetTaskByStatusQuery,
  useGetTaskByPriorityQuery,
  useGetTaskByNameQuery,
 
  useDeleteTaskMutation,
  useGetAllTasksQuery,
} from "../redux/Task/TaskSlice.js";

const Task = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const today = new Date().toISOString();
  const [url, setUrl] = useState()

  // === API Calls ===
  const { data: allTaskData, isLoading: allTaskLoading } = useGetAllTasksQuery({ page, limit });
  const { data: dueTodayData } = useGetTaskDueTodayQuery(today);
  const { data: dueIn72HoursData } = useGetTaskDueIn72HoursQuery();
  const { data: overdueData } = useGetOverdueTasksQuery();
  const { data: emergencyData } = useGetEmergencyTasksQuery();
  
  const [deleteTask] = useDeleteTaskMutation();

  // Live search API (auto fetches as user types)
  const [searchTerm, setSearchTerm] = useState("");
  const { data: taskByNameData } = useGetTaskByNameQuery(searchTerm, {
    skip: !searchTerm, // Skip API call if no search term
  });

  // === Local state ===
  const [taskView, setTaskView] = useState(true);
  const [delegateView, setDelegateView] = useState(false);
  const [creatNewTask, setCreateNewTask] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [activeButton, setActiveButton] = useState("All")
  const [deleteMessage, setDeleteMessage] = useState("");

  // Edit modal states
  const [editData, setEditData] = useState({});

  // === Determine which dataset to show based on active filters ===
  const filteredTasks = useMemo(() => {
    // 1️⃣ If user is typing in search, show search results
    if (searchTerm && taskByNameData) {
      return taskByNameData?.tasks || [];
    }

    // 2️⃣ If user clicks top buttons
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

  // === Additional filter by status/priority (client-side only for now) ===
  const finalFilteredTasks = useMemo(() => {
    let filtered = [...filteredTasks];
    if (status) {
      filtered = filtered.filter(
        (task) => task.status?.toLowerCase() === status.toLowerCase()
      );
    }
    if (priority) {
      filtered = filtered.filter(
        (task) => task.priority?.toLowerCase() === priority.toLowerCase()
      );
    }
    return filtered;
  }, [filteredTasks, status, priority]);

  // Top buttons
  const buttons = ["All", "Due Today", "Overdue", "Emergency", "72HRS Due"];

  const handlingDelete = async (taskId) => {
  try {
    const res = await deleteTask(taskId).unwrap();
    return res.message;  // ✔️ unwrap() gives correct response.body
  } catch (error) {
    return error?.data?.message || "Failed to delete";
  }
};


  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-10 md:mt-16">
      {/* Header with "Tasks" title and + button */}
      <div className="flex justify-around mb-4">
        <button
          className="bg-green-500 rounded-2xl cursor-pointer p-2 text-white"
          onClick={() => {
            setTaskView(true);
            setDelegateView(false);
          }}
        >
          <MdAddTask className="inline text-white dark:text-black" />
          <span className="block text-white">Tasks</span>
        </button>

        <button
          className="rounded-2xl h-16 p-2 cursor-pointer bg-green-500"
          onClick={() => {
            setTaskView(false);
            setDelegateView(true);
          }}
        >
          <IoPeople className="inline text-white dark:text-black" />
          <span className="block text-white">Delegates</span>
        </button>

        <button
          className="rounded-2xl h-16 p-2 cursor-pointer bg-green-500"
          onClick={() => setCreateNewTask(!creatNewTask)}
        >
          <FaPlus className="inline text-white dark:text-black" />
          <span className="ml-2 text-white block">New Task</span>
        </button>
      </div>

      {/* === TASK VIEW === */}
      {taskView && (
        <section>
          {/* Search input */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full p-2 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter buttons + dropdown filters */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {buttons.map((button) => (
                <button
                  key={button}
                  className={`rounded-2xl border-2 border-gray-400 w-full p-2 h-14 hover:bg-green-900 hover:border-0 ${
                    activeButton === button ? "bg-green-500 text-white" : ""
                  }`}
                  onClick={() => {
                    setActiveButton(button);
                    setSearchTerm(""); // Reset search when switching filter
                  }}
                >
                  {button}
                </button>
              ))}
            </div>

            {/* Dropdown filters */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <select
                id="status"
                name="status"
                value={status}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none dark:bg-green-500 dark:text-white"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="inprogress">Inprogress</option>
              </select>

              <select
                id="priority"
                name="priority"
                value={priority}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none dark:bg-green-500 dark:text-white"
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Section header */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6 flex justify-between">
            <h1 className="font-bold">{activeButton}</h1>
            <small className="font-bold cursor-pointer">Sort: Due Date</small>
          </div>

          {/* === TASK LIST === */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6 grid md:grid-cols-2 lg:[grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]  gap-6">
            {finalFilteredTasks.length === 0 ? (
              <p className="text-center text-gray-500">No tasks found.</p>
            ) : (
              finalFilteredTasks.map((task) => (
                <div key={task._id} className="bg-[#f2f3f5] p-6 rounded-3xl">
                  <div className="dark:border-gray-600 py-4 flex justify-between">
                    <h1 className="text-gray-600 dark:text-gray-400">{task.title}</h1>
                    <button
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === "high"
                          ? "bg-red-200 text-red-800"
                          : task.priority === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </button>
                  </div>

                  <div>
                    <div className="">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>

                      <div className="flex gap-2 mt-2 ">
                        {/* View */}
                        <Link
                          to={`/task-details/${encodeURIComponent(task._id)}`}
                          className="rounded-2xl border-2 border-gray-500 dark:text-gray-600 p-2 hover:bg-gray-500 hover:text-white"
                        >
                          View
                        </Link>

                        {/* Edit */}
                        <button
                          className="rounded-2xl border-2 border-gray-500 dark:text-gray-600 p-2 hover:bg-gray-500 hover:text-white"
                          onClick={() => {
                            setUrl(`/${task._id}`)
                            setEditData(task);
                            setEditTask(true);
                          }}
                        >
                          Edit
                        </button>

                        {/* Delete */}
                       <DeleteModal
  handlingDelete={() => handlingDelete(task._id)}
  dialogMessage={`Are you sure you want to delete ${task.title}?`}
/>
                      </div>
                    </div>

                    {/* Delegates */}
                    <div className="mt-2">
                      {task.delegate?.map((user) => (
                        <div key={user.userId} className="flex items-center space-x-2">
                          <span className="font-semibold dark:text-gray-600">{user.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status */}
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "In Progress"
                            ? "bg-yellow-200 text-yellow-800"
                            : task.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-500"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <hr className="my-4 border-t-4 border-green-400 dark:border-green-600 rounded-full" />
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* === MODALS === */}
      {creatNewTask && <NewTask close={() => setCreateNewTask(false)} />}
{console.log(editData)}
      
      {editTask && (
  <>
   
    <EditTasks
      {...editData}
      url={url}
      onCancel={() => setEditTask(false)}
    />
  </>
)}


      {delegateView && (
        <DelegatesView
          delegateview={() => setDelegateView(false)}
          taskView={() => setTaskView(true)}
          newTask={() => setCreateNewTask(true)}
        />
      )}
    </div>
  );
};

export default Task;
