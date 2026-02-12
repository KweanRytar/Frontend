import React, { useState } from 'react'
import { useUpdateVisitorMutation } from '../redux/visitor/visitorSlice';
import { toast } from 'react-toastify';

const EditVisitor = ({visitor, close}) => {
    console.log("Editing visitor:", visitor);
const [formData, setFormData] = useState({
    _id: visitor?._id || '',
    name: visitor?.name || '',
    email: visitor?.email || '',
    phone: visitor?.phone || '',
    message: visitor?.message || '',
    createdAt: visitor?.createdAt || '',
    updatedAt: visitor?.updatedAt || ''
})


// HANDLE CHANGE
const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev)=> ({...prev, [name]: value}))
}

// UPDATE VISITOR MUTATION
const [updateVisitor, {isLoading}] = useUpdateVisitorMutation();


// HANDLE SUBMIT
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await updateVisitor({
            id: formData._id,
            updatedBody: formData,
        }).unwrap()
        toast.success(response?.message || 'Visitor updated successfully');
        close?.(); // Close modal if provided
    } catch (error) {
        toast.error(error?.data?.message || error.message || 'Update failed');
        
    }
}
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        
        <div   className="bg-gray-100 dark:bg-gray-800 dark:text-white 
                  rounded-2xl shadow-lg w-full max-w-3xl 
                  p-6 mx-4 overflow-y-auto max-h-[90vh]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Visitor Name"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
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
                value={formData.phone}
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
              value={formData.message}
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
              {isLoading? 'Updating...': 'update Visitor'}
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
  )
}

export default EditVisitor