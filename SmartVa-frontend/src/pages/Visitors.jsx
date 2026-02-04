// Visitors.jsx
import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import NewVisitor from "../components/NewVisitor";
import EditVisitor from "../components/EditVisitor";

import DeleteModal from "../components/DeleteModal";

import {
  useGetAllVisitorsQuery,
  useDeleteVisitorMutation,
  useGetVisitorByDayQuery,
  useGetVisitorByMonthQuery,
  useGetVisitorByWeekQuery,
  useGetVisitorsByNameQuery,
} from "../redux/visitor/visitorSlice";

const Visitors = () => {
  const [newVisitor, setNewVisitor] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  const [editView, setEditView] = useState(false);
  const [visitorToEdit, setVisitorToEdit] = useState(null);

  const navigate = useNavigate();

  // FETCH BASE DATA
  const { data: allVisitorsData, isLoading: loadingAll } = useGetAllVisitorsQuery();

  // BACKEND FILTER QUERIES
  const visitorsByName = useGetVisitorsByNameQuery(searchTerm, { skip: !searchTerm });
  const visitorsByDay = useGetVisitorByDayQuery(filterValue, {
    skip: filterType !== "day" || !filterValue,
  });
  const visitorsByMonth = useGetVisitorByMonthQuery(filterValue, {
    skip: filterType !== "month" || !filterValue,
  });
  const visitorsByWeek = useGetVisitorByWeekQuery(undefined, {
    skip: filterType !== "week",
  });

  const [deleteVisitor] = useDeleteVisitorMutation();


  // handle delete
  const handleDeleteVisitor = async (id) => {
  try {
    const res = await deleteVisitor(id).unwrap();
    return res.message;
  } catch (error) {
    return error?.data?.message || "Could not delete visitor";
  }
  }

  // FRONTEND ONLY: YEAR FILTER
  const filteredVisitors = useMemo(() => {
    if (loadingAll) return [];

    // NAME SEARCH (BACKEND)
    if (searchTerm) {
      return visitorsByName.data?.visitors || [];
    }

    // DAY FILTER (BACKEND)
    if (filterType === "day" && filterValue) {
      return visitorsByDay.data?.visitors || [];
    }

    // WEEK FILTER (BACKEND)
    if (filterType === "week") {
      return visitorsByWeek.data?.visitors || [];
    }

    // MONTH FILTER (BACKEND)
    if (filterType === "month" && filterValue) {
      return visitorsByMonth.data?.visitors || [];
    }

    // YEAR FILTER (FRONTEND ONLY)
    if (filterType === "year" && filterValue) {
      return allVisitorsData?.visitors.filter((v) => {
        const vYear = new Date(v.createdAt).getFullYear();
        return vYear.toString() === filterValue;
      });
    }

    // DEFAULT: RETURN ALL
    return allVisitorsData?.visitors || [];
  }, [
    searchTerm,
    filterType,
    filterValue,
    allVisitorsData,
    visitorsByName.data,
    visitorsByDay.data,
    visitorsByWeek.data,
    visitorsByMonth.data,
    loadingAll,
  ]);

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16">
      {/* Header */}
      <div className="flex justify-between mx-3">
        <h1 className="mb-8 text-2xl">Visitors</h1>
        <button
          onClick={() => setNewVisitor(true)}
          className="bg-green-500 rounded-md cursor-pointer px-3 h-8 text-white"
        >
          <FaPlus className="inline" />
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md space-y-4 mx-3">
        <input
          type="text"
          placeholder="Search visitors..."
          className="w-full p-2 rounded-md dark:bg-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-4 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue("");
              setSearchTerm(""); // reset search
            }}
            className="p-2 rounded-md border dark:bg-gray-600 dark:text-white"
          >
            <option value="all">All</option>
            <option value="day">By Day</option>
            <option value="week">By Week</option>
            <option value="month">By Month</option>
            <option value="year">By Year</option>
          </select>

          {/* DAY / WEEK */}
          {["day", "week"].includes(filterType) && (
            <input
              type="date"
              className="p-2 rounded-md border dark:bg-gray-600 dark:text-white"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}

          {/* MONTH */}
          {filterType === "month" && (
            <input
              type="month"
              className="p-2 rounded-md border dark:bg-gray-600 dark:text-white"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}

          {/* YEAR (FRONTEND FILTER) */}
          {filterType === "year" && (
            <input
              type="number"
              placeholder="Enter year (e.g., 2025)"
              className="p-2 rounded-md border dark:bg-gray-600 dark:text-white"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Visitor List */}
      {loadingAll ? (
        <p className="text-gray-600 mt-6">Loading visitors...</p>
      ) : filteredVisitors?.length === 0 ? (
        <p className="text-gray-600 mt-6">No visitors found.</p>
      ) : (
        <ul className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3">
          {filteredVisitors.map((visitor) => (
            <li key={visitor._id} className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-green-500">{visitor.name}</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {visitor.message?.slice(0, 50) || "No message"}...
              </p>

              <div className="text-sm text-gray-500 mt-4">
                Email: {visitor.email} | Phone: {visitor.phone}
              </div>
              <div className="text-sm text-gray-500">
                Visited on: {new Date(visitor.createdAt).toLocaleDateString()}
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  className="border-2 border-yellow-500 p-2 rounded-md hover:bg-yellow-500 hover:text-white"
                  onClick={() => { setVisitorToEdit(visitor); setEditView(true); }}
                >
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/visitor-details/${visitor._id}`, { state: { visitor } })}
                  className="border-2 border-gray-500 p-2 rounded-md hover:bg-gray-500 hover:text-white"
                >
                  View
                </button>
                <DeleteModal dialogMessage={`Are you sure you want to delete the visitor names ${visitor.name} who visited on ${visitor.createdAt}`} handlingDelete={()=>handleDeleteVisitor(visitor._id)} />

                {/* <button
                  onClick={() => deleteVisitor(visitor._id)}
                  className="border-2 border-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popups */}
      {newVisitor && <NewVisitor close={() => setNewVisitor(false)} />}
      {editView && (
        <EditVisitor visitor={visitorToEdit} close={() => setEditView(false)} />
      )}
    </div>
  );
};

export default Visitors;
