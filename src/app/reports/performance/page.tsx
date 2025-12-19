"use client";

import { Avatar, Badge, Box, Button, Card, Group, Progress, Select, Stack, Table, Text, Title } from "@mantine/core";
import { Award, Calendar, Download, Star, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const staffPerformance = [
  { name: "Dr. Hilina Solomon", role: "Dentist", avatar: "https://i.pravatar.cc/100?img=10", patients: 45, rating: 4.9, revenue: 125000, satisfaction: 98 },
  { name: "Dr. John Smith", role: "Dentist", avatar: "https://i.pravatar.cc/100?img=11", patients: 38, rating: 4.8, revenue: 105000, satisfaction: 96 },
  { name: "Sara Ahmed", role: "Hygienist", avatar: "https://i.pravatar.cc/100?img=20", patients: 52, rating: 4.8, revenue: 26000, satisfaction: 97 },
  { name: "Michael Brown", role: "Hygienist", avatar: "https://i.pravatar.cc/100?img=21", patients: 48, rating: 4.7, revenue: 24000, satisfaction: 95 },
];

const servicePerformance = [
  { service: "General Checkup", completed: 145, revenue: 72500, avgTime: "30 min", satisfaction: 4.8 },
  { service: "Root Canal", completed: 45, revenue: 112500, avgTime: "90 min", satisfaction: 4.9 },
  { service: "Teeth Cleaning", completed: 128, revenue: 64000, avgTime: "45 min", satisfaction: 4.7 },
  { service: "Orthodontics", completed: 24, revenue: 60000, avgTime: "60 min", satisfaction: 4.9 },
];

const monthlyMetrics = [
  { month: "Jul", appointments: 328, completed: 315, cancelled: 13, noShow: 0 },
  { month: "Aug", appointments: 352, completed: 340, cancelled: 10, noShow: 2 },
  { month: "Sep", appointments: 342, completed: 330, cancelled: 10, noShow: 2 },
  { month: "Oct", appointments: 365, completed: 355, cancelled: 8, noShow: 2 },
  { month: "Nov", appointments: 358, completed: 348, cancelled: 8, noShow: 2 },
  { month: "Dec", appointments: 342, completed: 330, cancelled: 10, noShow: 2 },
];

export default function PerformanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("december");
  const completionRate = 96.5;
  const avgSatisfaction = 4.8;

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div><Title order={2} className="text-gray-800">Performance Metrics</Title><Text size="sm" c="dimmed">Staff and service performance analytics</Text></div>
        <Group>
          <Select placeholder="Select Period" data={[{ value: "december", label: "December 2024" }, { value: "year", label: "Year 2024" }]} value={selectedPeriod} onChange={setSelectedPeriod} w={180} />
          <Button leftSection={<Download size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]">Export Report</Button>
        </Group>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "Completion Rate", value: `${completionRate}%`, change: "Target: 95%", icon: Award, color: "bg-green-500" },
          { label: "Avg. Satisfaction", value: avgSatisfaction.toString(), change: "Out of 5.0", icon: Star, color: "bg-yellow-500" },
          { label: "Total Appointments", value: "342", change: "+15.2% from last month", icon: Calendar, color: "bg-blue-500" },
          { label: "Active Staff", value: "15", change: "All categories", icon: Users, color: "bg-purple-500" },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between" mb="md"><div className={`${stat.color} p-3 rounded-lg`}><stat.icon size={24} className="text-white" /></div></Group>
            <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
            <Text size="xl" fw={700} mb={4}>{stat.value}</Text>
            <Text size="xs" c="dimmed">{stat.change}</Text>
          </Card>
        ))}
      </div>

      <Card shadow="sm" p="lg" mb="lg" className="border border-gray-200">
        <Group justify="space-between" mb="md"><Title order={4}>Staff Performance</Title><Text size="xs" c="dimmed">December 2024</Text></Group>
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead><Table.Tr><Table.Th>Staff Member</Table.Th><Table.Th>Role</Table.Th><Table.Th>Patients</Table.Th><Table.Th>Rating</Table.Th><Table.Th>Revenue</Table.Th><Table.Th>Satisfaction</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>
            {staffPerformance.map((staff) => (
              <Table.Tr key={staff.name}>
                <Table.Td><Group gap="xs"><Avatar src={staff.avatar} size={40} radius="xl" /><Text size="sm" fw={600}>{staff.name}</Text></Group></Table.Td>
                <Table.Td><Badge variant="light" color="gray">{staff.role}</Badge></Table.Td>
                <Table.Td><Text size="sm" fw={600}>{staff.patients}</Text></Table.Td>
                <Table.Td><Group gap={6}><Star size={16} fill="#fbbf24" className="text-yellow-400" /><Text size="sm" fw={600}>{staff.rating}</Text></Group></Table.Td>
                <Table.Td><Text size="sm" fw={600}>ETB {staff.revenue.toLocaleString()}</Text></Table.Td>
                <Table.Td><Badge variant="light" color="green">{staff.satisfaction}%</Badge></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Service Performance</Title>
          <Table highlightOnHover verticalSpacing="sm" fontSize="sm">
            <Table.Thead><Table.Tr><Table.Th>Service</Table.Th><Table.Th>Completed</Table.Th><Table.Th>Avg. Time</Table.Th><Table.Th>Rating</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {servicePerformance.map((service) => (
                <Table.Tr key={service.service}>
                  <Table.Td><Text size="sm" fw={500}>{service.service}</Text></Table.Td>
                  <Table.Td><Badge variant="light" color="blue">{service.completed}</Badge></Table.Td>
                  <Table.Td><Text size="xs" c="dimmed">{service.avgTime}</Text></Table.Td>
                  <Table.Td><Group gap={4}><Star size={12} fill="#fbbf24" className="text-yellow-400" /><Text size="xs">{service.satisfaction}</Text></Group></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Monthly Trends (Last 6 Months)</Title>
          <Table highlightOnHover verticalSpacing="sm" fontSize="sm">
            <Table.Thead><Table.Tr><Table.Th>Month</Table.Th><Table.Th>Total</Table.Th><Table.Th>Completed</Table.Th><Table.Th>Rate</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {monthlyMetrics.map((month) => {
                const rate = ((month.completed / month.appointments) * 100).toFixed(1);
                return (
                  <Table.Tr key={month.month}>
                    <Table.Td><Text size="sm" fw={500}>{month.month}</Text></Table.Td>
                    <Table.Td><Text size="sm">{month.appointments}</Text></Table.Td>
                    <Table.Td><Badge variant="light" color="green">{month.completed}</Badge></Table.Td>
                    <Table.Td><Text size="sm" fw={600}>{rate}%</Text></Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card>
      </div>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Performance Insights</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border border-green-200">
            <Group gap={8} mb={8}><TrendingUp size={20} className="text-green-600" /><Text size="sm" fw={600} className="text-green-800">High Completion</Text></Group>
            <Text size="xs" className="text-green-700">96.5% completion rate exceeds target. Efficient scheduling and minimal no-shows.</Text>
          </Card>
          <Card className="bg-yellow-50 border border-yellow-200">
            <Group gap={8} mb={8}><Star size={20} className="text-yellow-600" /><Text size="sm" fw={600} className="text-yellow-800">Excellent Ratings</Text></Group>
            <Text size="xs" className="text-yellow-700">All staff maintain ratings above 4.7/5.0, reflecting quality service delivery.</Text>
          </Card>
          <Card className="bg-blue-50 border border-blue-200">
            <Group gap={8} mb={8}><Award size={20} className="text-blue-600" /><Text size="sm" fw={600} className="text-blue-800">Top Performers</Text></Group>
            <Text size="xs" className="text-blue-700">Dr. Hilina leads with 4.9 rating and 98% satisfaction across 45 patients.</Text>
          </Card>
        </div>
      </Card>
    </Box>
  );
}
