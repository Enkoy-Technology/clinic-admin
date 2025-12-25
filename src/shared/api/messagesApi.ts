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
    getUnreadMessages: builder.query<MessagesResponse, void>({
      query: () => {
        const url = `/messages/`;
        const params = { is_read: "false" };
        console.log("[Messages API] getUnreadMessages called");
        console.log("[Messages API] URL:", url);
        console.log("[Messages API] Params:", params);
        return {
          url,
          params,
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
    getMessages: builder.query<MessagesResponse, { is_read?: boolean; page?: number }>({
      query: (params) => ({
        url: `/messages/`,
        params: params.is_read !== undefined ? { is_read: params.is_read.toString() } : {},
      }),
      providesTags: ["Messages"],
    }),
  }),
});

export const {
  useGetUnreadMessagesQuery,
  useGetMessagesQuery,
} = messagesApi;

