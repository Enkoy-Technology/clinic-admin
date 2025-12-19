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
  AlertTriangle,
  ArrowRight,
  Box as BoxIcon,
  Package,
  Plus,
  ShoppingCart,
  Wrench
} from "lucide-react";
import Link from "next/link";

// Mock data
const inventoryStats = [
  { category: "Equipment", count: 45, value: "ETB 2,500,000", icon: Wrench, color: "bg-blue-500", link: "/inventory/equipment" },
  { category: "Supplies", count: 234, value: "ETB 450,000", icon: Package, color: "bg-green-500", link: "/inventory/supplies" },
  { category: "Orders", count: 12, value: "ETB 125,000", icon: ShoppingCart, color: "bg-purple-500", link: "/inventory/orders" },
  { category: "Low Stock", count: 18, value: "Action Needed", icon: AlertTriangle, color: "bg-red-500", link: "/inventory/supplies" },
];

const lowStockItems = [
  { name: "Dental Gloves (Medium)", current: 50, minimum: 200, unit: "boxes", category: "Supplies" },
  { name: "Anesthetic Cartridges", current: 25, minimum: 100, unit: "units", category: "Supplies" },
  { name: "Disposable Masks", current: 75, minimum: 300, unit: "boxes", category: "Supplies" },
  { name: "Cotton Rolls", current: 30, minimum: 150, unit: "packs", category: "Supplies" },
  { name: "X-Ray Films", current: 40, minimum: 100, unit: "packs", category: "Supplies" },
];

const recentOrders = [
  { id: "ORD-001", items: "Dental Chair, LED Light", supplier: "MedEquip Ltd", status: "delivered", amount: "ETB 850,000", date: "2024-12-10" },
  { id: "ORD-002", items: "Gloves, Masks, Syringes", supplier: "DentSupply Co", status: "in-transit", amount: "ETB 45,000", date: "2024-12-14" },
  { id: "ORD-003", items: "Autoclave Unit", supplier: "MedTech Solutions", status: "pending", amount: "ETB 320,000", date: "2024-12-15" },
];

const statusColors: Record<string, string> = {
  delivered: "green",
  "in-transit": "blue",
  pending: "yellow",
  cancelled: "red",
};

export default function InventoryPage() {
  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Inventory Management</Title>
          <Text size="sm" c="dimmed">Track and manage clinic equipment and supplies</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
        >
          New Order
        </Button>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {inventoryStats.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <Card shadow="sm" p="lg" className="border border-gray-200 hover:shadow-lg transition-all cursor-pointer h-full">
              <Group justify="space-between" mb="md">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <ArrowRight className="text-gray-400" size={20} />
              </Group>
              <Text size="sm" c="dimmed" mb={4}>{stat.category}</Text>
              <Text size="xl" fw={700} mb={4}>{stat.count} items</Text>
              <Text size="xs" c="dimmed">{stat.value}</Text>
            </Card>
          </Link>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600}>Total Inventory Value</Text>
            <BoxIcon size={20} className="text-gray-400" />
          </Group>
          <Text size="2xl" fw={700} mb={4}>ETB 2,950,000</Text>
          <Text size="sm" c="dimmed">Equipment + Supplies</Text>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600}>Monthly Spending</Text>
            <ShoppingCart size={20} className="text-gray-400" />
          </Group>
          <Text size="2xl" fw={700} mb={4}>ETB 125,000</Text>
          <Text size="sm" c="dimmed">December 2024</Text>
        </Card>

        <Card shadow="sm" p="lg" className="border border-gray-200 border-red-300 bg-red-50">
          <Group justify="space-between" mb="md">
            <Text size="sm" fw={600} className="text-red-700">Low Stock Alerts</Text>
            <AlertTriangle size={20} className="text-red-500" />
          </Group>
          <Text size="2xl" fw={700} mb={4} className="text-red-700">{lowStockItems.length}</Text>
          <Text size="sm" className="text-red-600">Requires immediate attention</Text>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Low Stock Items */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={4}>Low Stock Items</Title>
              <Text size="sm" c="dimmed">Items below minimum threshold</Text>
            </div>
            <Link href="/inventory/supplies">
              <Button variant="light" size="sm">
                View All
              </Button>
            </Link>
          </Group>

          <Stack gap="md">
            {lowStockItems.map((item, index) => (
              <Card key={index} className="bg-red-50 border border-red-200">
                <Group justify="space-between" mb={8}>
                  <div>
                    <Text size="sm" fw={600}>{item.name}</Text>
                    <Text size="xs" c="dimmed">{item.category}</Text>
                  </div>
                  <Badge variant="light" color="red" size="sm">
                    Low Stock
                  </Badge>
                </Group>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">
                    Current: {item.current} {item.unit}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Minimum: {item.minimum} {item.unit}
                  </Text>
                </Group>
                <Progress
                  value={(item.current / item.minimum) * 100}
                  color="red"
                  size="sm"
                  radius="xl"
                />
                <Group justify="flex-end" mt={8}>
                  <Button size="xs" variant="light" color="red">
                    Order Now
                  </Button>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        {/* Recent Orders */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Recent Orders</Title>
          </Group>

          <Stack gap="md">
            {recentOrders.map((order, index) => (
              <Card key={index} className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors">
                <Group justify="space-between" mb={8}>
                  <Badge variant="light" color="gray">{order.id}</Badge>
                  <Badge
                    variant="light"
                    color={statusColors[order.status]}
                    size="sm"
                    className="capitalize"
                  >
                    {order.status.replace('-', ' ')}
                  </Badge>
                </Group>
                <Text size="sm" fw={500} mb={4}>{order.items}</Text>
                <Text size="xs" c="dimmed" mb={4}>{order.supplier}</Text>
                <Group justify="space-between">
                  <Text size="xs" fw={600}>{order.amount}</Text>
                  <Text size="xs" c="dimmed">{order.date}</Text>
                </Group>
              </Card>
            ))}
          </Stack>

          <Link href="/inventory/orders">
            <Button variant="light" fullWidth mt="md" className="hover:bg-[#19b5af]/10">
              View All Orders
            </Button>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Quick Actions</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Manage Equipment", link: "/inventory/equipment", color: "blue", icon: Wrench, description: "View and update equipment" },
            { title: "Manage Supplies", link: "/inventory/supplies", color: "green", icon: Package, description: "Track consumables and supplies" },
            { title: "Purchase Orders", link: "/inventory/orders", color: "purple", icon: ShoppingCart, description: "Create and track orders" },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <Card className={`bg-${item.color}-50 border border-${item.color}-200 hover:border-${item.color}-500 transition-all cursor-pointer h-full`}>
                <Group justify="space-between">
                  <div>
                    <item.icon size={24} className={`text-${item.color}-600 mb-2`} />
                    <Text fw={600} mb={4}>{item.title}</Text>
                    <Text size="xs" c="dimmed">{item.description}</Text>
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
