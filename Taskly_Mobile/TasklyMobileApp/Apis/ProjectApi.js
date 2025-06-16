import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../src/api/config'
import ApiService from '../services/ApiService';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    // Tüm projeleri getir
    getProjects: builder.query({
      queryFn: async () => {
        try {
          const response = await ApiService.get('/projects');
          return { data: response };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ['Project'],
    }),

    // Tek bir projeyi getir
    getProjectById: builder.query({
      queryFn: async (id) => {
        try {
          const response = await ApiService.get(`/projects/${id}`);
          return { data: response };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    // Yeni proje oluştur
    createProject: builder.mutation({
      queryFn: async (body) => {
        try {
          const response = await ApiService.post('/projects', body);
          return { data: response };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ['Project'],
    }),

    // Proje güncelle
    updateProject: builder.mutation({
      queryFn: async (body) => {
        try {
          const response = await ApiService.put('/projects', body);
          return { data: response };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.id }],
    }),

    // Proje sil
    deleteProject: builder.mutation({
      queryFn: async (id) => {
        try {
          const response = await ApiService.delete(`/projects/${id}`);
          return { data: response };
        } catch (error) {
          return { error: error.message };
        }
      },
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