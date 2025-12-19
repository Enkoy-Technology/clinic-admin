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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setIsChecking(false);
  }, [isAuthenticated, router]);

  // Handle dehydration/hydration flash
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="lg" color="teal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Let the router.push handle it
  }

  return <>{children}</>;

  return <>{children}</>;
}

