import React, { useEffect, useRef } from "react";

const NoteDetails = ({ note, close }) => {
  const modalRef = useRef(null);

  // Prevent background scroll + ESC close
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [close]);

  // Close when clicking outside modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      close();
    }
  };

  if (!note) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center 
                   bg-black/40 backdrop-blur-sm z-50 p-4"
        onClick={handleOutsideClick}
      >
        <div
          ref={modalRef}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl"
        >
          <p className="text-red-500 font-medium">Note not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                 bg-black/40 backdrop-blur-sm z-50 p-3 sm:p-6"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 
                   w-full max-w-3xl 
                   max-h-[90vh] 
                   overflow-hidden
                   rounded-2xl shadow-2xl 
                   border border-gray-200 dark:border-gray-700
                   flex flex-col"
      >

        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 pb-4 
                        border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold 
                         text-[#008235] dark:text-[#a4f5c2] break-words">
            {note.title}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="px-5 sm:px-8 py-5 
                        overflow-y-auto overflow-x-auto
                        text-gray-700 dark:text-gray-300 
                        leading-relaxed text-sm sm:text-base">

          {note.contentHtml ? (
            <div
              className="prose dark:prose-invert max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: note.contentHtml }}
            />
          ) : (
            <p className="break-words whitespace-pre-wrap">
              {note.contentText || note.content}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-8 py-4 
                        border-t border-gray-200 dark:border-gray-700 
                        flex flex-col sm:flex-row 
                        sm:items-center sm:justify-between gap-3">

          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Created: {new Date(note.createdAt).toLocaleDateString()} <br />
            Updated: {new Date(note.updatedAt).toLocaleDateString()}
          </div>

          <button
            onClick={close}
            className="px-4 py-2 rounded-xl 
                       bg-[#008235] hover:bg-[#0cfb6c]
                       text-white text-sm sm:text-base
                       font-medium transition duration-200 shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default NoteDetails;
