import React, { useState } from "react";
import Editor from "../components/Editor";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEditNoteMutation } from "../redux/Note/NoteSlice";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const EditNote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const note = location.state?.note;

  const [noteData, setNoteData] = useState({
    _id: note?._id,
    title: note?.title || "",
    contentHtml: note?.contentHtml || "",
    contentText: note?.contentText || "",
  });

  const [editNote, { isLoading }] = useEditNoteMutation();

  const handleEditorChange = (content) => {
    setNoteData((prev) => ({
      ...prev,
      ...content, // expects { contentHtml, contentText }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await editNote({
        id: noteData._id,
        title: noteData.title,
        contentHtml: noteData.contentHtml,
        contentText: noteData.contentText,
      }).unwrap();

     
      toast.success("Updated!");
      // navigate back to previous page after few seconds
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      toast.error(err?.data?.message || "Error updating note");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center gap-4 items-center mb-4 mt-4 lg:mt-36 fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 z-10 p-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:underline mb-4 cursor-pointer"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <input
          type="text"
          value={noteData.title}
          onChange={(e) =>
            setNoteData({ ...noteData, title: e.target.value })
          }
          placeholder="Note Title"
          className="p-2 w-full md:w-3/4 border rounded"
        />

        <div className="flex gap-2">
          <Link
            to="/note"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="mt-80  lg:mt-60 mb-10">
        <Editor
          initialHtml={noteData.contentHtml} // ✅ use state, not originalHtml
          onChange={handleEditorChange}
          disableAutoFocus={true}
        />
      </div>
    </form>

  );
};

export default EditNote;
