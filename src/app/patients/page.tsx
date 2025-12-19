"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import {
  ArrowRight,
  Calendar,
  FileText,
  Phone,
  Plus,
  Search,
  TrendingUp,
  Users,
  UserPlus
} from "lucide-react";
import Link from "next/link";

// Mock data
const recentPatients = [
  {
    id: 1,
    name: "Abebe Kebede",
    phone: "+251 911 234 567",
    lastVisit: "Dec 15, 2024",
    nextAppointment: "Dec 20, 2024",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Tigist Alemu",
    phone: "+251 912 345 678",
    lastVisit: "Dec 14, 2024",
    nextAppointment: "Dec 18, 2024",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Dawit Tadesse",
    phone: "+251 913 456 789",
    lastVisit: "Dec 10, 2024",
    nextAppointment: null,
    status: "inactive",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    name: "Meron Hailu",
    phone: "+251 914 567 890",
    lastVisit: "Dec 16, 2024",
    nextAppointment: "Dec 22, 2024",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
];

const ageGroups = [
  { range: "0-18", count: 245, percentage: 20 },
  { range: "19-35", count: 420, percentage: 34 },
  { range: "36-50", count: 380, percentage: 30 },
  { range: "51+", count: 203, percentage: 16 },
];

export default function PatientsPage() {
  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Patients</Title>
          <Text size="sm" c="dimmed">Manage patient information and records</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
        >
          Add New Patient
        </Button>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          {
            title: "Total Patients",
            value: "1,248",
            change: "+48 this month",
            icon: Users,
            color: "bg-blue-500",
          },
          {
            title: "New This Month",
            value: "48",
            change: "+12% from last month",
            icon: UserPlus,
            color: "bg-green-500",
          },
          {
            title: "Active Patients",
            value: "892",
            change: "71% of total",
            icon: TrendingUp,
            color: "bg-purple-500",
          },
          {
            title: "Records Updated",
            value: "124",
            change: "This week",
            icon: FileText,
            color: "bg-yellow-500",
          },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="lg" className="border border-gray-200">
            <Group justify="space-between" mb="md">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </Group>
            <Text size="sm" c="dimmed" mb={4}>{stat.title}</Text>
            <Text size="xl" fw={700} mb={4}>{stat.value}</Text>
            <Text size="xs" c="dimmed">{stat.change}</Text>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card shadow="sm" p="lg" mb="lg" className="border border-gray-200">
        <Title order={4} mb="md">Quick Actions</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/patients/list">
            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 hover:border-[#19b5af] transition-all cursor-pointer h-full">
              <Group justify="space-between">
                <div>
                  <Text fw={600} mb={4}>View All Patients</Text>
                  <Text size="sm" c="dimmed">Browse complete patient directory</Text>
                </div>
                <ArrowRight className="text-[#19b5af]" />
              </Group>
            </Card>
          </Link>
          <Link href="/patients/records">
            <Card className="bg-blue-50 border border-blue-200 hover:border-blue-500 transition-all cursor-pointer h-full">
              <Group justify="space-between">
                <div>
                  <Text fw={600} mb={4}>Medical Records</Text>
                  <Text size="sm" c="dimmed">Access patient medical records</Text>
                </div>
                <ArrowRight className="text-blue-500" />
              </Group>
            </Card>
          </Link>
          <Link href="/patients/treatment-plans">
            <Card className="bg-purple-50 border border-purple-200 hover:border-purple-500 transition-all cursor-pointer h-full">
              <Group justify="space-between">
                <div>
                  <Text fw={600} mb={4}>Treatment Plans</Text>
                  <Text size="sm" c="dimmed">Manage treatment plans</Text>
                </div>
                <ArrowRight className="text-purple-500" />
              </Group>
            </Card>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Patients */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Recent Patients</Title>
            <Link href="/patients/list">
              <Button variant="light" size="sm">
                View All
              </Button>
            </Link>
          </Group>

          <Stack gap="md">
            {recentPatients.map((patient) => (
              <Card key={patient.id} className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors">
                <Group justify="space-between">
                  <Group>
                    <Avatar src={patient.avatar} size={50} radius="xl" />
                    <div>
                      <Text size="sm" fw={600}>{patient.name}</Text>
                      <Group gap={6}>
                        <Phone size={14} className="text-gray-400" />
                        <Text size="xs" c="dimmed">{patient.phone}</Text>
                      </Group>
                    </div>
                  </Group>
                  <Group>
                    <div className="text-right">
                      <Text size="xs" c="dimmed">Last Visit</Text>
                      <Text size="xs" fw={500}>{patient.lastVisit}</Text>
                    </div>
                    {patient.nextAppointment ? (
                      <div className="text-right">
                        <Text size="xs" c="dimmed">Next</Text>
                        <Text size="xs" fw={500} className="text-[#19b5af]">
                          {patient.nextAppointment}
                        </Text>
                      </div>
                    ) : (
                      <Badge variant="light" color="gray" size="sm">
                        No upcoming
                      </Badge>
                    )}
                    <Badge
                      variant="light"
                      color={patient.status === "active" ? "green" : "gray"}
                      size="sm"
                      className="capitalize"
                    >
                      {patient.status}
                    </Badge>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        {/* Patient Demographics */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Age Distribution</Title>
          </Group>

          <Stack gap="lg">
            {ageGroups.map((group, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>{group.range} years</Text>
                  <Group gap={8}>
                    <Text size="sm" c="dimmed">{group.count}</Text>
                    <Text size="xs" c="dimmed">({group.percentage}%)</Text>
                  </Group>
                </Group>
                <Progress
                  value={group.percentage}
                  color="teal"
                  size="md"
                  radius="xl"
                />
              </div>
            ))}
          </Stack>

          <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 mt-6">
            <Text size="sm" fw={600} mb={4}>Gender Distribution</Text>
            <Group justify="space-between" mb={8}>
              <Text size="xs" c="dimmed">Female</Text>
              <Text size="sm" fw={600}>52%</Text>
            </Group>
            <Progress value={52} color="pink" size="sm" radius="xl" mb="sm" />
            <Group justify="space-between" mb={8}>
              <Text size="xs" c="dimmed">Male</Text>
              <Text size="sm" fw={600}>48%</Text>
            </Group>
            <Progress value={48} color="blue" size="sm" radius="xl" />
          </Card>
        </Card>
      </div>

      {/* Search Section */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Find a Patient</Title>
        <Group>
          <TextInput
            placeholder="Search by name, phone, or patient ID..."
            leftSection={<Search size={16} />}
            className="flex-1"
            size="md"
          />
          <Button size="md" className="bg-[#19b5af] hover:bg-[#14918c]">
            Search
          </Button>
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          Tip: Use patient ID for faster search results
        </Text>
      </Card>
    </Box>
  );
}
