'use client';
import {
  ColorSchemeScript,
  Loader,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme as baseTheme } from "@repo/theme/mantine";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "./store";
import RootAdminLayout from "./components/layout";

const metadata: Metadata = {
  title: "Dr Hilina Dental",
  description:
    "Dr Hilina Dental Clinic provides exceptional dental care services, including routine check-ups, advanced treatments, and personalized care to ensure your oral health and smile are at their best.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme: Partial<MantineThemeOverride> = baseTheme;

  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description as string} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={metadata.title as string} />
        <meta
          property="og:description"
          content={metadata.description as string}
        />
      </head>
      <body style={{ backgroundColor: "var(--mantine-color-body)" }}>
        <MantineProvider theme={theme}>
          <ColorSchemeScript />
          <Notifications position="top-right" />
          <Suspense fallback={<Loader />}>
            <Provider store={store}>
              <RootAdminLayout>
                {children}
              </RootAdminLayout>
            </Provider>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}