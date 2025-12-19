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
    Textarea,
    Title
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
    Award,
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
    UserCheck,
    Users
} from "lucide-react";
import { useState } from "react";

// Mock hygienists data
const mockHygienists = [
  {
    id: 1,
    name: "Sara Ahmed",
    specialization: "Dental Hygiene",
    phone: "+251 911 234 567",
    email: "sara@clinic.com",
    status: "active",
    experience: "6 years",
    rating: 4.8,
    patientsThisMonth: 52,
    appointmentsToday: 7,
    schedule: "Monday - Friday, 8AM - 6PM",
    avatar: "https://i.pravatar.cc/100?img=20",
    certifications: ["RDH", "CPR Certified"],
    joinedDate: "2021-02-10",
  },
  {
    id: 2,
    name: "Michael Brown",
    specialization: "Preventive Care",
    phone: "+251 912 345 678",
    email: "michael@clinic.com",
    status: "active",
    experience: "4 years",
    rating: 4.7,
    patientsThisMonth: 48,
    appointmentsToday: 6,
    schedule: "Tuesday - Saturday, 9AM - 5PM",
    avatar: "https://i.pravatar.cc/100?img=21",
    certifications: ["RDH", "Periodontal Therapy"],
    joinedDate: "2022-05-15",
  },
  {
    id: 3,
    name: "Emily Davis",
    specialization: "Pediatric Dental Hygiene",
    phone: "+251 913 456 789",
    email: "emily@clinic.com",
    status: "active",
    experience: "5 years",
    rating: 4.9,
    patientsThisMonth: 45,
    appointmentsToday: 5,
    schedule: "Monday - Friday, 10AM - 6PM",
    avatar: "https://i.pravatar.cc/100?img=22",
    certifications: ["RDH", "Pediatric Care Specialist"],
    joinedDate: "2021-08-20",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    specialization: "General Hygiene",
    phone: "+251 914 567 890",
    email: "ahmed@clinic.com",
    status: "on-leave",
    experience: "7 years",
    rating: 4.6,
    patientsThisMonth: 30,
    appointmentsToday: 0,
    schedule: "Monday - Saturday, 8AM - 4PM",
    avatar: "https://i.pravatar.cc/100?img=23",
    certifications: ["RDH", "Advanced Periodontology"],
    joinedDate: "2020-11-05",
  },
];

const statusColors: Record<string, string> = {
  active: "green",
  "on-leave": "yellow",
  inactive: "gray",
};

export default function HygienistsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedHygienist, setSelectedHygienist] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  const filteredHygienists = mockHygienists.filter((hygienist) => {
    const matchesSearch =
      hygienist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hygienist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hygienist.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || hygienist.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewHygienist = (hygienist: any) => {
    setSelectedHygienist(hygienist);
    openView();
  };

  const handleEditHygienist = (hygienist: any) => {
    setSelectedHygienist(hygienist);
    open();
  };

  const activeHygienists = mockHygienists.filter(h => h.status === "active").length;
  const totalPatients = mockHygienists.reduce((sum, h) => sum + h.patientsThisMonth, 0);
  const avgRating = (mockHygienists.reduce((sum, h) => sum + h.rating, 0) / mockHygienists.length).toFixed(1);

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Dental Hygienists</Title>
          <Text size="sm" c="dimmed">Manage hygienist profiles and schedules</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={open}
        >
          Add Hygienist
        </Button>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Hygienists", value: mockHygienists.length.toString(), icon: UserCheck, color: "bg-green-500" },
          { label: "Active Today", value: activeHygienists.toString(), icon: User, color: "bg-blue-500" },
          { label: "Patients This Month", value: totalPatients.toString(), icon: Users, color: "bg-purple-500" },
          { label: "Average Rating", value: avgRating, icon: Star, color: "bg-yellow-500" },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
                <Text size="xl" fw={700}>{stat.value}</Text>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </Group>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card shadow="sm" p="md" mb="md" className="border border-gray-200">
        <Group>
          <TextInput
            placeholder="Search by name, specialization, or email..."
            leftSection={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />
          <Select
            placeholder="Status"
            data={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "on-leave", label: "On Leave" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Hygienists Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Hygienist</Table.Th>
              <Table.Th>Specialization</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Experience</Table.Th>
              <Table.Th>Performance</Table.Th>
              <Table.Th>Schedule</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredHygienists.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" py="xl" c="dimmed">
                    No hygienists found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredHygienists.map((hygienist) => (
                <Table.Tr key={hygienist.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar src={hygienist.avatar} size={50} radius="xl" />
                      <div>
                        <Text size="sm" fw={600}>{hygienist.name}</Text>
                        <Group gap={6}>
                          <Star size={14} fill="#fbbf24" className="text-yellow-400" />
                          <Text size="xs" c="dimmed">{hygienist.rating}</Text>
                        </Group>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{hygienist.specialization}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Group gap={6}>
                        <Phone size={14} className="text-gray-400" />
                        <Text size="xs">{hygienist.phone}</Text>
                      </Group>
                      <Group gap={6}>
                        <Mail size={14} className="text-gray-400" />
                        <Text size="xs">{hygienist.email}</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{hygienist.experience}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Text size="xs" c="dimmed">Patients: {hygienist.patientsThisMonth}</Text>
                      <Text size="xs" c="dimmed">Today: {hygienist.appointmentsToday} appts</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <Clock size={14} className="text-gray-400" />
                      <Text size="xs" lineClamp={2}>{hygienist.schedule}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={statusColors[hygienist.status]}
                      size="sm"
                      className="capitalize"
                    >
                      {hygienist.status.replace('-', ' ')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleViewHygienist(hygienist)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="teal"
                        onClick={() => handleEditHygienist(hygienist)}
                      >
                        <Edit size={16} />
                      </ActionIcon>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="light" color="gray">
                            <MoreVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<Calendar size={16} />}>
                            View Schedule
                          </Menu.Item>
                          <Menu.Item leftSection={<Users size={16} />}>
                            View Patients
                          </Menu.Item>
                          <Menu.Item leftSection={<Award size={16} />}>
                            Performance Report
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item leftSection={<Trash2 size={16} />} color="red">
                            Remove
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Add/Edit Hygienist Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedHygienist(null);
        }}
        title={
          <Text fw={600} size="lg">
            {selectedHygienist ? "Edit Hygienist" : "Add New Hygienist"}
          </Text>
        }
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter name"
            required
            leftSection={<User size={16} />}
            defaultValue={selectedHygienist?.name}
          />
          <Group grow>
            <TextInput
              label="Phone Number"
              placeholder="+251 911 234 567"
              required
              leftSection={<Phone size={16} />}
              defaultValue={selectedHygienist?.phone}
            />
            <TextInput
              label="Email"
              placeholder="email@clinic.com"
              required
              leftSection={<Mail size={16} />}
              defaultValue={selectedHygienist?.email}
            />
          </Group>
          <TextInput
            label="Specialization"
            placeholder="e.g., Dental Hygiene, Preventive Care"
            required
            defaultValue={selectedHygienist?.specialization}
          />
          <TextInput
            label="Years of Experience"
            placeholder="e.g., 6 years"
            required
            defaultValue={selectedHygienist?.experience}
          />
          <Textarea
            label="Certifications"
            placeholder="List certifications (e.g., RDH, CPR)"
            rows={2}
          />
          <Select
            label="Working Days"
            placeholder="Select days"
            data={[
              "Monday - Friday",
              "Monday - Saturday",
              "Tuesday - Saturday",
              "Custom",
            ]}
          />
          <Group grow>
            <TimeInput
              label="Start Time"
              leftSection={<Clock size={16} />}
            />
            <TimeInput
              label="End Time"
              leftSection={<Clock size={16} />}
            />
          </Group>
          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: "active", label: "Active" },
              { value: "on-leave", label: "On Leave" },
              { value: "inactive", label: "Inactive" },
            ]}
            defaultValue={selectedHygienist?.status}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => {
              close();
              setSelectedHygienist(null);
            }}>
              Cancel
            </Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">
              {selectedHygienist ? "Update" : "Add"} Hygienist
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Hygienist Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Hygienist Profile
          </Text>
        }
        size="md"
      >
        {selectedHygienist && (
          <Stack gap="md">
            <Group>
              <Avatar src={selectedHygienist.avatar} size={80} radius="xl" />
              <div>
                <Text size="lg" fw={600}>{selectedHygienist.name}</Text>
                <Text size="sm" c="dimmed" mb={4}>{selectedHygienist.specialization}</Text>
                <Badge
                  variant="light"
                  color={statusColors[selectedHygienist.status]}
                  className="capitalize"
                >
                  {selectedHygienist.status.replace('-', ' ')}
                </Badge>
              </div>
            </Group>

            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={600}>Rating</Text>
                  <Group gap={6} mt={4}>
                    <Star size={20} fill="#fbbf24" className="text-yellow-400" />
                    <Text size="xl" fw={700}>{selectedHygienist.rating}/5.0</Text>
                  </Group>
                </div>
                <div className="text-right">
                  <Text size="sm" fw={600}>Experience</Text>
                  <Text size="xl" fw={700} mt={4}>{selectedHygienist.experience}</Text>
                </div>
              </Group>
            </Card>

            <div>
              <Text size="sm" fw={600} mb={8}>Contact Information</Text>
              <Stack gap={8}>
                <Group gap={8}>
                  <Phone size={16} className="text-gray-400" />
                  <Text size="sm">{selectedHygienist.phone}</Text>
                </Group>
                <Group gap={8}>
                  <Mail size={16} className="text-gray-400" />
                  <Text size="sm">{selectedHygienist.email}</Text>
                </Group>
              </Stack>
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>Certifications</Text>
              <Group gap={8}>
                {selectedHygienist.certifications.map((cert: string, index: number) => (
                  <Badge key={index} variant="light" color="green">
                    {cert}
                  </Badge>
                ))}
              </Group>
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>Schedule</Text>
              <Card className="bg-gray-50">
                <Group gap={8}>
                  <Clock size={16} className="text-gray-400" />
                  <Text size="sm">{selectedHygienist.schedule}</Text>
                </Group>
              </Card>
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>This Month's Performance</Text>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-blue-50 border border-blue-200">
                  <Text size="xs" c="dimmed" mb={4}>Patients Treated</Text>
                  <Text size="2xl" fw={700}>{selectedHygienist.patientsThisMonth}</Text>
                </Card>
                <Card className="bg-green-50 border border-green-200">
                  <Text size="xs" c="dimmed" mb={4}>Appointments Today</Text>
                  <Text size="2xl" fw={700}>{selectedHygienist.appointmentsToday}</Text>
                </Card>
              </div>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeView}>
                Close
              </Button>
              <Button
                className="bg-[#19b5af] hover:bg-[#14918c]"
                onClick={() => {
                  closeView();
                  handleEditHygienist(selectedHygienist);
                }}
              >
                Edit Profile
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
