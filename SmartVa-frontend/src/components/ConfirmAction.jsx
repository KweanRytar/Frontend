// src/components/ConfirmAction.js
import { toast } from 'react-toastify';

const ConfirmAction = (message = "Are you sure you want to proceed?") => {
  // Returns a function you can call with an onConfirm callback
  const show = (onConfirm) => {
    toast.info(
      <div>
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => {
              onConfirm();
              toast.dismiss(); // close the toast
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-black px-3 py-1 rounded"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // stay open until user clicks
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return { show };
};

export default ConfirmAction;
