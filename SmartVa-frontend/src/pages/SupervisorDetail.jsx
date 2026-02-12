import React, { useMemo } from "react";
import { motion } from "framer-motion";

const SupervisorDetail = ({
  supervisor,
  currentUserEmail,
  closeDetail,
}) => {
  if (!supervisor) return null;

  const { tasks = [], supervisor: supervisorInfo } = supervisor;
  const now = new Date();

  const isAssignedToUser = (delegates = []) =>
    delegates?.some((d) => d.email === currentUserEmail);

  /* ===============================
     TASK COUNTS
  =============================== */
  const { statusCounts, totalAssignedTasks } = useMemo(() => {
    const counts = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      Overdue: 0,
    };

    let total = 0;

    tasks.forEach((task) => {
      if (isAssignedToUser(task.delegate)) {
        total++;
        if (counts[task.status] !== undefined) {
          counts[task.status]++;
        }
        if (
          task.dueDate &&
          new Date(task.dueDate) < now &&
          task.status !== "Completed"
        ) {
          counts.Overdue++;
        }
      }

      task.subTasks?.forEach((sub) => {
        if (!isAssignedToUser(sub.delegate)) return;

        total++;
        if (counts[sub.status] !== undefined) {
          counts[sub.status]++;
        }
        if (
          sub.dueDate &&
          new Date(sub.dueDate) < now &&
          sub.status !== "Completed"
        ) {
          counts.Overdue++;
        }
      });
    });

    return { statusCounts: counts, totalAssignedTasks: total };
  }, [tasks, currentUserEmail]);

  const completionRate =
    totalAssignedTasks > 0
      ? Math.floor((statusCounts.Completed / totalAssignedTasks) * 100)
      : 0;

  const overdueRate =
    totalAssignedTasks > 0
      ? Math.floor((statusCounts.Overdue / totalAssignedTasks) * 100)
      : 0;

  const progressColor = (value) =>
    value < 30
      ? "bg-yellow-500"
      : value < 60
      ? "bg-blue-500"
      : "bg-emerald-500";

  const overdueColor =
    overdueRate > 50
      ? "bg-red-500"
      : overdueRate > 20
      ? "bg-orange-500"
      : "bg-emerald-500";

  /* ===============================
     USER TASKS (MAIN + SUB)
  =============================== */
  const userTasks = useMemo(() => {
    const items = [];

    tasks.forEach((task) => {
      if (isAssignedToUser(task.delegate)) {
        items.push({
          id: task._id,
          title: task.title,
          dueDate: task.dueDate,
          status: task.status,
          priority: task.priority,
          type: "main",
        });
      }

      task.subTasks?.forEach((sub) => {
        if (isAssignedToUser(sub.delegate)) {
          items.push({
            id: sub._id,
            title: sub.title,
            dueDate: sub.dueDate,
            status: sub.status,
            priority: sub.priority,
            parentTask: task.title,
            type: "subtask",
          });
        }
      });
    });

    return items;
  }, [tasks, currentUserEmail]);

  /* ===============================
     STATUS BADGE COLOR
  =============================== */
  const statusBadge = (status, dueDate) => {
    const isOverdue =
      dueDate && new Date(dueDate) < now && status !== "Completed";

    if (isOverdue)
      return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400";

    if (status === "Completed")
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400";

    if (status === "In Progress")
      return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400";

    return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400";
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            {supervisorInfo?.fullName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {supervisorInfo?.email}
          </p>
        </div>

        <button
          onClick={closeDetail}
          className="text-sm px-3 py-1 rounded-lg 
                     bg-gray-100 dark:bg-gray-800 
                     hover:bg-red-500 hover:text-white 
                     transition-all"
        >
          Close
        </button>
      </div>

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <MetricCard title="Total Assigned" value={totalAssignedTasks} />

        <MetricCard
          title="In Progress"
          value={statusCounts["In Progress"]}
        />

        <MetricCard
          title="Completed"
          value={statusCounts.Completed}
        />

        <MetricCard
          title="Overdue"
          value={statusCounts.Overdue}
        />
      </div>

      {/* ================= PROGRESS BARS ================= */}
      <div className="space-y-6">

        {/* Completion */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Completion Rate</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.6 }}
              className={`h-3 rounded-full ${progressColor(completionRate)}`}
            />
          </div>
        </div>

        {/* Overdue */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overdue Rate</span>
            <span>{overdueRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overdueRate}%` }}
              transition={{ duration: 0.6 }}
              className={`h-3 rounded-full ${overdueColor}`}
            />
          </div>
        </div>
      </div>

      {/* ================= TASK LIST ================= */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Your Assigned Tasks
        </h3>

        {userTasks.length ? (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {userTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border 
                           border-gray-200 dark:border-gray-800 
                           bg-white dark:bg-gray-900 
                           hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>

                    {task.type === "subtask" && (
                      <p className="text-xs text-gray-500">
                        Subtask of {task.parentTask}
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusBadge(
                      task.status,
                      task.dueDate
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
                  <span>
                    Due:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <span>Priority: {task.priority}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            No tasks assigned to you.
          </div>
        )}
      </div>
    </div>
  );
};

/* ===============================
   METRIC CARD COMPONENT
=============================== */
const MetricCard = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white dark:bg-gray-900 
               border border-gray-200 dark:border-gray-800 
               p-4 rounded-xl shadow-sm"
  >
    <p className="text-xs text-gray-500 dark:text-gray-400">
      {title}
    </p>
    <p className="text-lg font-semibold mt-1">{value}</p>
  </motion.div>
);

export default SupervisorDetail;
