import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

export interface Feedback {
  id: number;
  fullname: string;
  feedback: string;
  star: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedbacksResponse {
  links?: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: Feedback[];
  page_size?: number;
  current_page?: number;
  total_pages?: number;
}

export const feedbacksApi = createApi({
  reducerPath: "feedbacksApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Feedbacks"],
  endpoints: (builder) => ({
    getFeedbacks: builder.query<FeedbacksResponse, { page?: number; page_size?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.page_size !== undefined) {
          queryParams.page_size = params.page_size.toString();
        }
        return {
          url: "/messages/feedback/feedback/",
          params: queryParams,
        };
      },
      providesTags: ["Feedbacks"],
    }),
    updateFeedbackVisibility: builder.mutation<Feedback, { id: number; is_visible: boolean }>({
      query: ({ id, is_visible }) => ({
        url: `/messages/feedback/feedback/${id}/`,
        method: "PATCH",
        body: { is_visible },
      }),
      invalidatesTags: ["Feedbacks"],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useUpdateFeedbackVisibilityMutation,
} = feedbacksApi;

