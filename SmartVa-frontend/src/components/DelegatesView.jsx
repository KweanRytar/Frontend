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

  // Load delegates from Redux query
  useEffect(() => {
    if (delegatesData?.delegates) {
      setDelegates(delegatesData.delegates);
    }
  }, [delegatesData]);

  // Filtering logic
  const filteredDelegates = useMemo(() => {
    let filtered = [...delegates];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by overdue or pending
    if (showOverdue) filtered = filtered.filter((d) => d.overdue);
    if (showPending) filtered = filtered.filter((d) => d.pending);

    return filtered;
  }, [delegates, searchTerm, showOverdue, showPending]);

  // Badge color
  const getDelegateColor = (delegate) => {
    if (delegate.overdue) return "bg-red-400";
    if (delegate.pending) return "bg-yellow-400";
    return "bg-green-400";
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
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-10 md:mt-16">
      {/* Header */}
      <div className="flex justify-around items-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          <IoIosArrowBack
            className="text-2xl cursor-pointer"
            onClick={() => {
              delegateview();
              taskView();
            }}
          />
        </button>

        <button
          className={`text-white rounded-md px-4 py-2 cursor-pointer ${
            showOverdue ? "bg-red-500" : "bg-green-500"
          }`}
          onClick={() => setShowOverdue(!showOverdue)}
        >
          Overdue
        </button>

        <button
          className={`text-white rounded-md px-4 py-2 cursor-pointer ${
            showPending ? "bg-yellow-500" : "bg-green-500"
          }`}
          onClick={() => setShowPending(!showPending)}
        >
          Pending
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6 mb-6">
        <input
          type="text"
          placeholder="Search for a delegate"
          className="w-full p-2 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Delegates List */}
      <div className="grid  lg:grid-cols-4 md:grid-cols-2 gap-4">
        {filteredDelegates.length === 0 ? (
          <p className="text-center text-gray-500">No delegates found.</p>
        ) : (
          filteredDelegates.map((delegate, index) => (
            <div
              key={index}
              className={`${getDelegateColor(
                delegate
              )} text-white p-6 rounded-2xl shadow-md`}
            >
              <h2 className="text-xl font-semibold mb-2">{delegate?.name}</h2>
              <p className="mb-1">
                <strong>Email:</strong> {delegate?.email}
              </p>
             
              <p className="mt-2 text-sm opacity-90">
                Tasks assigned: {delegate.taskCount}
              </p>

              <div className="flex justify-around mt-4">
                <Link
                  to={`/delegate-details/${encodeURIComponent(delegate.email)}`}
                  className="px-4 py-2 rounded-xl font-medium shadow-sm 
                    bg-white text-gray-800 border border-gray-300 
                    hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  View
                </Link>

                <button
                  className="px-4 py-2 rounded-xl font-medium shadow-sm 
                    bg-green-500 text-white 
                    hover:bg-green-600 active:bg-green-700"
                  onClick={() => newTask()}
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
