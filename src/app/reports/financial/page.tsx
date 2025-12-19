"use client";

import { Badge, Box, Button, Card, Group, Progress, Select, Stack, Table, Text, Title } from "@mantine/core";
import { DollarSign, Download, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const monthlyData = [
  { month: "January", revenue: 245000, expenses: 125000, profit: 120000, patients: 98, appointments: 285 },
  { month: "February", revenue: 268000, expenses: 130000, profit: 138000, patients: 105, appointments: 312 },
  { month: "March", revenue: 252000, expenses: 128000, profit: 124000, patients: 102, appointments: 298 },
  { month: "April", revenue: 275000, expenses: 135000, profit: 140000, patients: 110, appointments: 325 },
  { month: "May", revenue: 290000, expenses: 142000, profit: 148000, patients: 118, appointments: 348 },
  { month: "June", revenue: 285000, expenses: 140000, profit: 145000, patients: 115, appointments: 338 },
  { month: "July", revenue: 278000, expenses: 138000, profit: 140000, patients: 112, appointments: 328 },
  { month: "August", revenue: 295000, expenses: 145000, profit: 150000, patients: 120, appointments: 352 },
  { month: "September", revenue: 288000, expenses: 143000, profit: 145000, patients: 116, appointments: 342 },
  { month: "October", revenue: 302000, expenses: 148000, profit: 154000, patients: 125, appointments: 365 },
  { month: "November", revenue: 298000, expenses: 147000, profit: 151000, patients: 122, appointments: 358 },
  { month: "December", revenue: 284500, expenses: 142000, profit: 142500, patients: 118, appointments: 342 },
];

const expenseBreakdown = [
  { category: "Salaries & Wages", amount: 85000, percentage: 60 },
  { category: "Supplies & Materials", amount: 28000, percentage: 20 },
  { category: "Equipment Maintenance", amount: 14000, percentage: 10 },
  { category: "Utilities & Rent", amount: 10000, percentage: 7 },
  { category: "Other Expenses", amount: 5000, percentage: 3 },
];

const revenueByService = [
  { service: "General Checkup", revenue: 72500, appointments: 145, avgCost: 500 },
  { service: "Root Canal Treatment", revenue: 112500, appointments: 45, avgCost: 2500 },
  { service: "Teeth Cleaning", revenue: 64000, appointments: 128, avgCost: 500 },
  { service: "Orthodontics", revenue: 60000, appointments: 24, avgCost: 2500 },
  { service: "Cosmetic Dentistry", revenue: 45000, appointments: 15, avgCost: 3000 },
  { service: "Other Services", revenue: 30500, appointments: 85, avgCost: 359 },
];

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>("december");

  const currentMonth = monthlyData[11]!;
  const previousMonth = monthlyData[10]!;
  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const profitChange = ((currentMonth.profit - previousMonth.profit) / previousMonth.profit * 100).toFixed(1);
  const yearlyRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const yearlyProfit = monthlyData.reduce((sum, m) => sum + m.profit, 0);

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div><Title order={2} className="text-gray-800">Financial Reports</Title><Text size="sm" c="dimmed">Revenue, expenses, and profit analysis</Text></div>
        <Group>
          <Select placeholder="Select Period" data={[{ value: "december", label: "December 2024" }, { value: "november", label: "November 2024" }, { value: "q4", label: "Q4 2024" }, { value: "year", label: "Year 2024" }]} value={selectedPeriod} onChange={setSelectedPeriod} w={180} />
          <Button leftSection={<Download size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]">Export Report</Button>
        </Group>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "Monthly Revenue", value: `ETB ${currentMonth.revenue.toLocaleString()}`, change: `${revenueChange}%`, trend: parseFloat(revenueChange) > 0, icon: DollarSign, color: "bg-green-500" },
          { label: "Monthly Expenses", value: `ETB ${currentMonth.expenses.toLocaleString()}`, change: "60% of revenue", trend: true, icon: DollarSign, color: "bg-red-500" },
          { label: "Monthly Profit", value: `ETB ${currentMonth.profit.toLocaleString()}`, change: `${profitChange}%`, trend: parseFloat(profitChange) > 0, icon: DollarSign, color: "bg-blue-500" },
          { label: "Profit Margin", value: `${((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%`, change: "Target: 50%", trend: true, icon: TrendingUp, color: "bg-purple-500" },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between" mb="md"><div className={`${stat.color} p-3 rounded-lg`}><stat.icon size={24} className="text-white" /></div></Group>
            <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
            <Text size="xl" fw={700} mb={4}>{stat.value}</Text>
            <Group gap={6}>{stat.trend ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}<Text size="xs" c="dimmed">{stat.change}</Text></Group>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Monthly Performance (2024)</Title>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead><Table.Tr><Table.Th>Month</Table.Th><Table.Th>Revenue</Table.Th><Table.Th>Expenses</Table.Th><Table.Th>Profit</Table.Th><Table.Th>Margin</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {monthlyData.slice(-6).map((month) => (
                <Table.Tr key={month.month}>
                  <Table.Td><Text size="sm" fw={500}>{month.month}</Text></Table.Td>
                  <Table.Td><Text size="sm">ETB {(month.revenue / 1000).toFixed(0)}K</Text></Table.Td>
                  <Table.Td><Text size="sm">ETB {(month.expenses / 1000).toFixed(0)}K</Text></Table.Td>
                  <Table.Td><Text size="sm" fw={600} className="text-green-600">ETB {(month.profit / 1000).toFixed(0)}K</Text></Table.Td>
                  <Table.Td><Text size="sm">{((month.profit / month.revenue) * 100).toFixed(1)}%</Text></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 mt-4">
            <Group justify="space-between"><div><Text size="sm" fw={600}>Yearly Total (2024)</Text><Text size="xs" c="dimmed">All 12 months</Text></div><div className="text-right"><Text size="lg" fw={700}>ETB {(yearlyRevenue / 1000000).toFixed(2)}M</Text><Text size="xs" c="dimmed">Revenue</Text></div></Group>
          </Card>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Title order={4} mb="md">Expense Breakdown</Title>
          <Stack gap="lg">
            {expenseBreakdown.map((expense, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}><Text size="sm" fw={500}>{expense.category}</Text><Group gap={8}><Text size="sm" fw={600}>ETB {expense.amount.toLocaleString()}</Text><Badge variant="light" color="gray" size="sm">{expense.percentage}%</Badge></Group></Group>
                <Progress value={expense.percentage} color="red" size="md" radius="xl" />
              </div>
            ))}
          </Stack>
          <Card className="bg-gray-50 mt-4">
            <Group justify="space-between"><Text size="sm" fw={600}>Total Monthly Expenses</Text><Text size="lg" fw={700}>ETB {currentMonth.expenses.toLocaleString()}</Text></Group>
          </Card>
        </Card>
      </div>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Group justify="space-between" mb="md"><Title order={4}>Revenue by Service</Title><Text size="xs" c="dimmed">December 2024</Text></Group>
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead><Table.Tr><Table.Th>Service</Table.Th><Table.Th>Revenue</Table.Th><Table.Th>Appointments</Table.Th><Table.Th>Avg. Cost</Table.Th><Table.Th>% of Total</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>
            {revenueByService.map((service) => {
              const percentage = ((service.revenue / currentMonth.revenue) * 100).toFixed(1);
              return (
                <Table.Tr key={service.service}>
                  <Table.Td><Text size="sm" fw={500}>{service.service}</Text></Table.Td>
                  <Table.Td><Text size="sm" fw={600}>ETB {service.revenue.toLocaleString()}</Text></Table.Td>
                  <Table.Td><Badge variant="light" color="blue">{service.appointments}</Badge></Table.Td>
                  <Table.Td><Text size="sm">ETB {service.avgCost.toLocaleString()}</Text></Table.Td>
                  <Table.Td><Badge variant="light" color="teal">{percentage}%</Badge></Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}
