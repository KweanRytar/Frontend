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
    // Edit note
    editNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: getFullURL(`/notes/editnote/${id}`),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }],
    }),

    // Delete note
    deleteNote: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/notes/deletenote/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Note', id }],
    }),

    // Get note by ID
    getNoteById: builder.query({
      query: (id) => getFullURL(`/notes/${id}`),
      providesTags: (result, error, id) => [{ type: 'Note', id }],
    }),

    // Get note by title
    getNoteByTitle: builder.query({
      query: (title) => getFullURL(`/notes/findnote/${title}`),
      providesTags: (result, error, title) => [{ type: 'Note', title }],
    }),
  }),
});



export const { useEditNoteMutation, useGetNoteByTitleQuery, useDeleteNoteMutation,  } = noteApi;


export default noteApi
