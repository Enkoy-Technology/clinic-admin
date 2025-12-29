import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface DashboardStats {
  new_patients: StatItem;
  completed_appointments: StatItem;
  unread_messages: StatItem;
  total_patients: StatItem;
}

export interface Appointment {
  id: number;
  patient?: {
    id: number;
    name: string;
    patient_id?: number;
    profile_picture?: string | null;
  } | string | null; // Can be object or string
  service?: {
    id: number;
    name: string;
  } | string | null; // Can be object or string
  doctor?: {
    id: number;
    name: string;
  } | null;
  formatted_start_time?: string;
  formatted_end_time?: string;
  start_time?: string;
  end_time?: string;
  status: string;
  scheduled_date?: string;
  formatted_date?: string;
  // Fields from today_appointments response
  time?: string;
  avatar?: string | null;
  patient_id?: number;
  service_id?: number;
  // Fields from upcoming_appointments response
  date?: string;
  appointment_id?: number;
}

export interface TodayAppointment {
  id: number;
  patient: string; // String in today_appointments
  service: string; // String in today_appointments
  time: string;
  status: string;
  avatar: string | null;
  patient_id: number;
  service_id: number;
}

export interface TodayAppointments {
  date: string;
  appointments: TodayAppointment[];
  count: number;
}

export interface UpcomingAppointment {
  patient: string; // String in upcoming_appointments
  service: string; // String in upcoming_appointments
  date: string;
  time: string;
  appointment_id: number;
  patient_id: number;
  scheduled_date: string;
}

export interface UpcomingAppointments {
  appointments: UpcomingAppointment[];
  count: number;
}

export interface Message {
  id: number;
  name: string;
  phone_number: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RecentMessages {
  messages: Message[];
  count: number;
  unread_count: number;
}

export interface Feedback {
  id: number;
  patient?: {
    id: number;
    name: string;
  } | null;
  rating: number;
  comment: string;
  created_at: string;
  service?: {
    id: number;
    name: string;
  } | null;
}

export interface RecentFeedbacks {
  feedbacks: Feedback[];
  count: number;
  average_rating: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  today_appointments: TodayAppointments;
  upcoming_appointments: UpcomingAppointments;
  recent_messages: RecentMessages;
  recent_feedbacks: RecentFeedbacks;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => ({
        url: "/dashboard/",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;

