import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};
export const visitorApi = createApi({
  reducerPath: 'visitorApi',
  baseQuery: fetchBaseQuery({
    // No baseUrl here — full URLs are built with getFullURL
    credentials: 'include',
  }),
  tagTypes: ['Visitor'],

  endpoints: (builder) => ({
    
    // ===========================
    // CREATE VISITOR
    // ===========================
    createVisitor: builder.mutation({
      query: (newVisitor) => ({
        url: getFullURL('/visitors'),
        method: 'POST',
        body: newVisitor,
      }),
      invalidatesTags: [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ===========================
    // GET ALL VISITORS
    // ===========================
    getAllVisitors: builder.query({
      query: () => getFullURL('/visitors/getVisitors'),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Visitor', id: _id })),
              { type: 'Visitor', id: 'LIST' },
            ]
          : [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ===========================
    // GET VISITOR BY ID
    // ===========================
    getVisitorById: builder.query({
      query: (id) => getFullURL(`/visitors/${id}`),
      providesTags: (result, error, id) => [{ type: 'Visitor', id }],
    }),

    // ===========================
    // UPDATE VISITOR
    // ===========================
    updateVisitor: builder.mutation({
      query: ({ id, updatedBody }) => ({
        url: getFullURL(`/visitors/${id}`),
        method: 'PUT',
        body: updatedBody,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Visitor', id },
        { type: 'Visitor', id: 'LIST' },
      ],
    }),

    // ===========================
    // DELETE VISITOR
    // ===========================
    deleteVisitor: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/visitors/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Visitor', id },
        { type: 'Visitor', id: 'LIST' },
      ],
    }),

    // ===========================
    // FILTER VISITORS
    // ===========================
    getVisitorsByDay: builder.query({
      query: (day) => getFullURL(`/visitors/day/${day}`),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Visitor', id: _id })),
              { type: 'Visitor', id: 'LIST' },
            ]
          : [{ type: 'Visitor', id: 'LIST' }],
    }),

    getVisitorsByWeek: builder.query({
      query: () => getFullURL('/visitors/week'),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Visitor', id: _id })),
              { type: 'Visitor', id: 'LIST' },
            ]
          : [{ type: 'Visitor', id: 'LIST' }],
    }),

    getVisitorsByMonth: builder.query({
      query: (month) => getFullURL(`/visitors/month/${month}`),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Visitor', id: _id })),
              { type: 'Visitor', id: 'LIST' },
            ]
          : [{ type: 'Visitor', id: 'LIST' }],
    }),

    getVisitorsByName: builder.query({
      query: (name) => getFullURL(`/visitors/name/${name}`),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Visitor', id: _id })),
              { type: 'Visitor', id: 'LIST' },
            ]
          : [{ type: 'Visitor', id: 'LIST' }],
    }),
  }),
});

export const {
   useGetAllVisitorsQuery,
  useGetVisitorByIdQuery,
  useCreateVisitorMutation,
  useUpdateVisitorMutation,
  useDeleteVisitorMutation,
  useGetVisitorsByDayQuery,
  useGetVisitorsByWeekQuery,
  useGetVisitorsByMonthQuery,
  useGetVisitorsByNameQuery,

} = visitorApi;

export default visitorApi;
