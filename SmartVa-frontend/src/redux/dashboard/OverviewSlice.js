import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {getFullURL} from '../../../API_Calls/baseURL.js';

export const overviewApi = createApi({
  reducerPath: 'overviewApi',
  baseQuery: fetchBaseQuery({
    // No trailing slash here — getFullURL will handle it
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Task', 'Event', 'Document', 'Notification', 'Contact'], // added 'Contact'

  endpoints: (builder) => ({
    // Notifications
    getAllNotifications: builder.query({
      query: () => getFullURL('/events/notify/'),
      providesTags: (result) =>
        result?.notifications
          ? [
              ...result.notifications.map((n) => ({
                type: 'Notification',
                id: n._id,
              })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/profile/notification/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // Visitors
    createVisitors: builder.mutation({
      query: (newVisitor) => ({
        url: getFullURL('/Visitors'),
        method: 'POST',
        body: newVisitor,
      }),
    }),

    // Tasks
    createNewTask: builder.mutation({
      query: (newTask) => ({
        url: getFullURL('/task'),
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    getTotalTasks: builder.query({
      query: () => getFullURL('/task/getAllTasks/'),
      providesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    getOverdueTasks: builder.query({
      query: () => getFullURL('/task/overdue'),
      providesTags: [{ type: 'Task', id: 'OVERDUE' }],
    }),

    getTaskDueIn3Days: builder.query({
      query: () => getFullURL('/task/due-in-next-72-hours'),
      providesTags: [{ type: 'Task', id: 'DUE_SOON' }],
    }),

    getPendingTasks: builder.query({
      query: () => getFullURL('/task/pending'),
      providesTags: [{ type: 'Task', id: 'PENDING' }],
    }),

    getEmergencyTasks: builder.query({
      query: () => getFullURL('/task/emergency/emergencyTasks'),
      providesTags: [{ type: 'Task', id: 'EMERGENCY' }],
    }),

    // Notes
    createNewNote: builder.mutation({
      query: (newNote) => ({
        url: getFullURL('/notes/createnote'),
        method: 'POST',
        body: newNote,
      }),
    }),

    getTotalNotes: builder.query({
      query: () => getFullURL('/notes/getallnotes'),
    }),

    // Events
    createNewEvent: builder.mutation({
      query: (newEvent) => ({
        url: getFullURL('/events'),
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    getEventForToday: builder.query({
      query: () => getFullURL('/events/events4DDay'),
      providesTags: [{ type: 'Event', id: 'TODAY' }],
    }),

    CreateContact: builder.mutation({
      query: (newContact) => ({
        url: getFullURL('/contact/'),
        method: 'POST',
        body: newContact,
      }),
      invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
    }),

    // Documents
    CreateNewDocument: builder.mutation({
      query: (newDocument) => ({
        url: getFullURL('/document/'),
        method: 'POST',
        body: newDocument,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    getTotalDocuments: builder.query({
      query: () => getFullURL('/document/getAllDocuments'),
      providesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    // Contacts & Visitors
    getAllContacts: builder.query({
      query: () => getFullURL('/contact/getAllContacts'),
      keepUnusedDataFor: 600,
    }),

    getTotalVisitors: builder.query({
      query: () => getFullURL('/visitors/getVisitors'),
    }),

    getVisitors4Day: builder.query({
      query: (day) => getFullURL(`/visitors/day/${day}`),
    }),

    // User Info
    getUserInfo: builder.query({
      query: () => getFullURL('/user/getUser'),
    }),
  }),
});

export const {
  useGetTotalContactsQuery,
  useGetTotalTasksQuery,
  useGetTotalNotesQuery,
  useGetTotalDocumentsQuery,
  useGetTotalVisitorsQuery,
  useGetEmergencyTasksQuery,
  useGetOverdueTasksQuery,
  useGetTaskDueIn3DaysQuery,
  useGetPendingTasksQuery,
  useGetEventForTodayQuery,
  useGetVisitors4DayQuery,
  useGetAllNotificationsQuery,
  useGetUserInfoQuery,
  useCreateNewEventMutation,
  useCreateNewTaskMutation,
  useCreateVisitorsMutation,
  useCreateNewNoteMutation,
  useCreateNewDocumentMutation,
  useCreateContactMutation,
  useGetAllContactsQuery,
  useDeleteNotificationMutation,
} = overviewApi;

export default overviewApi;