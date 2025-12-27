import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

export interface CreateDoctorRequest {
  profile: {
    user: {
      email?: string;
      username?: string;
      password?: string;
      first_name: string;
      last_name: string;
    };
    role: string;
    phone_number: string;
  };
  specialty?: string;
  qualification: string;
  years_of_experience?: number;
  bio?: string;
  gender: "MALE" | "FEMALE";
  address?: {
    city?: string;
    state?: string;
    street?: string;
    postal_code?: string;
    country?: number;
  };
  age?: number;
  dob?: string; // YYYY-MM-DD (optional if age is provided)
  is_licensed?: boolean;
  profile_picture?: string;
  name?: string;
}

export interface Doctor {
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
  specialty?: string;
  qualification: string;
  years_of_experience?: number;
  bio?: string;
  gender: "MALE" | "FEMALE";
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
  age?: number;
  dob?: string;
  is_licensed?: boolean;
  profile_picture?: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorsResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: Doctor[];
  page_size: number;
  current_page: number;
  total_pages: number;
}

export const doctorsApi = createApi({
  reducerPath: "doctorsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Doctors"],
  endpoints: (builder) => ({
    createDoctor: builder.mutation<Doctor, CreateDoctorRequest>({
      query: (doctor) => ({
        url: "/doctors/",
        method: "POST",
        body: doctor,
      }),
      invalidatesTags: ["Doctors"],
    }),
    updateDoctor: builder.mutation<Doctor, { id: number; data: Partial<CreateDoctorRequest> }>({
      query: ({ id, data }) => ({
        url: `/doctors/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Doctors"],
    }),
    getDoctors: builder.query<DoctorsResponse, { page?: number; per_page?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.per_page !== undefined) {
          queryParams.per_page = params.per_page.toString();
        }
        return {
          url: "/doctors/",
          params: queryParams,
        };
      },
      providesTags: ["Doctors"],
    }),
    getDoctor: builder.query<Doctor, number>({
      query: (id) => `/doctors/${id}/`,
      providesTags: ["Doctors"],
    }),
    deleteDoctor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/doctors/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctors"],
    }),
  }),
});

export const {
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useDeleteDoctorMutation,
} = doctorsApi;

