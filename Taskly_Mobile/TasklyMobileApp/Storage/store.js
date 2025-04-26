import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/AuthSlice';
import { AuthApi } from '../Apis/AuthApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AuthApi.middleware),
});

export default store;
