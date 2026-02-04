import React, { useMemo } from "react";

const SupervisorDetail = ({ supervisor, currentUserEmail, closeDetail }) => {
  if (!supervisor) return null;

  const { tasks = [], supervisor: supervisorInfo } = supervisor;
  const now = new Date();

  const isAssignedToUser = (delegates = []) =>
    delegates.some((d) => d.email === currentUserEmail);

  /** ---------------------------
   * TASK COUNTS (MAIN + SUBTASKS)
   ----------------------------*/
  const { statusCounts, totalAssignedTasks } = useMemo(() => {
    const counts = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      Overdue: 0,
    };

    let total = 0;

    tasks.forEach((task) => {
      // MAIN TASK
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

      // SUBTASKS
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

  /** ---------------------------
   * RATES
   ----------------------------*/
  const completionRate =
    totalAssignedTasks > 0
      ? Math.floor((statusCounts.Completed / totalAssignedTasks) * 100)
      : 0;

  const overdueRate =
    totalAssignedTasks > 0
      ? Math.floor((statusCounts.Overdue / totalAssignedTasks) * 100)
      : 0;

  /** ---------------------------
   * PROGRESS BAR COLORS
   ----------------------------*/
  const completionColor =
    completionRate < 30
      ? "bg-yellow-500"
      : completionRate < 60
      ? "bg-blue-500"
      : "bg-green-500";

  const overdueColor =
    overdueRate > 50
      ? "bg-red-500"
      : overdueRate > 20
      ? "bg-orange-500"
      : "bg-green-500";

      // dynamic background color
     const taskBackgroundColor = (status, priority, dueDate) => {
  const isOverdue =
    dueDate && new Date(dueDate) < now && status !== "Completed";

  if (isOverdue) return "bg-red-100 dark:bg-red-900";
  if (status === "Completed") return "bg-green-100 dark:bg-green-900";
  if (status === "In Progress") return "bg-blue-100 dark:bg-blue-900";
  if (status === "Pending" && priority === "High")
    return "bg-orange-100 dark:bg-orange-900";
  if (status === "Pending") return "bg-yellow-100 dark:bg-yellow-900";

  return "bg-gray-100 dark:bg-gray-800";
};



    

  /** ---------------------------
   * USER TASK UNITS (MAIN OR SUBTASK)
   ----------------------------*/
  const userTasks = useMemo(() => {
    const items = [];

    tasks.forEach((task) => {
      // MAIN TASK
      if (isAssignedToUser(task.delegate)) {
        items.push({
          id: task._id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          priority: task.priority,
          type: "main",
        });
      }

      // SUBTASKS
      task.subTasks?.forEach((sub) => {
        if (isAssignedToUser(sub.delegate)) {
          items.push({
            id: sub._id,
            title: sub.title,
            description: sub.description,
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

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl space-y-6">
      {/* Supervisor Info */}
      <div>
        <h2 className="text-2xl font-bold">{supervisorInfo?.fullName}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {supervisorInfo?.email}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-xl">
          <p className="font-semibold">Total Assigned</p>
          <p>{totalAssignedTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-xl">
          <p className="font-semibold">In Progress</p>
          <p>{statusCounts["In Progress"]}</p>
        </div>
      </div>

      {/* Overdue Progress */}
      <div>
        <h3 className="font-semibold mb-1">
          Overdue Tasks: {statusCounts.Overdue} of {totalAssignedTasks}
        </h3>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
          <div
            className={`${overdueColor} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${overdueRate}%` }}
          />
        </div>
        <p className="text-sm mt-1">Overdue Rate: {overdueRate}%</p>
      </div>

      {/* Completion Progress */}
      <div>
        <h3 className="font-semibold mb-1">
          Completed Tasks: {statusCounts.Completed} of {totalAssignedTasks}
        </h3>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
          <div
            className={`${completionColor} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm mt-1">Completion Rate: {completionRate}%</p>
      </div>

      {/* Your Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Your Tasks</h3>

        {userTasks.length ? (
          <div className="space-y-3">
            {userTasks.map((task) => (
              <div
                key={task.id}
                className={` p-4 rounded-xl hover:shadow-md transition-shadow duration-200 ${taskBackgroundColor(task.status, task.priority, task.dueDate)}`}
              >
                <h4 className="font-semibold">{task.title}</h4>

                {task.type === "subtask" && (
                  <p className="text-sm text-gray-500">
                    Subtask of:{" "}
                    <span className="font-medium">{task.parentTask}</span>
                  </p>
                )}

                <p>Status: {task.status}</p>
                <p>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toString().slice(0, 15)
                    : "N/A"}
                </p>
                <p>Priority: {task.priority}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tasks assigned to you.</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={closeDetail}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Close
      </button>
    </div>
  );
};

export default SupervisorDetail;
