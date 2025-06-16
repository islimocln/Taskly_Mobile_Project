import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  darkMode: false,
  pushNotifications: true,
  emailUpdates: true,
  language: 'en',
};

const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      AsyncStorage.setItem('settings', JSON.stringify(state));
    },
    togglePushNotifications: (state) => {
      state.pushNotifications = !state.pushNotifications;
      AsyncStorage.setItem('settings', JSON.stringify(state));
    },
    toggleEmailUpdates: (state) => {
      state.emailUpdates = !state.emailUpdates;
      AsyncStorage.setItem('settings', JSON.stringify(state));
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      AsyncStorage.setItem('settings', JSON.stringify(state));
    },
    restoreSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleDarkMode,
  togglePushNotifications,
  toggleEmailUpdates,
  setLanguage,
  restoreSettings,
} = SettingsSlice.actions;

export default SettingsSlice.reducer; 