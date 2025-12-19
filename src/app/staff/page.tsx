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
    Title
} from "@mantine/core";
import {
    ArrowRight,
    Calendar,
    Clock,
    Plus,
    Stethoscope,
    User,
    UserCheck,
    Users
} from "lucide-react";
import Link from "next/link";

// Mock staff data
const staffStats = [
  { role: "Dentists", count: 3, icon: Stethoscope, color: "bg-blue-500", link: "/staff/dentists" },
  { role: "Hygienists", count: 4, icon: UserCheck, color: "bg-green-500", link: "/staff/hygienists" },
  { role: "Assistants", count: 6, icon: User, color: "bg-purple-500", link: "/staff/assistants" },
  { role: "Receptionists", count: 2, icon: Users, color: "bg-yellow-500", link: "/staff/receptionists" },
];

const recentStaff = [
  {
    id: 1,
    name: "Dr. Hilina Solomon",
    role: "Lead Dentist",
    department: "Dentists",
    phone: "+251 910 151 739",
    email: "hilina@clinic.com",
    status: "active",
    shift: "Morning (8AM - 4PM)",
    avatar: "https://i.pravatar.cc/100?img=10",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    role: "Senior Hygienist",
    department: "Hygienists",
    phone: "+251 911 234 567",
    email: "sara@clinic.com",
    status: "active",
    shift: "Full Day (8AM - 6PM)",
    avatar: "https://i.pravatar.cc/100?img=20",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Dental Assistant",
    department: "Assistants",
    phone: "+251 912 345 678",
    email: "john@clinic.com",
    status: "active",
    shift: "Afternoon (12PM - 8PM)",
    avatar: "https://i.pravatar.cc/100?img=30",
  },
  {
    id: 4,
    name: "Marta Bekele",
    role: "Receptionist",
    department: "Receptionists",
    phone: "+251 913 456 789",
    email: "marta@clinic.com",
    status: "on-leave",
    shift: "Morning (8AM - 4PM)",
    avatar: "https://i.pravatar.cc/100?img=40",
  },
];

const attendanceData = [
  { day: "Monday", present: 14, total: 15 },
  { day: "Tuesday", present: 15, total: 15 },
  { day: "Wednesday", present: 13, total: 15 },
  { day: "Thursday", present: 15, total: 15 },
  { day: "Friday", present: 14, total: 15 },
];

const statusColors: Record<string, string> = {
  active: "green",
  "on-leave": "yellow",
  inactive: "gray",
};

export default function StaffPage() {
  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Staff Management</Title>
          <Text size="sm" c="dimmed">Manage your clinic staff and their information</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
        >
          Add Staff Member
        </Button>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {staffStats.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <Card shadow="sm" p="lg" className="border border-gray-200 hover:shadow-lg transition-all cursor-pointer h-full">
              <Group justify="space-between" mb="md">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <ArrowRight className="text-gray-400" size={20} />
              </Group>
              <Text size="sm" c="dimmed" mb={4}>{stat.role}</Text>
              <Text size="xl" fw={700}>{stat.count} staff</Text>
            </Card>
          </Link>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600}>Total Staff</Text>
            <Users size={20} className="text-gray-400" />
          </Group>
          <Text size="2xl" fw={700} mb={4}>15</Text>
          <Group gap={8}>
            <Badge variant="light" color="green" size="sm">14 Active</Badge>
            <Badge variant="light" color="yellow" size="sm">1 On Leave</Badge>
          </Group>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600}>Today's Attendance</Text>
            <Calendar size={20} className="text-gray-400" />
          </Group>
          <Text size="2xl" fw={700} mb={4}>14/15</Text>
          <Progress value={93.3} color="teal" size="md" radius="xl" />
          <Text size="xs" c="dimmed" mt={8}>93.3% attendance rate</Text>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600}>Active Shifts</Text>
            <Clock size={20} className="text-gray-400" />
          </Group>
          <Text size="2xl" fw={700} mb={4}>8</Text>
          <Text size="sm" c="dimmed">Currently working</Text>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Staff Members */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Staff Directory</Title>
            <Link href="/staff/dentists">
              <Button variant="light" size="sm">
                View All
              </Button>
            </Link>
          </Group>

          <Stack gap="md">
            {recentStaff.map((staff) => (
              <Card key={staff.id} className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors">
                <Group justify="space-between">
                  <Group>
                    <Avatar src={staff.avatar} size={50} radius="xl" />
                    <div>
                      <Text size="sm" fw={600}>{staff.name}</Text>
                      <Text size="xs" c="dimmed">{staff.role}</Text>
                    </div>
                  </Group>
                  <Group>
                    <Stack gap={4} className="text-right">
                      <Badge variant="light" color="gray" size="xs">
                        {staff.department}
                      </Badge>
                      <Group gap={6} justify="flex-end">
                        <Clock size={14} className="text-gray-400" />
                        <Text size="xs" c="dimmed">{staff.shift}</Text>
                      </Group>
                    </Stack>
                    <Badge
                      variant="light"
                      color={statusColors[staff.status]}
                      size="sm"
                      className="capitalize"
                    >
                      {staff.status.replace('-', ' ')}
                    </Badge>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        {/* Weekly Attendance */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Weekly Attendance</Title>
          </Group>

          <Stack gap="lg">
            {attendanceData.map((day, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>{day.day}</Text>
                  <Text size="sm" c="dimmed">{day.present}/{day.total}</Text>
                </Group>
                <Progress
                  value={(day.present / day.total) * 100}
                  color="teal"
                  size="md"
                  radius="xl"
                />
              </div>
            ))}
          </Stack>

          <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 mt-6">
            <Text size="sm" fw={600} mb={4}>Weekly Average</Text>
            <Group justify="space-between">
              <Text size="xl" fw={700} className="text-[#19b5af]">94%</Text>
              <Badge variant="light" color="green">
                Excellent
              </Badge>
            </Group>
          </Card>
        </Card>
      </div>

      {/* Quick Access Links */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Quick Access</Title>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Dentists", link: "/staff/dentists", color: "blue", icon: Stethoscope },
            { title: "Hygienists", link: "/staff/hygienists", color: "green", icon: UserCheck },
            { title: "Assistants", link: "/staff/assistants", color: "purple", icon: User },
            { title: "Receptionists", link: "/staff/receptionists", color: "yellow", icon: Users },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <Card className={`bg-${item.color}-50 border border-${item.color}-200 hover:border-${item.color}-500 transition-all cursor-pointer h-full`}>
                <Group justify="space-between">
                  <div>
                    <item.icon size={24} className={`text-${item.color}-600 mb-2`} />
                    <Text fw={600}>{item.title}</Text>
                    <Text size="xs" c="dimmed">Manage team</Text>
                  </div>
                  <ArrowRight className={`text-${item.color}-500`} />
                </Group>
              </Card>
            </Link>
          ))}
        </div>
      </Card>
    </Box>
  );
}
