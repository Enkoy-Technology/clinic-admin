import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

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
  patient: {
    id: number;
    name: string;
    patient_id: number;
    profile_picture: string | null;
  } | null;
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
  patient?: number; // Optional patient filter
}

export interface CreateAppointmentRequest {
  patient: number;
  branch?: number; // Optional, defaults to 0
  doctor?: number | null;
  service?: number | null;
  scheduled_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS or ISO format
  end_time: string; // HH:MM:SS or ISO format
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  reason?: string;
  notes?: string;
}

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    getActiveAppointments: builder.query<AppointmentsResponse, GetAppointmentsParams>({
      query: (params) => {
        const queryParams: Record<string, string> = {
          start_date: params.start_date,
          end_date: params.end_date,
        };
        if (params.patient !== undefined) {
          queryParams.patient = params.patient.toString();
        }
        return {
          url: `/appointments/active`,
          params: queryParams,
        };
      },
      providesTags: ["Appointments"],
    }),
    createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
      query: (appointment) => ({
        url: "/appointments/",
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

