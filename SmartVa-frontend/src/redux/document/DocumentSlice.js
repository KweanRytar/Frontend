import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


 const getFullURL = (endpoint = '') => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  
  // If no endpoint or it's just query params, don't add extra slash
  const cleanEndpoint = endpoint ? endpoint.replace(/^\/+/, '') : '';
  
  return new URL(cleanEndpoint, base).toString();
};

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: fetchBaseQuery({
    // No baseUrl here — we build full URLs with getFullURL
    credentials: 'include',
  }),
  tagTypes: ['Document'],

  endpoints: (builder) => ({
    // ✅ Get all documents
    getDocuments: builder.query({
      query: (params = {}) => ({
        url: getFullURL('/document/getAllDocuments'),
        params, // pass query params if provided
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Document',
                id: _id,
              })),
              { type: 'Document', id: 'LIST' },
            ]
          : [{ type: 'Document', id: 'LIST' }],
    }),

    // 📁 Create new document
    CreateNewDocument: builder.mutation({
      query: (newDocument) => ({
        url: getFullURL('/document/'),
        method: 'POST',
        body: newDocument,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    // Get single document by ID
    getDocumentById: builder.query({
      query: (id) => getFullURL(`/document/${id}`),
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),

    // Add response to document
    addDocumentResponse: builder.mutation({
      query: ({ id, responseBody }) => ({
        url: getFullURL(`/document/response/${id}`),
        method: 'POST',
        body: responseBody,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    // ✅ Update a document
    updateDocument: builder.mutation({
      query: ({ id, updatedBody }) => ({
        url: getFullURL(`/document/${id}`),
        method: 'PUT', // or 'PATCH' — keep whatever your backend expects
        body: updatedBody,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    // Delete document
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: getFullURL(`/document/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Document', id }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUpdateDocumentMutation,
  useGetDocumentByIdQuery,
  useDeleteDocumentMutation,
  useAddDocumentResponseMutation,
  useCreateNewDocumentMutation,
} = documentApi;

export default documentApi;
