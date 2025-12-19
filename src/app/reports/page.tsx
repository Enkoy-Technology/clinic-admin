"use client";

import {
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
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  TrendingDown,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";

// Mock data
const reportCategories = [
  { title: "Financial Reports", link: "/reports/financial", icon: DollarSign, color: "bg-green-500", description: "Revenue, expenses, and profit analysis" },
  { title: "Patient Statistics", link: "/reports/patient-stats", icon: Users, color: "bg-blue-500", description: "Patient demographics and trends" },
  { title: "Performance Metrics", link: "/reports/performance", icon: BarChart3, color: "bg-purple-500", description: "Staff and service performance" },
];

const quickStats = [
  { label: "Monthly Revenue", value: "ETB 284,500", change: "+12.5%", trend: "up", period: "December 2024" },
  { label: "Total Patients", value: "1,248", change: "+48", trend: "up", period: "This month" },
  { label: "Appointments", value: "342", change: "+15.2%", trend: "up", period: "This month" },
  { label: "Avg. Treatment Cost", value: "ETB 2,850", change: "-3.2%", trend: "down", period: "This month" },
];

const recentReports = [
  { name: "Monthly Financial Summary", type: "Financial", date: "2024-12-16", status: "ready" },
  { name: "Patient Demographics Report", type: "Statistics", date: "2024-12-15", status: "ready" },
  { name: "Staff Performance Review", type: "Performance", date: "2024-12-14", status: "ready" },
  { name: "Service Utilization Report", type: "Performance", date: "2024-12-13", status: "ready" },
];

const topServices = [
  { name: "General Checkup", count: 145, revenue: 72500, percentage: 35 },
  { name: "Teeth Cleaning", count: 128, revenue: 64000, percentage: 30 },
  { name: "Root Canal", count: 45, revenue: 112500, percentage: 20 },
  { name: "Orthodontics", count: 24, revenue: 60000, percentage: 15 },
];

export default function ReportsPage() {
  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Reports & Analytics</Title>
          <Text size="sm" c="dimmed">Track clinic performance and insights</Text>
        </div>
        <Group>
          <Button leftSection={<Calendar size={18} />} variant="light">
            Select Period
          </Button>
          <Button leftSection={<Download size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]">
            Export All
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {quickStats.map((stat, index) => (
          <Card key={index} shadow="sm" p="lg" className="border border-gray-200">
            <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
            <Text size="2xl" fw={700} mb={8}>{stat.value}</Text>
            <Group gap={8}>
              {stat.trend === "up" ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <Text size="sm" fw={500} className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                {stat.change}
              </Text>
              <Text size="xs" c="dimmed">{stat.period}</Text>
            </Group>
          </Card>
        ))}
      </div>

      {/* Report Categories */}
      <Card shadow="sm" p="lg" mb="lg" className="border border-gray-200">
        <Title order={4} mb="md">Report Categories</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportCategories.map((category, index) => (
            <Link key={index} href={category.link}>
              <Card className={`bg-gradient-to-br from-${category.color.split('-')[1]}-50 to-white border border-${category.color.split('-')[1]}-200 hover:shadow-lg transition-all cursor-pointer h-full`}>
                <Group justify="space-between" mb="md">
                  <div className={`${category.color} p-3 rounded-lg`}>
                    <category.icon size={28} className="text-white" />
                  </div>
                  <ArrowRight className="text-gray-400" />
                </Group>
                <Text fw={600} size="lg" mb={8}>{category.title}</Text>
                <Text size="sm" c="dimmed">{category.description}</Text>
              </Card>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Reports */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Recent Reports</Title>
            <Button variant="light" size="sm">View All</Button>
          </Group>

          <Stack gap="md">
            {recentReports.map((report, index) => (
              <Card key={index} className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors cursor-pointer">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={600} mb={4}>{report.name}</Text>
                    <Group gap={8}>
                      <Badge variant="light" color="gray" size="sm">{report.type}</Badge>
                      <Text size="xs" c="dimmed">{report.date}</Text>
                    </Group>
                  </div>
                  <Group>
                    <Badge variant="light" color="green" size="sm">Ready</Badge>
                    <Button size="xs" variant="light" leftSection={<Download size={14} />}>
                      Download
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        {/* Top Services */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Top Services</Title>
            <Text size="xs" c="dimmed">This Month</Text>
          </Group>

          <Stack gap="lg">
            {topServices.map((service, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>{service.name}</Text>
                  <Text size="sm" fw={600}>ETB {service.revenue.toLocaleString()}</Text>
                </Group>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">{service.count} appointments</Text>
                  <Text size="xs" c="dimmed">{service.percentage}%</Text>
                </Group>
                <Progress
                  value={service.percentage}
                  color="teal"
                  size="md"
                  radius="xl"
                />
              </div>
            ))}
          </Stack>
        </Card>
      </div>

      {/* Key Insights */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Key Insights</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border border-green-200">
            <Group gap={8} mb={8}>
              <TrendingUp size={20} className="text-green-600" />
              <Text size="sm" fw={600} className="text-green-800">Revenue Growth</Text>
            </Group>
            <Text size="xs" className="text-green-700">
              Monthly revenue increased by 12.5% compared to last month, driven by increased patient visits.
            </Text>
          </Card>

          <Card className="bg-blue-50 border border-blue-200">
            <Group gap={8} mb={8}>
              <Users size={20} className="text-blue-600" />
              <Text size="sm" fw={600} className="text-blue-800">Patient Growth</Text>
            </Group>
            <Text size="xs" className="text-blue-700">
              48 new patients registered this month. Patient retention rate stands at 87%.
            </Text>
          </Card>

          <Card className="bg-purple-50 border border-purple-200">
            <Group gap={8} mb={8}>
              <BarChart3 size={20} className="text-purple-600" />
              <Text size="sm" fw={600} className="text-purple-800">High Satisfaction</Text>
            </Group>
            <Text size="xs" className="text-purple-700">
              Average patient satisfaction score is 4.9/5.0, with 98% positive feedback rate.
            </Text>
          </Card>
        </div>
      </Card>
    </Box>
  );
}
