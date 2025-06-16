import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, prepareHeaders } from '../src/api/config';

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    // Kayıt işlemi
    signUp: builder.mutation({
      query: (signUpData) => ({
        url: 'Auth/signup',
        method: 'POST',
        body: signUpData,
      }),
      transformResponse: (response) => {
        console.log('SignUp Response:', response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('SignUp Error:', error);
        return {
          status: error.status,
          message: error.data?.message || 'Kayıt işlemi sırasında bir hata oluştu'
        };
      },
    }),

    // Login işlemi ve JWT token'ı al
    login: builder.mutation({
      query: (loginData) => ({
        url: 'Auth/login',
        method: 'POST',
        body: loginData,
      }),
      transformResponse: (response) => {
        console.log('Login Response:', response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error('Login Error:', error);
        return {
          status: error.status,
          message: error.data?.message || 'Giriş yapılırken bir hata oluştu'
        };
      },
    }),
  }),
  tagTypes: ['Auth'],
});

export const { useSignUpMutation, useLoginMutation } = AuthApi;
export default AuthApi;