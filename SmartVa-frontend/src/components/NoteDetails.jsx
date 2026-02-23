import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

const NoteDetails = ({ note, close }) => {
  const modalRef = useRef(null);

  // Lock scroll + ESC close
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") close();
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

  // ✅ SAFE PDF DOWNLOAD (NO OKLCH CRASH)
  const handleDownload = () => {
    const element = document.getElementById("document2Download");

    const opt = {
      margin: 0.5,
      filename: `${note?.title || "note"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff", // VERY IMPORTANT
      },
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
        className="bg-white w-full max-w-3xl max-h-[90vh] 
                   overflow-hidden rounded-2xl shadow-2xl 
                   border border-gray-300 flex flex-col"
      >
        {/* ========================= */}
        {/* PDF SAFE CONTENT AREA */}
        {/* ========================= */}
        <div
          id="document2Download"
          className="flex flex-col flex-1 overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          {/* Header */}
          <div
            className="px-8 pt-8 pb-4 border-b"
            style={{ borderColor: "#cccccc" }}
          >
            <h2
              className="text-2xl font-semibold break-words"
              style={{ color: "#008235" }}
            >
              {note.title}
            </h2>
          </div>

          {/* Scrollable Body */}
          <div
            className="px-8 py-6 overflow-y-auto leading-relaxed text-base"
            style={{ color: "#000000" }}
          >
            {note.contentHtml ? (
              <div
                className="max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: note.contentHtml }}
              />
            ) : (
              <p className="whitespace-pre-wrap break-words">
                {note.contentText || note.content}
              </p>
            )}
          </div>

          {/* Footer (Will appear in PDF) */}
          <div
            className="px-8 py-4 border-t text-sm"
            style={{
              borderColor: "#cccccc",
              color: "#555555",
            }}
          >
            <p>
              Generated from <strong>SmartVA</strong> — Productivity Tool
            </p>
            <p>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <p>
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* ACTION BUTTONS (NOT IN PDF) */}
        {/* ========================= */}
        <div
          className="px-8 py-4 border-t flex justify-end gap-3"
          style={{ borderColor: "#e5e5e5", backgroundColor: "#f9f9f9" }}
        >
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl 
           bg-gray-900 hover:bg-black
           text-white font-medium 
           transition duration-200 shadow-md"
          >
            Download PDF
          </button>

          <button
            onClick={close}
            className="px-4 py-2 rounded-xl 
                       bg-[#008235] hover:bg-[#0cfb6c]
                       text-white font-medium 
                       transition duration-200 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;