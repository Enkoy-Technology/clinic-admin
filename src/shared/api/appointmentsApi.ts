import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = "/api";

export interface Appointment {
  id: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  formatted_date: string;
  formatted_start_time: string;
  formatted_end_time: string;
  formatted_datetime: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  branch: any | null;
  doctor: any | null;
  service: any | null;
}

export interface AppointmentsResponse {
  count: number;
  appointments: Appointment[];
  filters: {
    start_date: string;
    end_date: string;
  };
}

export interface GetAppointmentsParams {
  start_date: string;
  end_date: string;
}

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    getActiveAppointments: builder.query<AppointmentsResponse, GetAppointmentsParams>({
      query: ({ start_date, end_date }) => ({
        url: `/appointments/active`,
        params: { start_date, end_date },
      }),
      providesTags: ["Appointments"],
    }),
    createAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (appointment) => ({
        url: "/appointments/active",
        method: "POST",
        body: appointment,
      }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointment: builder.mutation<Appointment, { id: number; data: Partial<Appointment> }>({
      query: ({ id, data }) => ({
        url: `/appointments/active/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),
    deleteAppointment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/appointments/active/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

export const {
  useGetActiveAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsApi;

