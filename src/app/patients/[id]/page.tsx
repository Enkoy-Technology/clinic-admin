"use client";

import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Group,
    Loader,
    Modal,
    Progress,
    Select,
    Stack,
    Table,
    Tabs,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    Mail,
    Phone,
    Plus,
    User
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCreateAppointmentMutation, useGetActiveAppointmentsQuery } from "src/shared/api/appointmentsApi";
import { useGetDoctorsQuery } from "src/shared/api/doctorsApi";
import { useGetPatientQuery } from "src/shared/api/patientsApi";
import { useGetInvoicesQuery } from "src/shared/api/paymentsApi";
import { useGetServicesQuery } from "src/shared/api/servicesApi";

const statusColors: Record<string, string> = {
  SCHEDULED: "blue",
  CONFIRMED: "green",
  COMPLETED: "gray",
  CANCELLED: "red",
  NO_SHOW: "orange",
};

const paymentStatusColors: Record<string, string> = {
  paid: "green",
  partial: "yellow",
  pending: "orange",
  overdue: "red",
};

// Time slots in 24-hour format
const timeSlots24 = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

// Helper function to convert 24-hour to 12-hour format
const convertTo12Hour = (time24: string) => {
  const [hours, minutes] = time24.split(":");
  if (!hours || !minutes) return time24;
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to convert system time to Ethiopian Local Time (ET)
const convertToEthiopianTime = (time24: string) => {
  const [hours, minutes] = time24.split(":");
  if (!hours || !minutes) return time24;
  let hour = parseInt(hours);
  hour = (hour - 6 + 24) % 24;
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to format time with ET in brackets
const formatTimeWithET = (time24: string) => {
  const time12 = convertTo12Hour(time24);
  const timeET = convertToEthiopianTime(time24);
  return `${time12} (${timeET} ET)`;
};

// Helper function to convert 12-hour to 24-hour format
const convertTo24Hour = (time12: string) => {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return time12;
  const hours = match[1];
  const minutes = match[2];
  const ampm = match[3];
  if (!hours || !minutes || !ampm) return time12;
  let hour = parseInt(hours);
  if (ampm.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  } else if (ampm.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }
  return `${hour.toString().padStart(2, "0")}:${minutes}`;
};

const timeSlots = timeSlots24.map(convertTo12Hour);

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const patientId = params.id as string;

  // Check if we should open appointments tab from URL
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(tabParam === "appointments" ? "appointments" : "overview");
  const [appointmentModalOpened, setAppointmentModalOpened] = useState(false);

  // Open appointment modal if coming from "Book Appointment"
  useEffect(() => {
    if (tabParam === "appointments") {
      setAppointmentModalOpened(true);
    }
  }, [tabParam]);

  // Fetch patient data
  const { data: patientData, isLoading: isLoadingPatient } = useGetPatientQuery(
    parseInt(patientId),
    { skip: !patientId }
  );

  // Fetch doctors for appointment creation
  const { data: doctorsData } = useGetDoctorsQuery(
    { page: 1, per_page: 100 },
    { refetchOnMountOrArgChange: true }
  );

  // Fetch services for appointment creation
  const { data: servicesData } = useGetServicesQuery(
    { page: 1, per_page: 1000 },
    { refetchOnMountOrArgChange: true }
  );

  // Fetch patient invoices to get services
  const { data: invoicesData } = useGetInvoicesQuery(
    { patient: parseInt(patientId) },
    { skip: !patientId }
  );

  // Fetch patient appointments (last 6 months)
  const appointmentDateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    if (!startDate || !endDate) {
      return null;
    }

    return {
      start_date: startDate,
      end_date: endDate,
      patient: parseInt(patientId),
    };
  }, [patientId]);

  const { data: appointmentsData, isLoading: isLoadingAppointments, refetch: refetchAppointments } = useGetActiveAppointmentsQuery(
    appointmentDateRange || { start_date: "", end_date: "" },
    { skip: !patientId || !appointmentDateRange }
  );

  const [createAppointment, { isLoading: isCreatingAppointment }] = useCreateAppointmentMutation();

  // Get patient's services from invoices
  const patientServices = useMemo(() => {
    if (!invoicesData?.results) return [];
    const services = new Set<string>();
    invoicesData.results.forEach((inv: any) => {
      if (inv.service) {
        services.add(inv.service);
      }
    });
    return Array.from(services);
  }, [invoicesData]);

  // Get default service (first service from invoices or first service from services list)
  const defaultService = useMemo(() => {
    if (patientServices.length > 0) {
      // Try to find matching service in services list
      const matchingService = servicesData?.results?.find((s: any) => s.name === patientServices[0]);
      if (matchingService) return matchingService.id.toString();
    }
    // Fallback to first service in list
    return servicesData?.results?.[0]?.id?.toString() || "";
  }, [patientServices, servicesData]);

  // Get default doctor (first doctor)
  const defaultDoctor = useMemo(() => {
    return doctorsData?.results?.[0]?.id?.toString() || "";
  }, [doctorsData]);

  // Appointment form
  const appointmentForm = useForm({
    initialValues: {
      scheduled_date: new Date(),
      start_time: "",
      end_time: "",
      doctor: "",
      service: "",
      status: "SCHEDULED" as "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW",
      reason: "",
      notes: "",
    },
    validate: {
      scheduled_date: (value) => (!value ? "Date is required" : null),
      start_time: (value) => (!value ? "Start time is required" : null),
      doctor: (value) => (!value ? "Doctor is required" : null),
    },
  });

  // Update form when defaults change
  useEffect(() => {
    if (defaultDoctor) {
      appointmentForm.setFieldValue("doctor", defaultDoctor);
    }
    if (defaultService) {
      appointmentForm.setFieldValue("service", defaultService);
    }
  }, [defaultDoctor, defaultService]);

  const handleCreateAppointment = async (values: typeof appointmentForm.values) => {
    try {
      const scheduledDate = values.scheduled_date.toISOString().split("T")[0];
      const time24 = convertTo24Hour(values.start_time);

      // Calculate end time (add 30 minutes to start time)
      const [hours, minutes] = time24.split(":");
      const startDate = new Date(values.scheduled_date);
      startDate.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0);
      const endDate = new Date(startDate.getTime() + 30 * 60000);
      const endTime24 = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

      const appointmentPayload: any = {
        patient: parseInt(patientId),
        // branch: 0, // Set branch to 0 as per API requirement
        scheduled_date: scheduledDate,
        start_time: time24 + ":00",
        end_time: endTime24 + ":00",
        status: values.status,
      };

      // Add optional fields only if provided
      if (values.doctor) {
        appointmentPayload.doctor = parseInt(values.doctor);
      } else {
        appointmentPayload.doctor = 0; // Default to 0 if not provided
      }
      if (values.service) {
        appointmentPayload.service = parseInt(values.service);
      } else {
        appointmentPayload.service = 0; // Default to 0 if not provided
      }
      if (values.reason) {
        appointmentPayload.reason = values.reason;
      }
      if (values.notes) {
        appointmentPayload.notes = values.notes;
      }

      await createAppointment(appointmentPayload).unwrap();

      notifications.show({
        title: "Success",
        message: "Appointment created successfully",
        color: "green",
      });

      appointmentForm.reset();
      // Reset to defaults
      if (defaultDoctor) {
        appointmentForm.setFieldValue("doctor", defaultDoctor);
      }
      if (defaultService) {
        appointmentForm.setFieldValue("service", defaultService);
      }
      appointmentForm.setFieldValue("status", "SCHEDULED");
      appointmentForm.setFieldValue("scheduled_date", new Date());
      setAppointmentModalOpened(false);
      refetchAppointments();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.detail || error?.data?.message || "Failed to create appointment",
        color: "red",
      });
    }
  };

  if (isLoadingPatient) {
    return (
      <Box>
        <div className="flex justify-center items-center py-32">
          <Loader size="xl" color="teal" />
        </div>
      </Box>
    );
  }

  if (!patientData) {
    return (
      <Box>
        <Text>Patient not found</Text>
      </Box>
    );
  }

  const fullName = `${patientData.profile?.user?.first_name || ""} ${patientData.profile?.user?.last_name || ""}`.trim() || patientData.name || "N/A";
  const patientInvoices = invoicesData?.results || [];
  const patientAppointments = appointmentsData?.appointments?.filter(
    (apt: any) => apt.patient?.id?.toString() === patientId || apt.patient?.patient_id?.toString() === patientId
  ) || [];

  // Calculate payment totals
  const totalAmount = patientInvoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.total_amount || "0"),
    0
  );
  const totalPaid = patientInvoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.paid_amount || "0"),
    0
  );
  const totalRemaining = totalAmount - totalPaid;

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Button
            variant="light"
            leftSection={<ArrowLeft size={18} />}
            onClick={() => router.back()}
            mb="md"
          >
            Back
          </Button>
          <Title order={2} className="text-gray-800">
            Patient Details
          </Title>
          <Text size="sm" c="dimmed">
            Complete patient information and history
          </Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={() => setAppointmentModalOpened(true)}
        >
          Add Appointment
        </Button>
      </Group>

      {/* Patient Info Card */}
      <Card shadow="sm" p="lg" mb="lg" className="border border-gray-200">
        <Group>
          <Avatar src={patientData.profile_picture} size={80} radius="xl" />
          <div className="flex-1">
            <Group justify="space-between" mb="xs">
              <div>
                <Text size="xl" fw={700}>{fullName}</Text>
                <Text size="sm" c="dimmed">Patient ID: #{patientData.id}</Text>
              </div>
              <Badge
                variant="light"
                color={statusColors?.[patientData.status as keyof typeof statusColors] ?? "gray"}
                size="lg"
                className="capitalize"
              >
                {patientData.status}
              </Badge>
            </Group>
            <Group gap="xl" mt="md">
              {patientData.profile?.phone_number && (
                <Group gap={6}>
                  <Phone size={16} className="text-gray-400" />
                  <Text size="sm">{patientData.profile.phone_number}</Text>
                </Group>
              )}
              {patientData.profile?.user?.email && (
                <Group gap={6}>
                  <Mail size={16} className="text-gray-400" />
                  <Text size="sm">{patientData.profile.user.email}</Text>
                </Group>
              )}
              {patientData.age && (
                <Text size="sm" c="dimmed">Age: {patientData.age}</Text>
              )}
              {patientData.gender && (
                <Text size="sm" c="dimmed">Gender: {patientData.gender}</Text>
              )}
            </Group>
            {patientData.address && (
              <Group gap={6} mt="xs">
                <Text size="sm" c="dimmed">
                  {[patientData.address.street, patientData.address.city, patientData.address.state]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </Group>
            )}
          </div>
        </Group>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "overview")} color="teal">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<User size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<DollarSign size={16} />}>
            Payment History
          </Tabs.Tab>
          <Tabs.Tab value="appointments" leftSection={<Calendar size={16} />}>
            Appointment History
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview" pt="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Title order={4} mb="md">Personal Information</Title>
              <Stack gap="md">
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Full Name</Text>
                  <Text size="sm" fw={500}>{fullName}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Patient ID</Text>
                  <Text size="sm" fw={500}>#{patientData.id}</Text>
                </div>
                {patientData.profile?.phone_number && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Phone Number</Text>
                    <Text size="sm" fw={500}>{patientData.profile.phone_number}</Text>
                  </div>
                )}
                {patientData.profile?.user?.email && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Email</Text>
                    <Text size="sm" fw={500}>{patientData.profile.user.email}</Text>
                  </div>
                )}
                {patientData.age && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Age</Text>
                    <Text size="sm" fw={500}>{patientData.age}</Text>
                  </div>
                )}
                {patientData.gender && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Gender</Text>
                    <Text size="sm" fw={500}>{patientData.gender}</Text>
                  </div>
                )}
                {patientData.dob && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Date of Birth</Text>
                    <Text size="sm" fw={500}>{patientData.dob}</Text>
                  </div>
                )}
                {patientData.note && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Notes</Text>
                    <Text size="sm">{patientData.note}</Text>
                  </div>
                )}
              </Stack>
            </Card>

            {/* Payment Summary */}
            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Title order={4} mb="md">Payment Summary</Title>
              <Stack gap="md">
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Total Amount</Text>
                  <Text size="xl" fw={700}>ETB {totalAmount.toLocaleString()}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Total Paid</Text>
                  <Text size="xl" fw={700} className="text-green-600">ETB {totalPaid.toLocaleString()}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Remaining</Text>
                  <Text size="xl" fw={700} className={totalRemaining > 0 ? "text-red-600" : "text-gray-600"}>
                    ETB {totalRemaining.toLocaleString()}
                  </Text>
                </div>
                {totalAmount > 0 && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Payment Progress</Text>
                    <Progress
                      value={(totalPaid / totalAmount) * 100}
                      color={totalPaid >= totalAmount ? "green" : "blue"}
                      size="lg"
                      radius="xl"
                    />
                    <Text size="xs" c="dimmed" mt={4} ta="center">
                      {((totalPaid / totalAmount) * 100).toFixed(0)}% paid
                    </Text>
                  </div>
                )}
              </Stack>
            </Card>
          </div>
        </Tabs.Panel>

        {/* Payment History Tab */}
        <Tabs.Panel value="payments" pt="xl">
          {isLoadingPatient ? (
            <div className="flex justify-center items-center py-16">
              <Loader size="lg" color="teal" />
            </div>
          ) : (
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
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {patientInvoices.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl" c="dimmed">
                          No payment records found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    patientInvoices.map((invoice: any) => {
                      const amount = parseFloat(invoice.total_amount || "0");
                      const paid = parseFloat(invoice.paid_amount || "0");
                      const remaining = amount - paid;
                      const progressPercent = amount > 0 ? (paid / amount) * 100 : 0;
                      const invoiceDate = invoice.created_at ? invoice.created_at.split("T")[0] : "N/A";

                      return (
                        <Table.Tr key={invoice.id}>
                          <Table.Td>
                            <Group gap={6}>
                              <Calendar size={14} className="text-gray-400" />
                              <Text size="xs">{invoiceDate}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={500}>{invoice.service}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={600}>ETB {amount.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" className="text-green-600" fw={500}>
                              ETB {paid.toLocaleString()}
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
                            <div style={{ minWidth: 80 }}>
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
                              color={paymentStatusColors[invoice.status] || "gray"}
                              size="sm"
                              className="capitalize"
                            >
                              {invoice.status}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          )}
        </Tabs.Panel>

        {/* Appointment History Tab */}
        <Tabs.Panel value="appointments" pt="xl">
          {isLoadingAppointments ? (
            <div className="flex justify-center items-center py-16">
              <Loader size="lg" color="teal" />
            </div>
          ) : (
            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Table highlightOnHover verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Service</Table.Th>
                    <Table.Th>Doctor</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {patientAppointments.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text ta="center" py="xl" c="dimmed">
                          No appointment history found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    patientAppointments.map((apt: any) => (
                      <Table.Tr key={apt.id}>
                        <Table.Td>
                          <Group gap={6}>
                            <Calendar size={14} className="text-gray-400" />
                            <Text size="xs">{apt.formatted_date}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <Clock size={14} className="text-gray-400" />
                            <Text size="sm">{formatTimeWithET(apt.formatted_start_time)}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {typeof apt.service === "object" && apt.service?.name
                              ? apt.service.name
                              : typeof apt.service === "string"
                              ? apt.service
                              : "N/A"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {typeof apt.doctor === "object" && apt.doctor?.name
                              ? apt.doctor.name
                              : typeof apt.doctor === "string"
                              ? apt.doctor
                              : "N/A"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={statusColors[apt.status] || "gray"}
                            size="sm"
                            className="capitalize"
                          >
                            {apt.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Card>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Add Appointment Modal */}
      <Modal
        opened={appointmentModalOpened}
        onClose={() => {
          setAppointmentModalOpened(false);
          appointmentForm.reset();
          if (defaultDoctor) {
            appointmentForm.setFieldValue("doctor", defaultDoctor);
          }
          if (defaultService) {
            appointmentForm.setFieldValue("service", defaultService);
          }
          appointmentForm.setFieldValue("status", "SCHEDULED");
          appointmentForm.setFieldValue("scheduled_date", new Date());
        }}
        title={
          <Text fw={600} size="lg">
            Add New Appointment
          </Text>
        }
        size="lg"
      >
        <form onSubmit={appointmentForm.onSubmit(handleCreateAppointment)}>
          <Stack gap="md">
            <TextInput
              label="Patient"
              value={fullName}
              disabled
              leftSection={<User size={16} />}
            />

            <Select
              label="Doctor"
              placeholder="Select doctor"
              required
              data={(doctorsData?.results || []).map((doctor: any) => {
                const doctorName = `${doctor.profile?.user?.first_name || ""} ${doctor.profile?.user?.last_name || ""}`.trim() || doctor.name || "N/A";
                return {
                  value: doctor.id.toString(),
                  label: doctorName,
                };
              })}
              {...appointmentForm.getInputProps("doctor")}
              searchable
            />

            <Select
              label="Service (Optional)"
              placeholder="Select service"
              description="Service from patient's payment history will be pre-selected if available"
              data={(servicesData?.results || []).map((service: any) => ({
                value: service.id.toString(),
                label: service.name,
              }))}
              {...appointmentForm.getInputProps("service")}
              searchable
            />

            <DatePickerInput
              label="Scheduled Date"
              placeholder="Select date"
              required
              leftSection={<Calendar size={16} />}
              minDate={new Date()}
              {...appointmentForm.getInputProps("scheduled_date")}
            />

            <Select
              label="Start Time"
              placeholder="Select time"
              required
              data={timeSlots.map((t) => ({
                value: t,
                label: `${t} (${convertToEthiopianTime(convertTo24Hour(t))} ET)`,
              }))}
              {...appointmentForm.getInputProps("start_time")}
            />

            <Select
              label="Status"
              data={[
                { value: "SCHEDULED", label: "Scheduled" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
                { value: "NO_SHOW", label: "No Show" },
              ]}
              {...appointmentForm.getInputProps("status")}
            />

            <TextInput
              label="Reason (Optional)"
              placeholder="Reason for appointment"
              {...appointmentForm.getInputProps("reason")}
            />

            <Textarea
              label="Notes (Optional)"
              placeholder="Additional notes"
              rows={3}
              {...appointmentForm.getInputProps("notes")}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  setAppointmentModalOpened(false);
                  appointmentForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#19b5af] hover:bg-[#14918c]"
                loading={isCreatingAppointment}
              >
                Create Appointment
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

