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
  DollarSign,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Trash2,
  Wrench
} from "lucide-react";
import { useState } from "react";

// Mock equipment data
const mockEquipment = [
  { id: 1, name: "Dental Chair - Unit 1", category: "Chairs", manufacturer: "Planmeca", model: "Compact i5", serialNumber: "PC-2023-001", purchaseDate: "2023-01-15", cost: 850000, status: "operational", location: "Room 1", lastMaintenance: "2024-11-01", nextMaintenance: "2025-02-01", warranty: "active" },
  { id: 2, name: "Digital X-Ray Machine", category: "Imaging", manufacturer: "Carestream", model: "CS 8100", serialNumber: "CS-2022-045", purchaseDate: "2022-06-20", cost: 1200000, status: "operational", location: "X-Ray Room", lastMaintenance: "2024-10-15", nextMaintenance: "2025-01-15", warranty: "active" },
  { id: 3, name: "Autoclave Sterilizer", category: "Sterilization", manufacturer: "Tuttnauer", model: "EZ10", serialNumber: "TT-2023-089", purchaseDate: "2023-03-10", cost: 320000, status: "operational", location: "Sterilization Room", lastMaintenance: "2024-12-01", nextMaintenance: "2025-03-01", warranty: "active" },
  { id: 4, name: "Ultrasonic Scaler", category: "Tools", manufacturer: "Woodpecker", model: "UDS-N3", serialNumber: "WP-2024-012", purchaseDate: "2024-02-05", cost: 45000, status: "operational", location: "Room 2", lastMaintenance: "2024-11-20", nextMaintenance: "2025-02-20", warranty: "active" },
  { id: 5, name: "LED Dental Light", category: "Lighting", manufacturer: "A-dec", model: "500 LED", serialNumber: "AD-2023-156", purchaseDate: "2023-01-15", cost: 95000, status: "maintenance", location: "Room 1", lastMaintenance: "2024-12-10", nextMaintenance: "2024-12-20", warranty: "active" },
];

const statusColors: Record<string, string> = {
  operational: "green",
  maintenance: "yellow",
  repair: "red",
  retired: "gray",
};

const warrantyColors: Record<string, string> = {
  active: "green",
  expired: "red",
};

export default function EquipmentPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>("all");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  const filteredEquipment = mockEquipment.filter((equipment) => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) || equipment.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || equipment.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || equipment.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = mockEquipment.reduce((sum, eq) => sum + eq.cost, 0);
  const operationalCount = mockEquipment.filter(eq => eq.status === "operational").length;
  const maintenanceCount = mockEquipment.filter(eq => eq.status === "maintenance").length;

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Equipment Management</Title>
          <Text size="sm" c="dimmed">Track and maintain dental equipment</Text>
        </div>
        <Button leftSection={<Plus size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]" onClick={open}>Add Equipment</Button>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Equipment", value: mockEquipment.length.toString(), icon: Wrench, color: "bg-blue-500" },
          { label: "Operational", value: operationalCount.toString(), icon: Settings, color: "bg-green-500" },
          { label: "Under Maintenance", value: maintenanceCount.toString(), icon: Wrench, color: "bg-yellow-500" },
          { label: "Total Value", value: `ETB ${(totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, color: "bg-purple-500" },
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
          <TextInput placeholder="Search by name or serial number..." leftSection={<Search size={16} />} value={searchQuery} onChange={(e) => setSearchQuery(e.currentTarget.value)} className="flex-1" />
          <Select placeholder="Category" data={[{ value: "all", label: "All Categories" }, { value: "Chairs", label: "Chairs" }, { value: "Imaging", label: "Imaging" }, { value: "Sterilization", label: "Sterilization" }, { value: "Tools", label: "Tools" }, { value: "Lighting", label: "Lighting" }]} value={categoryFilter} onChange={setCategoryFilter} clearable w={150} />
          <Select placeholder="Status" data={[{ value: "all", label: "All Status" }, { value: "operational", label: "Operational" }, { value: "maintenance", label: "Maintenance" }, { value: "repair", label: "Repair" }]} value={statusFilter} onChange={setStatusFilter} clearable w={150} />
        </Group>
      </Card>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Equipment</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Serial Number</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Cost</Table.Th>
              <Table.Th>Maintenance</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredEquipment.map((equipment) => (
              <Table.Tr key={equipment.id}>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={600}>{equipment.name}</Text>
                    <Text size="xs" c="dimmed">{equipment.manufacturer} - {equipment.model}</Text>
                  </div>
                </Table.Td>
                <Table.Td><Badge variant="light" color="blue">{equipment.category}</Badge></Table.Td>
                <Table.Td><Text size="xs" className="font-mono">{equipment.serialNumber}</Text></Table.Td>
                <Table.Td><Text size="sm">{equipment.location}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={500}>ETB {equipment.cost.toLocaleString()}</Text></Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">Next: {equipment.nextMaintenance}</Text>
                    <Badge variant="light" color={warrantyColors[equipment.warranty]} size="xs">{equipment.warranty}</Badge>
                  </Stack>
                </Table.Td>
                <Table.Td><Badge variant="light" color={statusColors[equipment.status]} size="sm" className="capitalize">{equipment.status}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => { setSelectedEquipment(equipment); openView(); }}><Eye size={16} /></ActionIcon>
                    <ActionIcon variant="light" color="teal" onClick={() => { setSelectedEquipment(equipment); open(); }}><Edit size={16} /></ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target><ActionIcon variant="light" color="gray"><MoreVertical size={16} /></ActionIcon></Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Wrench size={16} />}>Schedule Maintenance</Menu.Item>
                        <Menu.Item leftSection={<Calendar size={16} />}>Maintenance History</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<Trash2 size={16} />} color="red">Retire Equipment</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal opened={opened} onClose={() => { close(); setSelectedEquipment(null); }} title={<Text fw={600} size="lg">{selectedEquipment ? "Edit Equipment" : "Add New Equipment"}</Text>} size="lg">
        <Stack gap="md">
          <TextInput label="Equipment Name" placeholder="e.g., Dental Chair - Unit 1" required defaultValue={selectedEquipment?.name} />
          <Group grow>
            <Select label="Category" placeholder="Select category" required data={["Chairs", "Imaging", "Sterilization", "Tools", "Lighting", "Other"]} defaultValue={selectedEquipment?.category} />
            <TextInput label="Location" placeholder="e.g., Room 1" required defaultValue={selectedEquipment?.location} />
          </Group>
          <Group grow>
            <TextInput label="Manufacturer" placeholder="e.g., Planmeca" required defaultValue={selectedEquipment?.manufacturer} />
            <TextInput label="Model" placeholder="e.g., Compact i5" required defaultValue={selectedEquipment?.model} />
          </Group>
          <TextInput label="Serial Number" placeholder="e.g., PC-2023-001" required defaultValue={selectedEquipment?.serialNumber} />
          <Group grow>
            <DatePickerInput label="Purchase Date" placeholder="Select date" leftSection={<Calendar size={16} />} />
            <TextInput label="Purchase Cost (ETB)" placeholder="0" type="number" required leftSection={<DollarSign size={16} />} defaultValue={selectedEquipment?.cost} />
          </Group>
          <Select label="Status" placeholder="Select status" required data={[{ value: "operational", label: "Operational" }, { value: "maintenance", label: "Under Maintenance" }, { value: "repair", label: "Repair Needed" }, { value: "retired", label: "Retired" }]} defaultValue={selectedEquipment?.status} />
          <Select label="Warranty Status" placeholder="Select warranty status" data={[{ value: "active", label: "Active" }, { value: "expired", label: "Expired" }]} defaultValue={selectedEquipment?.warranty} />
          <Textarea label="Notes" placeholder="Additional notes..." rows={3} />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => { close(); setSelectedEquipment(null); }}>Cancel</Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">{selectedEquipment ? "Update" : "Add"} Equipment</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={viewModalOpened} onClose={closeView} title={<Text fw={600} size="lg">Equipment Details</Text>} size="md">
        {selectedEquipment && (
          <Stack gap="md">
            <div>
              <Text size="lg" fw={600} mb={4}>{selectedEquipment.name}</Text>
              <Group gap={8}>
                <Badge variant="light" color={statusColors[selectedEquipment.status]} className="capitalize">{selectedEquipment.status}</Badge>
                <Badge variant="light" color={warrantyColors[selectedEquipment.warranty]} className="capitalize">Warranty: {selectedEquipment.warranty}</Badge>
              </Group>
            </div>
            <Card className="bg-gray-50">
              <Group grow>
                <div><Text size="xs" c="dimmed" mb={4}>Category</Text><Text size="sm" fw={500}>{selectedEquipment.category}</Text></div>
                <div><Text size="xs" c="dimmed" mb={4}>Location</Text><Text size="sm" fw={500}>{selectedEquipment.location}</Text></div>
              </Group>
            </Card>
            <div><Text size="sm" fw={600} mb={8}>Equipment Details</Text><Stack gap={8}><Group justify="space-between"><Text size="sm" c="dimmed">Manufacturer:</Text><Text size="sm">{selectedEquipment.manufacturer}</Text></Group><Group justify="space-between"><Text size="sm" c="dimmed">Model:</Text><Text size="sm">{selectedEquipment.model}</Text></Group><Group justify="space-between"><Text size="sm" c="dimmed">Serial Number:</Text><Text size="sm" className="font-mono">{selectedEquipment.serialNumber}</Text></Group></Stack></div>
            <div><Text size="sm" fw={600} mb={8}>Financial</Text><Group justify="space-between"><Text size="sm" c="dimmed">Purchase Cost:</Text><Text size="lg" fw={700}>ETB {selectedEquipment.cost.toLocaleString()}</Text></Group><Text size="xs" c="dimmed" mt={4}>Purchased on: {selectedEquipment.purchaseDate}</Text></div>
            <div><Text size="sm" fw={600} mb={8}>Maintenance</Text><Stack gap={8}><Group justify="space-between"><Text size="sm" c="dimmed">Last Maintenance:</Text><Text size="sm">{selectedEquipment.lastMaintenance}</Text></Group><Group justify="space-between"><Text size="sm" c="dimmed">Next Maintenance:</Text><Text size="sm" fw={600} className="text-[#19b5af]">{selectedEquipment.nextMaintenance}</Text></Group></Stack></div>
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeView}>Close</Button>
              <Button className="bg-[#19b5af] hover:bg-[#14918c]" onClick={() => { closeView(); setSelectedEquipment(selectedEquipment); open(); }}>Edit Equipment</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
