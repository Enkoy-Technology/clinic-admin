// apps/app1/src/app/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { appointmentsApi } from "../shared/api/appointmentsApi";
import { authApi } from "../shared/api/authApi";
import { dashboardApi } from "../shared/api/dashboardApi";
import { doctorsApi } from "../shared/api/doctorsApi";
import { messagesApi } from "../shared/api/messagesApi";
import { patientsApi } from "../shared/api/patientsApi";
import { paymentsApi } from "../shared/api/paymentsApi";
import { servicesApi } from "../shared/api/servicesApi";
import authReducer from "../shared/slices/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [doctorsApi.reducerPath]: doctorsApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      appointmentsApi.middleware,
      dashboardApi.middleware,
      messagesApi.middleware,
      doctorsApi.middleware,
      patientsApi.middleware,
      paymentsApi.middleware,
      servicesApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
