import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const noteApi = createApi({
    reducerPath: "noteApi",
    baseQuery: fetchBaseQuery({
    baseUrl: "https://smartva-backend-file.onrender.com/notes",
    credentials: 'include',
}),

tagTypes: ['Note'],

endpoints: (builder) => ({

    editNote: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/editnote/${id}`,
            method: 'PUT',
            body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }],




        }),

        deleteNote: builder.mutation({
            query: (id) =>({
            url: `/deletenote/${id}`,
            method: 'DELETE',
}),
            invalidatesTags: (result, error, id) => [{ type: 'NOTE', id }]
        }),


        getNoteById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Note', id }],

        }),

        getNoteByTitle: builder.query({
            query: (title) => `/findnote/${title}/`,
            providesTags: (result, error, title) => [{ type: 'Note', title }],
            
        })


    })


})


export const { useEditNoteMutation, useGetNoteByTitleQuery, useDeleteNoteMutation,  } = noteApi;


export default noteApi
