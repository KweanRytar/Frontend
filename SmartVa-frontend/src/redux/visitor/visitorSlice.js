import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const visitorApi = createApi({
  reducerPath: "visitorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/visitors",
    credentials: "include",
  }),
  tagTypes: ["VISITOR"],
  endpoints: (builder) => ({

    // ✅ Get all visitors
    getAllVisitors: builder.query({
      query: () => "/getVisitors",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item) => ({
                type: "VISITOR",
                id: item._id, // MongoDB _id
              })),
              { type: "VISITOR", id: "LIST" },
            ]
          : [{ type: "VISITOR", id: "LIST" }],
    }),

    // ✅ Get visitor by ID
    getVisitorById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "VISITOR", id }],
    }),

    // ✅ Create visitor
    createVisitor: builder.mutation({
      query: (newVisitor) => ({
        url: "/",
        method: "POST",
        body: newVisitor,
      }),
      invalidatesTags: [{ type: "VISITOR", id: "LIST" }],
    }),

    // ✅ Update visitor
    updateVisitor: builder.mutation({
      query: ({ id, updatedBody }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedBody,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "VISITOR", id },
        { type: "VISITOR", id: "LIST" },
      ],
    }),

    // ✅ Get visitor by month
    getVisitorByMonth: builder.query({
      query: (month) => `/month/${month}`,
      providesTags: [{ type: "VISITOR", id: "LIST" }],
    }),

    // ✅ Get visitor by day (fixed route)
    getVisitorByDay: builder.query({
      query: (day) => `/day/${day}`,
      providesTags: [{ type: "VISITOR", id: "LIST" }],
    }),

    // ✅ Get visitors by week
    getVisitorByWeek: builder.query({
      query: () => `/week`,
      providesTags: [{ type: "VISITOR", id: "LIST" }],
    }),

    // ✅ Get visitor by name
    getVisitorsByName: builder.query({
      query: (name) => `/name/${name}`,
      providesTags: [{ type: "VISITOR", id: "LIST" }],
    }),

    // ✅ Delete visitor
    deleteVisitor: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "VISITOR", id },
        { type: "VISITOR", id: "LIST" },
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
