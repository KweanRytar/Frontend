import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://smartva-backend-file.onrender.com/document",
    credentials: "include", // optional if you need cookies
  }),
  tagTypes: ["DOCUMENT"],

  endpoints: (builder) => ({
    // ✅ Get all documents
   getDocuments: builder.query({
  query: (params = {}) => ({
    url: "/getAllDocuments",
    params, // 
  }),
  providesTags: (result) =>
    result?.data
      ? [
          ...result.data.map(({ _id }) => ({
            type: "Document",
            id: _id,
          })),
          { type: "Document", id: "LIST" },
        ]
      : [{ type: "Document", id: "LIST" }],
}),

// 📁 Documents
    CreateNewDocument: builder.mutation({
      query: (newDocument) => ({
        url: '/',
        method: 'POST',
        body: newDocument,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    getDocumentById: builder.query({
      query: (id) => `/${id}`,
      providesTags: [{ type: "DOCUMENT", id: "LIST" }]
    }),

    // add response to document
    addDocumentResponse: builder.mutation({
      query: ({ id, responseBody }) => ({
        url: `/response/${id}`,
        method: "POST",
        body: responseBody,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DOCUMENT", id },
        { type: "DOCUMENT", id: "LIST" },
      ],
    }),

    

    // ✅ Update a document
    updateDocument: builder.mutation({
      query: ({ id, updatedBody }) => ({
        url: `/${id}`,
        method: "PUT", // or "PATCH" depending on backend
        body: updatedBody,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DOCUMENT", id },
        { type: "DOCUMENT", id: "LIST" },
      ],
    }),

   

    // delete document
    deleteDocument: builder.mutation({
      query: (id)=>({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'DOCUMENT', id }]
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
