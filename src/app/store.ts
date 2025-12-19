// apps/app1/src/app/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../shared/api/apiSlice";
import { authApi } from "../shared/api/authApi";
import { appointmentsApi } from "../shared/api/appointmentsApi";
import authReducer from "../shared/slices/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authApi.middleware,
      appointmentsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
