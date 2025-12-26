import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

// Invoice/Bill Interfaces
export interface CreateInvoiceRequest {
  patient: number;
  service: string;
  total_amount: string;
  dentist?: number;
  notes?: string;
}

export interface Invoice {
  id: number;
  patient: number;
  service: string;
  total_amount: string;
  paid_amount: string;
  remaining: string;
  status: "pending" | "partial" | "paid" | "overdue";
  dentist?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoicesResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: Invoice[];
  page_size: number;
  current_page: number;
  total_pages: number;
}

// Payment Transaction Interfaces
export interface CreatePaymentRequest {
  patient: number;
  invoice?: number | null; // Optional - can be null for general payments
  amount: string;
  payment_date: string; // YYYY-MM-DD
  payment_method: "Cash" | "Bank Transfer" | "Mobile Money" | "Credit Card" | "Check";
  notes?: string;
}

export interface Payment {
  id: number;
  invoice?: number | null;
  patient: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  notes?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentsResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: Payment[];
  page_size: number;
  current_page: number;
  total_pages: number;
}

// Patient Payment Summary Interface
export interface PaymentHistory {
  date: string;
  amount: number;
  method: string;
}

export interface InvoiceWithPayments extends Invoice {
  payment_history: PaymentHistory[];
}

export interface PatientPaymentSummary {
  patient: {
    id: number;
    name: string;
    patient_id: string;
  };
  summary: {
    total_expected: number;
    total_paid: number;
    remaining: number;
    payment_progress: number;
  };
  invoices: InvoiceWithPayments[];
  all_payments: Payment[];
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Invoices", "Payments", "PatientPayments"],
  endpoints: (builder) => ({
    // Invoice endpoints
    createInvoice: builder.mutation<Invoice, CreateInvoiceRequest>({
      query: (invoice) => ({
        url: "/invoices/",
        method: "POST",
        body: invoice,
      }),
      invalidatesTags: ["Invoices", "PatientPayments"],
    }),
    updateInvoice: builder.mutation<Invoice, { id: number; data: Partial<CreateInvoiceRequest> }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Invoices", "PatientPayments"],
    }),
    getInvoices: builder.query<InvoicesResponse, { patient?: number; status?: string; page?: number; per_page?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};
        if (params.patient !== undefined) {
          queryParams.patient = params.patient.toString();
        }
        if (params.status !== undefined) {
          queryParams.status = params.status;
        }
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.per_page !== undefined) {
          queryParams.per_page = params.per_page.toString();
        }
        return {
          url: "/invoices/",
          params: queryParams,
        };
      },
      providesTags: ["Invoices"],
    }),
    getInvoice: builder.query<Invoice, number>({
      query: (id) => `/invoices/${id}/`,
      providesTags: ["Invoices"],
    }),
    deleteInvoice: builder.mutation<void, number>({
      query: (id) => ({
        url: `/invoices/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoices", "PatientPayments"],
    }),

    // Payment endpoints
    createPayment: builder.mutation<Payment, CreatePaymentRequest>({
      query: (payment) => ({
        url: "/payments/",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["Payments", "Invoices", "PatientPayments"],
    }),
    getPayments: builder.query<PaymentsResponse, { patient?: number; invoice?: number; page?: number; per_page?: number }>({
      query: (params = {}) => {
        const queryParams: Record<string, string> = {};
        if (params.patient !== undefined) {
          queryParams.patient = params.patient.toString();
        }
        if (params.invoice !== undefined) {
          queryParams.invoice = params.invoice.toString();
        }
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.per_page !== undefined) {
          queryParams.per_page = params.per_page.toString();
        }
        return {
          url: "/payments/",
          params: queryParams,
        };
      },
      providesTags: ["Payments"],
    }),
    getPayment: builder.query<Payment, number>({
      query: (id) => `/payments/${id}/`,
      providesTags: ["Payments"],
    }),
    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/payments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments", "Invoices", "PatientPayments"],
    }),

    // Patient Payment Summary endpoint
    getPatientPaymentSummary: builder.query<PatientPaymentSummary, number>({
      query: (patientId) => `/patients/${patientId}/payments/`,
      providesTags: ["PatientPayments"],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useDeleteInvoiceMutation,
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useDeletePaymentMutation,
  useGetPatientPaymentSummaryQuery,
} = paymentsApi;

