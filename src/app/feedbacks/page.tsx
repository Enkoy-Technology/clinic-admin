"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Loader,
  Pagination,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { Star, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useGetFeedbacksQuery, useUpdateFeedbackVisibilityMutation } from "../../shared/api/feedbacksApi";
import { notifications } from "@mantine/notifications";

export default function FeedbacksPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useGetFeedbacksQuery({
    page,
    page_size: pageSize,
  });

  const [updateVisibility] = useUpdateFeedbackVisibilityMutation();

  const handleToggleVisibility = async (id: number, currentVisibility: boolean) => {
    try {
      await updateVisibility({ id, is_visible: !currentVisibility }).unwrap();
      notifications.show({
        title: "Success",
        message: `Feedback ${!currentVisibility ? "shown" : "hidden"} successfully`,
        color: "green",
      });
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.message || "Failed to update feedback visibility",
        color: "red",
      });
    }
  };

  if (isLoading) {
    return (
      <Box>
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" color="teal" />
        </div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text c="red" ta="center" py="xl">
          Error loading feedbacks. Please try again later.
        </Text>
      </Box>
    );
  }

  const feedbacks = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const totalCount = data?.count || 0;

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Feedbacks</Title>
          <Text size="sm" c="dimmed">
            Manage patient feedbacks and reviews ({totalCount} total)
          </Text>
        </div>
      </Group>

      {/* Feedbacks List */}
      {feedbacks.length === 0 ? (
        <Card shadow="sm" p="xl" className="border border-gray-200">
          <Text ta="center" c="dimmed" size="lg">
            No feedbacks found
          </Text>
        </Card>
      ) : (
        <Stack gap="md">
          {feedbacks.map((feedback) => (
            <Card
              key={feedback.id}
              shadow="sm"
              p="lg"
              className="border border-gray-200 hover:shadow-md transition-shadow"
            >
              <Group justify="space-between" align="flex-start">
                <div className="flex-1">
                  <Group justify="space-between" mb="xs">
                    <Group gap="xs">
                      <Text size="lg" fw={600}>
                        {feedback.fullname}
                      </Text>
                      <Group gap={4}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < feedback.star
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </Group>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        variant="light"
                        color={feedback.is_visible ? "green" : "gray"}
                        size="sm"
                      >
                        {feedback.is_visible ? "Visible" : "Hidden"}
                      </Badge>
                      <Switch
                        checked={feedback.is_visible}
                        onChange={() =>
                          handleToggleVisibility(feedback.id, feedback.is_visible)
                        }
                        size="sm"
                        onLabel={<Eye size={14} />}
                        offLabel={<EyeOff size={14} />}
                      />
                    </Group>
                  </Group>

                  <Text size="sm" c="dimmed" mb="sm">
                    {new Date(feedback.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>

                  <Text size="md" className="text-gray-700">
                    {feedback.feedback}
                  </Text>
                </div>
              </Group>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={page}
                onChange={setPage}
                total={totalPages}
                size="sm"
                radius="md"
              />
            </Group>
          )}
        </Stack>
      )}
    </Box>
  );
}

