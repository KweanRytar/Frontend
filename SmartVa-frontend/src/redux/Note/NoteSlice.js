import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const noteApi = createApi({
  reducerPath: 'noteApi',
  baseQuery: fetchBaseQuery({
    // No baseUrl — full URLs are built with getFullURL
    credentials: 'include',
  }),
  tagTypes: ['Note'],

  endpoints: (builder) => ({

  // ===========================
    // CREATE NOTE
    // ===========================
    createNote: builder.mutation({
      query: (newNote) => ({
        url: getFullURL('/notes/createnote'),
        method: 'POST',
        body: newNote,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    // ===========================
    // GET ALL NOTES
    // ===========================
    getNotes: builder.query({
      query: () => getFullURL('/notes/getallnotes'),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Note', id: _id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
      keepUnusedDataFor: 600,
    }),

    // ===========================
    // GET NOTE BY ID
    // ===========================
    getNoteById: builder.query({
      query: (id) => getFullURL(`/notes/${id}`),
      providesTags: (result, error, id) => [{ type: 'Note', id }],
    }),

    // ===========================
    // GET NOTE BY TITLE
    // ===========================
    getNoteByTitle: builder.query({
      query: (title) => getFullURL(`/notes/findnote/${title}`),
      providesTags: (result) =>
        result ? [{ type: 'Note', id: result._id }] : [],
    }),

    // ===========================
    // EDIT NOTE
    // ===========================
    editNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: getFullURL(`/notes/editnote/${id}`),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),

    // ===========================
    // DELETE NOTE
    // ===========================
    deleteNote: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/notes/deletenote/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),
  }),
});

export const { useEditNoteMutation, useGetNoteByTitleQuery, useDeleteNoteMutation, useCreateNoteMutation, useGetNotesQuery  } = noteApi;


export default noteApi
