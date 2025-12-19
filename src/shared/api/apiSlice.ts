import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HeroSection } from "../models/heroSection";

// Supabase is disabled. This is a placeholder for future API implementation.
export const apiSlice = createApi({
  reducerPath: "apiApp1",
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ["HeroSection"],
  endpoints: (builder) => ({
    getHeroSections: builder.query<HeroSection[], void>({
      query: () => 'hero-sections', // Will fail if called, but better than broken imports
    }),
    addHeroSection: builder.mutation<HeroSection, Omit<HeroSection, 'id'>>({
      query: (heroSection) => ({ url: 'hero-sections', method: 'POST', body: heroSection }),
    }),
    updateHeroSection: builder.mutation<HeroSection, HeroSection>({
      query: (heroSection) => ({ url: `hero-sections/${heroSection.id}`, method: 'PUT', body: heroSection }),
    }),
    deleteHeroSection: builder.mutation<void, string>({
      query: (id) => ({ url: `hero-sections/${id}`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetHeroSectionsQuery,
  useAddHeroSectionMutation,
  useUpdateHeroSectionMutation,
  useDeleteHeroSectionMutation,
} = apiSlice;

