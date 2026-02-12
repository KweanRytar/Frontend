import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const overviewApi = createApi({
  reducerPath: 'overviewApi',
  baseQuery: fetchBaseQuery({
    // No trailing slash here — getFullURL will handle it
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: [  'Notification'], // added 'Contact'

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


  
   
    

    // Contacts & Visitors
    

    

    // User Info
    getUserInfo: builder.query({
      query: () => getFullURL('/user/getUser'),
    }),
  }),
});

export const {

  

  useGetAllNotificationsQuery,
  useGetUserInfoQuery,



 

  useDeleteNotificationMutation,
} = overviewApi;

export default overviewApi;