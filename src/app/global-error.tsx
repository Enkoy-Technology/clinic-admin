"use client"; // Error components must be Client Components

import React from "react";
import { Container, Title, Text, Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export const ErrorComponent: React.FC = () => {
    const navigate = useRouter();

    return (
        <Container className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-red-50">
            <svg
                className="w-48 h-48 mb-4 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <Title order={2} className="text-red-900">
                Something Went Wrong
            </Title>
            <Text color="dimmed" className="mb-4">
                An error occurred. Please try again later.
            </Text>
            <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => navigate.push("/")}
            >
                Go to Home
            </Button>
        </Container>
    );
};
export default ErrorComponent;
