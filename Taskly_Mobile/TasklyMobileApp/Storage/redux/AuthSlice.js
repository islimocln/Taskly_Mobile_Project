import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // ✅ Hem token hem user'ı AsyncStorage'a yaz
      AsyncStorage.setItem('token', action.payload.token);
      AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // ✅ Oturumu tamamen sil
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    restoreSession: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    }
  },
});

export const { loginSuccess, logout, restoreSession } = AuthSlice.actions;
export default AuthSlice.reducer;
