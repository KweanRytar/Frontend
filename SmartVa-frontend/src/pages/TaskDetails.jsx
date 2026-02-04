import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// import icon to naviage back
import { FaArrowLeft } from "react-icons/fa";

import { useParams, Link } from "react-router-dom";
import { useGetTaskByIdQuery } from "../redux/Task/TaskSlice";
import EditTasks from "../components/EditTasks";

const TaskDetails = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetTaskByIdQuery(id);
  const [filter, setFilter] = useState("all");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
    

  // Always define hooks before any conditional return
  const task = data?.task || {};
  const subtask = data?.subtask || {};
  const isSubtask = !!data?.isSubtask;

  const subtasks = task?.subTasks || [];
  const delegate = task?.delegate || [];

  const isOverdue = (item) =>
    item?.dueDate && new Date(item.dueDate) < new Date() && item.status !== "Completed";

  // ✅ useMemo always runs regardless of data state
  const filteredSubtasks = useMemo(() => {
    if (!Array.isArray(subtasks)) return [];
    switch (filter) {
      case "Pending":
        return subtasks.filter((s) => s.status === "Pending" && !isOverdue(s));
      case "Completed":
        return subtasks.filter((s) => s.status === "Completed");
      case "Overdue":
        return subtasks.filter((s) => isOverdue(s));
      default:
        return subtasks;
    }
  }, [subtasks, filter]);

  // ✅ Conditional returns after all hooks are declared
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        Error loading details.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 mt-28 bg-gray-100 min-h-screen dark:bg-gray-800 dark:text-white">
      {isSubtask ? (
        // ✅ Subtask view
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:underline mb-4 cursor-pointer"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-green-500">{subtask.title}</h1>
          <p className="text-gray-700 mt-2">{subtask.description}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {new Date(subtask.dueDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-md text-white ${
                  subtask.status === "Completed"
                    ? "bg-green-600"
                    : isOverdue(subtask)
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
              >
                {isOverdue(subtask) ? "Overdue" : subtask.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Parent Task:</span>{" "}
              <Link
                to={`/task-details/${data.parentTaskId}`}
                className="text-blue-500 hover:underline"
              >
                View Parent Task
              </Link>
            </p>
          </div>

          {subtask.delegate?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Delegates:</h3>
              {subtask.delegate.map((d, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <Link
                    to={`/delegate-details/${encodeURIComponent(d.email)}`}
                    className="text-green-500 hover:underline"
                  >
                    {d.name}
                  </Link>
                  <span className="text-gray-400">({d.email})</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        // ✅ Main task view
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md"
          >
             <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:underline mb-4 cursor-pointer"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
            <h1 className="text-2xl font-bold text-green-500">{task.title}</h1>
            <p className="text-gray-700 mt-2">{task.description}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <p>
                <span className="font-semibold">Due Date:</span>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-white ${
                    task.status === "Completed"
                      ? "bg-green-600"
                      : task.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                >
                  {task.status}
                </span>
              </p>
              <p>
  <span className="font-semibold">Delegate:</span>{" "}
  {Array.isArray(delegate) && delegate.length > 0 ? (
    <>
      <Link
        to={`/delegate-details/${encodeURIComponent(delegate[0].email)}`}
        className="text-green-500 hover:underline"
      >
        {delegate[0].name}
      </Link>
      <span className="text-gray-400"> ({delegate[0].email})</span>
    </>
  ) : (
    "None"
  )}
</p>
            </div>
          </motion.div>

          {/* Subtask Filters */}
          <div className="flex gap-3">
            {["all", "Pending", "Completed", "Overdue"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg shadow-md transition ${
                  filter === f
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Subtask List */}
          <motion.div
            layout
            className="space-y-4 dark:bg-gray-700 p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-xl font-semibold">Subtasks</h2>
            {filteredSubtasks.length > 0 ? (
              filteredSubtasks.map((sub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-green-500">{sub.title}</h3>
                    <p className="text-gray-600">{sub.description}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(sub.dueDate).toLocaleDateString()}
                    </p>
                    {sub.delegate?.length > 0 && (
                      <div className="mt-2">
                        {sub.delegate.map((d, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            <Link
                              to={`/delegate-details/${encodeURIComponent(d.email)}`}
                              className="font-semibold"
                            >
                              {d.name}
                            </Link>
                            <span className="text-gray-500 dark:text-gray-400">
                              ({d.email})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/task-details/${sub._id}`}
                      className="text-sm text-blue-500 hover:underline mt-1 block"
                    >
                      View Subtask Details →
                    </Link>
                  </div>

                  <span
                    className={`mt-2 sm:mt-0 px-3 py-1 rounded-lg text-sm font-medium ${
                      sub.status === "Completed"
                        ? "bg-green-500 text-white"
                        : isOverdue(sub)
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400 text-white"
                    }`}
                  >
                    {isOverdue(sub) ? "Overdue" : sub.status}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic">No subtasks found.</p>
            )}
          </motion.div>

          {/* Add Subtask Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-700 transition" 
            onClick={()=>{
              setIsEditOpen(true);
              setUrl(`/${task._id}`);


            }}
            >
              <FaPlus /> Add Subtask
            </button>
          </div>
          {isEditOpen && (
            <EditTasks
            title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
              delegate={task.delegate}
              subTasks={task.subTasks}
              onCancel={() => setIsEditOpen(false)}
              url={url}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskDetails;
