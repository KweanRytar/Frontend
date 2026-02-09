import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    // No baseUrl here — we use getFullURL for full control
    credentials: 'include',
  }),
  tagTypes: ['Contact'],

  endpoints: (builder) => ({
    // UPDATE CONTACT
    UpdateContact: builder.mutation({
      query: ({ id, updatedBody }) => ({
        url: getFullURL(`/contact/${id}`),
        method: 'PUT',
        body: updatedBody,
      }),
      invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // GET CONTACT BY NAME
    GetContactByName: builder.query({
      query: (name) => getFullURL(`/contact/name/${name}`),
      providesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // GET CONTACT BY COMPANY NAME
    getContactByCompanyName: builder.query({
      query: (companyName) => getFullURL(`/contact/company/${companyName}`),
      providesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // DELETE CONTACT
    deleteContact: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/contact/${id}`),
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
