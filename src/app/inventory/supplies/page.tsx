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
import { useDisclosure } from "@mantine/hooks";
import {
  AlertTriangle,
  DollarSign,
  Edit,
  Eye,
  MoreVertical,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2
} from "lucide-react";
import { useState } from "react";

const mockSupplies = [
  { id: 1, name: "Dental Gloves (Medium)", category: "Personal Protection", unit: "box", quantity: 50, minimumStock: 200, costPerUnit: 450, supplier: "MedSupply Co", status: "low", lastOrdered: "2024-11-15" },
  { id: 2, name: "Disposable Masks", category: "Personal Protection", unit: "box", quantity: 75, minimumStock: 300, costPerUnit: 320, supplier: "MedSupply Co", status: "low", lastOrdered: "2024-11-15" },
  { id: 3, name: "Anesthetic Cartridges", category: "Medications", unit: "unit", quantity: 25, minimumStock: 100, costPerUnit: 85, supplier: "PharmaDent", status: "critical", lastOrdered: "2024-10-20" },
  { id: 4, name: "Dental Burs Set", category: "Instruments", unit: "set", quantity: 150, minimumStock: 50, costPerUnit: 1200, supplier: "DentalTools Ltd", status: "adequate", lastOrdered: "2024-12-01" },
  { id: 5, name: "Cotton Rolls", category: "Consumables", unit: "pack", quantity: 30, minimumStock: 150, costPerUnit: 180, supplier: "MedSupply Co", status: "low", lastOrdered: "2024-11-25" },
  { id: 6, name: "Composite Resin", category: "Materials", unit: "unit", quantity: 45, minimumStock: 30, costPerUnit: 2500, supplier: "DentalMaterials Inc", status: "adequate", lastOrdered: "2024-12-05" },
  { id: 7, name: "X-Ray Films", category: "Imaging", unit: "pack", quantity: 40, minimumStock: 100, costPerUnit: 850, supplier: "RadioDental", status: "low", lastOrdered: "2024-11-10" },
  { id: 8, name: "Sterilization Pouches", category: "Sterilization", unit: "box", quantity: 200, minimumStock: 100, costPerUnit: 280, supplier: "MedSupply Co", status: "adequate", lastOrdered: "2024-12-10" },
];

const statusColors: Record<string, string> = {
  critical: "red",
  low: "yellow",
  adequate: "green",
  overstocked: "blue",
};

export default function SuppliesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedSupply, setSelectedSupply] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>("all");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  const filteredSupplies = mockSupplies.filter((supply) => {
    const matchesSearch = supply.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || supply.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const criticalCount = mockSupplies.filter(s => s.status === "critical").length;
  const lowCount = mockSupplies.filter(s => s.status === "low").length;
  const totalValue = mockSupplies.reduce((sum, s) => sum + (s.quantity * s.costPerUnit), 0);

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Supplies Management</Title>
          <Text size="sm" c="dimmed">Track and manage dental supplies inventory</Text>
        </div>
        <Group>
          <Button leftSection={<ShoppingCart size={18} />} variant="light">Bulk Order</Button>
          <Button leftSection={<Plus size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]" onClick={open}>Add Supply</Button>
        </Group>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Items", value: mockSupplies.length.toString(), icon: Package, color: "bg-blue-500" },
          { label: "Critical Stock", value: criticalCount.toString(), icon: AlertTriangle, color: "bg-red-500" },
          { label: "Low Stock", value: lowCount.toString(), icon: AlertTriangle, color: "bg-yellow-500" },
          { label: "Total Value", value: `ETB ${(totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: "bg-green-500" },
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
          <TextInput placeholder="Search supplies..." leftSection={<Search size={16} />} value={searchQuery} onChange={(e) => setSearchQuery(e.currentTarget.value)} className="flex-1" />
          <Select placeholder="Category" data={[{ value: "all", label: "All Categories" }, { value: "Personal Protection", label: "Personal Protection" }, { value: "Medications", label: "Medications" }, { value: "Instruments", label: "Instruments" }, { value: "Materials", label: "Materials" }, { value: "Consumables", label: "Consumables" }]} value={categoryFilter} onChange={setCategoryFilter} clearable w={180} />
          <Select placeholder="Stock Status" data={[{ value: "all", label: "All Status" }, { value: "critical", label: "Critical" }, { value: "low", label: "Low Stock" }, { value: "adequate", label: "Adequate" }]} value={statusFilter} onChange={setStatusFilter} clearable w={150} />
        </Group>
      </Card>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Supply Item</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Min. Stock</Table.Th>
              <Table.Th>Cost/Unit</Table.Th>
              <Table.Th>Total Value</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredSupplies.map((supply) => (
              <Table.Tr key={supply.id} className={supply.status === "critical" ? "bg-red-50" : supply.status === "low" ? "bg-yellow-50" : ""}>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={600}>{supply.name}</Text>
                    <Text size="xs" c="dimmed">{supply.supplier}</Text>
                  </div>
                </Table.Td>
                <Table.Td><Badge variant="light" color="gray" size="sm">{supply.category}</Badge></Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600} className={supply.status === "critical" ? "text-red-600" : supply.status === "low" ? "text-yellow-600" : ""}>
                    {supply.quantity} {supply.unit}
                  </Text>
                </Table.Td>
                <Table.Td><Text size="sm" c="dimmed">{supply.minimumStock} {supply.unit}</Text></Table.Td>
                <Table.Td><Text size="sm">ETB {supply.costPerUnit}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={500}>ETB {(supply.quantity * supply.costPerUnit).toLocaleString()}</Text></Table.Td>
                <Table.Td><Badge variant="light" color={statusColors[supply.status]} size="sm" className="capitalize">{supply.status}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => { setSelectedSupply(supply); openView(); }}><Eye size={16} /></ActionIcon>
                    <ActionIcon variant="light" color="teal" onClick={() => { setSelectedSupply(supply); open(); }}><Edit size={16} /></ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target><ActionIcon variant="light" color="gray"><MoreVertical size={16} /></ActionIcon></Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<ShoppingCart size={16} />}>Order Now</Menu.Item>
                        <Menu.Item leftSection={<Package size={16} />}>Adjust Stock</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<Trash2 size={16} />} color="red">Remove</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal opened={opened} onClose={() => { close(); setSelectedSupply(null); }} title={<Text fw={600} size="lg">{selectedSupply ? "Edit Supply" : "Add New Supply"}</Text>} size="lg">
        <Stack gap="md">
          <TextInput label="Supply Name" placeholder="e.g., Dental Gloves (Medium)" required defaultValue={selectedSupply?.name} />
          <Group grow>
            <Select label="Category" placeholder="Select category" required data={["Personal Protection", "Medications", "Instruments", "Materials", "Consumables", "Imaging", "Sterilization"]} defaultValue={selectedSupply?.category} />
            <Select label="Unit" placeholder="Select unit" required data={["box", "pack", "unit", "set", "bottle", "roll"]} defaultValue={selectedSupply?.unit} />
          </Group>
          <Group grow>
            <TextInput label="Current Quantity" placeholder="0" type="number" required defaultValue={selectedSupply?.quantity} />
            <TextInput label="Minimum Stock Level" placeholder="0" type="number" required defaultValue={selectedSupply?.minimumStock} />
          </Group>
          <Group grow>
            <TextInput label="Cost Per Unit (ETB)" placeholder="0" type="number" required leftSection={<DollarSign size={16} />} defaultValue={selectedSupply?.costPerUnit} />
            <TextInput label="Supplier" placeholder="Supplier name" required defaultValue={selectedSupply?.supplier} />
          </Group>
          <Textarea label="Notes" placeholder="Additional notes..." rows={2} />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => { close(); setSelectedSupply(null); }}>Cancel</Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">{selectedSupply ? "Update" : "Add"} Supply</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={viewModalOpened} onClose={closeView} title={<Text fw={600} size="lg">Supply Details</Text>} size="md">
        {selectedSupply && (
          <Stack gap="md">
            <div>
              <Text size="lg" fw={600} mb={4}>{selectedSupply.name}</Text>
              <Group gap={8}>
                <Badge variant="light" color={statusColors[selectedSupply.status]} className="capitalize">{selectedSupply.status}</Badge>
                <Badge variant="light" color="gray">{selectedSupply.category}</Badge>
              </Group>
            </div>
            <Card className={selectedSupply.status === "critical" ? "bg-red-50 border border-red-200" : selectedSupply.status === "low" ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"}>
              <Group grow>
                <div><Text size="xs" c="dimmed" mb={4}>Current Stock</Text><Text size="2xl" fw={700} className={selectedSupply.status === "critical" ? "text-red-600" : selectedSupply.status === "low" ? "text-yellow-600" : ""}>{selectedSupply.quantity} {selectedSupply.unit}</Text></div>
                <div><Text size="xs" c="dimmed" mb={4}>Minimum Required</Text><Text size="2xl" fw={700}>{selectedSupply.minimumStock} {selectedSupply.unit}</Text></div>
              </Group>
            </Card>
            <div><Text size="sm" fw={600} mb={8}>Pricing</Text><Stack gap={8}><Group justify="space-between"><Text size="sm" c="dimmed">Cost Per Unit:</Text><Text size="sm" fw={600}>ETB {selectedSupply.costPerUnit}</Text></Group><Group justify="space-between"><Text size="sm" c="dimmed">Total Value:</Text><Text size="lg" fw={700}>ETB {(selectedSupply.quantity * selectedSupply.costPerUnit).toLocaleString()}</Text></Group></Stack></div>
            <div><Text size="sm" fw={600} mb={8}>Supplier</Text><Text size="sm">{selectedSupply.supplier}</Text><Text size="xs" c="dimmed" mt={4}>Last ordered: {selectedSupply.lastOrdered}</Text></div>
            {(selectedSupply.status === "critical" || selectedSupply.status === "low") && (
              <Card className="bg-yellow-50 border border-yellow-200">
                <Group gap={8}>
                  <AlertTriangle size={20} className="text-yellow-600" />
                  <div>
                    <Text size="sm" fw={600} className="text-yellow-800">Stock Alert</Text>
                    <Text size="xs" className="text-yellow-700">This item is {selectedSupply.status === "critical" ? "critically" : ""} low in stock. Please reorder soon.</Text>
                  </div>
                </Group>
              </Card>
            )}
            <Group justify="flex-end" mt="md">
              <Button variant="light" leftSection={<ShoppingCart size={16} />}>Order Now</Button>
              <Button variant="light" onClick={closeView}>Close</Button>
              <Button className="bg-[#19b5af] hover:bg-[#14918c]" onClick={() => { closeView(); setSelectedSupply(selectedSupply); open(); }}>Edit Supply</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
