// src/pages/VisitorDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useGetVisitorByIdQuery,useDeleteVisitorMutation } from "../redux/visitor/visitorSlice";
import EditVisitor from "../components/EditVisitor";
import DeleteModal from "../components/DeleteModal";
import { mockVisitors } from "../data/visitorData"; // mock visitor data

const VisitorDetails = () => {

  const [deleteVisitor] = useDeleteVisitorMutation();

   const { id } = useParams();
  const location = useLocation()

  // extract visitor from location 
const visitorFromState = location.state?.visitor

const {data: fetchedVisitor, isLoading, isError} = useGetVisitorByIdQuery(id, {skip: !visitorFromState})

 
const visitor = visitorFromState || fetchedVisitor?.visitor

const navigate = useNavigate();

const [editVisitor, setEditVisitor] = useState()

  

  if (!visitor || isError) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold mt-24">
        An Error occured, Visitor not found.
      </div>
    );
  }

  if(isLoading){
    return(
       <div className="p-8 text-center text-yellow-500 font-semibold">
        fetching visitor...
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this visitor record?")) {
      alert("Visitor deleted (mock)!");
      navigate("/visitor");
    }
  };

  // handle delete visitor
  const handleDeleteVisitor = async () => {
    try {
      const res = await deleteVisitor(id).unwrap();
      return res.message;
    } catch (error) {
      return error?.data?.message || "Could not delete visitor";
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16 md:mt-22">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
        
        {/* Back Button */}
        <Link
          to="/visitor"
          className="inline-block mb-4 text-sm text-green-500 hover:underline"
        >
          ← Back to Visitors
        </Link>

        {/* Visitor Name */}
        <h1 className="text-2xl font-bold text-green-500">{visitor.name}</h1>

        {/* Visitor Details */}
        <div className="mt-4 space-y-2">
          <p><strong>Purpose:</strong> {visitor.message}</p>
         
          <p><strong>Phone:</strong> {visitor.phone}</p>
          <p><strong>Email:</strong> {visitor.email}</p>
        
        </div>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mt-6">
          <p>Visited On: {new Date(visitor.createdAt).toDateString()}</p>
          
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setEditVisitor(true)}
            className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
          >
            Edit
          </button>
          <DeleteModal dialogMessage={`Are you sure you want to delete the visitor named ${visitor.name} who visited on ${visitor.createdAt}`} handlingDelete={()=>{
            handleDeleteVisitor(visitor._id)
            navigate(-1)
          }} />
          {/* <button
            onClick={handleDelete}
            className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500 mt-2 mr-2"
          >
            Delete
          </button> */}
        </div>
      </div>
     {editVisitor && (
      <EditVisitor visitor={visitor} close={()=>setEditVisitor(false)}/>
     )}
    </div>
  );
};

export default VisitorDetails;
