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

const mockAssistants = [
  { id: 1, name: "John Doe", phone: "+251 911 234 567", email: "john@clinic.com", status: "active", experience: "3 years", rating: 4.7, assignedDentist: "Dr. Hilina", patientsThisMonth: 45, appointmentsToday: 6, schedule: "Mon-Fri, 8AM-4PM", avatar: "https://i.pravatar.cc/100?img=30" },
  { id: 2, name: "Emma Wilson", phone: "+251 912 345 678", email: "emma@clinic.com", status: "active", experience: "4 years", rating: 4.8, assignedDentist: "Dr. John", patientsThisMonth: 42, appointmentsToday: 5, schedule: "Tue-Sat, 9AM-5PM", avatar: "https://i.pravatar.cc/100?img=31" },
  { id: 3, name: "David Miller", phone: "+251 913 456 789", email: "david@clinic.com", status: "active", experience: "2 years", rating: 4.6, assignedDentist: "Dr. Sarah", patientsThisMonth: 38, appointmentsToday: 4, schedule: "Mon-Fri, 10AM-6PM", avatar: "https://i.pravatar.cc/100?img=32" },
  { id: 4, name: "Sophia Taylor", phone: "+251 914 567 890", email: "sophia@clinic.com", status: "on-leave", experience: "5 years", rating: 4.9, assignedDentist: "Dr. Hilina", patientsThisMonth: 25, appointmentsToday: 0, schedule: "Mon-Sat, 8AM-4PM", avatar: "https://i.pravatar.cc/100?img=33" },
  { id: 5, name: "Liam Anderson", phone: "+251 915 678 901", email: "liam@clinic.com", status: "active", experience: "3 years", rating: 4.7, assignedDentist: "Dr. John", patientsThisMonth: 40, appointmentsToday: 5, schedule: "Mon-Fri, 12PM-8PM", avatar: "https://i.pravatar.cc/100?img=34" },
  { id: 6, name: "Olivia Martinez", phone: "+251 916 789 012", email: "olivia@clinic.com", status: "active", experience: "4 years", rating: 4.8, assignedDentist: "Dr. Sarah", patientsThisMonth: 43, appointmentsToday: 6, schedule: "Tue-Sat, 9AM-5PM", avatar: "https://i.pravatar.cc/100?img=35" },
];

const statusColors: Record<string, string> = { active: "green", "on-leave": "yellow", inactive: "gray" };

export default function AssistantsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  const filteredAssistants = mockAssistants.filter((assistant) => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) || assistant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || assistant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeAssistants = mockAssistants.filter(a => a.status === "active").length;
  const totalPatients = mockAssistants.reduce((sum, a) => sum + a.patientsThisMonth, 0);
  const avgRating = (mockAssistants.reduce((sum, a) => sum + a.rating, 0) / mockAssistants.length).toFixed(1);

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Dental Assistants</Title>
          <Text size="sm" c="dimmed">Manage dental assistant profiles and assignments</Text>
        </div>
        <Button leftSection={<Plus size={18} />} className="bg-[#19b5af] hover:bg-[#14918c]" onClick={open}>Add Assistant</Button>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Assistants", value: mockAssistants.length.toString(), icon: Users, color: "bg-purple-500" },
          { label: "Active Today", value: activeAssistants.toString(), icon: User, color: "bg-blue-500" },
          { label: "Patients Assisted", value: totalPatients.toString(), icon: Users, color: "bg-green-500" },
          { label: "Average Rating", value: avgRating, icon: Star, color: "bg-yellow-500" },
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
              <Table.Th>Assistant</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Assigned Dentist</Table.Th>
              <Table.Th>Experience</Table.Th>
              <Table.Th>Performance</Table.Th>
              <Table.Th>Schedule</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredAssistants.map((assistant) => (
              <Table.Tr key={assistant.id}>
                <Table.Td>
                  <Group gap="xs">
                    <Avatar src={assistant.avatar} size={50} radius="xl" />
                    <div>
                      <Text size="sm" fw={600}>{assistant.name}</Text>
                      <Group gap={6}><Star size={14} fill="#fbbf24" className="text-yellow-400" /><Text size="xs" c="dimmed">{assistant.rating}</Text></Group>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Group gap={6}><Phone size={14} className="text-gray-400" /><Text size="xs">{assistant.phone}</Text></Group>
                    <Group gap={6}><Mail size={14} className="text-gray-400" /><Text size="xs">{assistant.email}</Text></Group>
                  </Stack>
                </Table.Td>
                <Table.Td><Text size="sm">{assistant.assignedDentist}</Text></Table.Td>
                <Table.Td><Text size="sm">{assistant.experience}</Text></Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">Patients: {assistant.patientsThisMonth}</Text>
                    <Text size="xs" c="dimmed">Today: {assistant.appointmentsToday} appts</Text>
                  </Stack>
                </Table.Td>
                <Table.Td><Group gap={6}><Clock size={14} className="text-gray-400" /><Text size="xs">{assistant.schedule}</Text></Group></Table.Td>
                <Table.Td><Badge variant="light" color={statusColors[assistant.status]} size="sm" className="capitalize">{assistant.status.replace('-', ' ')}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => { setSelectedAssistant(assistant); openView(); }}><Eye size={16} /></ActionIcon>
                    <ActionIcon variant="light" color="teal" onClick={() => { setSelectedAssistant(assistant); open(); }}><Edit size={16} /></ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target><ActionIcon variant="light" color="gray"><MoreVertical size={16} /></ActionIcon></Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Calendar size={16} />}>View Schedule</Menu.Item>
                        <Menu.Item leftSection={<Users size={16} />}>View Assignments</Menu.Item>
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

      <Modal opened={opened} onClose={() => { close(); setSelectedAssistant(null); }} title={<Text fw={600} size="lg">{selectedAssistant ? "Edit Assistant" : "Add New Assistant"}</Text>} size="lg">
        <Stack gap="md">
          <TextInput label="Full Name" placeholder="Enter name" required leftSection={<User size={16} />} defaultValue={selectedAssistant?.name} />
          <Group grow>
            <TextInput label="Phone" placeholder="+251 911 234 567" required leftSection={<Phone size={16} />} defaultValue={selectedAssistant?.phone} />
            <TextInput label="Email" placeholder="email@clinic.com" required leftSection={<Mail size={16} />} defaultValue={selectedAssistant?.email} />
          </Group>
          <Select label="Assigned Dentist" placeholder="Select dentist" required data={["Dr. Hilina", "Dr. John", "Dr. Sarah"]} defaultValue={selectedAssistant?.assignedDentist} />
          <TextInput label="Years of Experience" placeholder="e.g., 3 years" required defaultValue={selectedAssistant?.experience} />
          <Select label="Working Days" placeholder="Select days" data={["Monday - Friday", "Monday - Saturday", "Tuesday - Saturday"]} />
          <Group grow><TimeInput label="Start Time" leftSection={<Clock size={16} />} /><TimeInput label="End Time" leftSection={<Clock size={16} />} /></Group>
          <Select label="Status" placeholder="Select status" data={[{ value: "active", label: "Active" }, { value: "on-leave", label: "On Leave" }, { value: "inactive", label: "Inactive" }]} defaultValue={selectedAssistant?.status} />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => { close(); setSelectedAssistant(null); }}>Cancel</Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">{selectedAssistant ? "Update" : "Add"} Assistant</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={viewModalOpened} onClose={closeView} title={<Text fw={600} size="lg">Assistant Profile</Text>} size="md">
        {selectedAssistant && (
          <Stack gap="md">
            <Group><Avatar src={selectedAssistant.avatar} size={80} radius="xl" /><div><Text size="lg" fw={600}>{selectedAssistant.name}</Text><Text size="sm" c="dimmed" mb={4}>Dental Assistant</Text><Badge variant="light" color={statusColors[selectedAssistant.status]} className="capitalize">{selectedAssistant.status.replace('-', ' ')}</Badge></div></Group>
            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20"><Group justify="space-between"><div><Text size="sm" fw={600}>Rating</Text><Group gap={6} mt={4}><Star size={20} fill="#fbbf24" className="text-yellow-400" /><Text size="xl" fw={700}>{selectedAssistant.rating}/5.0</Text></Group></div><div className="text-right"><Text size="sm" fw={600}>Experience</Text><Text size="xl" fw={700} mt={4}>{selectedAssistant.experience}</Text></div></Group></Card>
            <div><Text size="sm" fw={600} mb={8}>Contact Information</Text><Stack gap={8}><Group gap={8}><Phone size={16} className="text-gray-400" /><Text size="sm">{selectedAssistant.phone}</Text></Group><Group gap={8}><Mail size={16} className="text-gray-400" /><Text size="sm">{selectedAssistant.email}</Text></Group></Stack></div>
            <div><Text size="sm" fw={600} mb={8}>Assignment</Text><Card className="bg-gray-50"><Text size="sm">Assigned to: {selectedAssistant.assignedDentist}</Text></Card></div>
            <div><Text size="sm" fw={600} mb={8}>This Month's Performance</Text><div className="grid grid-cols-2 gap-4"><Card className="bg-blue-50 border border-blue-200"><Text size="xs" c="dimmed" mb={4}>Patients Assisted</Text><Text size="2xl" fw={700}>{selectedAssistant.patientsThisMonth}</Text></Card><Card className="bg-green-50 border border-green-200"><Text size="xs" c="dimmed" mb={4}>Appointments Today</Text><Text size="2xl" fw={700}>{selectedAssistant.appointmentsToday}</Text></Card></div></div>
            <Group justify="flex-end" mt="md"><Button variant="light" onClick={closeView}>Close</Button><Button className="bg-[#19b5af] hover:bg-[#14918c]" onClick={() => { closeView(); setSelectedAssistant(selectedAssistant); open(); }}>Edit Profile</Button></Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
