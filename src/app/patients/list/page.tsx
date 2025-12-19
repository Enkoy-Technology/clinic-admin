"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
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
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Download
} from "lucide-react";
import { useState } from "react";

// Mock patient data
const mockPatients = [
  {
    id: "P001",
    name: "Abebe Kebede",
    age: 34,
    gender: "Male",
    phone: "+251 911 234 567",
    email: "abebe@email.com",
    lastVisit: "2024-12-15",
    nextAppointment: "2024-12-20",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=1",
    address: "Bole, Addis Ababa",
  },
  {
    id: "P002",
    name: "Tigist Alemu",
    age: 28,
    gender: "Female",
    phone: "+251 912 345 678",
    email: "tigist@email.com",
    lastVisit: "2024-12-14",
    nextAppointment: "2024-12-18",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=2",
    address: "Kolfe, Addis Ababa",
  },
  {
    id: "P003",
    name: "Dawit Tadesse",
    age: 42,
    gender: "Male",
    phone: "+251 913 456 789",
    email: "dawit@email.com",
    lastVisit: "2024-12-10",
    nextAppointment: null,
    status: "inactive",
    avatar: "https://i.pravatar.cc/100?img=3",
    address: "Merkato, Addis Ababa",
  },
  {
    id: "P004",
    name: "Meron Hailu",
    age: 31,
    gender: "Female",
    phone: "+251 914 567 890",
    email: "meron@email.com",
    lastVisit: "2024-12-16",
    nextAppointment: "2024-12-22",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=4",
    address: "Piassa, Addis Ababa",
  },
  {
    id: "P005",
    name: "Yohannes Bekele",
    age: 55,
    gender: "Male",
    phone: "+251 915 678 901",
    email: "yohannes@email.com",
    lastVisit: "2024-12-12",
    nextAppointment: "2024-12-19",
    status: "active",
    avatar: "https://i.pravatar.cc/100?img=5",
    address: "Megenagna, Addis Ababa",
  },
];

const statusColors: Record<string, string> = {
  active: "green",
  inactive: "gray",
  new: "blue",
};

export default function PatientListPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [genderFilter, setGenderFilter] = useState<string | null>("all");

  // Filter patients
  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    openView();
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    open();
  };

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Patient Directory</Title>
          <Text size="sm" c="dimmed">Complete list of all patients</Text>
        </div>
        <Group>
          <Button
            leftSection={<Download size={18} />}
            variant="light"
          >
            Export
          </Button>
          <Button
            leftSection={<Plus size={18} />}
            className="bg-[#19b5af] hover:bg-[#14918c]"
            onClick={open}
          >
            Add Patient
          </Button>
        </Group>
      </Group>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Patients", value: mockPatients.length.toString(), color: "bg-blue-500" },
          { label: "Active", value: mockPatients.filter(p => p.status === "active").length.toString(), color: "bg-green-500" },
          { label: "Male", value: mockPatients.filter(p => p.gender === "Male").length.toString(), color: "bg-purple-500" },
          { label: "Female", value: mockPatients.filter(p => p.gender === "Female").length.toString(), color: "bg-pink-500" },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb={4}>{stat.label}</Text>
                <Text size="xl" fw={700}>{stat.value}</Text>
              </div>
              <div className={`${stat.color} w-2 h-full rounded-full`} />
            </Group>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card shadow="sm" p="md" mb="md" className="border border-gray-200">
        <Group>
          <TextInput
            placeholder="Search by name, phone, ID, or email..."
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
              { value: "inactive", label: "Inactive" },
              { value: "new", label: "New" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={150}
          />
          <Select
            placeholder="Gender"
            data={[
              { value: "all", label: "All Genders" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            value={genderFilter}
            onChange={setGenderFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Patients Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox />
              </Table.Th>
              <Table.Th>Patient ID</Table.Th>
              <Table.Th>Patient</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Age/Gender</Table.Th>
              <Table.Th>Last Visit</Table.Th>
              <Table.Th>Next Appointment</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPatients.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <Text ta="center" py="xl" c="dimmed">
                    No patients found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredPatients.map((patient) => (
                <Table.Tr key={patient.id}>
                  <Table.Td>
                    <Checkbox />
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="gray">{patient.id}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar src={patient.avatar} size={40} radius="xl" />
                      <div>
                        <Text size="sm" fw={500}>{patient.name}</Text>
                        <Text size="xs" c="dimmed">{patient.address}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Group gap={6}>
                        <Phone size={14} className="text-gray-400" />
                        <Text size="xs">{patient.phone}</Text>
                      </Group>
                      <Group gap={6}>
                        <Mail size={14} className="text-gray-400" />
                        <Text size="xs">{patient.email}</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{patient.age} / {patient.gender}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <Calendar size={14} className="text-gray-400" />
                      <Text size="xs">{patient.lastVisit}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {patient.nextAppointment ? (
                      <Group gap={6}>
                        <Calendar size={14} className="text-[#19b5af]" />
                        <Text size="xs" className="text-[#19b5af]">{patient.nextAppointment}</Text>
                      </Group>
                    ) : (
                      <Text size="xs" c="dimmed">None</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={statusColors[patient.status]}
                      size="sm"
                      className="capitalize"
                    >
                      {patient.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="teal"
                        onClick={() => handleEditPatient(patient)}
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
                          <Menu.Item leftSection={<FileText size={16} />}>
                            View Records
                          </Menu.Item>
                          <Menu.Item leftSection={<Calendar size={16} />}>
                            Book Appointment
                          </Menu.Item>
                          <Menu.Item leftSection={<Phone size={16} />}>
                            Call Patient
                          </Menu.Item>
                          <Menu.Item leftSection={<Mail size={16} />}>
                            Send Email
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item leftSection={<Trash2 size={16} />} color="red">
                            Delete
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

      {/* Add/Edit Patient Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedPatient(null);
        }}
        title={
          <Text fw={600} size="lg">
            {selectedPatient ? "Edit Patient" : "New Patient"}
          </Text>
        }
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter patient name"
            required
            leftSection={<User size={16} />}
            defaultValue={selectedPatient?.name}
          />
          <Group grow>
            <TextInput
              label="Age"
              placeholder="Age"
              type="number"
              required
              defaultValue={selectedPatient?.age}
            />
            <Select
              label="Gender"
              placeholder="Select gender"
              required
              data={["Male", "Female", "Other"]}
              defaultValue={selectedPatient?.gender}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Phone Number"
              placeholder="+251 911 234 567"
              required
              leftSection={<Phone size={16} />}
              defaultValue={selectedPatient?.phone}
            />
            <TextInput
              label="Email"
              placeholder="patient@email.com"
              leftSection={<Mail size={16} />}
              defaultValue={selectedPatient?.email}
            />
          </Group>
          <TextInput
            label="Address"
            placeholder="Enter address"
            required
            defaultValue={selectedPatient?.address}
          />
          <DatePickerInput
            label="Date of Birth"
            placeholder="Select date"
            leftSection={<Calendar size={16} />}
          />
          <Select
            label="Blood Group"
            placeholder="Select blood group"
            data={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          />
          <TextInput
            label="Emergency Contact"
            placeholder="Name and phone number"
            leftSection={<Phone size={16} />}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => {
              close();
              setSelectedPatient(null);
            }}>
              Cancel
            </Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">
              {selectedPatient ? "Update" : "Create"} Patient
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Patient Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Patient Details
          </Text>
        }
        size="md"
      >
        {selectedPatient && (
          <Stack gap="md">
            <Group>
              <Avatar src={selectedPatient.avatar} size={80} radius="xl" />
              <div>
                <Text size="lg" fw={600}>{selectedPatient.name}</Text>
                <Badge variant="light" color={statusColors[selectedPatient.status]} className="capitalize">
                  {selectedPatient.status}
                </Badge>
                <Text size="sm" c="dimmed" mt={4}>Patient ID: {selectedPatient.id}</Text>
              </div>
            </Group>

            <Card className="bg-gray-50">
              <Group grow>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Age</Text>
                  <Text size="sm" fw={500}>{selectedPatient.age}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Gender</Text>
                  <Text size="sm" fw={500}>{selectedPatient.gender}</Text>
                </div>
              </Group>
            </Card>

            <div>
              <Text size="sm" c="dimmed" mb={4}>Contact Information</Text>
              <Stack gap={8}>
                <Group gap={8}>
                  <Phone size={16} className="text-gray-400" />
                  <Text size="sm">{selectedPatient.phone}</Text>
                </Group>
                <Group gap={8}>
                  <Mail size={16} className="text-gray-400" />
                  <Text size="sm">{selectedPatient.email}</Text>
                </Group>
              </Stack>
            </div>

            <div>
              <Text size="sm" c="dimmed" mb={4}>Address</Text>
              <Text size="sm">{selectedPatient.address}</Text>
            </div>

            <Group grow>
              <div>
                <Text size="sm" c="dimmed" mb={4}>Last Visit</Text>
                <Group gap={6}>
                  <Calendar size={16} className="text-gray-400" />
                  <Text size="sm">{selectedPatient.lastVisit}</Text>
                </Group>
              </div>
              <div>
                <Text size="sm" c="dimmed" mb={4}>Next Appointment</Text>
                {selectedPatient.nextAppointment ? (
                  <Group gap={6}>
                    <Calendar size={16} className="text-[#19b5af]" />
                    <Text size="sm" className="text-[#19b5af]">{selectedPatient.nextAppointment}</Text>
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed">None scheduled</Text>
                )}
              </div>
            </Group>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeView}>
                Close
              </Button>
              <Button
                className="bg-[#19b5af] hover:bg-[#14918c]"
                onClick={() => {
                  closeView();
                  handleEditPatient(selectedPatient);
                }}
              >
                Edit Patient
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
