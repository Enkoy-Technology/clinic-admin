"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
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
import { useGetMessagesQuery, useGetUnreadMessagesQuery } from "../shared/api/messagesApi";

// Mock data
const statsData = [
  {
    title: "New Patients",
    value: "48",
    change: "+12",
    trend: "up",
    icon: TrendingUp,
    color: "bg-blue-500",
  },
  {
    title: "Completed",
    value: "124",
    change: "+8",
    trend: "up",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    title: "Unread Messages",
    value: "5",
    change: "+2",
    trend: "up",
    icon: MessageSquare,
    color: "bg-purple-500",
  },
  {
    title: "Total Patients",
    value: "1,248",
    change: "+48",
    trend: "up",
    icon: Users,
    color: "bg-yellow-500",
  },
];

const recentAppointments = [
  {
    id: 1,
    patient: "Abebe Kebede",
    service: "Root Canal Treatment",
    time: "09:00 AM",
    status: "confirmed",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    patient: "Tigist Alemu",
    service: "Teeth Cleaning",
    time: "10:30 AM",
    status: "in-progress",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    patient: "Dawit Tadesse",
    service: "Orthodontics",
    time: "02:00 PM",
    status: "confirmed",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    patient: "Meron Hailu",
    service: "Cosmetic Dentistry",
    time: "03:30 PM",
    status: "pending",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
];

const upcomingAppointments = [
  {
    patient: "Sara Ahmed",
    service: "Checkup",
    date: "Tomorrow",
    time: "10:00 AM",
  },
  {
    patient: "John Doe",
    service: "Crown Placement",
    date: "Dec 18",
    time: "02:00 PM",
  },
  {
    patient: "Hanna Solomon",
    service: "Root Canal",
    date: "Dec 19",
    time: "11:00 AM",
  },
];


const statusColors: Record<string, string> = {
  confirmed: "green",
  pending: "yellow",
  "in-progress": "blue",
  completed: "gray",
};

export default function DashboardPage() {
  const { data: unreadMessages } = useGetUnreadMessagesQuery();
  const unreadCount = unreadMessages?.count || 0;

  // Update stats data with real unread messages count
  const updatedStatsData = statsData.map((stat) => {
    if (stat.title === "Unread Messages") {
      return {
        ...stat,
        value: unreadCount.toString(),
      };
    }
    return stat;
  });

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
        {updatedStatsData.map((stat, index) => (
          <Card key={index} shadow="sm" p="lg" className="border border-gray-200 hover:shadow-md transition-shadow">
            <Group justify="space-between" mb="md">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Appointments */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={4}>Today's Appointments</Title>
              <Text size="sm" c="dimmed">Monday, December 16, 2024</Text>
            </div>
            <Button variant="light" size="sm" leftSection={<Eye size={16} />}>
              View All
            </Button>
          </Group>

          <Stack gap="md">
            {recentAppointments.map((appointment) => (
              <Card key={appointment.id} className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors">
                <Group justify="space-between">
                  <Group>
                    <Avatar src={appointment.avatar} size={50} radius="xl" />
                    <div>
                      <Text size="sm" fw={600}>{appointment.patient}</Text>
                      <Text size="xs" c="dimmed">{appointment.service}</Text>
                    </div>
                  </Group>
                  <Group>
                    <Group gap={6}>
                      <Clock size={16} className="text-gray-400" />
                      <Text size="sm">{appointment.time}</Text>
                    </Group>
                    <Badge
                      variant="light"
                      color={statusColors[appointment.status]}
                      size="sm"
                      className="capitalize"
                    >
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                    <ActionIcon variant="light" color="gray">
                      <MoreVertical size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))}
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
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={600}>{appointment.patient}</Text>
                  <Badge variant="light" size="xs">{appointment.date}</Badge>
                </Group>
                <Text size="xs" c="dimmed" mb={4}>{appointment.service}</Text>
                <Group gap={6}>
                  <Clock size={14} className="text-gray-400" />
                  <Text size="xs" c="dimmed">{appointment.time}</Text>
                </Group>
              </div>
            ))}
          </Stack>

          <Button variant="light" fullWidth mt="md" className="hover:bg-[#19b5af]/10">
            View All Appointments
          </Button>
        </Card>
      </div>

      {/* Messages */}
      <MessagesSection />

      {/* Feedbacks Section */}
      <FeedbacksSection />
    </Box>
  );
}

// Messages Section Component
function MessagesSection() {
  const router = useRouter();
  const { data: unreadMessages, isLoading: isLoadingMessages } = useGetUnreadMessagesQuery({ page_size: 5 });
  const { data: recentMessages } = useGetMessagesQuery({ page_size: 5 });

  const unreadCount = unreadMessages?.count || 0;
  const messages = recentMessages?.results || [];

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

      {isLoadingMessages ? (
        <Text size="sm" c="dimmed" ta="center" py="md">Loading messages...</Text>
      ) : messages.length === 0 ? (
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
function FeedbacksSection() {
  // Mock feedbacks data - replace with real API when available
  const mockFeedbacks = [
    {
      id: 1,
      patient: "Abebe Kebede",
      rating: 5,
      comment: "Excellent service! The staff was very professional and the treatment was painless.",
      date: "2024-12-15",
      service: "Root Canal Treatment",
    },
    {
      id: 2,
      patient: "Tigist Alemu",
      rating: 4,
      comment: "Good experience overall. Clean facility and friendly staff.",
      date: "2024-12-14",
      service: "Teeth Cleaning",
    },
    {
      id: 3,
      patient: "Dawit Tadesse",
      rating: 5,
      comment: "Best dental clinic in town! Highly recommend.",
      date: "2024-12-13",
      service: "Orthodontics",
    },
    {
      id: 4,
      patient: "Meron Hailu",
      rating: 4,
      comment: "Very satisfied with the treatment. Will come back for follow-up.",
      date: "2024-12-12",
      service: "Cosmetic Dentistry",
    },
  ];

  const averageRating = mockFeedbacks.reduce((sum, f) => sum + f.rating, 0) / mockFeedbacks.length;

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
            {averageRating.toFixed(1)}
          </Text>
          <Text size="sm" c="dimmed">
            ({mockFeedbacks.length} reviews)
          </Text>
        </Group>
      </Group>

      <Stack gap="md">
        {mockFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="bg-gray-50 border border-gray-200">
            <Group justify="space-between" align="flex-start" mb="xs">
              <div className="flex-1">
                <Group gap="xs" mb={4}>
                  <Text size="sm" fw={600}>
                    {feedback.patient}
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
                  {feedback.service} • {new Date(feedback.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                <Text size="sm" lineClamp={2}>
                  {feedback.comment}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </Stack>

      <Button variant="light" fullWidth mt="md" className="hover:bg-[#19b5af]/10">
        View All Feedbacks
      </Button>
    </Card>
  );
}
