"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title
} from "@mantine/core";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetDashboardQuery } from "../shared/api/dashboardApi";

// Helper function to convert 24-hour to 12-hour format
const convertTo12Hour = (time24: string) => {
  if (!time24) {
    const [hours, minutes] = time24.split(":");
    if (hours && minutes) {
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
  }
  return time24;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper function to get relative date (Today, Tomorrow, etc.)
const getRelativeDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return formatDate(dateString);
};


const statusColors: Record<string, string> = {
  SCHEDULED: "yellow",
  CONFIRMED: "green",
  COMPLETED: "gray",
  CANCELLED: "red",
  NO_SHOW: "orange",
  confirmed: "green",
  pending: "yellow",
  "in-progress": "blue",
  completed: "gray",
};

// Icon mapping for stats
const statIcons: Record<string, any> = {
  "New Patients": TrendingUp,
  "Completed": Calendar,
  "Unread Messages": MessageSquare,
  "Total Patients": Users,
};

// Color mapping for stats
const statColors: Record<string, string> = {
  "New Patients": "bg-blue-500",
  "Completed": "bg-green-500",
  "Unread Messages": "bg-purple-500",
  "Total Patients": "bg-yellow-500",
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <Box>
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" color="teal" />
        </div>
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Box>
        <Text c="red" ta="center" py="xl">
          Error loading dashboard data. Please try again later.
        </Text>
      </Box>
    );
  }

  const { stats, today_appointments, upcoming_appointments, recent_messages, recent_feedbacks } = dashboardData;

  // Build stats array from API data
  const statsArray = [
    stats.new_patients,
    stats.completed_appointments,
    stats.unread_messages,
    stats.total_patients,
  ];

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Dashboard</Title>
          <Text size="sm" c="dimmed">Welcome back, Dr. Hilina! Here's what's happening today.</Text>
        </div>
        {/* <Group>
          <Button variant="light" leftSection={<Calendar size={18} />}>
            Schedule
          </Button>
          <Button className="bg-[#19b5af] hover:bg-[#14918c]" leftSection={<User size={18} />}>
            New Patient
          </Button>
        </Group> */}
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsArray.map((stat, index) => {
          const Icon = statIcons[stat.title] || Calendar;
          const color = statColors[stat.title] || "bg-gray-500";

          return (
            <Card key={index} shadow="sm" p="lg" className="border border-gray-200 hover:shadow-md transition-shadow">
              <Group justify="space-between" mb="md">
                <div className={`${color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                {stat.trend === "up" ? (
                  <Group gap={4} className="text-green-600">
                    <ArrowUpRight size={16} />
                    <Text size="sm" fw={500}>{stat.change}</Text>
                  </Group>
                ) : (
                  <Group gap={4} className="text-red-600">
                    <ArrowDownRight size={16} />
                    <Text size="sm" fw={500}>{stat.change}</Text>
                  </Group>
                )}
              </Group>
              <Text size="sm" c="dimmed" mb={4}>{stat.title}</Text>
              <Text size="xl" fw={700}>{stat.value}</Text>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Appointments */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={4}>Today's Appointments</Title>
              <Text size="sm" c="dimmed">{today_appointments.date}</Text>
            </div>
            <Button
              variant="light"
              size="sm"
              leftSection={<Eye size={16} />}
              onClick={() => router.push("/appointments")}
            >
              View All
            </Button>
          </Group>

          <Stack gap="md">
            {today_appointments.appointments.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">No appointments for today</Text>
            ) : (
              today_appointments.appointments.map((appointment) => (
                <Card key={appointment.id} className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors">
                  <Group justify="space-between">
                    <Group>
                      <Avatar
                        src={appointment.patient?.profile_picture || undefined}
                        size={50}
                        radius="xl"
                      >
                        {appointment.patient?.name?.charAt(0) || "?"}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={600}>
                          {appointment.patient?.name || "Unknown Patient"}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {appointment.service?.name || "No service"}
                        </Text>
                      </div>
                    </Group>
                    <Group>
                      <Group gap={6}>
                        <Clock size={16} className="text-gray-400" />
                        <Text size="sm">
                          {appointment.formatted_start_time
                            ? convertTo12Hour(appointment.formatted_start_time)
                            : appointment.start_time
                            ? convertTo12Hour(appointment.start_time)
                            : "N/A"}
                        </Text>
                      </Group>
                      <Badge
                        variant="light"
                        color={statusColors[appointment.status] || "gray"}
                        size="sm"
                        className="capitalize"
                      >
                        {appointment.status.replace('_', ' ')}
                      </Badge>
                      <ActionIcon variant="light" color="gray">
                        <MoreVertical size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </Card>

        {/* Upcoming Appointments */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Upcoming</Title>
            <ActionIcon variant="light">
              <MoreVertical size={16} />
            </ActionIcon>
          </Group>

          <Stack gap="md">
            {upcoming_appointments.appointments.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="md">No upcoming appointments</Text>
            ) : (
              upcoming_appointments.appointments.map((appointment, index) => (
                <div key={appointment.id || index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={600}>
                      {appointment.patient?.name || "Unknown Patient"}
                    </Text>
                    <Badge variant="light" size="xs">
                      {appointment.formatted_date
                        ? getRelativeDate(appointment.formatted_date)
                        : appointment.scheduled_date
                        ? getRelativeDate(appointment.scheduled_date)
                        : "N/A"}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" mb={4}>
                    {appointment.service?.name || "No service"}
                  </Text>
                  <Group gap={6}>
                    <Clock size={14} className="text-gray-400" />
                    <Text size="xs" c="dimmed">
                      {appointment.formatted_start_time
                        ? convertTo12Hour(appointment.formatted_start_time)
                        : appointment.start_time
                        ? convertTo12Hour(appointment.start_time)
                        : "N/A"}
                    </Text>
                  </Group>
                </div>
              ))
            )}
          </Stack>

          <Button
            variant="light"
            fullWidth
            mt="md"
            className="hover:bg-[#19b5af]/10"
            onClick={() => router.push("/appointments")}
          >
            View All Appointments
          </Button>
        </Card>
      </div>

      {/* Messages */}
      <MessagesSection dashboardMessages={recent_messages} />

      {/* Feedbacks Section */}
      <FeedbacksSection dashboardFeedbacks={recent_feedbacks} />
    </Box>
  );
}

// Messages Section Component
function MessagesSection({ dashboardMessages }: { dashboardMessages?: any }) {
  const router = useRouter();

  const unreadCount = dashboardMessages?.unread_count || 0;
  const messages = dashboardMessages?.messages || [];

  return (
    <Card shadow="sm" p="lg" className="border border-gray-200">
      <Group justify="space-between" mb="lg">
        <Group>
          <Title order={4}>Messages</Title>
          {unreadCount > 0 && (
            <Badge variant="filled" color="red" size="sm">
              {unreadCount} unread
            </Badge>
          )}
        </Group>
        <Button
          variant="light"
          size="sm"
          leftSection={<MessageSquare size={16} />}
          onClick={() => router.push("/messages")}
        >
          View All
        </Button>
      </Group>

      {messages.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="md">No messages</Text>
      ) : (
        <Stack gap="sm">
          {messages.slice(0, 5).map((message: any) => (
            <Card
              key={message.id}
              className={`border transition-colors ${
                !message.is_read
                  ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Group justify="space-between" align="flex-start">
                <div className="flex-1">
                  <Group gap="xs" mb={4}>
                    <Text size="sm" fw={600}>
                      {message.name}
                    </Text>
                    {!message.is_read && (
                      <Badge size="xs" color="blue" variant="dot">New</Badge>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed" mb={4}>
                    {message.phone_number}
                  </Text>
                  <Text size="sm" lineClamp={2}>
                    {message.message}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {new Date(message.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </div>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Card>
  );
}

// Feedbacks Section Component
function FeedbacksSection({ dashboardFeedbacks }: { dashboardFeedbacks?: any }) {
  const feedbacks = dashboardFeedbacks?.feedbacks || [];
  const averageRating = dashboardFeedbacks?.average_rating || 0;
  const feedbackCount = dashboardFeedbacks?.count || 0;

  return (
    <Card shadow="sm" p="lg" className="border border-gray-200">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={4}>Recent Feedbacks</Title>
          <Text size="sm" c="dimmed">Patient reviews and ratings</Text>
        </div>
        <Group gap="xs">
          <Star size={20} className="text-yellow-500 fill-yellow-500" />
          <Text size="lg" fw={700}>
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </Text>
          <Text size="sm" c="dimmed">
            ({feedbackCount} reviews)
          </Text>
        </Group>
      </Group>

      <Stack gap="md">
        {feedbacks.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">No feedbacks yet</Text>
        ) : (
          feedbacks.map((feedback: any) => (
            <Card key={feedback.id} className="bg-gray-50 border border-gray-200">
              <Group justify="space-between" align="flex-start" mb="xs">
                <div className="flex-1">
                  <Group gap="xs" mb={4}>
                    <Text size="sm" fw={600}>
                      {feedback.patient?.name || "Anonymous"}
                    </Text>
                    <Group gap={4}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < feedback.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </Group>
                  </Group>
                  <Text size="xs" c="dimmed" mb={4}>
                    {feedback.service?.name || "No service"} • {formatDate(feedback.created_at)}
                  </Text>
                  <Text size="sm" lineClamp={2}>
                    {feedback.comment || "No comment"}
                  </Text>
                </div>
              </Group>
            </Card>
          ))
        )}
      </Stack>

      <Button variant="light" fullWidth mt="md" className="hover:bg-[#19b5af]/10">
        View All Feedbacks
      </Button>
    </Card>
  );
}
