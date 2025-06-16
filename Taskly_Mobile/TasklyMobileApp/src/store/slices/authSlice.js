import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;

      // Token ve user'ı AsyncStorage'a kaydet
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // AsyncStorage'dan temizle
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    restoreSession: (state, action) => {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
    },
  },
});

export const { login, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer; 