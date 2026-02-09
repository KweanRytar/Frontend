import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    // No baseUrl here at all
    credentials: "include",
  }),
  tagTypes: ["Profile", "Task"],

  endpoints: (builder) => ({
    getSupervisors: builder.query({
      query: (email) => getFullURL(`/profile/supervisors/${email}`),
      providesTags: (result, error, id) => [{ type: "Profile", id }],
    }),

    updateTaskStatusByDelegate: builder.mutation({
      query: ({ taskId, isSubtask, subtaskId, status }) => ({
        url: getFullURL(`/profile/task/status/${taskId}`),
        method: "PATCH",
        body: { isSubtask, subtaskId, status },
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    getEventsByMemberEmail: builder.query({
      query: (email) => getFullURL(`/profile/events/member/${email}`),
      providesTags: (result, error, id) => [{ type: "Profile", id }],
    }),

    logOut: builder.mutation({
      query: () => ({
        url: getFullURL(`/profile/logout`),
        method: "POST",
      }),
      invalidatesTags: [{ type: "Profile" }],
    }),
  }),
});

export const { useGetSupervisorsQuery, useUpdateTaskStatusByDelegateMutation, useGetEventsByMemberEmailQuery,  useLogOutMutation } = profileApi;
export default profileApi;
