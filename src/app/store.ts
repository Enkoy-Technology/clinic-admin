// apps/app1/src/app/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../shared/api/authApi";
import { appointmentsApi } from "../shared/api/appointmentsApi";
import { messagesApi } from "../shared/api/messagesApi";
import { doctorsApi } from "../shared/api/doctorsApi";
import authReducer from "../shared/slices/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [doctorsApi.reducerPath]: doctorsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      appointmentsApi.middleware,
      messagesApi.middleware,
      doctorsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
