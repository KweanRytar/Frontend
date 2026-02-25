import React, { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

const NoteDetails = ({ note, close }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Lock scroll + ESC close
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [close]);

  // Close when clicking outside modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) close();
  };

  // PDF download — clone the content node, force white/black styles on the
  // clone so dark mode classes don't corrupt the PDF, then discard the clone.
  const handleDownload = () => {
    const source = contentRef.current;
    if (!source) return;

    // Deep clone so we never mutate the visible DOM
    const clone = source.cloneNode(true);

    // Force PDF-safe colors on every element in the clone
    clone.style.backgroundColor = "#ffffff";
    clone.style.color = "#000000";
    clone.querySelectorAll("*").forEach((el) => {
      el.style.color = el.style.color || "#000000";
      el.style.backgroundColor = "transparent";
    });
    // Restore the green title color in the clone
    const titleEl = clone.querySelector("[data-pdf-title]");
    if (titleEl) titleEl.style.color = "#008235";

    // Temporarily attach clone off-screen so html2pdf can read it
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.width = source.offsetWidth + "px";
    document.body.appendChild(clone);

    const opt = {
      margin: 0.5,
      filename: `${note?.title || "note"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .finally(() => document.body.removeChild(clone));
  };

  if (!note) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-3 sm:p-6"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="
          bg-white dark:bg-gray-900
          w-full max-w-3xl max-h-[90vh]
          overflow-hidden rounded-2xl shadow-2xl
          border border-gray-300 dark:border-gray-700
          flex flex-col
        "
      >
        {/* ══════════════════════════════════════
            CONTENT AREA — dark mode aware on screen,
            cloned + forced white for PDF export
        ══════════════════════════════════════ */}
        <div
          ref={contentRef}
          className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-900"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2
              data-pdf-title
              className="text-2xl font-semibold break-words text-[#008235]"
            >
              {note.title}
            </h2>
          </div>

          {/* Scrollable body */}
          <div className="px-8 py-6 overflow-y-auto leading-relaxed text-base text-gray-900 dark:text-gray-100">
            {note.contentHtml ? (
              <div
                className="
                  max-w-none break-words
                  prose dark:prose-invert
                  prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                  prose-p:text-gray-800 dark:prose-p:text-gray-200
                  prose-li:text-gray-800 dark:prose-li:text-gray-200
                  prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                "
                dangerouslySetInnerHTML={{ __html: note.contentHtml }}
              />
            ) : (
              <p className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">
                {note.contentText || note.content}
              </p>
            )}
          </div>

          {/* Footer — visible in modal AND captured in PDF */}
          <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>Generated from <strong className="text-gray-700 dark:text-gray-300">SmartVA</strong> — Productivity Tool</p>
            <p>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            ACTION BUTTONS — NOT included in PDF
            (they are outside contentRef)
        ══════════════════════════════════════ */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium transition duration-200 shadow-md"
          >
            Download PDF
          </button>
          <button
            onClick={close}
            className="px-4 py-2 rounded-xl bg-[#008235] hover:bg-[#006828] text-white font-medium transition duration-200 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;