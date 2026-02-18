// src/pages/Profile.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetUserInfoQuery,
  useGetSupervisorsQuery,
  useGetEventsByMemberEmailQuery,
  useLogOutMutation,
} from "../redux/Profile/ProfileSlice"; // adjust path if needed
import EventDashboard from "../components/EventDashboard";

const Profile = () => {
  const navigate = useNavigate();
  const [logOut] = useLogOutMutation();

  const { data: userData } = useGetUserInfoQuery();
  const { data: eventsData } = useGetEventsByMemberEmailQuery();

  const email = userData?.user?.email;
  const username = userData?.user?.fullName || "User";

  const firstLetter = username.charAt(0).toUpperCase();
  const secondLetter = username.split(" ")[1]?.charAt(0).toUpperCase() || "";
  const initials = firstLetter + secondLetter;

  const {
    data: supervisorsData,
    isLoading: supervisorsLoading,
    isError: supervisorsError,
  } = useGetSupervisorsQuery(email, { skip: !email });

  const supervisors = supervisorsData?.supervisors || [];

  // ────────────────────────────────────────────────
  //  Compute task overview stats (across ALL supervisors)
  // ────────────────────────────────────────────────
  const taskStats = useMemo(() => {
    let total = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;

    supervisors.forEach((sup) => {
      const tasks = sup.tasks || [];
      total += tasks.length;

      tasks.forEach((task) => {
        if (task.status === "completed") completed++;
        else if (task.status === "in-progress") inProgress++;
        else if (task.status === "pending") {
          // You can improve this logic if you have dueDate
          const due = new Date(task.dueDate);
          if (!isNaN(due) && due < new Date()) overdue++;
        }
      });
    });

    return { total, inProgress, completed, overdue };
  }, [supervisors]);

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white pt-20 md:pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Smart Space
          </h1>
        </motion.div>

        {/* ================= PROFILE CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                     rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-semibold shadow-md">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{username}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Virtual Assistant
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/edit-profile"
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT – Supervisors & Tasks (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-8">

            <h2 className="text-2xl font-semibold">Supervisors & Tasks</h2>

            {/* ── Task Overview Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Tasks" value={taskStats.total} color="bg-emerald-100 dark:bg-emerald-900/30" />
              <StatCard label="In Progress" value={taskStats.inProgress} color="bg-blue-100 dark:bg-blue-900/30" />
              <StatCard label="Completed" value={taskStats.completed} color="bg-green-100 dark:bg-green-900/30" />
              <StatCard label="Overdue" value={taskStats.overdue} color="bg-red-100 dark:bg-red-900/30" />
            </div>

            {/* ── Supervisors List ── */}
            {supervisorsLoading ? (
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading supervisors...</p>
            ) : supervisorsError ? (
              <p className="text-red-500">Unable to load supervisors.</p>
            ) : supervisors.length > 0 ? (
              <div className="space-y-4">
                {supervisors.map((supervisor) => (
                  <div
                    key={supervisor.supervisorId}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                               rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {supervisor.supervisor.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {supervisor.supervisor.email}
                        </p>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {supervisor.totalTasks}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          tasks assigned
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
                No supervisors assigned yet.
              </div>
            )}

            {/* ── Detailed Tasks (like previous modal content) ── */}
            {supervisors.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-5">All Assigned Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {supervisors.flatMap((sup) =>
                    (sup.tasks || []).map((task) => (
                      <TaskCard
                        key={task._id || task.id}
                        task={task}
                        supervisorName={sup.supervisor.fullName}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT – Assigned Events (1/3 width on desktop) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Assigned Events</h2>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                           rounded-2xl p-5 shadow-sm">
              <EventDashboard eventsData={eventsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
//  Small helper components
// ────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-4 text-center ${color} border border-gray-200/50 dark:border-gray-700/50`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function TaskCard({ task, supervisorName }) {
  const statusColor =
    task.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300" :
    task.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300" :
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-lg line-clamp-2">{task.title || "Untitled Task"}</h4>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {task.status || "pending"}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {task.description || "No description"}
      </p>

      <div className="text-xs space-y-1">
        <p><span className="font-medium">Supervisor:</span> {supervisorName}</p>
        {task.dueDate && (
          <p>
            <span className="font-medium">Due:</span>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;