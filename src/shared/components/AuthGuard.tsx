"use client";

import { Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isAuthenticated, router]);

  // Show loader during initial mount/hydration
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="lg" color="teal" />
      </div>
    );
  }

  // If not authenticated after mount, show loader while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="lg" color="teal" />
      </div>
    );
  }

  return <>{children}</>;
}

