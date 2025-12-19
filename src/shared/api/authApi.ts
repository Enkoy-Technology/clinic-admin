import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use Next.js API proxy to avoid CORS issues
const API_BASE_URL = "/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh: string;
  role: string;
}

export interface Address {
  id: number;
  city: string;
  state: string;
  street: string;
  postal_code: string;
  country: number;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  label: string;
  key: string;
}

export interface UserProfile {
  user: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  role: string;
  phone_number: string;
}

export interface User {
  id: number;
  profile: UserProfile;
  admin_type: string;
  bio: string;
  gender: string;
  profile_picture: string;
  status: string;
  age: number;
  dob: string;
  address: Address;
  name: string;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/token",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: builder.mutation<{ token: string }, { refresh: string }>({
      query: (body) => ({
        url: "/auth/token/refresh",
        method: "POST",
        body,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
} = authApi;

