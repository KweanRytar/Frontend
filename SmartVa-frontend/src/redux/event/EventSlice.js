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


    // ===========================
    // CREATE EVENT
    // ===========================
    createEvent: builder.mutation({
      query: (newEvent) => ({
        url: getFullURL('/events'),
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: (result, error, { id }) => [
  { type: 'Event', id },
  { type: 'Event', id: 'LIST' },
  { type: 'Event', id: 'TODAY' },
],
    }),

    // ===========================
    // GET ALL EVENTS
    // ===========================
    getEvents: builder.query({
      query: () => getFullURL('/events/'),
      providesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    // ===========================
    // GET EVENTS FOR TODAY
    // ===========================
    getEventsForToday: builder.query({
      query: () => getFullURL('/events/events4DDay'),
      providesTags: [{ type: 'Event', id: 'TODAY' }],
    }),

    // ===========================
    // GET EVENT BY NAME (SEARCH)
    // ===========================
    getEventByName: builder.query({
      query: (name) => getFullURL(`/events/eventName/${name}`),
      providesTags:(result, error, {name} )=> [{ type: 'Event', id: `NAME-${name}` }],
    }),

    // ===========================
    // GET SINGLE EVENT BY ID
    // ===========================
    getEventById: builder.query({
      query: (id) => getFullURL(`/events/${id}`),
      providesTags:  [{ type: 'Event', id }],
    }),

    // ===========================
    // UPDATE EVENT
    // ===========================
    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: getFullURL(`/events/${id}`),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags:  (result, error, { id }) => [
  { type: 'Event', id },
  { type: 'Event', id: 'LIST' },
  { type: 'Event', id: 'TODAY' },
],
    }),

    // ===========================
    // CANCEL / DELETE EVENT
    // ===========================
    cancelEvent: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/events/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
  { type: 'Event', id },
  { type: 'Event', id: 'LIST' },
  { type: 'Event', id: 'TODAY' },
],
    }),
  }),
});


export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetEventsForTodayQuery,
  useGetEventByNameQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useCancelEventMutation,
} = eventApi;

export default eventApi;
