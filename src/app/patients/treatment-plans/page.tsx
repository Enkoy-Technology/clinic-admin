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
  Progress,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  User,
  X
} from "lucide-react";
import { useState } from "react";

// Mock treatment plans data
const mockTreatmentPlans = [
  {
    id: 1,
    patient: "Abebe Kebede",
    patientId: "P001",
    planName: "Root Canal & Crown Treatment",
    startDate: "2024-12-01",
    estimatedEnd: "2025-01-15",
    status: "in-progress",
    progress: 60,
    totalCost: 45000,
    paidAmount: 27000,
    dentist: "Dr. Hilina",
    avatar: "https://i.pravatar.cc/100?img=1",
    procedures: [
      { name: "Initial Consultation", status: "completed", date: "2024-12-01" },
      { name: "Root Canal Treatment", status: "completed", date: "2024-12-08" },
      { name: "Crown Preparation", status: "in-progress", date: "2024-12-20" },
      { name: "Crown Placement", status: "pending", date: "2025-01-15" },
    ],
  },
  {
    id: 2,
    patient: "Tigist Alemu",
    patientId: "P002",
    planName: "Orthodontic Treatment (Braces)",
    startDate: "2024-11-15",
    estimatedEnd: "2026-11-15",
    status: "in-progress",
    progress: 15,
    totalCost: 120000,
    paidAmount: 40000,
    dentist: "Dr. Hilina",
    avatar: "https://i.pravatar.cc/100?img=2",
    procedures: [
      { name: "Consultation & Assessment", status: "completed", date: "2024-11-15" },
      { name: "Impressions & X-rays", status: "completed", date: "2024-11-20" },
      { name: "Braces Installation", status: "completed", date: "2024-12-01" },
      { name: "Regular Adjustments", status: "in-progress", date: "Ongoing" },
    ],
  },
  {
    id: 3,
    patient: "Dawit Tadesse",
    patientId: "P003",
    planName: "Full Mouth Restoration",
    startDate: "2024-12-10",
    estimatedEnd: "2025-03-10",
    status: "pending",
    progress: 10,
    totalCost: 85000,
    paidAmount: 10000,
    dentist: "Dr. Hilina",
    avatar: "https://i.pravatar.cc/100?img=3",
    procedures: [
      { name: "Comprehensive Examination", status: "completed", date: "2024-12-10" },
      { name: "Treatment Planning", status: "in-progress", date: "2024-12-18" },
      { name: "Phase 1: Extractions", status: "pending", date: "TBD" },
      { name: "Phase 2: Implants", status: "pending", date: "TBD" },
      { name: "Phase 3: Crowns", status: "pending", date: "TBD" },
    ],
  },
  {
    id: 4,
    patient: "Meron Hailu",
    patientId: "P004",
    planName: "Cosmetic Dentistry Package",
    startDate: "2024-11-01",
    estimatedEnd: "2024-12-01",
    status: "completed",
    progress: 100,
    totalCost: 35000,
    paidAmount: 35000,
    dentist: "Dr. Hilina",
    avatar: "https://i.pravatar.cc/100?img=4",
    procedures: [
      { name: "Teeth Whitening", status: "completed", date: "2024-11-05" },
      { name: "Composite Bonding", status: "completed", date: "2024-11-15" },
      { name: "Final Polish", status: "completed", date: "2024-11-25" },
    ],
  },
];

const statusColors: Record<string, string> = {
  "in-progress": "blue",
  pending: "yellow",
  completed: "green",
  cancelled: "red",
};

export default function TreatmentPlansPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");

  // Filter treatment plans
  const filteredPlans = mockTreatmentPlans.filter((plan) => {
    const matchesSearch =
      plan.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan);
    openView();
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    open();
  };

  const activePlans = mockTreatmentPlans.filter(p => p.status === "in-progress").length;
  const completedPlans = mockTreatmentPlans.filter(p => p.status === "completed").length;
  const totalRevenue = mockTreatmentPlans.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Treatment Plans</Title>
          <Text size="sm" c="dimmed">Manage patient treatment plans and progress</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={open}
        >
          New Treatment Plan
        </Button>
      </Group>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Plans", value: activePlans.toString(), icon: Clock, color: "bg-blue-500" },
          { label: "Completed", value: completedPlans.toString(), icon: CheckCircle2, color: "bg-green-500" },
          { label: "Total Revenue", value: `ETB ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-purple-500" },
          { label: "Avg Completion", value: "78%", icon: Check, color: "bg-yellow-500" },
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
            placeholder="Search by patient, ID, or plan name..."
            leftSection={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />
          <Select
            placeholder="Status"
            data={[
              { value: "all", label: "All Status" },
              { value: "in-progress", label: "In Progress" },
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Treatment Plans Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Patient</Table.Th>
              <Table.Th>Treatment Plan</Table.Th>
              <Table.Th>Timeline</Table.Th>
              <Table.Th>Progress</Table.Th>
              <Table.Th>Cost & Payment</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPlans.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text ta="center" py="xl" c="dimmed">
                    No treatment plans found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredPlans.map((plan) => (
                <Table.Tr key={plan.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar src={plan.avatar} size={40} radius="xl" />
                      <div>
                        <Text size="sm" fw={500}>{plan.patient}</Text>
                        <Badge variant="light" color="gray" size="xs">{plan.patientId}</Badge>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{plan.planName}</Text>
                    <Text size="xs" c="dimmed">{plan.dentist}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Group gap={6}>
                        <Calendar size={14} className="text-gray-400" />
                        <Text size="xs">Start: {plan.startDate}</Text>
                      </Group>
                      <Group gap={6}>
                        <Clock size={14} className="text-gray-400" />
                        <Text size="xs">End: {plan.estimatedEnd}</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Group justify="space-between" mb={4}>
                        <Text size="xs" c="dimmed">Progress</Text>
                        <Text size="xs" fw={600}>{plan.progress}%</Text>
                      </Group>
                      <Progress
                        value={plan.progress}
                        color={plan.status === "completed" ? "green" : "blue"}
                        size="sm"
                        radius="xl"
                      />
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Text size="xs" fw={500}>ETB {plan.totalCost.toLocaleString()}</Text>
                      <Text size="xs" c="dimmed">
                        Paid: ETB {plan.paidAmount.toLocaleString()}
                      </Text>
                      <Progress
                        value={(plan.paidAmount / plan.totalCost) * 100}
                        color="green"
                        size="xs"
                        radius="xl"
                      />
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={statusColors[plan.status]}
                      size="sm"
                      className="capitalize"
                    >
                      {plan.status.replace('-', ' ')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="teal"
                        onClick={() => handleEditPlan(plan)}
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
                          <Menu.Item leftSection={<DollarSign size={16} />}>
                            Record Payment
                          </Menu.Item>
                          <Menu.Item leftSection={<Calendar size={16} />}>
                            Schedule Next Visit
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item leftSection={<Trash2 size={16} />} color="red">
                            Cancel Plan
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

      {/* Add/Edit Treatment Plan Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedPlan(null);
        }}
        title={
          <Text fw={600} size="lg">
            {selectedPlan ? "Edit Treatment Plan" : "New Treatment Plan"}
          </Text>
        }
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Patient"
            placeholder="Select patient"
            required
            data={mockTreatmentPlans.map(p => ({ value: p.patientId, label: p.patient }))}
            leftSection={<User size={16} />}
            defaultValue={selectedPlan?.patientId}
          />
          <TextInput
            label="Treatment Plan Name"
            placeholder="e.g., Root Canal & Crown Treatment"
            required
            defaultValue={selectedPlan?.planName}
          />
          <Select
            label="Primary Dentist"
            placeholder="Select dentist"
            required
            data={["Dr. Hilina", "Dr. John", "Dr. Sarah"]}
            defaultValue={selectedPlan?.dentist}
          />
          <Group grow>
            <DatePickerInput
              label="Start Date"
              placeholder="Select date"
              required
              leftSection={<Calendar size={16} />}
            />
            <DatePickerInput
              label="Estimated End Date"
              placeholder="Select date"
              required
              leftSection={<Clock size={16} />}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Total Cost (ETB)"
              placeholder="Enter total cost"
              required
              type="number"
              leftSection={<DollarSign size={16} />}
              defaultValue={selectedPlan?.totalCost}
            />
            <TextInput
              label="Initial Payment (ETB)"
              placeholder="Enter initial payment"
              type="number"
              leftSection={<DollarSign size={16} />}
              defaultValue={selectedPlan?.paidAmount}
            />
          </Group>
          <Textarea
            label="Treatment Description"
            placeholder="Describe the treatment plan and procedures..."
            required
            rows={4}
          />
          <Select
            label="Status"
            placeholder="Select status"
            required
            data={[
              { value: "pending", label: "Pending" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
            defaultValue={selectedPlan?.status}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => {
              close();
              setSelectedPlan(null);
            }}>
              Cancel
            </Button>
            <Button className="bg-[#19b5af] hover:bg-[#14918c]">
              {selectedPlan ? "Update" : "Create"} Plan
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Treatment Plan Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Treatment Plan Details
          </Text>
        }
        size="lg"
      >
        {selectedPlan && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group>
                <Avatar src={selectedPlan.avatar} size={60} radius="xl" />
                <div>
                  <Text size="lg" fw={600}>{selectedPlan.patient}</Text>
                  <Badge variant="light" color="gray">{selectedPlan.patientId}</Badge>
                </div>
              </Group>
              <Badge
                variant="light"
                color={statusColors[selectedPlan.status]}
                size="lg"
                className="capitalize"
              >
                {selectedPlan.status.replace('-', ' ')}
              </Badge>
            </Group>

            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20">
              <Text size="md" fw={600} mb={4}>{selectedPlan.planName}</Text>
              <Text size="sm" c="dimmed">Assigned to {selectedPlan.dentist}</Text>
            </Card>

            <Card className="bg-gray-50">
              <Group grow>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Start Date</Text>
                  <Group gap={6}>
                    <Calendar size={16} className="text-gray-400" />
                    <Text size="sm" fw={500}>{selectedPlan.startDate}</Text>
                  </Group>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Estimated End</Text>
                  <Group gap={6}>
                    <Clock size={16} className="text-gray-400" />
                    <Text size="sm" fw={500}>{selectedPlan.estimatedEnd}</Text>
                  </Group>
                </div>
              </Group>
            </Card>

            <div>
              <Text size="sm" fw={600} mb={8}>Overall Progress</Text>
              <Group justify="space-between" mb={4}>
                <Text size="sm" c="dimmed">Completion</Text>
                <Text size="sm" fw={600}>{selectedPlan.progress}%</Text>
              </Group>
              <Progress
                value={selectedPlan.progress}
                color={selectedPlan.status === "completed" ? "green" : "blue"}
                size="lg"
                radius="xl"
              />
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>Payment Status</Text>
              <Group justify="space-between" mb={4}>
                <Text size="sm">Total Cost:</Text>
                <Text size="sm" fw={600}>ETB {selectedPlan.totalCost.toLocaleString()}</Text>
              </Group>
              <Group justify="space-between" mb={4}>
                <Text size="sm">Paid Amount:</Text>
                <Text size="sm" fw={600} className="text-green-600">
                  ETB {selectedPlan.paidAmount.toLocaleString()}
                </Text>
              </Group>
              <Group justify="space-between" mb={8}>
                <Text size="sm">Remaining:</Text>
                <Text size="sm" fw={600} className="text-red-600">
                  ETB {(selectedPlan.totalCost - selectedPlan.paidAmount).toLocaleString()}
                </Text>
              </Group>
              <Progress
                value={(selectedPlan.paidAmount / selectedPlan.totalCost) * 100}
                color="green"
                size="md"
                radius="xl"
              />
            </div>

            <div>
              <Text size="sm" fw={600} mb={8}>Treatment Procedures</Text>
              <Timeline active={selectedPlan.procedures.findIndex((p: any) => p.status === "in-progress")} bulletSize={24} lineWidth={2}>
                {selectedPlan.procedures.map((procedure: any, index: number) => (
                  <Timeline.Item
                    key={index}
                    bullet={
                      procedure.status === "completed" ? (
                        <CheckCircle2 size={16} />
                      ) : procedure.status === "in-progress" ? (
                        <Clock size={16} />
                      ) : (
                        <X size={16} />
                      )
                    }
                    title={procedure.name}
                    color={
                      procedure.status === "completed"
                        ? "green"
                        : procedure.status === "in-progress"
                        ? "blue"
                        : "gray"
                    }
                  >
                    <Text size="xs" c="dimmed" mt={4}>
                      {procedure.date}
                    </Text>
                    <Badge
                      variant="light"
                      color={
                        procedure.status === "completed"
                          ? "green"
                          : procedure.status === "in-progress"
                          ? "blue"
                          : "gray"
                      }
                      size="xs"
                      mt={4}
                      className="capitalize"
                    >
                      {procedure.status.replace('-', ' ')}
                    </Badge>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="light" leftSection={<DollarSign size={16} />}>
                Record Payment
              </Button>
              <Button variant="light" onClick={closeView}>
                Close
              </Button>
              <Button
                className="bg-[#19b5af] hover:bg-[#14918c]"
                onClick={() => {
                  closeView();
                  handleEditPlan(selectedPlan);
                }}
              >
                Edit Plan
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
