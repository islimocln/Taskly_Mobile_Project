import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config, prepareHeaders } from './config';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: config.baseUrl,
    prepareHeaders,
  }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: () => 'documents',
      providesTags: ['Document'],
    }),
    getDocumentById: builder.query({
      query: (id) => `documents/${id}`,
      providesTags: ['Document'],
    }),
    createDocument: builder.mutation({
      query: (document) => ({
        url: 'documents',
        method: 'POST',
        body: document,
      }),
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation({
      query: ({ id, ...document }) => ({
        url: `documents/${id}`,
        method: 'PUT',
        body: document,
      }),
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentApi; 