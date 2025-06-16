import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/ApiService';

// Görevleri API'den çek
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const data = await ApiService.get('/Tasks');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Görev güncelle
export const updateTask = createAsyncThunk('tasks/updateTask', async (updatedTask, thunkAPI) => {
  try {
    await ApiService.put('/Tasks', updatedTask);
    // Güncel listeyi tekrar çek
    thunkAPI.dispatch(fetchTasks());
    return updatedTask;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Görev sil
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId, thunkAPI) => {
  try {
    await ApiService.delete(`/Tasks/${taskId}`);
    thunkAPI.dispatch(fetchTasks());
    return taskId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer; 