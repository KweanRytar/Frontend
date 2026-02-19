import React, { useState } from "react";
import Editor from "../components/Editor";
import { useCreateNoteMutation } from "../redux/Note/NoteSlice";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineSave, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";

const CreateNote = () => {
  const [noteData, setNoteData] = useState({
    title: "",
    contentHtml: "",
    contentText: "",
  });

  const navigate = useNavigate();
  const [createNewNote] = useCreateNoteMutation();

  const handleEditorChange = (content) => {
    setNoteData((prev) => ({
      ...prev,
      ...content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !noteData.title.trim() &&
      !noteData.contentHtml.trim() &&
      !noteData.contentText.trim()
    ) {
      toast.info("Cannot save an empty note");
      return;
    }

    try {
      const response = await createNewNote(noteData).unwrap();
      setNoteData({ title: "", contentHtml: "", contentText: "" });
      toast.success(response.message);

      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      toast.error(error?.data?.message || "Error creating note");
    }
  };

  return (
    <form className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white" onSubmit={handleSubmit}>
      {/* FIXED HEADER */}
      <div className="fixed top-14 md:top-24  left-0 right-0 z-10 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* TITLE */}
        <input
          type="text"
          value={noteData.title}
          onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
          placeholder="Note Title"
          className="w-full md:flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 flex-wrap md:flex-nowrap mt-2 md:mt-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition dark:text-white"
          >
            <FaArrowLeft /> Back
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition"
          >
            <Link to="/" className="flex items-center gap-2">
              <AiOutlineClose /> Cancel
            </Link>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition"
          >
            <AiOutlineSave /> Save
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="pt-52 md:pt-48 p-4 md:p-6">
        <Editor onChange={handleEditorChange} />
      </div>
    </form>
  );
};

export default CreateNote;
