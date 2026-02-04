import React from "react";
import { useRef } from "react";
import { toast } from "react-toastify";

const DeleteModal = ({ handlingDelete, dialogMessage}) => {
  const deleteDialog = useRef(null);

  // open the delete dialogue
  const openDeleteDialogu = () => {
    deleteDialog.current.showModal();
  };

  // close the delete Dialogu
  const closeDeleteDialogu = () => {
     
    deleteDialog.current.close();
  };

  // hangle delete dialogu
  const handleDelete = async () => {
  const message =  await handlingDelete();
    toast.success(message);
    closeDeleteDialogu();
  };
  return (
    <>
      <button
        onClick={openDeleteDialogu}
        className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500 mt-2 mr-2"
      >
        delete
      </button>


      <dialog
        ref={deleteDialog}
        className="p-6 rounded-2xl bg-green-500 dark:bg-gray-800 shadow-lg w-80  top-6/12 left-1/2 transform -translate-x-1/2 translate-y-1/2"
      >
        <p className=" font-bold text-red-600 mb-4 mt-6 p-6 text-center">{dialogMessage}</p>
        <div className=" flex justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          >
            yes
          </button>

          <button
            onClick={closeDeleteDialogu}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
};

export default DeleteModal;
