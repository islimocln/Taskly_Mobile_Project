import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/ApiService';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (userId, thunkAPI) => {
  try {
    const data = await ApiService.get(`/notifications/user/${userId}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteNotification = createAsyncThunk('notifications/deleteNotification', async ({ id, userId }, thunkAPI) => {
  try {
    await ApiService.delete(`/notifications/${id}`);
    thunkAPI.dispatch(fetchNotifications(userId));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteAllNotifications = createAsyncThunk('notifications/deleteAllNotifications', async (userId, thunkAPI) => {
  try {
    await ApiService.delete(`/notifications/user/${userId}`);
    thunkAPI.dispatch(fetchNotifications(userId));
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer; 