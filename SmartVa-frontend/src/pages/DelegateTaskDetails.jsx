import React, { useState, useMemo } from "react";
import { useParams, useNavigate , useLocation} from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

import { useGetTaskByIdQuery } from "../redux/Task/TaskSlice";
import { useUpdateTaskStatusByDelegateMutation } from "../redux/Profile/ProfileSlice";
import { toast } from "react-toastify";

const DelegateTaskDetails = () => {
  const location = useLocation();

  const userEmail = location.state?.email;

  const { id: taskId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetTaskByIdQuery(taskId);
  const [updateStatus, {isLoading: isUpdating}] = useUpdateTaskStatusByDelegateMutation();

  const [pendingStatus, setPendingStatus] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  if (isLoading) return <p className="mt-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>;
  if (isError || !data)
    return (
      <p className="text-center mt-10 text-red-600">
        Error loading task.
      </p>
    );

  const task = data.task;
  const subtasks = task.subTasks || [];
 

  /* ======================
     HELPERS
  ====================== */

  const isDelegate = (delegates = []) =>
    delegates.some(
      (d) => d.email?.toLowerCase() === userEmail?.toLowerCase()
    );

  const handleUpdate = async ({ isSubtask, subtaskId }) => {
    const key = isSubtask ? subtaskId : "main";
    const status = pendingStatus[key];

    if (!status) return;

    try {
      setUpdatingId(key);
      await updateStatus({
        taskId,
        status,
        isSubtask,
        subtaskId: isSubtask ? subtaskId : null,
      }).unwrap();
toast.success("Status updated!");

    } catch (err) {
      toast.error(err?.data?.message || "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColor = (status) =>
    status === "Completed"
      ? "bg-green-300"
      : status === "In Progress"
      ? "bg-blue-300"
      : "bg-yellow-300";

  /* ======================
     RENDER
  ====================== */

  return (
    <div className="p-6 mt-28 bg-gray-100 min-h-screen dark:bg-gray-800 dark:text-white">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:underline mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* ======================
         MAIN TASK
      ====================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl shadow-md ${statusColor(
          task.status
        )} text-white`}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{task.title}</h2>

          {isDelegate(task.delegate) && (
            <span className="px-3 py-1 bg-yellow/30 rounded-full text-sm">
              Assigned to you
            </span>
          )}
        </div>

        <p className="mt-2">{task.description}</p>

        {/* Delegates */}
        <p className="mt-3 text-sm">
          <strong>Delegates:</strong>{" "}
          {task.delegate.map((d) => `${d.name} (${d.email})`).join(", ")}
        </p>

        {/* Status */}
        <div className="mt-4">
          <strong>Status:</strong>

          {isDelegate(task.delegate) ? (
            <div className="flex items-center gap-3 mt-2">
              <select
                value={pendingStatus.main ?? task.status}
                onChange={(e) =>
                  setPendingStatus((p) => ({
                    ...p,
                    main: e.target.value,
                  }))
                }
                className="text-black px-2 py-1 rounded"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <button
                onClick={() => handleUpdate({ isSubtask: false })}
                disabled={updatingId === "main"}
                className="px-4 py-1 bg-black/40 rounded hover:bg-black/60"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          ) : (
            <span className="ml-2 font-semibold">{task.status}</span>
          )}
        </div>
      </motion.div>

      {/* ======================
         SUBTASKS
      ====================== */}
      {subtasks.length > 0 && (
        <div className="mt-6 space-y-4">
          {subtasks.map((sub) => {
            const canUpdate = isDelegate(sub.delegate);

            return (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl shadow-md ${statusColor(
                  sub.status
                )} text-white`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold">{sub.title}</h4>

                  {canUpdate && (
                    <span className="px-3 py-1 bg-black/30 rounded-full text-sm">
                      Assigned to you
                    </span>
                  )}
                </div>

                <p className="text-sm mt-1">{sub.description}</p>

                <p className="text-sm mt-2">
                  <strong>Delegates:</strong>{" "}
                  {sub.delegate
                    .map((d) => `${d.name} (${d.email})`)
                    .join(", ")}
                </p>

                <div className="mt-3">
                  <strong>Status:</strong>

                  {canUpdate ? (
                    <div className="flex items-center gap-3 mt-2">
                      <select
                        value={pendingStatus[sub._id] ?? sub.status}
                        onChange={(e) =>
                          setPendingStatus((p) => ({
                            ...p,
                            [sub._id]: e.target.value,
                          }))
                        }
                        className="text-black px-2 py-1 rounded"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>

                      <button
                        onClick={() =>
                          handleUpdate({
                            isSubtask: true,
                            subtaskId: sub._id,
                          })
                        }
                        disabled={updatingId === sub._id}
                        className="px-4 py-1 bg-black/40 rounded hover:bg-black/60"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <span className="ml-2 font-semibold">
                      {sub.status}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DelegateTaskDetails;
