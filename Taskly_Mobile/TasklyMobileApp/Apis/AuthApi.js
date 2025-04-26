import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from './config';

export const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl, // Backend base URL'ini buraya ekle
  }),
  endpoints: (builder) => ({
    // Kayıt işlemi
    signUp: builder.mutation({
      query: (signUpData) => ({
        url: 'Auth/signup',  // API endpoint'ini belirt
        method: 'POST',
        body: signUpData,    // Kayıt verilerini gönder
      }),
    }),

    // Login işlemi ve JWT token'ı al
    login: builder.mutation({
      query: (loginData) => ({
        url: 'Auth/login',  // Login endpoint'ini belirt
        method: 'POST',
        body: loginData,    // Login verilerini gönder
      }),
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation } = AuthApi;
export default AuthApi;