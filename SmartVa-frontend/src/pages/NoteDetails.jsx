import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { noteData } from "../data/noteData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const note = noteData.find((n) => n.id === parseInt(id));

  if (!note) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Note not found.
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      alert("Note deleted (mock)!");
      navigate("/note");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16 md:mt-22">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
        
        {/* Back Button */}
        <Link
          to="/note"
          className="inline-block mb-4 text-sm text-green-500 hover:underline"
        >
          ← Back to Notes
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-bold text-green-500">{note.title}</h1>

        {/* Render Markdown Content */}
        <div className="prose dark:prose-invert max-w-none mt-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mt-6">
          <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => alert("Edit note (mock)")}
            className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500 mt-2 mr-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
