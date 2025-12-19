"use client";

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Group,
    Progress,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Clock,
    DollarSign,
    Eye,
    MoreVertical,
    Phone,
    TrendingDown,
    TrendingUp,
    User,
    Users
} from "lucide-react";

// Mock data
const statsData = [
  {
    title: "Today's Appointments",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Calendar,
    color: "bg-blue-500",
  },
  {
    title: "Total Patients",
    value: "1,248",
    change: "+48",
    trend: "up",
    icon: Users,
    color: "bg-green-500",
  },
  {
    title: "Revenue (This Month)",
    value: "ETB 284,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-purple-500",
  },
  {
    title: "Pending Appointments",
    value: "8",
    change: "-3",
    trend: "down",
    icon: Clock,
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

const serviceStats = [
  { name: "General Checkup", count: 45, percentage: 35, color: "blue" },
  { name: "Teeth Cleaning", count: 38, percentage: 30, color: "green" },
  { name: "Root Canal", count: 25, percentage: 20, color: "purple" },
  { name: "Orthodontics", count: 19, percentage: 15, color: "yellow" },
];

const statusColors: Record<string, string> = {
  confirmed: "green",
  pending: "yellow",
  "in-progress": "blue",
  completed: "gray",
};

export default function DashboardPage() {
  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Dashboard</Title>
          <Text size="sm" c="dimmed">Welcome back, Dr. Hilina! Here's what's happening today.</Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<Calendar size={18} />}>
            Schedule
          </Button>
          <Button className="bg-[#19b5af] hover:bg-[#14918c]" leftSection={<User size={18} />}>
            New Patient
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Popular Services */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Popular Services</Title>
            <Text size="sm" c="dimmed">This Month</Text>
          </Group>

          <Stack gap="lg">
            {serviceStats.map((service, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>{service.name}</Text>
                  <Text size="sm" c="dimmed">{service.count} appointments</Text>
                </Group>
                <Progress
                  value={service.percentage}
                  color={service.color}
                  size="md"
                  radius="xl"
                />
              </div>
            ))}
          </Stack>
        </Card>

        {/* Quick Stats */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Quick Stats</Title>
            <ActionIcon variant="light">
              <MoreVertical size={16} />
            </ActionIcon>
          </Group>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 border border-blue-200">
              <Group gap={8} mb={8}>
                <TrendingUp size={20} className="text-blue-600" />
                <Text size="xs" c="dimmed">New Patients</Text>
              </Group>
              <Text size="xl" fw={700} className="text-blue-600">48</Text>
              <Text size="xs" c="dimmed" mt={4}>This month</Text>
            </Card>

            <Card className="bg-green-50 border border-green-200">
              <Group gap={8} mb={8}>
                <Calendar size={20} className="text-green-600" />
                <Text size="xs" c="dimmed">Completed</Text>
              </Group>
              <Text size="xl" fw={700} className="text-green-600">124</Text>
              <Text size="xs" c="dimmed" mt={4}>This month</Text>
            </Card>

            <Card className="bg-purple-50 border border-purple-200">
              <Group gap={8} mb={8}>
                <Phone size={20} className="text-purple-600" />
                <Text size="xs" c="dimmed">Calls Made</Text>
              </Group>
              <Text size="xl" fw={700} className="text-purple-600">89</Text>
              <Text size="xs" c="dimmed" mt={4}>This week</Text>
            </Card>

            <Card className="bg-yellow-50 border border-yellow-200">
              <Group gap={8} mb={8}>
                <TrendingDown size={20} className="text-yellow-600" />
                <Text size="xs" c="dimmed">Cancellations</Text>
              </Group>
              <Text size="xl" fw={700} className="text-yellow-600">12</Text>
              <Text size="xs" c="dimmed" mt={4}>This month</Text>
            </Card>
          </div>

          <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 mt-4">
            <Group justify="space-between" mb={8}>
              <Text size="sm" fw={600} className="text-[#19b5af]">Patient Satisfaction</Text>
              <Text size="xl" fw={700} className="text-[#19b5af]">4.9/5</Text>
            </Group>
            <Progress value={98} color="teal" size="sm" radius="xl" />
            <Text size="xs" c="dimmed" mt={8}>Based on 248 reviews</Text>
          </Card>
        </Card>
      </div>

      {/* Revenue Overview */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={4}>Revenue Overview</Title>
            <Text size="sm" c="dimmed">December 2024</Text>
          </div>
          <Group>
            <Button variant="light" size="sm">Week</Button>
            <Button variant="light" size="sm">Month</Button>
            <Button size="sm" className="bg-[#19b5af] hover:bg-[#14918c]">Year</Button>
          </Group>
        </Group>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Week 1", amount: "ETB 68,500", percentage: 85 },
            { label: "Week 2", amount: "ETB 72,300", percentage: 92 },
            { label: "Week 3", amount: "ETB 65,200", percentage: 78 },
            { label: "Week 4", amount: "ETB 78,500", percentage: 95 },
          ].map((week, index) => (
            <Card key={index} className="bg-gray-50">
              <Text size="xs" c="dimmed" mb={8}>{week.label}</Text>
              <Text size="lg" fw={700} mb={12}>{week.amount}</Text>
              <Progress
                value={week.percentage}
                color="teal"
                size="md"
                radius="xl"
              />
            </Card>
          ))}
        </div>
      </Card>
    </Box>
  );
}
