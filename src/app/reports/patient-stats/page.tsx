"use client";

import { Badge, Box, Button, Card, Group, Progress, Select, Stack, Table, Text, Title } from "@mantine/core";
import { Calendar, Download, TrendingUp, Users, UserPlus } from "lucide-react";
import { useState } from "react";

const ageGroups = [
  { range: "0-18", count: 245, percentage: 20, newThisMonth: 8 },
  { range: "19-35", count: 420, percentage: 34, newThisMonth: 18 },
  { range: "36-50", count: 380, percentage: 30, newThisMonth: 12 },
  { range: "51+", count: 203, percentage: 16, newThisMonth: 10 },
];

const monthlyPatients = [
  { month: "Jan", new: 42, returning: 56, total: 98 },
  { month: "Feb", new: 48, returning: 57, total: 105 },
  { month: "Mar", new: 45, returning: 57, total: 102 },
  { month: "Apr", new: 52, returning: 58, total: 110 },
  { month: "May", new: 56, returning: 62, total: 118 },
  { month: "Jun", new: 53, returning: 62, total: 115 },
  { month: "Jul", new: 50, returning: 62, total: 112 },
  { month: "Aug", new: 58, returning: 62, total: 120 },
  { month: "Sep", new: 54, returning: 62, total: 116 },
  { month: "Oct", new: 60, returning: 65, total: 125 },
  { month: "Nov", new: 57, returning: 65, total: 122 },
  { month: "Dec", new: 48, returning: 70, total: 118 },
];

const topTreatments = [
  { treatment: "General Checkup", count: 145, patients: 128 },
  { treatment: "Teeth Cleaning", count: 128, patients: 115 },
  { treatment: "Root Canal", count: 45, patients: 45 },
  { treatment: "Orthodontics", count: 24, patients: 18 },
  { treatment: "Cosmetic Dentistry", count: 15, patients: 14 },
];

export default function PatientStatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("december");
  const totalPatients = 1248;
  const newThisMonth = 48;
  const retentionRate = 87;

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div><Title order={2} className="text-gray-800">Patient Statistics</Title><Text size="sm" c="dimmed">Patient demographics and trends</Text></div>
        <Group>
          <Select placeholder="Select Period" data={[{ value: "december", label: "December 2024" }, { value: "year", label: "Year 2024" }]} value={selectedPeriod} onChange={setSelectedPeriod} w={180} />
          <Button leftSection={<Download size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]">Export Report</Button>
        </Group>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "Total Patients", value: totalPatients.toString(), change: "+48 this month", icon: Users, color: "bg-blue-500" },
          { label: "New Patients", value: newThisMonth.toString(), change: "+12% from last month", icon: UserPlus, color: "bg-green-500" },
          { label: "Active Patients", value: "892", change: "71% of total", icon: Users, color: "bg-purple-500" },
          { label: "Retention Rate", value: `${retentionRate}%`, change: "Above target", icon: TrendingUp, color: "bg-yellow-500" },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between" mb="md"><div className={`${stat.color} p-3 rounded-lg`}><stat.icon size={24} className="text-white" /></div></Group>
            <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
            <Text size="xl" fw={700} mb={4}>{stat.value}</Text>
            <Text size="xs" c="dimmed">{stat.change}</Text>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Age Distribution</Title>
          <Stack gap="lg">
            {ageGroups.map((group, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>{group.range} years</Text>
                  <Group gap={8}>
                    <Text size="sm" fw={600}>{group.count} patients</Text>
                    <Badge variant="light" color="green" size="xs">+{group.newThisMonth} new</Badge>
                  </Group>
                </Group>
                <Group justify="space-between" mb={4}><Text size="xs" c="dimmed">{group.percentage}% of total</Text></Group>
                <Progress value={group.percentage} color="blue" size="md" radius="xl" />
              </div>
            ))}
          </Stack>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Gender Distribution</Title>
          <Stack gap="lg">
            <div>
              <Group justify="space-between" mb={8}><Text size="sm" fw={500}>Female</Text><Text size="sm" fw={600}>649 patients</Text></Group>
              <Group justify="space-between" mb={4}><Text size="xs" c="dimmed">52% of total</Text></Group>
              <Progress value={52} color="pink" size="md" radius="xl" />
            </div>
            <div>
              <Group justify="space-between" mb={8}><Text size="sm" fw={500}>Male</Text><Text size="sm" fw={600}>599 patients</Text></Group>
              <Group justify="space-between" mb={4}><Text size="xs" c="dimmed">48% of total</Text></Group>
              <Progress value={48} color="blue" size="md" radius="xl" />
            </div>
          </Stack>
          <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 mt-6">
            <Text size="sm" fw={600} mb={4}>Patient Satisfaction</Text>
            <Group justify="space-between"><Text size="2xl" fw={700} className="text-[#19b5af]">4.9/5.0</Text><Badge variant="light" color="green" size="lg">Excellent</Badge></Group>
            <Progress value={98} color="teal" size="sm" radius="xl" mt="md" />
          </Card>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Monthly Patient Trends (2024)</Title>
          <Table highlightOnHover verticalSpacing="sm" fontSize="sm">
            <Table.Thead><Table.Tr><Table.Th>Month</Table.Th><Table.Th>New</Table.Th><Table.Th>Returning</Table.Th><Table.Th>Total</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {monthlyPatients.slice(-6).map((month) => (
                <Table.Tr key={month.month}>
                  <Table.Td><Text size="sm" fw={500}>{month.month}</Text></Table.Td>
                  <Table.Td><Badge variant="light" color="green" size="sm">{month.new}</Badge></Table.Td>
                  <Table.Td><Badge variant="light" color="blue" size="sm">{month.returning}</Badge></Table.Td>
                  <Table.Td><Text size="sm" fw={600}>{month.total}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Top Treatments</Title>
          <Table highlightOnHover verticalSpacing="sm" fontSize="sm">
            <Table.Thead><Table.Tr><Table.Th>Treatment</Table.Th><Table.Th>Visits</Table.Th><Table.Th>Patients</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {topTreatments.map((treatment) => (
                <Table.Tr key={treatment.treatment}>
                  <Table.Td><Text size="sm" fw={500}>{treatment.treatment}</Text></Table.Td>
                  <Table.Td><Badge variant="light" color="blue">{treatment.count}</Badge></Table.Td>
                  <Table.Td><Text size="sm">{treatment.patients}</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </div>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Key Insights</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border border-green-200">
            <Text size="sm" fw={600} className="text-green-800" mb={4}>Growing Patient Base</Text>
            <Text size="xs" className="text-green-700">48 new patients registered this month, indicating strong growth and positive word-of-mouth.</Text>
          </Card>
          <Card className="bg-blue-50 border border-blue-200">
            <Text size="sm" fw={600} className="text-blue-800" mb={4}>High Retention</Text>
            <Text size="xs" className="text-blue-700">87% patient retention rate shows excellent service quality and patient satisfaction.</Text>
          </Card>
          <Card className="bg-purple-50 border border-purple-200">
            <Text size="sm" fw={600} className="text-purple-800" mb={4}>Balanced Demographics</Text>
            <Text size="xs" className="text-purple-700">Well-distributed age groups ensure diverse revenue streams and sustainable growth.</Text>
          </Card>
        </div>
      </Card>
    </Box>
  );
}
