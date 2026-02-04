import React, { useState } from 'react';
import { useUpdateContactMutation } from '../redux/Contact/ContactSlice';
import { toast } from 'react-toastify';

const EditContact = ({ contact, close }) => {
    console.log('Editing contact:', contact);
  const [formData, setFormData] = useState({
    _id: contact?._id || '',
    name: contact?.name || '',
    companyName: contact?.companyName || '',
    email: contact?.email || '',
    phoneNumber: contact?.phoneNumber || '',
    position: contact?.position || '',
    createdAt: contact?.createdAt || '',
    updatedAt: contact?.updatedAt || ''
  });

  console.log('Form data state:', formData);

  const [updateContact, { isLoading }] = useUpdateContactMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Adjust payload structure to match your backend API
      const response = await updateContact({
        id: formData._id,
        updatedBody: formData,
      }).unwrap();

      toast.success(response?.message || 'Contact updated successfully');
      close?.(); // Close modal if provided
    } catch (error) {
      toast.error(error?.data?.message || error.message || 'Update failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-4xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Update a Connection</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name">Contact Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contact Name"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Position"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="bg-gray-400 dark:bg-gray-500 rounded-2xl h-10 p-4"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Contact'}
            </button>
            <button
              type="button"
              onClick={()=>close()}
              className="bg-gray-500 text-white p-2 rounded-md flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContact;
