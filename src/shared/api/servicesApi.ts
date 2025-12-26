import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

export interface CreateServiceRequest {
  name: string;
  base_price?: string;
  min_price?: string;
  max_price?: string;
  time_unit?: string;
  duration?: number;
  is_active: boolean;
  description?: string;
}

export interface Service {
  id: number;
  name: string;
  clinic?: number;
  base_price?: string;
  min_price?: string;
  max_price?: string;
  time_unit?: string;
  duration?: number;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServicesResponse {
  links?: {
    next: string | null;
    previous: string | null;
  };
  count?: number;
  results: Service[];
  page_size?: number;
  current_page?: number;
  total_pages?: number;
}

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (service) => ({
        url: "/services/",
        method: "POST",
        body: service,
      }),
      invalidatesTags: ["Services"],
    }),
    updateService: builder.mutation<Service, { id: number; data: Partial<CreateServiceRequest> }>({
      query: ({ id, data }) => ({
        url: `/services/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
    getServices: builder.query<ServicesResponse, { page?: number; per_page?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.per_page !== undefined) {
          queryParams.per_page = params.per_page.toString();
        }
        return {
          url: "/services/",
          params: queryParams,
        };
      },
      providesTags: ["Services"],
    }),
    getService: builder.query<Service, number>({
      query: (id) => `/services/${id}/`,
      providesTags: ["Services"],
    }),
    deleteService: builder.mutation<void, number>({
      query: (id) => ({
        url: `/services/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetServicesQuery,
  useGetServiceQuery,
  useDeleteServiceMutation,
} = servicesApi;

