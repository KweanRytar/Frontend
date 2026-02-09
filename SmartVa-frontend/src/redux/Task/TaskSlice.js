import { createApi, fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    // No baseUrl here — we use getFullURL for full control
    credentials: 'include',
  }),
  tagTypes: ['Task'],

  endpoints: (builder) => ({
    // Get task due today
    getTaskDueToday: builder.query({
      query: (dueDate) => getFullURL(`/task/due-date/${dueDate}`),
      providesTags: [{ type: 'Task', id: 'DUE_TODAY' }],
    }),

    // Get overdue tasks
    getOverdueTasks: builder.query({
      query: () => getFullURL('/task/overdue'),
      providesTags: [{ type: 'Task', id: 'OVERDUE' }],
    }),

    // Get tasks due in 72 hours
    getTaskDueIn72Hours: builder.query({
      query: () => getFullURL('/task/due-in-next-72-hours'),
      providesTags: [{ type: 'Task', id: 'DUE_IN_72_HOURS' }],
    }),

    // Get tasks by status
    getTaskByStatus: builder.query({
      query: (status) => getFullURL(`/task/status/${status}`),
      providesTags: [{ type: 'Task', id: 'BY_STATUS' }],
    }),

    // Get tasks by priority
    getTaskByPriority: builder.query({
      query: (priority) => getFullURL(`/task/priority/${priority}`),
      providesTags: [{ type: 'Task', id: 'BY_PRIORITY' }],
    }),

    // Get task by name/title
    getTaskByName: builder.query({
      query: (title) => getFullURL(`/task/title/${title}`),
      providesTags: [{ type: 'Task', id: 'BY_TITLE' }],
    }),

    // Get single task by ID
    getTaskById: builder.query({
      query: (id) => getFullURL(`/task/${id}`),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // Get all delegates
    getAllDelegates: builder.query({
      query: () => getFullURL('/task/delegates/allDelegates'),
      providesTags: [{ type: 'Task', id: 'ALL_DELEGATES' }],
    }),

    // Mark task as completed
    markTaskCompleted: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/task/${id}/mark-completed`),
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // Update task (using dynamic url from argument)
    updateTask: builder.mutation({
      query: ({ url, payload }) => ({
        url: getFullURL(url), // assuming url is already a path like '/task/123'
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    // Delete task
    deleteTask: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/task/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // Get all tasks (with pagination)
    getAllTasks: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: getFullURL('/task/getAllTasks'),
        params: { page, limit },
        method: 'GET',
      }),
      providesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    // Get delegate details
    getDelegatesDetails: builder.query({
      query: (delegateEmail) => getFullURL(`/task/delegates/details/${delegateEmail}`),
    }),

    // Get all delegated tasks
    getAllDelegateTasks: builder.query({
      query: () => getFullURL('/task/delegates/allTask'),
      providesTags: [{ type: 'Task', id: 'DELEGATED_TASKS' }],
    }),

    // Message delegate
    messageDelegate: builder.mutation({
      query: ({ subject, message, delegateEmail }) => ({
        url: getFullURL('/task/delegate/message'),
        method: 'POST',
        body: { subject, message, delegateEmail },
      }),
    }),

    // Get delegate by ID
    delegateDetails: builder.query({
      query: (id) => getFullURL(`/task/delegate/${id}`),
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
