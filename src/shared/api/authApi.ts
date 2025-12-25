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

// Helper function to check if error is token expired
const isTokenExpiredError = (error: any): boolean => {
  if (!error || !error.data) return false;

  const errorData = error.data as any;

  // Check for the specific token expired error structure
  if (
    errorData.code === "token_not_valid" &&
    errorData.detail === "Given token not valid for any token type"
  ) {
    const messages = errorData.messages || [];
    return messages.some(
      (msg: any) =>
        msg.token_type === "access" && msg.message === "Token is expired"
    );
  }

  return false;
};

// Wrapper that automatically refreshes token on 401 or 403 with token expired error
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 or 403 with token expired error
  const isUnauthorized = result.error && (result.error.status === 401 || result.error.status === 403);
  const isTokenExpired = isUnauthorized && isTokenExpiredError(result.error);

  if (isTokenExpired) {
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
        // Handle different response formats from refresh endpoint
        const refreshData = refreshResult.data as any;
        const newToken = refreshData.token || refreshData.access || refreshData.access_token;

        if (newToken) {
          // Update the token in both localStorage and Redux
          localStorage.setItem("accessToken", newToken);
          api.dispatch(updateAccessToken(newToken));

          // Retry the original query with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Token format not recognized, logout user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        // Refresh failed, logout user
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

