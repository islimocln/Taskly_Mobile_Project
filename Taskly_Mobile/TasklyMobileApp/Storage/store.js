import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { documentApi } from '../Apis/DocumentApi';
import { taskApi } from '../Apis/TaskApi';
import { teamApi } from '../Apis/TeamApi';
import { projectApi } from '../Apis/ProjectApi';
import { AuthApi } from '../Apis/AuthApi';
import authReducer from './redux/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApi.middleware,
      documentApi.middleware,
      taskApi.middleware,
      teamApi.middleware,
      projectApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
