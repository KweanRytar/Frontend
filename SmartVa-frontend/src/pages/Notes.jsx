import React, { useState, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import { useGetTotalNotesQuery } from '../redux/dashboard/OverviewSlice';
import { useGetNoteByTitleQuery } from '../redux/Note/NoteSlice';
import { useNavigate } from 'react-router-dom';
import NoteDetails from '../components/NoteDetails';
import { useDeleteNoteMutation } from '../redux/Note/NoteSlice';
import DeleteModal from '../components/DeleteModal';

const Note = () => {
  const [searchInput, setSearchInput] = useState('');

  const [title, setTitle] = useState('');
  const [viewnoteDetails, setViewNoteDetails] = useState(false);
  const [currentNote, setCurrentNote] = useState();


  // innitiate useNavigate
  const navigate = useNavigate();




  const { data: totalNotesData, isLoading: isTotalNotesLoading } = useGetTotalNotesQuery();

  const [deleteNote, {isLoading: deletingNote}] = useDeleteNoteMutation()

  const { data: searchedNotesData } = useGetNoteByTitleQuery(title, {
    skip: !title, // only query when a title is set
  });

  // When user presses Enter, trigger the actual search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTitle(searchInput.trim());
    }
  };

  const filteredNotes = useMemo(() => {
  const searchedNotes = searchedNotesData ?? [];
  const allNotes = totalNotesData?.notes ?? [];
  const notes = allNotes.length ? allNotes : [];

  return title ? searchedNotes : notes;
}, [title, totalNotesData, searchedNotesData]);

// delete note function
const handleDelete = async (id) => {
  try {
    const response = await deleteNote(id).unwrap();
    return response.message || "Deleted successfully";
  } catch (error) {
    return error?.data?.message || "Failed to delete";
  }
};


  return (
    <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-800 dark:text-white mt-16 md:mt-22">
      <div className="flex justify-between">
        <h1 className="mb-8 text-2xl inline">Notes</h1>
        <Link
          to="/create-note"
          className="bg-green-500 rounded-md cursor-pointer px-2 h-8 text-white"
        >
          <FaPlus className="inline text-white dark:text-black" />
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md">
        <input
          type="text"
          placeholder="Search notes... (Press Enter)"
          className="w-full p-2 focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-gray-600 mt-6">No notes found.</p>
      ) : (
        <ul className="mt-6 space-y-4 grid gap-4 flex-wrap md:flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <li
              key={note._id}
              className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md"
            >
              <h2 className="text-xl font-bold text-green-500">{note.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {note.content && note.content.length > 100
                  ? note.content.slice(0, 50) + '...'
                  : note.content}
              </p>
              <div className="text-sm text-gray-500 mt-4">
                Created: {new Date(note.createdAt).toLocaleDateString()} | Updated:{' '}
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
              <div>
                <button
                 
                  className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
                  onClick={()=>{
                    setCurrentNote(note);
                    setViewNoteDetails(true)}}
                >
                  View
                </button>
                <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
                onClick={() => {
                 
                 
  setTimeout(() => navigate(`/edit-note/${note._id}`, {state: {note}}), 2000);
}}
                >
                  Edit
                </button>
                <DeleteModal handlingDelete={()=> handleDelete(note._id)}  dialogMessage={`Are you sure you want to delete ${note.title}?`}/>
                {/* <button className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500 mt-2 mr-2"
                onClick={()=>handleDelete(note._id)}
                >
                  Delete
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
      {viewnoteDetails && currentNote && <NoteDetails note={currentNote} close={()=>setViewNoteDetails(false)} />}
    </div>
  );
};

export default Note;
