import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://smartva-backend-file.onrender.com/contact',
    credentials: 'include',
  }),
  tagTypes: ['Contact'],

  endpoints: (builder) => ({

    // UPDATE CONTACT
    UpdateContact: builder.mutation({
      query: ({ id, updatedBody }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedBody,
      }),
      invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // GET CONTACT BY NAME
    GetContactByName: builder.query({
      query: (name) => `name/${name}`,
      providesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // GET CONTACT BY COMPANY NAME (Add tags!)
    getContactByCompanyName: builder.query({
      query: (companyName) => `company/${companyName}`,
      providesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // DELETE CONTACT
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

  }),
});

// Hooks export
export const {
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetContactByCompanyNameQuery,
  useGetContactByNameQuery,
} = contactApi;

export default contactApi;
