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
  Progress,
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
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  MoreVertical,
  Search,
  TrendingUp,
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetPatientsQuery } from "../../../shared/api/patientsApi";

// Mock payment records data
const mockPaymentRecords = [
  {
    id: 1,
    invoiceId: "INV-001",
    date: "2024-12-15",
    service: "Root Canal Treatment",
    amount: 15000,
    paid: 15000,
    method: "Cash",
    status: "paid",
    dentist: "Dr. Hilina",
    notes: "Full payment received",
    paymentHistory: [
      { date: "2024-12-15", amount: 15000, method: "Cash" },
    ],
  },
  {
    id: 2,
    invoiceId: "INV-002",
    date: "2024-12-10",
    service: "Initial Consultation",
    amount: 2000,
    paid: 2000,
    method: "Bank Transfer",
    status: "paid",
    dentist: "Dr. Hilina",
    notes: "Payment confirmed",
    paymentHistory: [
      { date: "2024-12-10", amount: 2000, method: "Bank Transfer" },
    ],
  },
  {
    id: 3,
    invoiceId: "INV-003",
    date: "2024-12-08",
    service: "Crown Preparation",
    amount: 12000,
    paid: 10000,
    method: "Partial Payment",
    status: "partial",
    dentist: "Dr. Hilina",
    notes: "Remaining: ETB 2,000",
    paymentHistory: [
      { date: "2024-12-08", amount: 5000, method: "Cash" },
      { date: "2024-12-10", amount: 3000, method: "Bank Transfer" },
      { date: "2024-12-12", amount: 2000, method: "Mobile Money" },
    ],
  },
  {
    id: 4,
    invoiceId: "INV-004",
    date: "2024-11-20",
    service: "Teeth Cleaning",
    amount: 3000,
    paid: 3000,
    method: "Mobile Money",
    status: "paid",
    dentist: "Dr. Hilina",
    notes: "Regular cleaning service",
    paymentHistory: [
      { date: "2024-11-20", amount: 3000, method: "Mobile Money" },
    ],
  },
];

const paymentStatusColors: Record<string, string> = {
  paid: "green",
  partial: "yellow",
  pending: "orange",
  overdue: "red",
};

const paymentMethodColors: Record<string, string> = {
  Cash: "blue",
  "Bank Transfer": "purple",
  "Mobile Money": "teal",
  "Credit Card": "indigo",
  "Partial Payment": "yellow",
};

export default function PatientRecordsPage() {
  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get("patientId");

  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patientIdParam);

  // Fetch patients for dropdown
  const { data: patientsData } = useGetPatientsQuery({ page: 1, per_page: 100 });

  // Get selected patient info
  const selectedPatient = patientsData?.results?.find((p: any) => p.id.toString() === selectedPatientId);

  // Filter payment records (in real app, this would come from API)
  const filteredRecords = mockPaymentRecords.filter((record) => {
    const matchesSearch =
      record.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate payment statistics
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalPaid = filteredRecords.reduce((sum, r) => sum + r.paid, 0);
  const totalRemaining = totalAmount - totalPaid;
  const paymentProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    openView();
  };

  useEffect(() => {
    if (patientIdParam) {
      setSelectedPatientId(patientIdParam);
    }
  }, [patientIdParam]);

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Payment Records</Title>
          <Text size="sm" c="dimmed">
            {selectedPatient
              ? `Payment history for ${selectedPatient.profile?.user?.first_name || ""} ${selectedPatient.profile?.user?.last_name || ""}`
              : "View patient payment history and billing information"
            }
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<Download size={18} />}
            variant="light"
          >
            Export
          </Button>
        </Group>
      </Group>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Invoices",
            value: filteredRecords.length.toString(),
            icon: FileText,
            color: "bg-blue-500"
          },
          {
            label: "Total Amount",
            value: `ETB ${totalAmount.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-purple-500"
          },
          {
            label: "Total Paid",
            value: `ETB ${totalPaid.toLocaleString()}`,
            icon: CheckCircle2,
            color: "bg-green-500"
          },
          {
            label: "Remaining",
            value: `ETB ${totalRemaining.toLocaleString()}`,
            icon: Clock,
            color: totalRemaining > 0 ? "bg-red-500" : "bg-gray-500"
          },
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
            placeholder="Search by service..."
            leftSection={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />
          <Select
            placeholder="Payment Status"
            data={[
              { value: "all", label: "All Status" },
              { value: "paid", label: "Paid" },
              { value: "partial", label: "Partial" },
              { value: "pending", label: "Pending" },
              { value: "overdue", label: "Overdue" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={180}
          />
        </Group>
      </Card>

      {/* Payment Records Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Service</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Paid</Table.Th>
              <Table.Th>Remaining</Table.Th>
              <Table.Th>Progress</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRecords.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" py="xl" c="dimmed">
                    No payment records found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredRecords.map((record) => {
                const remaining = record.amount - record.paid;
                const progressPercent = record.amount > 0 ? (record.paid / record.amount) * 100 : 0;
                return (
                  <Table.Tr key={record.id}>
                    <Table.Td>
                      <Group gap={6}>
                        <Calendar size={14} className="text-gray-400" />
                        <Text size="xs">{record.date}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>{record.service}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>ETB {record.amount.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="text-green-600" fw={500}>
                        ETB {record.paid.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        className={remaining > 0 ? "text-red-600" : "text-gray-600"}
                        fw={500}
                      >
                        ETB {remaining.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <div style={{ minWidth: 100 }}>
                        <Progress
                          value={progressPercent}
                          color={progressPercent === 100 ? "green" : progressPercent >= 50 ? "blue" : "yellow"}
                          size="sm"
                          radius="xl"
                        />
                        <Text size="xs" c="dimmed" mt={4} ta="center">
                          {progressPercent.toFixed(0)}%
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={paymentStatusColors[record.status]}
                        size="sm"
                        className="capitalize"
                      >
                        {record.status}
                      </Badge>
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
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="light" color="gray">
                              <MoreVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<Download size={16} />}>
                              Download Invoice
                            </Menu.Item>
                            <Menu.Item leftSection={<FileText size={16} />}>
                              View Details
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* View Payment Record Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Payment Record Details
          </Text>
        }
        size="lg"
      >
        {selectedRecord && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="lg" fw={600}>{selectedRecord.service}</Text>
                <Badge variant="light" color="gray" mt={4}>
                  {selectedRecord.invoiceId}
                </Badge>
              </div>
              <Badge
                variant="light"
                color={paymentStatusColors[selectedRecord.status]}
                size="lg"
                className="capitalize"
              >
                {selectedRecord.status}
              </Badge>
            </Group>

            <Card className="bg-gray-50">
              <Group grow>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Payment Date</Text>
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
              <Text size="sm" fw={600} mb={8}>Payment Breakdown</Text>
              <Stack gap={8}>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Total Amount:</Text>
                  <Text size="sm" fw={600}>ETB {selectedRecord.amount.toLocaleString()}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Amount Paid:</Text>
                  <Text size="sm" fw={600} className="text-green-600">
                    ETB {selectedRecord.paid.toLocaleString()}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Remaining:</Text>
                  <Text
                    size="sm"
                    fw={600}
                    className={selectedRecord.amount - selectedRecord.paid > 0 ? "text-red-600" : "text-gray-600"}
                  >
                    ETB {(selectedRecord.amount - selectedRecord.paid).toLocaleString()}
                  </Text>
                </Group>
                <Progress
                  value={(selectedRecord.paid / selectedRecord.amount) * 100}
                  color={selectedRecord.paid === selectedRecord.amount ? "green" : "yellow"}
                  size="md"
                  radius="xl"
                  mt={8}
                />
              </Stack>
            </div>

            {/* Payment History */}
            {selectedRecord.paymentHistory && selectedRecord.paymentHistory.length > 0 && (
              <div>
                <Text size="sm" fw={600} mb={8}>Payment History</Text>
                <Stack gap={8}>
                  {selectedRecord.paymentHistory.map((payment: any, index: number) => (
                    <Card key={index} className="bg-gray-50 border border-gray-200">
                      <Group justify="space-between">
                        <Group gap={8}>
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <Text size="sm" fw={500}>{payment.date}</Text>
                            <Text size="xs" c="dimmed">{payment.method}</Text>
                          </div>
                        </Group>
                        <Text size="sm" fw={600} className="text-green-600">
                          ETB {payment.amount.toLocaleString()}
                        </Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </div>
            )}

            {selectedRecord.notes && (
              <div>
                <Text size="sm" fw={600} mb={4}>Notes</Text>
                <Card className="bg-gray-50">
                  <Text size="sm">{selectedRecord.notes}</Text>
                </Card>
              </div>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" leftSection={<Download size={16} />}>
                Download Invoice
              </Button>
              <Button variant="light" onClick={closeView}>
                Close
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
