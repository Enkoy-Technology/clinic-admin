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
    Tabs,
    Text,
    TextInput,
    Textarea,
    Title
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
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
    Users
} from "lucide-react";
import { useState } from "react";

// Mock dentists data
const mockDentists = [
  {
    id: 1,
    name: "Dr. Hilina Solomon",
    specialization: "General & Cosmetic Dentistry",
    phone: "+251 910 151 739",
    email: "hilina@clinic.com",
    status: "active",
    experience: "10 years",
    rating: 4.9,
    patientsThisMonth: 45,
    appointmentsToday: 6,
    schedule: "Monday - Friday, 8AM - 4PM",
    avatar: "https://i.pravatar.cc/100?img=10",
    qualifications: ["DDS", "Cosmetic Dentistry Specialist"],
    joinedDate: "2020-01-15",
  },
  {
    id: 2,
    name: "Dr. John Smith",
    specialization: "Orthodontics",
    phone: "+251 911 234 567",
    email: "john@clinic.com",
    status: "active",
    experience: "8 years",
    rating: 4.8,
    patientsThisMonth: 38,
    appointmentsToday: 5,
    schedule: "Monday - Saturday, 9AM - 5PM",
    avatar: "https://i.pravatar.cc/100?img=11",
    qualifications: ["DDS", "Orthodontics Specialist"],
    joinedDate: "2021-03-20",
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialization: "Endodontics & Root Canal",
    phone: "+251 912 345 678",
    email: "sarah@clinic.com",
    status: "on-leave",
    experience: "12 years",
    rating: 4.7,
    patientsThisMonth: 28,
    appointmentsToday: 0,
    schedule: "Tuesday - Saturday, 10AM - 6PM",
    avatar: "https://i.pravatar.cc/100?img=12",
    qualifications: ["DDS", "Endodontics Specialist", "PhD Dental Surgery"],
    joinedDate: "2019-06-10",
  },
];

const statusColors: Record<string, string> = {
  active: "green",
  "on-leave": "yellow",
  inactive: "gray",
};

export default function DentistsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedDentist, setSelectedDentist] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  // Filter dentists
  const filteredDentists = mockDentists.filter((dentist) => {
    const matchesSearch =
      dentist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dentist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dentist.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || dentist.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDentist = (dentist: any) => {
    setSelectedDentist(dentist);
    openView();
  };

  const handleEditDentist = (dentist: any) => {
    setSelectedDentist(dentist);
    open();
  };

  const activeDentists = mockDentists.filter(d => d.status === "active").length;
  const totalPatients = mockDentists.reduce((sum, d) => sum + d.patientsThisMonth, 0);
  const avgRating = (mockDentists.reduce((sum, d) => sum + d.rating, 0) / mockDentists.length).toFixed(1);

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Dentists</Title>
          <Text size="sm" c="dimmed">Manage dentist profiles and schedules</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={open}
        >
          Add Dentist
        </Button>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Dentists", value: mockDentists.length.toString(), icon: Users, color: "bg-blue-500" },
          { label: "Active Today", value: activeDentists.toString(), icon: User, color: "bg-green-500" },
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

      {/* Dentists Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Dentist</Table.Th>
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
            {filteredDentists.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" py="xl" c="dimmed">
                    No dentists found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredDentists.map((dentist) => (
                <Table.Tr key={dentist.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar src={dentist.avatar} size={50} radius="xl" />
                      <div>
                        <Text size="sm" fw={600}>{dentist.name}</Text>
                        <Group gap={6}>
                          <Star size={14} fill="#fbbf24" className="text-yellow-400" />
                          <Text size="xs" c="dimmed">{dentist.rating}</Text>
                        </Group>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{dentist.specialization}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Group gap={6}>
                        <Phone size={14} className="text-gray-400" />
                        <Text size="xs">{dentist.phone}</Text>
                      </Group>
                      <Group gap={6}>
                        <Mail size={14} className="text-gray-400" />
                        <Text size="xs">{dentist.email}</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{dentist.experience}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Text size="xs" c="dimmed">Patients: {dentist.patientsThisMonth}</Text>
                      <Text size="xs" c="dimmed">Today: {dentist.appointmentsToday} appts</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <Clock size={14} className="text-gray-400" />
                      <Text size="xs" lineClamp={2}>{dentist.schedule}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={statusColors[dentist.status]}
                      size="sm"
                      className="capitalize"
                    >
                      {dentist.status.replace('-', ' ')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleViewDentist(dentist)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="teal"
                        onClick={() => handleEditDentist(dentist)}
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

      {/* Add/Edit Dentist Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedDentist(null);
        }}
        title={
          <Text fw={600} size="lg">
            {selectedDentist ? "Edit Dentist" : "Add New Dentist"}
          </Text>
        }
        size="xl"
      >
        <Tabs defaultValue="personal">
          <Tabs.List>
            <Tabs.Tab value="personal" leftSection={<User size={16} />}>
              Personal Info
            </Tabs.Tab>
            <Tabs.Tab value="professional" leftSection={<Award size={16} />}>
              Professional
            </Tabs.Tab>
            <Tabs.Tab value="schedule" leftSection={<Calendar size={16} />}>
              Schedule
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="personal" pt="md">
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Dr. John Doe"
                required
                leftSection={<User size={16} />}
                defaultValue={selectedDentist?.name}
              />
              <Group grow>
                <TextInput
                  label="Phone Number"
                  placeholder="+251 911 234 567"
                  required
                  leftSection={<Phone size={16} />}
                  defaultValue={selectedDentist?.phone}
                />
                <TextInput
                  label="Email"
                  placeholder="email@clinic.com"
                  required
                  leftSection={<Mail size={16} />}
                  defaultValue={selectedDentist?.email}
                />
              </Group>
              <DatePickerInput
                label="Date of Birth"
                placeholder="Select date"
                leftSection={<Calendar size={16} />}
              />
              <TextInput
                label="Address"
                placeholder="Enter address"
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="professional" pt="md">
            <Stack gap="md">
              <TextInput
                label="Specialization"
                placeholder="e.g., Orthodontics, Endodontics"
                required
                defaultValue={selectedDentist?.specialization}
              />
              <TextInput
                label="Years of Experience"
                placeholder="e.g., 10 years"
                required
                defaultValue={selectedDentist?.experience}
              />
              <Textarea
                label="Qualifications"
                placeholder="List qualifications (e.g., DDS, PhD)"
                rows={3}
              />
              <TextInput
                label="License Number"
                placeholder="Enter license number"
                required
              />
              <DatePickerInput
                label="Joining Date"
                placeholder="Select date"
                leftSection={<Calendar size={16} />}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="schedule" pt="md">
            <Stack gap="md">
              <Select
                label="Working Days"
                placeholder="Select days"
                data={[
                  "Monday - Friday",
                  "Monday - Saturday",
                  "Tuesday - Saturday",
                  "Custom",
                ]}
                defaultValue={selectedDentist?.schedule?.split(",")[0]}
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
              <Textarea
                label="Additional Notes"
                placeholder="Any special schedule considerations..."
                rows={3}
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={() => {
            close();
            setSelectedDentist(null);
          }}>
            Cancel
          </Button>
          <Button className="bg-[#19b5af] hover:bg-[#14918c]">
            {selectedDentist ? "Update" : "Add"} Dentist
          </Button>
        </Group>
      </Modal>

      {/* View Dentist Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Dentist Profile
          </Text>
        }
        size="lg"
      >
        {selectedDentist && (
          <Stack gap="md">
            <Group>
              <Avatar src={selectedDentist.avatar} size={80} radius="xl" />
              <div>
                <Text size="lg" fw={600}>{selectedDentist.name}</Text>
                <Text size="sm" c="dimmed" mb={4}>{selectedDentist.specialization}</Text>
                <Badge
                  variant="light"
                  color={statusColors[selectedDentist.status]}
                  className="capitalize"
                >
                  {selectedDentist.status.replace('-', ' ')}
                </Badge>
              </div>
            </Group>

            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={600}>Rating</Text>
                  <Group gap={6} mt={4}>
                    <Star size={20} fill="#fbbf24" className="text-yellow-400" />
                    <Text size="xl" fw={700}>{selectedDentist.rating}/5.0</Text>
                  </Group>
                </div>
                <div className="text-right">
                  <Text size="sm" fw={600}>Experience</Text>
                  <Text size="xl" fw={700} mt={4}>{selectedDentist.experience}</Text>
                </div>
              </Group>
            </Card>

            <div>
              <Text size="sm" fw={600} mb={8}>Contact Information</Text>
              <Stack gap={8}>
                <Group gap={8}>
                  <Phone size={16} className="text-gray-400" />
                  <Text size="sm">{selectedDentist.phone}</Text>
                </Group>
                <Group gap={8}>
                  <Mail size={16} className="text-gray-400" />
                  <Text size="sm">{selectedDentist.email}</Text>
                </Group>
              </Stack>
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>Qualifications</Text>
              <Group gap={8}>
                {selectedDentist.qualifications.map((qual: string, index: number) => (
                  <Badge key={index} variant="light" color="blue">
                    {qual}
                  </Badge>
                ))}
              </Group>
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>Schedule</Text>
              <Card className="bg-gray-50">
                <Group gap={8}>
                  <Clock size={16} className="text-gray-400" />
                  <Text size="sm">{selectedDentist.schedule}</Text>
                </Group>
              </Card>
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>This Month's Performance</Text>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-blue-50 border border-blue-200">
                  <Text size="xs" c="dimmed" mb={4}>Patients Treated</Text>
                  <Text size="2xl" fw={700}>{selectedDentist.patientsThisMonth}</Text>
                </Card>
                <Card className="bg-green-50 border border-green-200">
                  <Text size="xs" c="dimmed" mb={4}>Appointments Today</Text>
                  <Text size="2xl" fw={700}>{selectedDentist.appointmentsToday}</Text>
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
                  handleEditDentist(selectedDentist);
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
