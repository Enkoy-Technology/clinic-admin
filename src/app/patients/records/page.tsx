"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  Progress,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetPatientsQuery } from "../../../shared/api/patientsApi";

// Mock payment records data - each record is tied to a patient
const mockPaymentRecords = [
  {
    id: 1,
    patientId: 1, // Patient ID this record belongs to
    invoiceId: "INV-001",
    date: "2024-12-15",
    service: "Root Canal Treatment",
    amount: 15000,
    paid: 15000,
    method: "Cash",
    status: "paid",
    dentist: "Dr. Hilina",
    notes: "Full payment received",
    paymentHistory: [{ date: "2024-12-15", amount: 15000, method: "Cash" }],
  },
  {
    id: 2,
    patientId: 1, // Same patient
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
    patientId: 1, // Same patient
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
    patientId: 2, // Different patient
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get("patientId");

  const [viewModalOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    patientIdParam
  );

  // Fetch patients for dropdown
  const { data: patientsData } = useGetPatientsQuery({
    page: 1,
    per_page: 100,
  });

  // Get selected patient info
  const selectedPatient = patientsData?.results?.find(
    (p: any) => p.id.toString() === selectedPatientId
  );

  // Aggregate payment records by patient (in real app, this would come from API)
  // Group all invoices/payments by patient and calculate totals
  const patientPaymentData =
    patientsData?.results?.map((patient: any) => {
      // Get all payment records for this patient
      const patientRecords = mockPaymentRecords.filter(
        (record) => record.patientId?.toString() === patient.id.toString()
      );

      const totalAmount = patientRecords.reduce((sum, r) => sum + r.amount, 0);
      const totalPaid = patientRecords.reduce((sum, r) => sum + r.paid, 0);
      const totalRemaining = totalAmount - totalPaid;
      const progressPercent =
        totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

      // Determine overall status
      let overallStatus = "pending";
      if (totalPaid === 0) {
        overallStatus = "pending";
      } else if (totalPaid >= totalAmount) {
        overallStatus = "paid";
      } else {
        overallStatus = "partial";
      }

      return {
        patientId: patient.id,
        patient: patient,
        totalAmount,
        totalPaid,
        totalRemaining,
        progressPercent,
        status: overallStatus,
        invoiceCount: patientRecords.length,
        records: patientRecords, // Keep individual records for detail view
      };
    }) || [];

  // Filter by selected patient if provided
  let filteredPatientData = patientPaymentData;
  if (selectedPatientId) {
    filteredPatientData = patientPaymentData.filter(
      (data) => data.patientId.toString() === selectedPatientId
    );
  }

  // Apply search filter
  const searchFiltered = filteredPatientData.filter((data) => {
    const patientName =
      `${data.patient.profile?.user?.first_name || ""} ${data.patient.profile?.user?.last_name || ""}`
        .trim()
        .toLowerCase();
    const patientId = data.patientId.toString();
    const matchesSearch =
      !searchQuery ||
      patientName.includes(searchQuery.toLowerCase()) ||
      patientId.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || data.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate overall statistics
  const totalAmount = searchFiltered.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaid = searchFiltered.reduce((sum, p) => sum + p.totalPaid, 0);
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
          <Title order={2} className="text-gray-800">
            Payment Records
          </Title>
          <Text size="sm" c="dimmed">
            {selectedPatient
              ? `Payment history for ${selectedPatient.profile?.user?.first_name || ""} ${selectedPatient.profile?.user?.last_name || ""}`
              : "View patient payment history and billing information"}
          </Text>
          {selectedPatient && (
            <Group gap="xs" mt={4}>
              <User size={14} className="text-gray-400" />
              <Text size="xs" c="dimmed">
                Patient ID: #{selectedPatient.id}
              </Text>
              {selectedPatient.profile?.phone_number && (
                <>
                  <Text size="xs" c="dimmed">
                    •
                  </Text>
                  <Text size="xs" c="dimmed">
                    Phone: {selectedPatient.profile.phone_number}
                  </Text>
                </>
              )}
            </Group>
          )}
        </div>
        <Group>
          {selectedPatient && (
            <Button
              leftSection={<Plus size={18} />}
              className="bg-[#19b5af] hover:bg-[#14918c]"
              onClick={() =>
                router.push(
                  `/patients/payments/add?patientId=${selectedPatient.id}`
                )
              }
            >
              Add Payment
            </Button>
          )}
          <Button leftSection={<Download size={18} />} variant="light">
            Export
          </Button>
        </Group>
      </Group>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Patients",
            value: searchFiltered.length.toString(),
            icon: FileText,
            color: "bg-blue-500",
          },
          {
            label: "Total Amount",
            value: `ETB ${totalAmount.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-purple-500",
          },
          {
            label: "Total Paid",
            value: `ETB ${totalPaid.toLocaleString()}`,
            icon: CheckCircle2,
            color: "bg-green-500",
          },
          {
            label: "Remaining",
            value: `ETB ${totalRemaining.toLocaleString()}`,
            icon: Clock,
            color: totalRemaining > 0 ? "bg-red-500" : "bg-gray-500",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            shadow="sm"
            p="md"
            className="border border-gray-200"
          >
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  {stat.label}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
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
            placeholder="Search by patient name or ID..."
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
              <Table.Th>Patient Name</Table.Th>
              <Table.Th>Total Amount</Table.Th>
              <Table.Th>Total Paid</Table.Th>
              <Table.Th>Remaining</Table.Th>
              <Table.Th>Progress</Table.Th>
              <Table.Th>Invoices</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {searchFiltered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" py="xl" c="dimmed">
                    No payment records found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              searchFiltered.map((patientData) => {
                const patientName =
                  `${patientData.patient.profile?.user?.first_name || ""} ${patientData.patient.profile?.user?.last_name || ""}`.trim() ||
                  patientData.patient.name ||
                  "N/A";
                return (
                  <Table.Tr key={patientData.patientId}>
                    <Table.Td>
                      <Group gap="xs">
                        <Avatar
                          src={patientData.patient.profile_picture}
                          size={40}
                          radius="xl"
                        />
                        <div>
                          <Text size="sm" fw={500}>
                            {patientName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            ID: #{patientData.patientId}
                          </Text>
                          {patientData.patient.profile?.phone_number && (
                            <Text size="xs" c="dimmed">
                              {patientData.patient.profile.phone_number}
                            </Text>
                          )}
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        ETB {patientData.totalAmount.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="text-green-600" fw={500}>
                        ETB {patientData.totalPaid.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        className={
                          patientData.totalRemaining > 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                        fw={500}
                      >
                        ETB {patientData.totalRemaining.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <div style={{ minWidth: 100 }}>
                        <Progress
                          value={patientData.progressPercent}
                          color={
                            patientData.progressPercent === 100
                              ? "green"
                              : patientData.progressPercent >= 50
                                ? "blue"
                                : "yellow"
                          }
                          size="sm"
                          radius="xl"
                        />
                        <Text size="xs" c="dimmed" mt={4} ta="center">
                          {patientData.progressPercent.toFixed(0)}%
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue" size="sm">
                        {patientData.invoiceCount} invoice(s)
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={paymentStatusColors[patientData.status]}
                        size="sm"
                        className="capitalize"
                      >
                        {patientData.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => {
                            setSelectedRecord({
                              patient: patientData.patient,
                              records: patientData.records,
                              totalAmount: patientData.totalAmount,
                              totalPaid: patientData.totalPaid,
                              totalRemaining: patientData.totalRemaining,
                              status: patientData.status,
                            });
                            openView();
                          }}
                        >
                          <Eye size={16} />
                        </ActionIcon>
                        <Button
                          variant="light"
                          size="xs"
                          onClick={() =>
                            router.push(
                              `/patients/payments/add?patientId=${patientData.patientId}`
                            )
                          }
                        >
                          Add Payment
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* View Patient Payment Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Patient Payment Details
          </Text>
        }
        size="xl"
      >
        {selectedRecord && selectedRecord.patient && (
          <Stack gap="md">
            {/* Patient Info */}
            <Group>
              <Avatar
                src={selectedRecord.patient.profile_picture}
                size={60}
                radius="xl"
              />
              <div>
                <Text size="lg" fw={600}>
                  {selectedRecord.patient.profile?.user?.first_name || ""}{" "}
                  {selectedRecord.patient.profile?.user?.last_name || ""}
                </Text>
                <Text size="sm" c="dimmed">
                  Patient ID: #{selectedRecord.patient.id}
                </Text>
                {selectedRecord.patient.profile?.phone_number && (
                  <Text size="sm" c="dimmed">
                    Phone: {selectedRecord.patient.profile.phone_number}
                  </Text>
                )}
              </div>
              <Badge
                variant="light"
                color={paymentStatusColors[selectedRecord.status]}
                size="lg"
                className="capitalize"
                ml="auto"
              >
                {selectedRecord.status}
              </Badge>
            </Group>

            {/* Payment Summary */}
            <Card className="bg-gray-50">
              <Text size="sm" fw={600} mb={8}>
                Payment Summary
              </Text>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Text size="xs" c="dimmed" mb={4}>
                    Total Amount
                  </Text>
                  <Text size="lg" fw={700}>
                    ETB {selectedRecord.totalAmount.toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>
                    Total Paid
                  </Text>
                  <Text size="lg" fw={700} className="text-green-600">
                    ETB {selectedRecord.totalPaid.toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>
                    Remaining
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    className={
                      selectedRecord.totalRemaining > 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    ETB {selectedRecord.totalRemaining.toLocaleString()}
                  </Text>
                </div>
              </div>
              <Progress
                value={
                  (selectedRecord.totalPaid / selectedRecord.totalAmount) * 100
                }
                color={
                  selectedRecord.totalPaid === selectedRecord.totalAmount
                    ? "green"
                    : "yellow"
                }
                size="md"
                radius="xl"
                mt={12}
              />
            </Card>

            {/* Invoices List */}
            {selectedRecord.records && selectedRecord.records.length > 0 && (
              <div>
                <Text size="sm" fw={600} mb={8}>
                  Invoices & Services
                </Text>
                <Stack gap={8}>
                  {selectedRecord.records.map((invoice: any) => (
                    <Card key={invoice.id} className="border border-gray-200">
                      <Group justify="space-between" mb={8}>
                        <div>
                          <Text size="sm" fw={600}>
                            {invoice.service}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {invoice.invoiceId}
                          </Text>
                        </div>
                        <Badge
                          variant="light"
                          color={paymentStatusColors[invoice.status]}
                          size="sm"
                          className="capitalize"
                        >
                          {invoice.status}
                        </Badge>
                      </Group>
                      <div className="grid grid-cols-3 gap-4 mb={8}">
                        <div>
                          <Text size="xs" c="dimmed">
                            Amount
                          </Text>
                          <Text size="sm" fw={500}>
                            ETB {invoice.amount.toLocaleString()}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">
                            Paid
                          </Text>
                          <Text size="sm" fw={500} className="text-green-600">
                            ETB {invoice.paid.toLocaleString()}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">
                            Remaining
                          </Text>
                          <Text size="sm" fw={500} className="text-red-600">
                            ETB{" "}
                            {(invoice.amount - invoice.paid).toLocaleString()}
                          </Text>
                        </div>
                      </div>
                      {invoice.paymentHistory &&
                        invoice.paymentHistory.length > 0 && (
                          <div>
                            <Text size="xs" c="dimmed" mb={4}>
                              Payment History:
                            </Text>
                            <Stack gap={4}>
                              {invoice.paymentHistory.map(
                                (payment: any, idx: number) => (
                                  <Group
                                    key={idx}
                                    justify="space-between"
                                    gap="xs"
                                  >
                                    <Group gap={4}>
                                      <Calendar
                                        size={12}
                                        className="text-gray-400"
                                      />
                                      <Text size="xs">{payment.date}</Text>
                                      <Text size="xs" c="dimmed">
                                        • {payment.method}
                                      </Text>
                                    </Group>
                                    <Text
                                      size="xs"
                                      fw={500}
                                      className="text-green-600"
                                    >
                                      ETB {payment.amount.toLocaleString()}
                                    </Text>
                                  </Group>
                                )
                              )}
                            </Stack>
                          </div>
                        )}
                    </Card>
                  ))}
                </Stack>
              </div>
            )}

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  closeView();
                  router.push(
                    `/patients/payments/add?patientId=${selectedRecord.patient.id}`
                  );
                }}
                leftSection={<Plus size={16} />}
              >
                Add Payment
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
