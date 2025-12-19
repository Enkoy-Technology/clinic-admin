"use client";

import { LoadingOverlay, Skeleton } from "@mantine/core";
import React from "react";
type LoaderProps = {
  isSkeleton?: boolean;
  visible?: boolean;
  blur?: number;
  radius?: "sm" | "md" | "lg" | "xl";
};
export const Loader = ({
  isSkeleton,
  visible,
  blur = 2,
  radius = "sm",
}: LoaderProps) => {
  return isSkeleton ? (
    <Skeleton circle mb="xl" />
  ) : (
    <LoadingOverlay
      visible={visible ?? true}
      zIndex={1000}
      overlayProps={{ radius: radius, blur: blur }}
    />
  );
};
export default Loader;
