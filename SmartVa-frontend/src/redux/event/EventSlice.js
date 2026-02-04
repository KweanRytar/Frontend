// src/redux/event/EventSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/events/`, 

    credentials: "include"
  }


  ),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    // Get all events
    getEvents: builder.query({
      query: () => `allEvents/`,
      providesTags: ["Event"],
    }),

    // Get events for today
    getEventsForDay: builder.query({
      query: () => `events4DDay/`,
      providesTags: ["Event"],
    }),

    // Get event by name (for search)
    getEventByName: builder.query({
      query: (name) => `eventName/${name}`,
      providesTags: ["Event"],
    }),

    // Get single event by ID
    getEventById: builder.query({
      query: (id) => `${id}`,
      providesTags: ["Event"],
    }),

    // Update event
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    // Cancel event
    cancelEvent: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventsForDayQuery,
  useGetEventByNameQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useCancelEventMutation,
} = eventApi;

export default eventApi;
