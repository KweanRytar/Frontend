import React, { useRef } from "react";
import { toast } from "react-toastify";

const DeleteModal = ({ handlingDelete, dialogMessage }) => {
  const deleteDialog = useRef(null);

  const openDeleteDialog = () => {
    deleteDialog.current.showModal();
  };

  const closeDeleteDialog = () => {
    deleteDialog.current.close();
  };

  const handleDelete = async () => {
    const message = await handlingDelete();
    toast.success(message);
    closeDeleteDialog();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openDeleteDialog}
        className="px-4 py-2 rounded-lg border border-red-500 
                   text-red-500 hover:bg-red-500 hover:text-white 
                   transition duration-200 text-sm font-medium"
      >
        Delete
      </button>

      {/* Modal */}
      <dialog
        ref={deleteDialog}
        className="rounded-2xl p-0 w-[90%] max-w-md 
                   backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="bg-white dark:bg-gray-900 
                        rounded-2xl shadow-2xl 
                        border border-gray-200 dark:border-gray-700 
                        overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="mx-auto mb-4 w-12 h-12 
                            flex items-center justify-center 
                            rounded-full bg-red-100 dark:bg-red-900/30">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Confirm Deletion
            </h2>
          </div>

          {/* Message */}
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dialogMessage}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 
                          px-6 pb-6">
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-xl 
                         bg-red-600 hover:bg-red-700 
                         text-white font-medium 
                         transition duration-200 shadow-md"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeDeleteDialog}
              className="px-5 py-2 rounded-xl 
                         bg-gray-200 hover:bg-gray-300 
                         dark:bg-gray-700 dark:hover:bg-gray-600
                         text-gray-800 dark:text-white 
                         font-medium transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteModal;
