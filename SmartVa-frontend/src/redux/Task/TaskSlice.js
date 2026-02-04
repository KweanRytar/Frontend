import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://smartva-backend-file.onrender.com/task',
    credentials: 'include'
  }),
  tagTypes: ['Task'],

  endpoints: (builder) => ({
    getTaskDueToday: builder.query({
      query: (dueDate) => `/due-date/${dueDate}`,
      providesTags: [{ type: 'Task', id: 'DUE_TODAY' }],
    }),

    getOverdueTasks: builder.query({
      query: () => `/overdue`,
      providesTags: [{ type: 'Task', id: 'OVERDUE' }],
    }),

    getTaskDueIn72Hours: builder.query({
      query: () => `/due-in-next-72-hours`,
      providesTags: [{ type: 'Task', id: 'DUE_IN_72_HOURS' }],
    }),

    getTaskByStatus: builder.query({
      query: (status) => `/status/${status}`,
      providesTags: [{ type: 'Task', id: 'BY_STATUS' }],
    }),

    getTaskByPriority: builder.query({
      query: (priority) => `/priority/${priority}`,
      providesTags: [{ type: 'Task', id: 'BY_PRIORITY' }],
    }),

    getTaskByName: builder.query({
      query: (title) => `/title/${title}`,
      providesTags: [{ type: 'Task', id: 'BY_TITLE' }],
    }),


    getTaskById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    getAllDelegates: builder.query({
      query: () => '/delegates/allDelegates',
      providesTags: [{ type: 'Task', id: 'ALL_DELEGATES' }],
    }),

    markTaskCompleted: builder.mutation({
      query: (id) => ({
        url: `/${id}/mark-completed`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    updateTask: builder.mutation({
      query: ({ url, payload }) => ({
        url,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    getAllTasks: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/getAllTasks`,
        params: { page, limit },
        method: 'GET',
      }),
      providesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    getDelegatesDetails: builder.query({
      query: (delegateEmail) => `/delegates/details/${delegateEmail}`,
    }),
    getAllDelegateTasks: builder.query({
      query: () => `/delegates/allTask`,
      providesTags: [{ type: 'Task', id: 'DELEGATED_TASKS' }],
    }),

    messageDelegate: builder.mutation({
      query: ({ subject, message, delegateEmail }) => ({
        url: '/delegate/message',
        method: 'POST',
        body: { subject, message, delegateEmail },
      }),
      
    }),

    delegateDetails: builder.query({
      query: (id) => `/delegate/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
  }),
});


export const {
  useGetTaskDueTodayQuery,
  useMessageDelegateMutation,
  useGetOverdueTasksQuery,
  useGetTaskDueIn72HoursQuery,
  useGetTaskByStatusQuery,
  useGetTaskByPriorityQuery,
  useGetTaskByNameQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useGetAllDelegateTasksQuery,
  useDelegateDetailsQuery,
  useGetAllDelegatesQuery,
  useGetDelegatesDetailsQuery,
  useMarkTaskCompletedMutation,
} = taskApi;


export default taskApi;
