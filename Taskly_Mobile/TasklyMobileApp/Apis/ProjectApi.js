import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config, prepareHeaders } from './config';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: config.baseUrl,
    prepareHeaders,
  }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    // Tüm projeleri getir
    getProjects: builder.query({
      query: () => 'projects',
      providesTags: ['Project'],
    }),

    // Tek bir projeyi getir
    getProjectById: builder.query({
      query: (id) => `projects/${id}`,
      providesTags: ['Project'],
    }),

    // Yeni proje oluştur
    createProject: builder.mutation({
      query: (project) => ({
        url: 'projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),

    // Proje güncelle
    updateProject: builder.mutation({
      query: ({ id, project }) => ({
        url: `projects/${id}`,
        method: 'PUT',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),

    // Proje sil
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),

    // Proje istatistiklerini getir
    getProjectStats: builder.query({
      query: (id) => `projects/${id}/stats`,
      providesTags: ['Project'],
    }),

    // Projeye üye ekle
    addProjectMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `projects/${projectId}/members`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Project'],
    }),

    // Projeden üye çıkar
    removeProjectMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `projects/${projectId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectStatsQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectApi; 