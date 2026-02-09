// src/redux/event/EventSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    // No baseUrl here — we use getFullURL to build full paths
    credentials: 'include',
  }),
  tagTypes: ['Event'],

  endpoints: (builder) => ({
    // Get all events
    getEvents: builder.query({
      query: () => getFullURL('/events/allEvents/'),
      providesTags: ['Event'],
    }),

    // Get events for today
    getEventsForDay: builder.query({
      query: () => getFullURL('/events/events4DDay/'),
      providesTags: ['Event'],
    }),

    // Get event by name (for search)
    getEventByName: builder.query({
      query: (name) => getFullURL(`/events/eventName/${name}`),
      providesTags: ['Event'],
    }),

    // Get single event by ID
    getEventById: builder.query({
      query: (id) => getFullURL(`/events/${id}`),
      providesTags: ['Event'],
    }),

    // Update event
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: getFullURL(`/events/${id}`),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),

    // Cancel event
    cancelEvent: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/events/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
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
