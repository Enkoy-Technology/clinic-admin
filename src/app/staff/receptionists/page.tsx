"use client";

import {
    ActionIcon,
    Avatar,
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
    Title
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
    Calendar,
    Clock,
    Edit,
    Eye,
    Mail,
    MoreVertical,
    Phone,
    Plus,
    Search,
    Star,
    Trash2,
    User,
    Users
} from "lucide-react";
import { useState } from "react";

const mockReceptionists = [
  { id: 1, name: "Marta Bekele", phone: "+251 913 456 789", email: "marta@clinic.com", status: "active", experience: "5 years", rating: 4.9, callsHandled: 125, appointmentsBooked: 45, schedule: "Mon-Fri, 8AM-4PM", avatar: "https://i.pravatar.cc/100?img=40" },
  { id: 2, name: "Daniel Tesfaye", phone: "+251 914 567 890", email: "daniel@clinic.com", status: "active", experience: "3 years", rating: 4.7, callsHandled: 98, appointmentsBooked: 38, schedule: "Mon-Sat, 12PM-8PM", avatar: "https://i.pravatar.cc/100?img=41" },
];

const statusColors: Record<string, string> = { active: "green", "on-leave": "yellow", inactive: "gray" };

export default function ReceptionistsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  const filteredReceptionists = mockReceptionists.filter((receptionist) => {
    const matchesSearch = receptionist.name.toLowerCase().includes(searchQuery.toLowerCase()) || receptionist.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || receptionist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeReceptionists = mockReceptionists.filter(r => r.status === "active").length;
  const totalCalls = mockReceptionists.reduce((sum, r) => sum + r.callsHandled, 0);
  const avgRating = (mockReceptionists.reduce((sum, r) => sum + r.rating, 0) / mockReceptionists.length).toFixed(1);

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Receptionists</Title>
          <Text size="sm" c="dimmed">Manage receptionist profiles and performance</Text>
        </div>
        <Button leftSection={<Plus size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]" onClick={open}>Add Receptionist</Button>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Receptionists", value: mockReceptionists.length.toString(), icon: Users, color: "bg-yellow-500" },
          { label: "Active Today", value: activeReceptionists.toString(), icon: User, color: "bg-blue-500" },
          { label: "Calls Handled", value: totalCalls.toString(), icon: Phone, color: "bg-green-500" },
          { label: "Average Rating", value: avgRating, icon: Star, color: "bg-purple-500" },
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
          <TextInput placeholder="Search by name or email..." leftSection={<Search size={16} />} value={searchQuery} onChange={(e) => setSearchQuery(e.currentTarget.value)} className="flex-1" />
          <Select placeholder="Status" data={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "on-leave", label: "On Leave" }, { value: "inactive", label: "Inactive" }]} value={statusFilter} onChange={setStatusFilter} clearable w={150} />
        </Group>
      </Card>

      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Receptionist</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Experience</Table.Th>
              <Table.Th>Performance</Table.Th>
              <Table.Th>Schedule</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredReceptionists.map((receptionist) => (
              <Table.Tr key={receptionist.id}>
                <Table.Td>
                  <Group gap="xs">
                    <Avatar src={receptionist.avatar} size={50} radius="xl" />
                    <div>
                      <Text size="sm" fw={600}>{receptionist.name}</Text>
                      <Group gap={6}><Star size={14} fill="#fbbf24" className="text-yellow-400" /><Text size="xs" c="dimmed">{receptionist.rating}</Text></Group>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Group gap={6}><Phone size={14} className="text-gray-400" /><Text size="xs">{receptionist.phone}</Text></Group>
                    <Group gap={6}><Mail size={14} className="text-gray-400" /><Text size="xs">{receptionist.email}</Text></Group>
                  </Stack>
                </Table.Td>
                <Table.Td><Text size="sm">{receptionist.experience}</Text></Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">Calls: {receptionist.callsHandled}</Text>
                    <Text size="xs" c="dimmed">Bookings: {receptionist.appointmentsBooked}</Text>
                  </Stack>
                </Table.Td>
                <Table.Td><Group gap={6}><Clock size={14} className="text-gray-400" /><Text size="xs">{receptionist.schedule}</Text></Group></Table.Td>
                <Table.Td><Badge variant="light" color={statusColors[receptionist.status]} size="sm" className="capitalize">{receptionist.status.replace('-', ' ')}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => { setSelectedReceptionist(receptionist); openView(); }}><Eye size={16} /></ActionIcon>
                    <ActionIcon variant="light" color="teal" onClick={() => { setSelectedReceptionist(receptionist); open(); }}><Edit size={16} /></ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target><ActionIcon variant="light" color="gray"><MoreVertical size={16} /></ActionIcon></Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Calendar size={16} />}>View Schedule</Menu.Item>
                        <Menu.Item leftSection={<Phone size={16} />}>Call History</Menu.Item>
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

      <Modal opened={opened} onClose={() => { close(); setSelectedReceptionist(null); }} title={<Text fw={600} size="lg">{selectedReceptionist ? "Edit Receptionist" : "Add New Receptionist"}</Text>} size="lg">
        <Stack gap="md">
          <TextInput label="Full Name" placeholder="Enter name" required leftSection={<User size={16} />} defaultValue={selectedReceptionist?.name} />
          <Group grow>
            <TextInput label="Phone" placeholder="+251 911 234 567" required leftSection={<Phone size={16} />} defaultValue={selectedReceptionist?.phone} />
            <TextInput label="Email" placeholder="email@clinic.com" required leftSection={<Mail size={16} />} defaultValue={selectedReceptionist?.email} />
          </Group>
          <TextInput label="Years of Experience" placeholder="e.g., 5 years" required defaultValue={selectedReceptionist?.experience} />
          <Select label="Working Days" placeholder="Select days" data={["Monday - Friday", "Monday - Saturday", "Tuesday - Saturday"]} />
          <Group grow><TimeInput label="Start Time" leftSection={<Clock size={16} />} /><TimeInput label="End Time" leftSection={<Clock size={16} />} /></Group>
          <Select label="Status" placeholder="Select status" data={[{ value: "active", label: "Active" }, { value: "on-leave", label: "On Leave" }, { value: "inactive", label: "Inactive" }]} defaultValue={selectedReceptionist?.status} />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => { close(); setSelectedReceptionist(null); }}>Cancel</Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">{selectedReceptionist ? "Update" : "Add"} Receptionist</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={viewModalOpened} onClose={closeView} title={<Text fw={600} size="lg">Receptionist Profile</Text>} size="md">
        {selectedReceptionist && (
          <Stack gap="md">
            <Group><Avatar src={selectedReceptionist.avatar} size={80} radius="xl" /><div><Text size="lg" fw={600}>{selectedReceptionist.name}</Text><Text size="sm" c="dimmed" mb={4}>Receptionist</Text><Badge variant="light" color={statusColors[selectedReceptionist.status]} className="capitalize">{selectedReceptionist.status.replace('-', ' ')}</Badge></div></Group>
            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20"><Group justify="space-between"><div><Text size="sm" fw={600}>Rating</Text><Group gap={6} mt={4}><Star size={20} fill="#fbbf24" className="text-yellow-400" /><Text size="xl" fw={700}>{selectedReceptionist.rating}/5.0</Text></Group></div><div className="text-right"><Text size="sm" fw={600}>Experience</Text><Text size="xl" fw={700} mt={4}>{selectedReceptionist.experience}</Text></div></Group></Card>
            <div><Text size="sm" fw={600} mb={8}>Contact Information</Text><Stack gap={8}><Group gap={8}><Phone size={16} className="text-gray-400" /><Text size="sm">{selectedReceptionist.phone}</Text></Group><Group gap={8}><Mail size={16} className="text-gray-400" /><Text size="sm">{selectedReceptionist.email}</Text></Group></Stack></div>
            <div><Text size="sm" fw={600} mb={8}>This Month's Performance</Text><div className="grid grid-cols-2 gap-4"><Card className="bg-blue-50 border border-blue-200"><Text size="xs" c="dimmed" mb={4}>Calls Handled</Text><Text size="2xl" fw={700}>{selectedReceptionist.callsHandled}</Text></Card><Card className="bg-green-50 border border-green-200"><Text size="xs" c="dimmed" mb={4}>Appointments Booked</Text><Text size="2xl" fw={700}>{selectedReceptionist.appointmentsBooked}</Text></Card></div></div>
            <Group justify="flex-end" mt="md"><Button variant="light" onClick={closeView}>Close</Button><Button className="bg-[#19b5af] hover:bg-[#14918c]" onClick={() => { closeView(); setSelectedReceptionist(selectedReceptionist); open(); }}>Edit Profile</Button></Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
