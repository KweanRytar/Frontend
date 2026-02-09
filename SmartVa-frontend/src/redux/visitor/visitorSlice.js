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
    // ✅ Get all visitors
    getAllVisitors: builder.query({
      query: () => getFullURL('/visitors/getVisitors'),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item) => ({
                type: 'Visitor',
                id: item._id,
              })),
              { type: 'Visitor', id: 'LIST' },
            ]
          : [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ✅ Get visitor by ID
    getVisitorById: builder.query({
      query: (id) => getFullURL(`/visitors/${id}`),
      providesTags: (result, error, id) => [{ type: 'Visitor', id }],
    }),

    // ✅ Create visitor
    createVisitor: builder.mutation({
      query: (newVisitor) => ({
        url: getFullURL('/visitors/'),
        method: 'POST',
        body: newVisitor,
      }),
      invalidatesTags: [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ✅ Update visitor
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

    // ✅ Get visitor by month
    getVisitorByMonth: builder.query({
      query: (month) => getFullURL(`/visitors/month/${month}`),
      providesTags: [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ✅ Get visitor by day
    getVisitorByDay: builder.query({
      query: (day) => getFullURL(`/visitors/day/${day}`),
      providesTags: [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ✅ Get visitors by week
    getVisitorByWeek: builder.query({
      query: () => getFullURL('/visitors/week'),
      providesTags: [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ✅ Get visitor by name
    getVisitorsByName: builder.query({
      query: (name) => getFullURL(`/visitors/name/${name}`),
      providesTags: [{ type: 'Visitor', id: 'LIST' }],
    }),

    // ✅ Delete visitor
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
  }),
});

export const {
  useGetAllVisitorsQuery,
  useGetVisitorByIdQuery,
  useCreateVisitorMutation,
  useUpdateVisitorMutation,
  useGetVisitorByMonthQuery,
  useGetVisitorByDayQuery,
  useGetVisitorByWeekQuery,
  useGetVisitorsByNameQuery,
  useDeleteVisitorMutation,

} = visitorApi;

export default visitorApi;
