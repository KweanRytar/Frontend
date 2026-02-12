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
    
    // ===========================
    // CREATE TASK
    // ===========================
    createTask: builder.mutation({
      query: (newTask) => ({
        url: getFullURL('/task'),
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    // ===========================
    // GET ALL TASKS (paginated)
    // ===========================
    getAllTasks: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: getFullURL('/task/getAllTasks'),
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Task', id: _id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    // ===========================
    // GET TASK BY ID
    // ===========================
    getTaskById: builder.query({
      query: (id) => getFullURL(`/task/${id}`),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // ===========================
    // GET TASKS BY FILTERS
    // ===========================
    getTasksByStatus: builder.query({
      query: (status) => getFullURL(`/task/status/${status}`),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    getTasksByPriority: builder.query({
      query: (priority) => getFullURL(`/task/priority/${priority}`),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    getTasksByName: builder.query({
      query: (title) => getFullURL(`/task/title/${title}`),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    getTasksDueToday: builder.query({
      query: (dueDate) => getFullURL(`/task/due-date/${dueDate}`),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    getOverdueTasks: builder.query({
      query: () => getFullURL('/task/overdue'),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    getTasksDueIn72Hours: builder.query({
      query: () => getFullURL('/task/due-in-next-72-hours'),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    getEmergencyTasks: builder.query({
      query: () => getFullURL('/task/emergency/emergencyTasks'),
      providesTags: (result) =>
        result ? result.map(({ _id }) => ({ type: 'Task', id: _id })) : [],
    }),

    // ===========================
    // TASK DELEGATES
    // ===========================
    getAllDelegates: builder.query({
      query: () => getFullURL('/task/delegates/allDelegates'),
      providesTags: [{ type: 'Task', id: 'ALL_DELEGATES' }],
    }),

    getDelegateDetails: builder.query({
      query: (delegateEmail) => getFullURL(`/task/delegates/details/${delegateEmail}`),
      providesTags: [{ type: 'Task', id: 'DELEGATE_DETAILS' }],
    }),

    getAllDelegateTasks: builder.query({
      query: () => getFullURL('/task/delegates/allTask'),
      providesTags: [{ type: 'Task', id: 'DELEGATED_TASKS' }],
    }),

    delegateDetailsById: builder.query({
      query: (id) => getFullURL(`/task/delegate/${id}`),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // ===========================
    // UPDATE / DELETE / COMPLETE TASK
    // ===========================
    updateTask: builder.mutation({
      query: ({ id, payload }) => ({
        url: getFullURL(`/task/${id}`),
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    markTaskCompleted: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/task/${id}/mark-completed`),
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/task/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    messageDelegate: builder.mutation({
      query: ({ subject, message, delegateEmail }) => ({
        url: getFullURL('/task/delegate/message'),
        method: 'POST',
        body: { subject, message, delegateEmail },
      }),
    }),
  }),
});


export const {
 useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksByStatusQuery,
  useGetTasksByPriorityQuery,
  useGetTasksByNameQuery,
  useGetTasksDueTodayQuery,
  useGetOverdueTasksQuery,
  useGetTasksDueIn72HoursQuery,
  useGetEmergencyTasksQuery,
  useGetAllDelegatesQuery,
  useGetAllDelegateTasksQuery,
  useGetDelegateDetailsQuery,
  useDelegateDetailsByIdQuery,
  useUpdateTaskMutation,
  useMarkTaskCompletedMutation,
  useDeleteTaskMutation,
  useMessageDelegateMutation,
  


} = taskApi;


export default taskApi;
