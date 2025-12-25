import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

export interface CreatePatientRequest {
  profile: {
    user: {
      email?: string;
      password?: string;
      first_name: string;
      last_name: string;
    };
    role: string;
    phone_number: string;
  };
  age?: number;
  dob?: string; // YYYY-MM-DD (optional if age is provided)
  gender: "MALE" | "FEMALE";
  status?: "ACTIVE" | "COMPLETED" | "PENDING" | "ARCHIVED";
  note?: string;
  address?: {
    city?: string;
    state?: string;
    street?: string;
    postal_code?: string;
    country?: number;
  };
  profile_picture?: string;
}

export interface Patient {
  id: number;
  profile: {
    user: {
      email?: string;
      username?: string;
      first_name: string;
      last_name: string;
    };
    role: string;
    phone_number: string;
  };
  age?: number;
  dob?: string;
  gender: "MALE" | "FEMALE";
  status?: "ACTIVE" | "COMPLETED" | "PENDING" | "ARCHIVED";
  telegram_username?: string;
  note?: string;
  address?: {
    id: number;
    city?: string;
    state?: string;
    street?: string;
    postal_code?: string;
    country?: number;
    created_at: string;
    updated_at: string;
  };
  profile_picture?: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientsResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: Patient[];
  page_size: number;
  current_page: number;
  total_pages: number;
}

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Patients"],
  endpoints: (builder) => ({
    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      query: (patient) => ({
        url: "/patients/",
        method: "POST",
        body: patient,
      }),
      invalidatesTags: ["Patients"],
    }),
    updatePatient: builder.mutation<Patient, { id: number; data: Partial<CreatePatientRequest> }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Patients"],
    }),
    getPatients: builder.query<PatientsResponse, { page?: number; per_page?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.per_page !== undefined) {
          queryParams.per_page = params.per_page.toString();
        }
        return {
          url: "/patients/",
          params: queryParams,
        };
      },
      providesTags: ["Patients"],
    }),
    getPatient: builder.query<Patient, number>({
      query: (id) => `/patients/${id}/`,
      providesTags: ["Patients"],
    }),
    deletePatient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/patients/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patients"],
    }),
  }),
});

export const {
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useGetPatientsQuery,
  useGetPatientQuery,
  useDeletePatientMutation,
} = patientsApi;

