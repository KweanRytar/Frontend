import React, { useState } from "react";
import { useGetUserInfoQuery } from "../redux/dashboard/OverviewSlice";
import { useGetSupervisorsQuery, useGetEventsByMemberEmailQuery } from "../redux/Profile/ProfileSlice";
import EventDashboard from "../components/EventDashboard";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLogOutMutation } from "../redux/Profile/ProfileSlice";

import SupervisorDetail from "./SupervisorDetail";

const Profile = () => {

const [logOut] = useLogOutMutation();

  // handle logout
  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      // clear local storage
      localStorage.removeItem('isLoggedIn');
      // redirect to login page

      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } 
  }

  const navigate = useNavigate();

  const {data: eventsData, isLoading: eventsLoading, isError: eventsError } = useGetEventsByMemberEmailQuery();
  const { data: userData } = useGetUserInfoQuery();
  const email = userData?.user?.email;

  const username = userData?.user?.fullName || "User";
  const firstLetter = username.charAt(0).toUpperCase();
  const secondLetter = username.split(" ")[1]?.charAt(0).toUpperCase() || "";
  const [revealSupervisorDetails, setRevealSupervisorDetails] = useState(false);
  const [currentSupervisor, setCurrentSupervisor] = useState(null);
  const initials = firstLetter + secondLetter;

  const {
    data: supervisorsData,
    isLoading: supervisorsLoading,
    isError: supervisorsError,
  } = useGetSupervisorsQuery(email, { skip: !email });

  const supervisors = supervisorsData?.supervisors || [];
 




  // State to track which supervisor cards are expanded
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-10 md:mt-0">
      <h1 className="text-3xl font-bold mt-22 mb-4">Your Smart Space</h1>

      {/* User Profile Card */}
      <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 rounded-[50%] p-4 text-2xl text-white">
              {initials}
            </div>
            <div className="flex flex-col items-center mt-4">
              <h1>{username}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Virtual Assistant
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link className="bg-gray-300 text-[#584949] rounded-2xl w-24 hover:bg-gray-400 dark:hover:bg-[#00B86B] p-2"
            to={'/edit-profile'}
            >
              Edit Profile
            </Link>
            <button 
            onClick={()=>{handleLogout()}}
            className="bg-yellow-300 text-[#FFFFFF] rounded-2xl w-24 hover:bg-yellow-400 dark:hover:bg-[#00B86B] p-2">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Supervisors Section */}
      {supervisorsLoading ? (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400 animate-pulse">
          Loading supervisors...
        </p>
      ) : supervisorsError ? (
        <p className="mt-10 text-center text-red-500 font-medium">
          Unable to load supervisors. Please try again.
        </p>
      ) : (
        <section id="supervisor" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Supervisors</h2>

          {supervisors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supervisors.map((supervisor) => {
                const isExpanded = expandedIds.includes(
                  supervisor.supervisorId
                );
                return (
                  <div
                    key={supervisor.supervisorId}
                    className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    {/* Supervisor Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {supervisor.supervisor.fullName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Email: {supervisor.supervisor.email}
                        </p>
                        <h4 className="text-lg font-semibold">
                          Assigned Tasks: {supervisor.totalTasks}
                        </h4>
                      </div>
                      <button
                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl text-sm"
                        onClick={() => {
                          toggleExpand(supervisor.supervisorId);
                          setRevealSupervisorDetails(true);
                          setCurrentSupervisor(supervisor);
                        }}
                      >
                        details
                      </button>
                    </div>

                    {/* Expandable Tasks */}

                    <div className="mt-4 space-y-3">
                      {supervisor.tasks.length > 0 ? (
                        supervisor.tasks.map((task) => (
                          <div
                            key={task._id}
                            className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center"
                          >
                            <div>
                              <h5 className="font-medium">{task.title}</h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Due:{" "}
                                {new Date(task.dueDate).toString().slice(0, 15)}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                navigate(
                                  `/delegate-task-details/${encodeURIComponent(
                                    task._id
                                  )}`,
                                  { state: { email } }
                                )
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl text-sm"
                            >
                              View Task
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          No tasks assigned
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              You have no supervisors assigned.
            </p>
          )}
        </section>
      )}

      {/* Supervisor Detail Modal */}
      {revealSupervisorDetails && currentSupervisor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-y-auto">
            <SupervisorDetail
              supervisor={currentSupervisor}
              currentUserEmail={email}
              closeDetail={() => setRevealSupervisorDetails(false)}
            />
          </div>
        </div>
      )}
      {/* Event Dashboard */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Assigned Events (created by others, I’m involved)</h2>
        <EventDashboard eventsData={eventsData} />
      </div>
    </div>
  );
};

export default Profile;
