import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const overviewApi = createApi({
  reducerPath: 'overviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    credentials: 'include',
  }),
  tagTypes: ['Task', 'Event', 'Document', 'Notification'], //  Declare tag types
  endpoints: (builder) => ({
    //  Notifications
   getAllNotifications: builder.query({
  query: () => 'events/notify/',
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

   
     //  DELETE notification
   deleteNotification: builder.mutation({
  query: (id) => ({
    url: `profile/notification/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
}),


   // Visitors
    createVisitors: builder.mutation({
      query: (newVisitor) => ({
        url: 'Visitors',
        method: 'POST',
        body: newVisitor,
      }),
    }),

   // Tasks
    createNewTask: builder.mutation({
      query: (newTask) => ({
        url: 'task',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    getTotalTasks: builder.query({
      query: () => 'task/getAllTasks/',
      providesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    getOverdueTasks: builder.query({
      query: () => 'task/overdue',
      providesTags: [{ type: 'Task', id: 'OVERDUE' }],
    }),

    getTaskDueIn3Days: builder.query({
      query: () => 'task/due-in-next-72-hours',
      providesTags: [{ type: 'Task', id: 'DUE_SOON' }],
    }),

    getPendingTasks: builder.query({
      query: () => 'task/pending',
      providesTags: [{ type: 'Task', id: 'PENDING' }],
    }),

    getEmergencyTasks: builder.query({
      query: () => 'task/emergency/emergencyTasks',
      providesTags: [{ type: 'Task', id: 'EMERGENCY' }],
    }),

    //  Notes
    createNewNote: builder.mutation({
      query: (newNote) => ({
        url: 'notes/createnote',
        method: 'POST',
        body: newNote,
      }),
    }),

    getTotalNotes: builder.query({
      query: () => 'notes/getallnotes',
    }),

    //  Events
    createNewEvent: builder.mutation({
      query: (newEvent) => ({
        url: 'events',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    getEventForToday: builder.query({
      query: () => 'events/events4DDay',
      providesTags: [{ type: 'Event', id: 'TODAY' }],
    }),

    CreateContact: builder.mutation({
      query: (newContact) => ({
        url: 'contact/',
        method: 'POST',
        body:   newContact,

      }),
      invalidatesTags: [{type: 'Contact', id: 'LIST'}]
    }),

  

    //  Documents
    CreateNewDocument: builder.mutation({
      query: (newDocument) => ({
        url: 'document/',
        method: 'POST',
        body: newDocument,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    getTotalDocuments: builder.query({
      query: () => 'document/getAllDocuments',
      providesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    // Contacts & Visitors
    getAllContacts: builder.query({
      query: () => 'contact/getAllContacts',
      keepUnusedDataFor: 600,
    }),

    getTotalVisitors: builder.query({
      query: () => 'visitors/getVisitors',
    }),

    getVisitors4Day: builder.query({
      query: (day) => `visitors/day/${day}`,
    }),

    //  User Info
    getUserInfo: builder.query({
      query: () => 'user/getUser',
    }),
  }),
});


export const {useGetTotalContactsQuery, useGetTotalTasksQuery, useGetTotalNotesQuery, useGetTotalDocumentsQuery, useGetTotalVisitorsQuery, useGetEmergencyTasksQuery, useGetOverdueTasksQuery, useGetTaskDueIn3DaysQuery, useGetPendingTasksQuery, useGetEventForTodayQuery, useGetVisitors4DayQuery, useGetAllNotificationsQuery, useGetUserInfoQuery, useCreateNewEventMutation, useCreateNewTaskMutation, useCreateVisitorsMutation,
useCreateNewNoteMutation, useCreateNewDocumentMutation, useCreateContactMutation, useGetAllContactsQuery, useDeleteNotificationMutation} = overviewApi;

export default overviewApi;


