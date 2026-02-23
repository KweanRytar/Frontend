import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

const NoteDetails = ({ note, close }) => {
  const modalRef = useRef(null);

  // Lock background scroll + ESC close
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

  // 🔥 Download as PDF
  const handleDownload = () => {
    const element = document.getElementById("document2Download");

    const opt = {
      margin: 0.5,
      filename: `${note.title || "note"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!note) return null;

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
        {/* ===================== */}
        {/* CONTENT TO DOWNLOAD */}
        {/* ===================== */}
        <div
          id="document2Download"
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 sm:px-10 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-[#008235] break-words">
              {note.title}
            </h2>
          </div>

          {/* Scrollable Body */}
          <div
            className="px-6 sm:px-10 py-6 
                       overflow-y-auto 
                       text-gray-700 dark:text-gray-300 
                       leading-relaxed text-base"
          >
            {note.contentHtml ? (
              <div
                className="prose dark:prose-invert max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: note.contentHtml }}
              />
            ) : (
              <p className="whitespace-pre-wrap break-words">
                {note.contentText || note.content}
              </p>
            )}
          </div>

          {/* SmartVA Footer */}
          <div className="px-6 sm:px-10 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
            <p>
              Generated from <strong>SmartVA</strong> — Productivity Tool for
              Administrative Assistants
            </p>
            <p>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <p>
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ===================== */}
        {/* ACTION BUTTONS (NOT IN PDF) */}
        {/* ===================== */}
        <div
          className="px-6 sm:px-10 py-4 
                     border-t border-gray-200 dark:border-gray-700 
                     flex flex-col sm:flex-row 
                     sm:items-center sm:justify-end gap-3
                     bg-gray-50 dark:bg-gray-800"
        >
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl 
                       bg-[#a4f5c2] hover:bg-[#7fe8a9]
                       text-white
                       font-medium transition duration-200 shadow-md"
          >
            Download PDF
          </button>

          <button
            onClick={close}
            className="px-4 py-2 rounded-xl 
                       bg-[#008235] hover:bg-[#0cfb6c]
                       text-white
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