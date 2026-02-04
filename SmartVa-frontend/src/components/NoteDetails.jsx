import React from 'react';

const NoteDetails = ({ note, close }) => {
  if (!note) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500">Note not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-auto p-4 ">
      <div className="bg-red-300 dark:bg-gray-800 p-12 rounded-lg shadow-lg max-w-full  mt-auto w-fit">
        <h2 className="text-2xl font-bold text-green-500 mb-4 ">{note.title}</h2>
        <div className="text-gray-700 dark:text-gray-300 mb-4 break-words overflow-x-auto">
          {note.contentHtml ? (
            <div dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
          ) : (
            <p className='break-words'>{note.contentText || note.content}</p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Created: {new Date(note.createdAt).toLocaleDateString()} | Updated: {new Date(note.updatedAt).toLocaleDateString()}
        </div>
         <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2 bg-green-500"
         onClick={()=>close()}
         >Close</button>
      </div>
     
    </div>
  );
};

export default NoteDetails;