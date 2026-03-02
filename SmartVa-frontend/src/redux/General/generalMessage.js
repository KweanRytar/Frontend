import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getFullURL = (endpoint = '') => {
    const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
    const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
    return new URL(cleanEndpoint, base).toString();
};

export const generalMessageApi = createApi({
    reducerPath: 'generalMessageApi',
    baseQuery: fetchBaseQuery({
        credentials: 'include',
    }),
    tagTypes: ['GeneralMessage'],
    endpoints: (builder) => ({
        sendGeneralMessage: builder.mutation({
            query: (message) => ({
                url: getFullURL('/general/general-message'),
                method: 'POST',
                body: message,
            }),
            invalidatesTags: [{ type: 'GeneralMessage', id: 'LIST' }],
        }),

        // gneral reminder
        sendGeneralReminder: builder.mutation({
            query: (reminder) => ({
                url: getFullURL('/general/general-reminder'),
                method: 'POST',
                body: reminder,
            }),
            invalidatesTags: [{ type: 'GeneralMessage', id: 'LIST' }],
        }),
    }),
});

export const { useSendGeneralMessageMutation, useSendGeneralReminderMutation } = generalMessageApi;