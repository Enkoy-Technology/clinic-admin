"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Menu,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MoreVertical,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  X
} from "lucide-react";
import { useState } from "react";

const mockOrders = [
  { id: "ORD-001", orderDate: "2024-12-10", supplier: "MedEquip Ltd", items: "Dental Chair, LED Light", itemCount: 2, totalAmount: 850000, status: "delivered", deliveryDate: "2024-12-15", trackingNumber: "ME-2024-1001", paymentStatus: "paid" },
  { id: "ORD-002", orderDate: "2024-12-14", supplier: "DentSupply Co", items: "Gloves (500 boxes), Masks (300 boxes), Syringes (50 units)", itemCount: 3, totalAmount: 45000, status: "in-transit", deliveryDate: "2024-12-18", trackingNumber: "DS-2024-2045", paymentStatus: "paid" },
  { id: "ORD-003", orderDate: "2024-12-15", supplier: "MedTech Solutions", items: "Autoclave Sterilizer Unit", itemCount: 1, totalAmount: 320000, status: "pending", deliveryDate: "2024-12-22", trackingNumber: "MT-2024-3087", paymentStatus: "pending" },
  { id: "ORD-004", orderDate: "2024-12-12", supplier: "PharmaDent", items: "Anesthetic Cartridges (200 units)", itemCount: 1, totalAmount: 17000, status: "delivered", deliveryDate: "2024-12-14", trackingNumber: "PD-2024-4521", paymentStatus: "paid" },
  { id: "ORD-005", orderDate: "2024-12-16", supplier: "DentalMaterials Inc", items: "Composite Resin (20 units), Bonding Agent (10 units)", itemCount: 2, totalAmount: 58000, status: "processing", deliveryDate: "2024-12-20", trackingNumber: "DM-2024-5672", paymentStatus: "paid" },
];

const statusColors: Record<string, string> = {
  pending: "yellow",
  processing: "blue",
  "in-transit": "cyan",
  delivered: "green",
  cancelled: "red",
};

const paymentColors: Record<string, string> = {
  paid: "green",
  pending: "yellow",
  overdue: "red",
};

export default function OrdersPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(o => o.status === "pending" || o.status === "processing").length;
  const deliveredOrders = mockOrders.filter(o => o.status === "delivered").length;
  const totalValue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Purchase Orders</Title>
          <Text size="sm" c="dimmed">Manage and track purchase orders</Text>
        </div>
        <Button leftSection={<Plus size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]" onClick={open}>New Order</Button>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, color: "bg-blue-500" },
          { label: "Pending", value: pendingOrders.toString(), icon: Clock, color: "bg-yellow-500" },
          { label: "Delivered", value: deliveredOrders.toString(), icon: CheckCircle2, color: "bg-green-500" },
          { label: "Total Value", value: `ETB ${(totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: "bg-purple-500" },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between">
              <div><Text size="sm" c="dimmed" mb={4}>{stat.label}</Text><Text size="xl" fw={700}>{stat.value}</Text></div>
              <div className={`${stat.color} p-3 rounded-lg`}><stat.icon size={24} className="text-white" /></div>
            </Group>
          </Card>
        ))}
      </div>

      <Card shadow="sm" p="md" mb="md" className="border border-gray-200">
        <Group>
          <TextInput placeholder="Search by order ID or supplier..." leftSection={<Search size={16} />} value={searchQuery} onChange={(e) => setSearchQuery(e.currentTarget.value)} className="flex-1" />
          <Select placeholder="Status" data={[{ value: "all", label: "All Status" }, { value: "pending", label: "Pending" }, { value: "processing", label: "Processing" }, { value: "in-transit", label: "In Transit" }, { value: "delivered", label: "Delivered" }]} value={statusFilter} onChange={setStatusFilter} clearable w={150} />
        </Group>
      </Card>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Supplier</Table.Th>
              <Table.Th>Items</Table.Th>
              <Table.Th>Order Date</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Payment</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredOrders.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={600} className="font-mono">{order.id}</Text>
                    <Text size="xs" c="dimmed">{order.trackingNumber}</Text>
                  </div>
                </Table.Td>
                <Table.Td><Text size="sm">{order.supplier}</Text></Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm" lineClamp={1}>{order.items}</Text>
                    <Badge variant="light" color="gray" size="xs">{order.itemCount} items</Badge>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Group gap={6}><Calendar size={14} className="text-gray-400" /><Text size="xs">{order.orderDate}</Text></Group>
                    <Group gap={6}><Truck size={14} className="text-gray-400" /><Text size="xs">ETA: {order.deliveryDate}</Text></Group>
                  </Stack>
                </Table.Td>
                <Table.Td><Text size="sm" fw={600}>ETB {order.totalAmount.toLocaleString()}</Text></Table.Td>
                <Table.Td><Badge variant="light" color={paymentColors[order.paymentStatus]} size="sm" className="capitalize">{order.paymentStatus}</Badge></Table.Td>
                <Table.Td><Badge variant="light" color={statusColors[order.status]} size="sm" className="capitalize">{order.status.replace('-', ' ')}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => { setSelectedOrder(order); openView(); }}><Eye size={16} /></ActionIcon>
                    <ActionIcon variant="light" color="teal" onClick={() => { setSelectedOrder(order); open(); }}><Edit size={16} /></ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target><ActionIcon variant="light" color="gray"><MoreVertical size={16} /></ActionIcon></Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Truck size={16} />}>Track Shipment</Menu.Item>
                        <Menu.Item leftSection={<Package size={16} />}>Mark as Received</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<X size={16} />} color="red">Cancel Order</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal opened={opened} onClose={() => { close(); setSelectedOrder(null); }} title={<Text fw={600} size="lg">{selectedOrder ? "Edit Order" : "New Purchase Order"}</Text>} size="lg">
        <Stack gap="md">
          <Select label="Supplier" placeholder="Select supplier" required data={["MedEquip Ltd", "DentSupply Co", "MedTech Solutions", "PharmaDent", "DentalMaterials Inc"]} defaultValue={selectedOrder?.supplier} />
          <Textarea label="Order Items" placeholder="List items to order..." required rows={3} defaultValue={selectedOrder?.items} />
          <Group grow>
            <TextInput label="Item Count" placeholder="Number of items" type="number" required defaultValue={selectedOrder?.itemCount} />
            <TextInput label="Total Amount (ETB)" placeholder="0" type="number" required leftSection={<DollarSign size={16} />} defaultValue={selectedOrder?.totalAmount} />
          </Group>
          <Group grow>
            <DatePickerInput label="Order Date" placeholder="Select date" required leftSection={<Calendar size={16} />} />
            <DatePickerInput label="Expected Delivery" placeholder="Select date" leftSection={<Truck size={16} />} />
          </Group>
          <TextInput label="Tracking Number" placeholder="e.g., ME-2024-1001" defaultValue={selectedOrder?.trackingNumber} />
          <Group grow>
            <Select label="Order Status" placeholder="Select status" required data={[{ value: "pending", label: "Pending" }, { value: "processing", label: "Processing" }, { value: "in-transit", label: "In Transit" }, { value: "delivered", label: "Delivered" }]} defaultValue={selectedOrder?.status} />
            <Select label="Payment Status" placeholder="Select status" required data={[{ value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }]} defaultValue={selectedOrder?.paymentStatus} />
          </Group>
          <Textarea label="Notes" placeholder="Additional notes..." rows={2} />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => { close(); setSelectedOrder(null); }}>Cancel</Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">{selectedOrder ? "Update" : "Create"} Order</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={viewModalOpened} onClose={closeView} title={<Text fw={600} size="lg">Order Details</Text>} size="md">
        {selectedOrder && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="lg" fw={600} className="font-mono">{selectedOrder.id}</Text>
                <Text size="sm" c="dimmed">Tracking: {selectedOrder.trackingNumber}</Text>
              </div>
              <Badge variant="light" color={statusColors[selectedOrder.status]} size="lg" className="capitalize">{selectedOrder.status.replace('-', ' ')}</Badge>
            </Group>
            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20">
              <Group justify="space-between">
                <div><Text size="sm" fw={600}>Total Amount</Text><Text size="2xl" fw={700} className="text-[#19b5af]">ETB {selectedOrder.totalAmount.toLocaleString()}</Text></div>
                <div className="text-right"><Text size="sm" fw={600}>Payment</Text><Badge variant="light" color={paymentColors[selectedOrder.paymentStatus]} className="capitalize" mt={4}>{selectedOrder.paymentStatus}</Badge></div>
              </Group>
            </Card>
            <div><Text size="sm" fw={600} mb={8}>Supplier</Text><Text size="sm">{selectedOrder.supplier}</Text></div>
            <div><Text size="sm" fw={600} mb={8}>Order Items</Text><Card className="bg-gray-50"><Text size="sm">{selectedOrder.items}</Text><Badge variant="light" color="gray" size="sm" mt={8}>{selectedOrder.itemCount} items</Badge></Card></div>
            <div><Text size="sm" fw={600} mb={8}>Timeline</Text><Stack gap={8}><Group justify="space-between"><Text size="sm" c="dimmed">Order Date:</Text><Text size="sm">{selectedOrder.orderDate}</Text></Group><Group justify="space-between"><Text size="sm" c="dimmed">Expected Delivery:</Text><Text size="sm" fw={600} className="text-[#19b5af]">{selectedOrder.deliveryDate}</Text></Group></Stack></div>
            {selectedOrder.status !== "delivered" && (
              <Card className="bg-blue-50 border border-blue-200">
                <Group gap={8}>
                  <Truck size={20} className="text-blue-600" />
                  <div>
                    <Text size="sm" fw={600} className="text-blue-800">Order Status</Text>
                    <Text size="xs" className="text-blue-700">Expected delivery on {selectedOrder.deliveryDate}</Text>
                  </div>
                </Group>
              </Card>
            )}
            <Group justify="flex-end" mt="md">
              {selectedOrder.status !== "delivered" && (
                <Button variant="light" leftSection={<CheckCircle2 size={16} />}>Mark as Received</Button>
              )}
              <Button variant="light" onClick={closeView}>Close</Button>
              <Button className="bg-[#19b5af] hover:bg-[#14918c]" onClick={() => { closeView(); setSelectedOrder(selectedOrder); open(); }}>Edit Order</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
