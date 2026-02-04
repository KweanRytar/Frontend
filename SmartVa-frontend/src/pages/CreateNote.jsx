// src/pages/Note.jsx (or CreateNote.jsx depending on your structure)
import React, { useState } from "react";
import Editor from "../components/Editor";
import { useCreateNewNoteMutation } from "../redux/dashboard/OverviewSlice";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";


const CreateNote = () => {
  const [noteData, setNoteData] = useState({
    title: "",
    contentHtml: "",
    contentText: "",
  });

  const navigate = useNavigate();
  const [createNewNote] = useCreateNewNoteMutation( );

  const handleEditorChange = (content) => {
    setNoteData((prev) => ({
      ...prev,
      ...content, // updates both contentHtml & contentText
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Skip if title & both contents are EMPTY
  if (
    !noteData.title.trim() &&
    !noteData.contentHtml.trim() &&
    !noteData.contentText.trim()
  ) {
    toast.info("Cannot save an empty note");
    return; // Stop here
  }

  try {
    const response = await createNewNote(noteData).unwrap();
    setNoteData({ title: "", contentHtml: "", contentText: "" });
    toast.success(response.message);

    // navigate back to previous page after few seconds
    setTimeout(() => {
      navigate(-1);
    }, 1000);

  } catch (error) {
    toast.error(error?.data?.message || "Error creating note");
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex flex-col justify-center gap-10 md:flex-row items-center mb-4 mt-36 fixed top-0 left-0 right-0 bg-[#FFFFFF] dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 z-10 p-4 border-b">
         <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-blue-500 hover:underline mb-4 cursor-pointer"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
         <input
        type="text"
        value={noteData.title}
        onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
        placeholder="Note Title"
        className="p-2 w-3xl border rounded"
      />
      <button  className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        <Link to="/">
        Cancel
      </Link>
      </button>
      
      <button
        type="submit"
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Save 
      </button>
      </div>
     
<div className="mb-10 mt-64">
    <Editor onChange={handleEditorChange} />
</div>
    

      
    </form>
  );
};

export default CreateNote;
