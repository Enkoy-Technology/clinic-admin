"use client";

import { Box, Text } from "@mantine/core";
import { usePathname } from "next/navigation";
import logger from "../../../shared/utility/logger";

const ClientPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const getTitleFromPath = (path: string) => {
    logger.info("path", path);
    if (path === "/") return "Dashboard";
    const parts = path.split("/");
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" > ");
  };

  logger.info("pathname", pathname);

  return (
    <Box p="md">
      <Text size="xl" fw={700} mb="lg" className="text-secondary-900">
        {getTitleFromPath(pathname)}
      </Text>
      {children}
    </Box>
  );
};

export default ClientPageWrapper;
