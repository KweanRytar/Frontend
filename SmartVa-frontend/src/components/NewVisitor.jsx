// NewVisitor.jsx
import { useState } from "react";
import React from "react";
import { useCreateVisitorMutation } from "../redux/visitor/visitorSlice";
import { toast } from "react-toastify";

const NewVisitor = ({ close }) => {

  const [visitorData, setVisitorData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",


  })

  const handleChange = (e)=>{
const {name, value} = e.target;
setVisitorData({
  ...visitorData,
  [name]: value,
})
  }

const [createVisitor, {isLoading} ] = useCreateVisitorMutation()

const handleSubmit = async (e)=>{
  e.preventDefault();
  const payload ={
    ...visitorData
  }
  try {
    const response = await createVisitor(payload).unwrap();
    toast.success(response.message)


    setVisitorData({
      name: "",
      phone: "",
      email: "",
      message: ""
    })
    close()
  } catch (error) {
    toast.error(error?.message)
  }
}

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-100 dark:bg-gray-800 dark:text-white 
                  rounded-2xl shadow-lg w-full max-w-3xl 
                  p-6 mx-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold mb-6">Create New Visitor</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={visitorData.name}
                onChange={handleChange}
                placeholder="Visitor Name"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={visitorData.email}
                name="email"
                onChange={handleChange}
                placeholder="Visitor Email"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
          </div>

          {/* Phone + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Phone</label>
              <input
                type="text"
                value={visitorData.phone}
                name="phone"
                onChange={handleChange}
                placeholder="Visitor Phone"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
            
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Message</label>
            <textarea
            
              placeholder="Visitor Message (optional)"
              name="message"
              value={visitorData.message}
              onChange={handleChange}
              className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-24 p-4"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md flex-1"
              disabled={isLoading}
            >
           {   isLoading ? "Saving..." : "Save "}
            </button>
            <button
              type="reset"
              className="bg-gray-500 text-white p-2 rounded-md flex-1"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVisitor;
