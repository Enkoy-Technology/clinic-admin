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
  Textarea,
  TextInput,
  Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  AlertCircle,
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Pill,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  X
} from "lucide-react";
import { useState } from "react";

// Mock records data
const mockRecords = [
  {
    id: 1,
    patient: "Abebe Kebede",
    patientId: "P001",
    date: "2024-12-15",
    type: "consultation",
    diagnosis: "Root Canal Treatment Required",
    treatment: "Root Canal Therapy initiated",
    dentist: "Dr. Hilina",
    notes: "Patient experiencing pain in lower left molar. X-ray shows infection.",
    prescriptions: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
    attachments: 2,
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    patient: "Tigist Alemu",
    patientId: "P002",
    date: "2024-12-14",
    type: "checkup",
    diagnosis: "Healthy - Routine Cleaning",
    treatment: "Professional teeth cleaning completed",
    dentist: "Dr. Hilina",
    notes: "Regular checkup, no issues found. Patient advised on proper brushing technique.",
    prescriptions: [],
    attachments: 1,
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    patient: "Dawit Tadesse",
    patientId: "P003",
    date: "2024-12-10",
    type: "followup",
    diagnosis: "Orthodontic Assessment",
    treatment: "Treatment plan discussed for braces",
    dentist: "Dr. Hilina",
    notes: "Patient interested in orthodontic treatment. Impressions taken for treatment planning.",
    prescriptions: [],
    attachments: 3,
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

const recordTypeColors: Record<string, string> = {
  consultation: "blue",
  checkup: "green",
  followup: "purple",
  emergency: "red",
  surgery: "orange",
};

export default function PatientRecordsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("all");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Filter records
  const filteredRecords = mockRecords.filter((record) => {
    const matchesSearch =
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || record.type === typeFilter;
    const matchesPatient = !selectedPatient || record.patientId === selectedPatient;

    return matchesSearch && matchesType && matchesPatient;
  });

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    openView();
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    open();
  };

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Medical Records</Title>
          <Text size="sm" c="dimmed">Patient medical history and records</Text>
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
            New Record
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Records", value: mockRecords.length.toString(), icon: FileText, color: "bg-blue-500" },
          { label: "This Month", value: "12", icon: Calendar, color: "bg-green-500" },
          { label: "With Attachments", value: mockRecords.filter(r => r.attachments > 0).length.toString(), icon: ImageIcon, color: "bg-purple-500" },
          { label: "Prescriptions", value: "24", icon: Pill, color: "bg-yellow-500" },
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
            placeholder="Search by patient, ID, or diagnosis..."
            leftSection={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />
          <Select
            placeholder="Select Patient"
            data={[
              { value: "all", label: "All Patients" },
              ...mockRecords.map(r => ({ value: r.patientId, label: r.patient }))
            ]}
            value={selectedPatient}
            onChange={setSelectedPatient}
            clearable
            w={200}
          />
          <Select
            placeholder="Record Type"
            data={[
              { value: "all", label: "All Types" },
              { value: "consultation", label: "Consultation" },
              { value: "checkup", label: "Checkup" },
              { value: "followup", label: "Follow-up" },
              { value: "emergency", label: "Emergency" },
              { value: "surgery", label: "Surgery" },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Records Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Patient</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Diagnosis</Table.Th>
              <Table.Th>Treatment</Table.Th>
              <Table.Th>Dentist</Table.Th>
              <Table.Th>Attachments</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRecords.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" py="xl" c="dimmed">
                    No records found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredRecords.map((record) => (
                <Table.Tr key={record.id}>
                  <Table.Td>
                    <Group gap={6}>
                      <Calendar size={14} className="text-gray-400" />
                      <Text size="xs">{record.date}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar src={record.avatar} size={40} radius="xl" />
                      <div>
                        <Text size="sm" fw={500}>{record.patient}</Text>
                        <Badge variant="light" color="gray" size="xs">{record.patientId}</Badge>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={recordTypeColors[record.type]}
                      size="sm"
                      className="capitalize"
                    >
                      {record.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={1}>{record.diagnosis}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={1}>{record.treatment}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{record.dentist}</Text>
                  </Table.Td>
                  <Table.Td>
                    {record.attachments > 0 ? (
                      <Group gap={6}>
                        <ImageIcon size={14} className="text-gray-400" />
                        <Text size="xs">{record.attachments}</Text>
                      </Group>
                    ) : (
                      <Text size="xs" c="dimmed">None</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleViewRecord(record)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="teal"
                        onClick={() => handleEditRecord(record)}
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
                          <Menu.Item leftSection={<Download size={16} />}>
                            Download PDF
                          </Menu.Item>
                          <Menu.Item leftSection={<ImageIcon size={16} />}>
                            View Attachments
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

      {/* Add/Edit Record Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedRecord(null);
        }}
        title={
          <Text fw={600} size="lg">
            {selectedRecord ? "Edit Medical Record" : "New Medical Record"}
          </Text>
        }
        size="xl"
      >
        <Stack gap="md">
          <Tabs defaultValue="basic">
            <Tabs.List>
              <Tabs.Tab value="basic" leftSection={<FileText size={16} />}>
                Basic Info
              </Tabs.Tab>
              <Tabs.Tab value="clinical" leftSection={<AlertCircle size={16} />}>
                Clinical Details
              </Tabs.Tab>
              <Tabs.Tab value="attachments" leftSection={<Upload size={16} />}>
                Attachments
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" pt="md">
              <Stack gap="md">
                <Select
                  label="Patient"
                  placeholder="Select patient"
                  required
                  data={mockRecords.map(r => ({ value: r.patientId, label: r.patient }))}
                  leftSection={<User size={16} />}
                  defaultValue={selectedRecord?.patientId}
                />
                <Group grow>
                  <DatePickerInput
                    label="Visit Date"
                    placeholder="Select date"
                    required
                    leftSection={<Calendar size={16} />}
                  />
                  <Select
                    label="Record Type"
                    placeholder="Select type"
                    required
                    data={[
                      { value: "consultation", label: "Consultation" },
                      { value: "checkup", label: "Checkup" },
                      { value: "followup", label: "Follow-up" },
                      { value: "emergency", label: "Emergency" },
                      { value: "surgery", label: "Surgery" },
                    ]}
                    defaultValue={selectedRecord?.type}
                  />
                </Group>
                <Select
                  label="Dentist"
                  placeholder="Select dentist"
                  required
                  data={["Dr. Hilina", "Dr. John", "Dr. Sarah"]}
                  defaultValue={selectedRecord?.dentist}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="clinical" pt="md">
              <Stack gap="md">
                <TextInput
                  label="Chief Complaint"
                  placeholder="Patient's main complaint"
                  required
                />
                <Textarea
                  label="Diagnosis"
                  placeholder="Enter diagnosis details"
                  required
                  rows={3}
                  defaultValue={selectedRecord?.diagnosis}
                />
                <Textarea
                  label="Treatment Provided"
                  placeholder="Describe treatment"
                  required
                  rows={3}
                  defaultValue={selectedRecord?.treatment}
                />
                <Textarea
                  label="Clinical Notes"
                  placeholder="Additional notes and observations"
                  rows={4}
                  defaultValue={selectedRecord?.notes}
                />
                <TextInput
                  label="Prescriptions"
                  placeholder="Medications prescribed (comma separated)"
                  leftSection={<Pill size={16} />}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="attachments" pt="md">
              <Stack gap="md">
                <Card className="border-2 border-dashed border-gray-300 hover:border-[#19b5af] transition-colors cursor-pointer">
                  <Group justify="center" py="xl">
                    <Upload size={32} className="text-gray-400" />
                    <div className="text-center">
                      <Text size="sm" fw={500}>Click to upload or drag and drop</Text>
                      <Text size="xs" c="dimmed">X-rays, photos, documents (Max 10MB)</Text>
                    </div>
                  </Group>
                </Card>
                <Text size="xs" c="dimmed">
                  Supported formats: JPG, PNG, PDF, DICOM
                </Text>
              </Stack>
            </Tabs.Panel>
          </Tabs>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => {
              close();
              setSelectedRecord(null);
            }}>
              Cancel
            </Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">
              {selectedRecord ? "Update" : "Create"} Record
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Record Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Medical Record Details
          </Text>
        }
        size="lg"
      >
        {selectedRecord && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group>
                <Avatar src={selectedRecord.avatar} size={60} radius="xl" />
                <div>
                  <Text size="lg" fw={600}>{selectedRecord.patient}</Text>
                  <Badge variant="light" color="gray">{selectedRecord.patientId}</Badge>
                </div>
              </Group>
              <Badge
                variant="light"
                color={recordTypeColors[selectedRecord.type]}
                size="lg"
                className="capitalize"
              >
                {selectedRecord.type}
              </Badge>
            </Group>

            <Card className="bg-gray-50">
              <Group grow>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Visit Date</Text>
                  <Group gap={6}>
                    <Calendar size={16} className="text-gray-400" />
                    <Text size="sm" fw={500}>{selectedRecord.date}</Text>
                  </Group>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Dentist</Text>
                  <Text size="sm" fw={500}>{selectedRecord.dentist}</Text>
                </div>
              </Group>
            </Card>

            <div>
              <Text size="sm" fw={600} mb={4}>Diagnosis</Text>
              <Card className="bg-blue-50 border border-blue-200">
                <Text size="sm">{selectedRecord.diagnosis}</Text>
              </Card>
            </div>

            <div>
              <Text size="sm" fw={600} mb={4}>Treatment Provided</Text>
              <Card className="bg-green-50 border border-green-200">
                <Text size="sm">{selectedRecord.treatment}</Text>
              </Card>
            </div>

            <div>
              <Text size="sm" fw={600} mb={4}>Clinical Notes</Text>
              <Card className="bg-gray-50">
                <Text size="sm">{selectedRecord.notes}</Text>
              </Card>
            </div>

            {selectedRecord.prescriptions.length > 0 && (
              <div>
                <Text size="sm" fw={600} mb={4}>Prescriptions</Text>
                <Stack gap={8}>
                  {selectedRecord.prescriptions.map((prescription: string, index: number) => (
                    <Card key={index} className="bg-purple-50 border border-purple-200">
                      <Group gap={8}>
                        <Pill size={16} className="text-purple-600" />
                        <Text size="sm">{prescription}</Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </div>
            )}

            {selectedRecord.attachments > 0 && (
              <div>
                <Text size="sm" fw={600} mb={4}>Attachments</Text>
                <Card className="bg-gray-50">
                  <Group gap={8}>
                    <ImageIcon size={16} className="text-gray-400" />
                    <Text size="sm">{selectedRecord.attachments} file(s) attached</Text>
                    <Button variant="subtle" size="xs" leftSection={<Eye size={14} />}>
                      View
                    </Button>
                  </Group>
                </Card>
              </div>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" leftSection={<Download size={16} />}>
                Download PDF
              </Button>
              <Button variant="light" onClick={closeView}>
                Close
              </Button>
              <Button
                className="bg-[#19b5af] hover:bg-[#14918c]"
                onClick={() => {
                  closeView();
                  handleEditRecord(selectedRecord);
                }}
              >
                Edit Record
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
