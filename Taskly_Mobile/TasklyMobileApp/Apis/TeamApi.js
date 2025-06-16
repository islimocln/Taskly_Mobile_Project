import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../src/api/config'

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Team'],
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: () => 'teams',
      providesTags: ['Team'],
    }),
    getTeamById: builder.query({
      query: (id) => `teams/${id}`,
      providesTags: ['Team'],
    }),
    createTeam: builder.mutation({
      query: ({ name, description }) => ({
        url: 'teams',
        method: 'POST',
        body: { name, description },
      }),
      invalidatesTags: ['Team'],
    }),
    updateTeam: builder.mutation({
      query: ({ id, team }) => ({
        url: `teams/${id}`,
        method: 'PUT',
        body: team,
      }),
      invalidatesTags: ['Team'],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    addTeamMember: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: `teams/${teamId}/members`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ['Team'],
    }),
    removeTeamMember: builder.mutation({
      query: ({ teamId, userId }) => ({
        url: `teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    getTeamStats: builder.query({
      query: (teamId) => `teams/${teamId}/stats`,
      providesTags: ['Team'],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useGetTeamStatsQuery,
} = teamApi; 