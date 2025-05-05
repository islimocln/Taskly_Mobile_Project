import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config, prepareHeaders } from './config';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: config.baseUrl,
    prepareHeaders,
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => 'tasks',
      providesTags: ['Task'],
    }),
    getTaskById: builder.query({
      query: (id) => `tasks/${id}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: 'tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi; 