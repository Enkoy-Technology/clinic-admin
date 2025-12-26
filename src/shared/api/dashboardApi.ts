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
  } | null;
  service?: {
    id: number;
    name: string;
  } | null;
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
}

export interface TodayAppointments {
  date: string;
  appointments: Appointment[];
  count: number;
}

export interface UpcomingAppointments {
  appointments: Appointment[];
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

