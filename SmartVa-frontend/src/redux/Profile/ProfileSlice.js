import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/profile`,
    credentials: "include",
  }),
  tagTypes: ["Profile", "Task"],

  endpoints: (builder) => ({
    // GET supervisors
    getSupervisors: builder.query({
      query: (email) => `/supervisors/${email}`,
      providesTags: (result, error, id) => [{ type: "Profile", id }],
    }),

    // PATCH: update task status by delegate
    updateTaskStatusByDelegate: builder.mutation({
      query: ({ taskId, isSubtask, subtaskId, status }) => ({
        url: `/task/status/${taskId}`,
        method: "PATCH",
        body: { isSubtask, subtaskId, status },
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),


    // GET events by member email
    getEventsByMemberEmail: builder.query({
      query: (email) => `/events/member/${email}`,
      providesTags: (result, error, id) => [{ type: "Profile", id }],
    }),

    logOut: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Profile" }],
    }),

  
   
    }
    )

  
});

export const { useGetSupervisorsQuery, useUpdateTaskStatusByDelegateMutation, useGetEventsByMemberEmailQuery,  useLogOutMutation } = profileApi;
export default profileApi;
