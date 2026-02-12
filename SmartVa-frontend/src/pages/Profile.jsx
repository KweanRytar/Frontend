// src/pages/Profile.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useGetUserInfoQuery } from "../redux/dashboard/OverviewSlice";
import {
  useGetSupervisorsQuery,
  useGetEventsByMemberEmailQuery,
  useLogOutMutation,
} from "../redux/Profile/ProfileSlice";
import EventDashboard from "../components/EventDashboard";
import SupervisorDetail from "./SupervisorDetail";

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

  const [revealSupervisorDetails, setRevealSupervisorDetails] =
    useState(false);
  const [currentSupervisor, setCurrentSupervisor] = useState(null);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white pt-20 md:pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Your Smart Space
          </motion.h1>
        </div>

        {/* ================= PROFILE SUMMARY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                     rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white 
                              flex items-center justify-center text-xl font-semibold shadow-md">
                {initials}
              </div>

              <div>
                <h2 className="text-lg font-semibold">{username}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Virtual Assistant
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                to="/edit-profile"
                className="px-4 py-2 rounded-xl text-center 
                           bg-gray-100 dark:bg-gray-800 
                           hover:bg-gray-200 dark:hover:bg-gray-700 
                           transition-all duration-200"
              >
                Edit Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-center 
                           bg-emerald-500 text-white 
                           hover:bg-emerald-600 
                           transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== SUPERVISORS ===== */}
          <div className="lg:col-span-2 space-y-6">

            <h2 className="text-xl font-semibold">
              Your Supervisors
            </h2>

            {supervisorsLoading ? (
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                Loading supervisors...
              </p>
            ) : supervisorsError ? (
              <p className="text-red-500">
                Unable to load supervisors.
              </p>
            ) : supervisors.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                {supervisors.map((supervisor, index) => (
                  <motion.div
                    key={supervisor.supervisorId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-900 
                               border border-gray-200 dark:border-gray-800 
                               rounded-2xl p-5 
                               shadow-sm hover:-translate-y-1 hover:shadow-lg 
                               transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {supervisor.supervisor.fullName}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {supervisor.supervisor.email}
                        </p>

                        <p className="mt-2 text-sm font-medium text-emerald-500">
                          {supervisor.totalTasks} Tasks Assigned
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setRevealSupervisorDetails(true);
                          setCurrentSupervisor(supervisor);
                        }}
                        className="text-sm px-3 py-1 rounded-lg 
                                   bg-gray-100 dark:bg-gray-800 
                                   hover:bg-emerald-500 hover:text-white 
                                   transition-all duration-200"
                      >
                        Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 
                              border border-gray-200 dark:border-gray-800 
                              rounded-2xl p-6 text-gray-500 dark:text-gray-400">
                You have no supervisors assigned.
              </div>
            )}
          </div>

          {/* ===== EVENTS ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Assigned Events
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 
                         border border-gray-200 dark:border-gray-800 
                         rounded-2xl p-5 shadow-sm hover:shadow-lg 
                         transition-all duration-300"
            >
              <EventDashboard eventsData={eventsData} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {revealSupervisorDetails && currentSupervisor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                        flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 
                       border border-gray-200 dark:border-gray-800 
                       rounded-2xl shadow-xl 
                       w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          >
            <SupervisorDetail
              supervisor={currentSupervisor}
              currentUserEmail={email}
              closeDetail={() => setRevealSupervisorDetails(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
