import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

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

export interface MessagesResponse {
  links?: {
    next: string | null;
    previous: string | null;
  };
  count?: number;
  results?: Message[];
  page_size?: number;
  current_page?: number;
  total_pages?: number;
}

// API can return either an array or an object with results
export type MessagesApiResponse = MessagesResponse | Message[];

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getUnreadMessages: builder.query<MessagesResponse, { page?: number; page_size?: number } | void>({
      query: (params) => {
        const url = `/messages/`;
        const queryParams: Record<string, string> = {
          is_read: "false",
        };

        // Add pagination if provided
        if (params) {
          if (params.page !== undefined) {
            queryParams.page = params.page.toString();
          }
          if (params.page_size !== undefined) {
            queryParams.page_size = params.page_size.toString();
          }
        }

        return {
          url,
          params: queryParams,
        };
      },
      transformResponse: (response: MessagesApiResponse): MessagesResponse => {
        // Handle array response
        if (Array.isArray(response)) {
          return {
            count: response.length,
            results: response,
          };
        }
        // Handle object response
        return response;
      },
      providesTags: ["Messages"],
    }),
    getMessages: builder.query<MessagesResponse, { is_read?: boolean | string; page?: number; page_size?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};

        if (params.is_read !== undefined) {
          queryParams.is_read = params.is_read.toString();
        }
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.page_size !== undefined) {
          queryParams.page_size = params.page_size.toString();
        }

        return {
          url: `/messages/`,
          params: queryParams,
        };
      },
      transformResponse: (response: MessagesApiResponse): MessagesResponse => {
        // Handle array response
        if (Array.isArray(response)) {
          return {
            count: response.length,
            results: response,
          };
        }
        // Handle object response
        return response;
      },
      providesTags: ["Messages"],
    }),
    markAsRead: builder.mutation<Message, number>({
      query: (id) => ({
        url: `/messages/${id}/mark-read/`,
        method: "POST",
      }),
      invalidatesTags: ["Messages"],
    }),
    markAsUnread: builder.mutation<Message, number>({
      query: (id) => ({
        url: `/messages/${id}/mark-unread/`,
        method: "POST",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetUnreadMessagesQuery,
  useGetMessagesQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
} = messagesApi;

