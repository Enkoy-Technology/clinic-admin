"use client";

import { Container, Title, Text } from "@mantine/core";
import React from "react";

interface PageInProgressProps {
  pageName: string;
}

export function PageInProgress({ pageName }: PageInProgressProps) {
  return (
    <Container className="h-screen flex flex-col items-center justify-center text-center space-y-4">
      <Title order={2} className="text-4xl text-blue-600">
        {pageName} Page
      </Title>
      <Text className="text-gray-500 text-lg">
        This page is currently under construction. Please check back later!
      </Text>
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
    </Container>
  );
}
