import React, { useState, useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useGetDelegateDetailsQuery , useMarkTaskCompletedMutation, useDeleteTaskMutation } from "../redux/Task/TaskSlice.js";
import { useNavigate } from "react-router-dom";
import { getDelegateBg } from "../utils/delegateDetailsUtils.js";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import MessageDelegate from "../components/MessageDelegate.jsx";


const DelegateDetails = () => {
  const navigate = useNavigate();

 
  const [receiverEmail, setDelegateEmail] = useState("");

  const { email } = useParams();
  const { data: delegateDetails, error, isLoading } = useGetDelegateDetailsQuery(email);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [markTaskCompleted, { isLoading: isUpdating }] = useMarkTaskCompletedMutation();
  const [filter, setFilter] = useState("all");
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const {
    delegateName = "",
    delegateEmail = "",
    totalPending = 0,
    totalCompleted = 0,
    totalOverdue = 0,
    assignments = [],
  } = delegateDetails || {};


const deleteTaskHandler = (id) => async () => {
toast.info("Deleting task...");
try {
const response = await deleteTask(id).unwrap();
toast.success(response?.message );
} catch (err) {
toast.error(err?.message || "Error deleting task");
}

}



  const markCompleted = (id) => async () => {
    toast.info("Updating task status...");
    try {
      console.log("Marking task as completed:", id);
      const response = await markTaskCompleted(id).unwrap();
      toast.success(response?.message );
    } catch (err) {
      toast.error(err?.message || "Error updating task status");
    }
  };

  const list = useMemo(() => {
    if (!assignments) return [];
    if (filter === "pending") return assignments.filter((a) => a.status === "Pending");
    if (filter === "completed") return assignments.filter((a) => a.status === "Completed");
    if (filter === "overdue")
      return assignments.filter(
        (a) => isPast(a.dueDate) && a.status !== "Completed"
      );
    return assignments;
  }, [filter, assignments]);

  const bg = getDelegateBg(totalPending, totalCompleted);

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Be patient</h2>
        <p className="text-gray-600">Loading delegate's data...</p>
      </div>
    );
  }

  if (error || !delegateDetails) {
    return (
      <div className="p-6 mt-28 grid justify-center  bg-red-600  max-w-fit lg:max-w-2xl mx-auto rounded-3xl">
        <h2 className="text-xl font-bold text-white text-center">Delegate not found</h2>
        <p className="text-gray-400 font-bold">
          No delegate matches email: {decodeURIComponent(email)}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mt-18 bg-gray-100 min-h-screen dark:bg-gray-800 dark:text-white">
      {/* Header card */}
      <div className={`${bg} text-white p-6 rounded-2xl shadow-md flex flex-col md:items-center gap-6`}>
         <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white hover:underline mb-4 cursor-pointer"
                  >
                    <FaArrowLeft className="mr-2" /> Back
                  </button>
        <h2 className="text-2xl font-bold">{delegateName}</h2>
        <p className="opacity-90">{delegateEmail}</p>
        <div className="flex gap-4">
            
              <button className=" rounded-2xl bg-gray-600 text-white p-2 cursor-pointer" 
              onClick={()=>{
                setShowMessageModal(true);
                setDelegateEmail(delegateEmail);
                
              }}
              >send a mail</button>
        </div>
    

        <div className="flex flex-wrap gap-3 mt-4 flex-col md:flex-row">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Total: {assignments.length}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Pending: {totalPending}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Completed: {totalCompleted}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Overdue: {totalOverdue}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["all", "pending", "completed", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl border ${
              filter === f
                ? "bg-green-500 text-white border-transparent"
                : "bg-white border-gray-300 text-black"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>




      {/* List */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6">
        {list.length === 0 ? (
          <p className="text-gray-600">No tasks in this category.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((t) => {
               
              const id =  t._id
              console.log(id)

              return (
                <li key={t._id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      {t.parentTask && (
                        <div className="text-sm text-gray-500">
                          Subtask of {t.parentTask}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Due: {new Date(t.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 h-fit rounded-full text-xs ${
                        t.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : isPast(t.dueDate) && t.status !== "Completed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-6">
                      <Link
                        to={`/task-details/${encodeURIComponent(id)}`}
                        className="bg-gray-500 text-white p-2 rounded-md flex-1 text-center"
                      >
                        View
                      </Link>
                      {t.status === "Completed" && (
                        <button 
                        onClick={deleteTaskHandler(id)}
                        disabled={isDeleting}
                        
                        className=" p-2 rounded-md flex-1 bg-red-500 text-white text-center ">
                         {isDeleting ? "Deleting": "Delete"} 
                        </button>

                      )}

{t.status !== "Completed" && (
   <button
                        onClick={markCompleted(id)}
                        disabled={isUpdating}
                        className={`p-2 rounded-md flex-1 ${
                          isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
                        } text-white`}
                      >
                        {isUpdating ? "Updating..." : "Mark Done"}
                      </button>
)}
                     
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showMessageModal && (
        <MessageDelegate

          delegateEmail={delegateEmail}
        
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
};

const isPast = (d) => {
  const due = new Date(d).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return due < today;
};

export default DelegateDetails;