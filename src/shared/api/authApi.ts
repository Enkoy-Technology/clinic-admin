import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateAccessToken } from "../slices/authSlice";

const API_BASE_URL = "https://ff-gng8.onrender.com/api";

// Base query function that handles token refresh on 401 errors
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `JWT ${token}`);
    }
    headers.set("accept", "*/*");
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Wrapper that automatically refreshes token on 401
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("[Auth] Token expired, attempting refresh...");

    // Try to refresh the token
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { token } = refreshResult.data as { token: string };

        // Update the token in both localStorage and Redux
        localStorage.setItem("accessToken", token);
        api.dispatch(updateAccessToken(token));
        console.log("[Auth] Token refreshed successfully");

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        console.error("[Auth] Token refresh failed, logging out");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Optionally dispatch logout action
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } else {
      // No refresh token, redirect to login
      console.error("[Auth] No refresh token found, redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

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
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/token/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: builder.mutation<{ token: string }, { refresh: string }>({
      query: (body) => ({
        url: "/auth/refresh/",
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

