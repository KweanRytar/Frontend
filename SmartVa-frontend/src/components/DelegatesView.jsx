import React, { useState, useEffect, useMemo } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetAllDelegatesQuery } from "../redux/Task/TaskSlice";

const DelegatesView = ({ delegateview, taskView, newTask }) => {
  const { data: delegatesData, error, isLoading } = useGetAllDelegatesQuery();
  const [delegates, setDelegates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOverdue, setShowOverdue] = useState(false);
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    if (delegatesData?.delegates) setDelegates(delegatesData.delegates);
  }, [delegatesData]);

  const filteredDelegates = useMemo(() => {
    let filtered = [...delegates];

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (showOverdue) filtered = filtered.filter((d) => d.overdue);
    if (showPending) filtered = filtered.filter((d) => d.pending);

    return filtered;
  }, [delegates, searchTerm, showOverdue, showPending]);

  const getDelegateColor = (delegate) => {
    if (delegate.overdue) return "bg-red-200 dark:bg-red-600";
    if (delegate.pending) return "bg-yellow-200 dark:bg-yellow-600";
    return "bg-green-200 dark:bg-green-600";
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading delegates...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load delegates.
      </p>
    );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
        <button
          className="flex items-center justify-center p-2 rounded-md bg-green-500 text-white hover:bg-green-600"
          onClick={() => {
            delegateview();
            taskView();
          }}
        >
          <IoIosArrowBack className="text-2xl" />
        </button>

        <button
          className={`px-4 py-2 rounded-2xl font-medium text-white transition ${
            showOverdue ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => setShowOverdue(!showOverdue)}
        >
          Overdue
        </button>

        <button
          className={`px-4 py-2 rounded-2xl font-medium text-white transition ${
            showPending ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => setShowPending(!showPending)}
        >
          Pending
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md mt-6">
        <input
          type="text"
          placeholder="Search for a delegate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Delegates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {filteredDelegates.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No delegates found.
          </p>
        ) : (
          filteredDelegates.map((delegate, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl shadow-md flex flex-col justify-between ${getDelegateColor(
                delegate
              )}`}
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white truncate">
                  {delegate?.name}
                </h2>
                <p className="mb-1 text-gray-700 dark:text-gray-200">
                  <strong>Email:</strong> {delegate?.email}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Tasks assigned: {delegate.taskCount}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-2 mt-4">
                <Link
                  to={`/delegate-details/${encodeURIComponent(delegate.email)}`}
                  className="px-4 py-2 rounded-xl font-medium shadow-sm bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition"
                >
                  View
                </Link>

                <button
                  onClick={() => newTask()}
                  className="px-4 py-2 rounded-xl font-medium shadow-sm bg-green-500 text-white hover:bg-green-600 active:bg-green-700 transition"
                >
                  Assign Task
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DelegatesView;