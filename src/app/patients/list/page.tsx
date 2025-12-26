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
    Loader,
    Menu,
    Modal,
    NumberInput,
    Progress,
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
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
    Calendar,
    Download,
    Edit,
    Eye,
    FileText,
    Home,
    Mail,
    MoreVertical,
    Phone,
    Plus,
    Search,
    Trash2,
    User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreatePatientMutation, useDeletePatientMutation, useGetPatientsQuery, useUpdatePatientMutation, type CreatePatientRequest } from "../../../shared/api/patientsApi";
import { useGetInvoicesQuery } from "../../../shared/api/paymentsApi";

const statusColors: Record<string, string> = {
  ACTIVE: "green",
  COMPLETED: "blue",
  PENDING: "yellow",
  ARCHIVED: "gray",
  active: "green",
  completed: "blue",
  pending: "yellow",
  archived: "gray",
};

// Mock payment records data
const mockPaymentRecords = [
  {
    id: 1,
    invoiceId: "INV-001",
    date: "2024-12-15",
    service: "Root Canal Treatment",
    amount: 15000,
    paid: 15000,
    status: "paid",
    dentist: "Dr. Hilina",
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
    status: "paid",
    dentist: "Dr. Hilina",
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
    status: "partial",
    dentist: "Dr. Hilina",
    paymentHistory: [
      { date: "2024-12-08", amount: 5000, method: "Cash" },
      { date: "2024-12-10", amount: 3000, method: "Bank Transfer" },
      { date: "2024-12-12", amount: 2000, method: "Mobile Money" },
    ],
  },
];

const paymentStatusColors: Record<string, string> = {
  paid: "green",
  partial: "yellow",
  pending: "orange",
  overdue: "red",
};

export default function PatientListPage() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [recordsModalOpened, { open: openRecordsModal, close: closeRecordsModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [bulkDeleteModalOpened, { open: openBulkDeleteModal, close: closeBulkDeleteModal }] = useDisclosure(false);
  const [patientToDelete, setPatientToDelete] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientForRecords, setPatientForRecords] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [genderFilter, setGenderFilter] = useState<string | null>("all");

  // Fetch invoices for the selected patient in the records modal
  const { data: patientInvoicesData, isLoading: isLoadingPatientInvoices } = useGetInvoicesQuery(
    { patient: patientForRecords?.id },
    { skip: !patientForRecords?.id }
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedPatientIds, setSelectedPatientIds] = useState<number[]>([]);

  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();
  const { data: patientsData, isLoading: isLoadingPatients, refetch } = useGetPatientsQuery({
    page: currentPage,
    per_page: perPage,
  });

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "PATIENT",
      gender: "MALE" as "MALE" | "FEMALE",
      age: undefined as number | undefined,
      dob: null as Date | null,
      status: "ACTIVE" as "ACTIVE" | "COMPLETED" | "PENDING" | "ARCHIVED",
      note: "",
      // Address fields
      street: "",
      city: "",
      state: "",
    },
    validate: {
      first_name: (value) => (!value ? "First name is required" : null),
      last_name: (value) => (!value ? "Last name is required" : null),
      email: (value) => (value && !/^\S+@\S+$/.test(value) ? "Invalid email" : null),
      phone_number: (value) => (!value ? "Phone number is required" : null),
      gender: (value) => (!value ? "Gender is required" : null),
    },
  });

  // Get patients from API
  const patients = patientsData?.results || [];

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.profile?.user?.first_name || ""} ${patient.profile?.user?.last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      patient.profile?.phone_number?.includes(searchQuery) ||
      patient.profile?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const patientStatus = patient.status?.toUpperCase();
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && patientStatus === "ACTIVE") ||
      (statusFilter === "completed" && patientStatus === "COMPLETED") ||
      (statusFilter === "pending" && patientStatus === "PENDING") ||
      (statusFilter === "archived" && patientStatus === "ARCHIVED");
    const matchesGender = genderFilter === "all" ||
      (genderFilter === "Male" && patient.gender === "MALE") ||
      (genderFilter === "Female" && patient.gender === "FEMALE");

    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    openView();
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    if (patient) {
      form.setValues({
        first_name: patient.profile?.user?.first_name || "",
        last_name: patient.profile?.user?.last_name || "",
        email: patient.profile?.user?.email || "",
        phone_number: patient.profile?.phone_number || "",
        role: patient.profile?.role || "PATIENT",
        gender: patient.gender || "MALE",
        age: patient.age,
        dob: patient.dob ? new Date(patient.dob) : null,
        status: patient.status || "ACTIVE",
        note: patient.note || "",
        street: patient.address?.street || "",
        city: patient.address?.city || "",
        state: patient.address?.state || "",
      });
    }
    open();
  };

  const handleSelectPatient = (patientId: number) => {
    setSelectedPatientIds((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPatientIds.length === filteredPatients.length) {
      setSelectedPatientIds([]);
    } else {
      setSelectedPatientIds(filteredPatients.map((p) => p.id));
    }
  };

  const allSelected = filteredPatients.length > 0 && selectedPatientIds.length === filteredPatients.length;
  const someSelected = selectedPatientIds.length > 0 && selectedPatientIds.length < filteredPatients.length;

  const handleDeleteClick = (patient: any) => {
    setPatientToDelete(patient);
    openDeleteModal();
  };

  const handleExportToExcel = async () => {
    const loadingNotification = notifications.show({
      id: "export-loading",
      title: "Exporting",
      message: "Preparing patient data for export...",
      color: "blue",
      loading: true,
      autoClose: false,
    });

    try {
      // Fetch all patients by getting all pages
      let allPatients: any[] = [];
      let currentPageNum = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`https://demo-oxua.onrender.com/api/patients/?page=${currentPageNum}&per_page=100`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        allPatients = [...allPatients, ...(data.results || [])];

        if (data.links?.next && currentPageNum < data.total_pages) {
          currentPageNum++;
        } else {
          hasMore = false;
        }
      }

      // Prepare data for Excel
      const excelData = allPatients.map((patient: any) => {
        const fullName = `${patient.profile?.user?.first_name || ""} ${patient.profile?.user?.last_name || ""}`.trim() || patient.name || "N/A";
        const address = patient.address
          ? [patient.address.street, patient.address.city, patient.address.state].filter(Boolean).join(", ")
          : "N/A";

        return {
          "Patient ID": patient.id,
          "First Name": patient.profile?.user?.first_name || "",
          "Last Name": patient.profile?.user?.last_name || "",
          "Full Name": fullName,
          "Phone Number": patient.profile?.phone_number || "",
          "Email": patient.profile?.user?.email || "",
          "Age": patient.age || "",
          "Gender": patient.gender || "",
          "Date of Birth": patient.dob || "",
          "Status": patient.status || "",
          "Street": patient.address?.street || "",
          "City": patient.address?.city || "",
          "State": patient.address?.state || "",
          "Address": address,
          "Note": patient.note || "",
          "Created At": patient.created_at || "",
          "Updated At": patient.updated_at || "",
        };
      });

      // Convert to CSV format
      const headers = Object.keys(excelData[0] || {});
      const csvContent = [
        headers.join(","),
        ...excelData.map((row: any) =>
          headers
            .map((header) => {
              const value = row[header] || "";
              // Escape commas and quotes in CSV
              if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(",")
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `patients_export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update the loading notification to success
      notifications.update({
        id: "export-loading",
        title: "Success",
        message: `Exported ${allPatients.length} patients to Excel`,
        color: "green",
        loading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      // Update the loading notification to error
      notifications.update({
        id: "export-loading",
        title: "Error",
        message: error?.message || "Failed to export patients",
        color: "red",
        loading: false,
        autoClose: 5000,
      });
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient(patientToDelete.id).unwrap();
      notifications.show({
        title: "Success",
        message: "Patient deleted successfully",
        color: "green",
      });
      closeDeleteModal();
      setPatientToDelete(null);
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.detail || error?.data?.message || "Failed to delete patient",
        color: "red",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPatientIds.length === 0) return;

    try {
      // Delete all selected patients
      await Promise.all(selectedPatientIds.map((id) => deletePatient(id).unwrap()));
      notifications.show({
        title: "Success",
        message: `${selectedPatientIds.length} patient(s) deleted successfully`,
        color: "green",
      });
      closeBulkDeleteModal();
      setSelectedPatientIds([]);
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.detail || error?.data?.message || "Failed to delete patients",
        color: "red",
      });
    }
  };

  const handleBulkExport = () => {
    const selectedPatientsData = patients.filter((p) => selectedPatientIds.includes(p.id));

    if (selectedPatientsData.length === 0) {
      notifications.show({
        title: "Error",
        message: "No patients selected",
        color: "red",
      });
      return;
    }

    // Prepare data for Excel
    const excelData = selectedPatientsData.map((patient: any) => {
      const fullName = `${patient.profile?.user?.first_name || ""} ${patient.profile?.user?.last_name || ""}`.trim() || patient.name || "N/A";
      const address = patient.address
        ? [patient.address.street, patient.address.city, patient.address.state].filter(Boolean).join(", ")
        : "N/A";

      return {
        "Patient ID": patient.id,
        "First Name": patient.profile?.user?.first_name || "",
        "Last Name": patient.profile?.user?.last_name || "",
        "Full Name": fullName,
        "Phone Number": patient.profile?.phone_number || "",
        "Email": patient.profile?.user?.email || "",
        "Age": patient.age || "",
        "Gender": patient.gender || "",
        "Date of Birth": patient.dob || "",
        "Status": patient.status || "",
        "Street": patient.address?.street || "",
        "City": patient.address?.city || "",
        "State": patient.address?.state || "",
        "Address": address,
        "Note": patient.note || "",
        "Created At": patient.created_at || "",
        "Updated At": patient.updated_at || "",
      };
    });

    // Convert to CSV format
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(","),
      ...excelData.map((row: any) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `selected_patients_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      title: "Success",
      message: `Exported ${selectedPatientsData.length} selected patient(s) to Excel`,
      color: "green",
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Format date of birth (optional if age is provided)
      const dob = values.dob ? values.dob.toISOString().split("T")[0] : undefined;

      // Build user object - email is optional
      const userData: any = {
        first_name: values.first_name,
        last_name: values.last_name,
      };
      if (values.email) userData.email = values.email;

      // Build address object if any address fields are provided
      const addressData: any = {};
      if (values.street) addressData.street = values.street;
      if (values.city) addressData.city = values.city;
      if (values.state) addressData.state = values.state;

      const patientData: any = {
        profile: {
          user: userData,
          role: selectedPatient ? values.role : "PATIENT", // Always use "PATIENT" when creating
          phone_number: values.phone_number,
        },
        gender: values.gender,
        status: values.status,
      };

      // Add optional fields if provided
      if (dob) patientData.dob = dob;
      if (values.age) patientData.age = values.age;
      if (values.note) patientData.note = values.note;
      if (Object.keys(addressData).length > 0) patientData.address = addressData;

      if (selectedPatient) {
        // Update patient
        await updatePatient({
          id: selectedPatient.id,
          data: patientData,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Patient updated successfully",
          color: "green",
        });
      } else {
        // Create patient
        await createPatient(patientData as CreatePatientRequest).unwrap();
        notifications.show({
          title: "Success",
          message: "Patient created successfully",
          color: "green",
        });
      }

      form.reset();
      close();
      setSelectedPatient(null);
      refetch(); // Refetch patients list
    } catch (error: any) {
      // Handle field-specific errors from backend
      const errorData = error?.data || {};
      const fieldErrors: string[] = [];

      // Extract field errors (format: {"field_name": ["error message"]})
      Object.keys(errorData).forEach((field) => {
        const fieldError = errorData[field];
        if (Array.isArray(fieldError)) {
          const errorMessage = fieldError[0] || fieldError;
          fieldErrors.push(`${field}: ${errorMessage}`);

          // Map backend field names to form field names
          let formFieldName = field;
          if (field.startsWith("profile.user.")) {
            formFieldName = field.replace("profile.user.", "");
          } else if (field.startsWith("profile.")) {
            formFieldName = field.replace("profile.", "");
          } else if (field.startsWith("address.")) {
            formFieldName = field.replace("address.", "");
          }

          // Set form field error if the field exists in the form
          if (formFieldName in form.values) {
            form.setFieldError(formFieldName, errorMessage);
          }
        } else if (typeof fieldError === "string") {
          fieldErrors.push(`${field}: ${fieldError}`);
        }
      });

      // Show notification with all errors
      const errorMessage = fieldErrors.length > 0
        ? fieldErrors.join("\n")
        : errorData?.detail || errorData?.message || "Failed to save patient";

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
    }
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
            onClick={handleExportToExcel}
          >
            Export
          </Button>
          <Button
            leftSection={<Plus size={18} />}
            className="bg-[#19b5af] hover:bg-[#14918c]"
            onClick={() => {
              setSelectedPatient(null);
              form.reset();
              form.setFieldValue("role", "PATIENT"); // Ensure role is PATIENT when creating
              open();
            }}
          >
            Add Patient
          </Button>
        </Group>
      </Group>

      {isLoadingPatients ? (
        <div className="flex justify-center items-center py-16">
          <Loader size="lg" color="teal" />
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 w-full">
            {[
              { label: "Total Patients", value: (patientsData?.count || 0).toString(), color: "bg-blue-500" },
              { label: "Active", value: patients.filter(p => p.status?.toUpperCase() === "ACTIVE").length.toString(), color: "bg-green-500" },
              { label: "Completed", value: patients.filter(p => p.status?.toUpperCase() === "COMPLETED").length.toString(), color: "bg-blue-500" },
              { label: "Pending", value: patients.filter(p => p.status?.toUpperCase() === "PENDING").length.toString(), color: "bg-yellow-500" },
              { label: "Archived", value: patients.filter(p => p.status?.toUpperCase() === "ARCHIVED").length.toString(), color: "bg-gray-500" },
            ].map((stat, index) => (
              <Card key={index} shadow="sm" p="md" className="border border-gray-200 w-full">
                <Group justify="space-between">
                  <div className="flex-1">
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
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "archived", label: "Archived" },
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

      {/* Bulk Actions Bar */}
      {selectedPatientIds.length > 0 && (
        <Card shadow="sm" p="md" mb="md" className="border border-[#19b5af] bg-[#19b5af]/5">
          <Group justify="space-between">
            <Group gap="md">
              <Text size="sm" fw={600}>
                {selectedPatientIds.length} patient(s) selected
              </Text>
              <Button
                variant="light"
                size="sm"
                onClick={() => setSelectedPatientIds([])}
              >
                Clear Selection
              </Button>
            </Group>
            <Group gap="xs">
              <Button
                variant="light"
                size="sm"
                leftSection={<Download size={16} />}
                onClick={handleBulkExport}
              >
                Export Selected
              </Button>
              <Button
                variant="light"
                color="red"
                size="sm"
                leftSection={<Trash2 size={16} />}
                onClick={openBulkDeleteModal}
              >
                Delete Selected
              </Button>
            </Group>
          </Group>
        </Card>
      )}

          {/* Patients Table */}
          <Card shadow="sm" p="lg" className="border border-gray-200">
          <Table highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                  />
                </Table.Th>
                <Table.Th>Patient ID</Table.Th>
                <Table.Th>Patient</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Age/Gender</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
              <Table.Tbody>
              {filteredPatients.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" py="xl" c="dimmed">
                      No patients found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredPatients.map((patient) => {
                  const fullName = `${patient.profile?.user?.first_name || ""} ${patient.profile?.user?.last_name || ""}`.trim() || patient.name || "N/A";
                  const address = patient.address ?
                    [patient.address.street, patient.address.city, patient.address.state].filter(Boolean).join(", ") :
                    "N/A";
                  return (
                    <Table.Tr key={patient.id}>
                      <Table.Td>
                        <Checkbox
                          checked={selectedPatientIds.includes(patient.id)}
                          onChange={() => handleSelectPatient(patient.id)}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="gray">#{patient.id}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar src={patient.profile_picture} size={40} radius="xl" />
                          <div>
                            <Text size="sm" fw={500}>{fullName}</Text>
                            <Text size="xs" c="dimmed">{address}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={6}>
                          <Phone size={14} className="text-gray-400" />
                          <Text size="xs">{patient.profile?.phone_number || "N/A"}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {patient.age ? `${patient.age} / ` : ""}{patient.gender || "N/A"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={statusColors[patient.status || ""] || "gray"}
                          size="sm"
                          className="capitalize"
                        >
                          {patient.status || "N/A"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => router.push(`/patients/${patient.id}`)}
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
                              <Menu.Item
                                leftSection={<FileText size={16} />}
                                onClick={() => {
                                  setPatientForRecords(patient);
                                  openRecordsModal();
                                }}
                              >
                                View Records
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<Calendar size={16} />}
                                onClick={() => router.push(`/patients/${patient.id}?tab=appointments`)}
                              >
                                Book Appointment
                              </Menu.Item>

                              <Menu.Divider />
                              <Menu.Item
                                leftSection={<Trash2 size={16} />}
                                color="red"
                                onClick={() => handleDeleteClick(patient)}
                                disabled={isDeleting}
                              >
                                Delete
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
          {/* Pagination */}
        {patientsData && patientsData.total_pages > 1 && (
          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Page {patientsData.current_page} of {patientsData.total_pages}
            </Text>
            <Group gap="xs">
              <Button
                variant="light"
                size="sm"
                disabled={!patientsData.links.previous}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="light"
                size="sm"
                disabled={!patientsData.links.next}
                onClick={() => setCurrentPage((p) => Math.min(patientsData.total_pages, p + 1))}
              >
                Next
              </Button>
            </Group>
          </Group>
        )}
          </Card>
        </>
      )}

      {/* Add/Edit Patient Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedPatient(null);
          form.reset();
          form.setFieldValue("role", "PATIENT"); // Ensure role is PATIENT when closing
        }}
        title={
          <Text fw={600} size="lg">
            {selectedPatient ? "Edit Patient" : "Add Patient"}
          </Text>
        }
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Tabs defaultValue="basic">
            <Tabs.List grow mb="md">
              <Tabs.Tab value="basic" leftSection={<User size={16} />}>
                Basic Info
              </Tabs.Tab>
              <Tabs.Tab value="address" leftSection={<Home size={16} />}>
                Address
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" pt="md">
              <Stack gap="md">
                <Group grow>
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    required
                    leftSection={<User size={16} />}
                    {...form.getInputProps("first_name")}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    required
                    leftSection={<User size={16} />}
                    {...form.getInputProps("last_name")}
                  />
                </Group>

                <Group grow>
                  <TextInput
                    label="Phone Number"
                    placeholder="+251 911 234 567"
                    required
                    leftSection={<Phone size={16} />}
                    {...form.getInputProps("phone_number")}
                  />
                  <TextInput
                    label="Email (Optional)"
                    placeholder="patient@email.com"
                    leftSection={<Mail size={16} />}
                    {...form.getInputProps("email")}
                  />
                </Group>

                <Group grow>
                  <NumberInput
                    label="Age (Optional)"
                    placeholder="Enter age"
                    min={0}
                    max={150}
                    value={form.values.age}
                    onChange={(value) => form.setFieldValue("age", typeof value === "number" ? value : undefined)}
                  />
                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    required
                    data={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                    ]}
                    {...form.getInputProps("gender")}
                  />
                </Group>

                <Group grow>
                  <DatePickerInput
                    label="Date of Birth (Optional)"
                    placeholder="Select date"
                    leftSection={<Calendar size={16} />}
                    value={form.values.dob}
                    onChange={(date) => form.setFieldValue("dob", date)}
                  />
                  <Select
                    label="Status"
                    placeholder="Select status"
                    data={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "COMPLETED", label: "Completed" },
                      { value: "PENDING", label: "Pending" },
                      { value: "ARCHIVED", label: "Archived" },
                    ]}
                    {...form.getInputProps("status")}
                  />
                </Group>

                <Textarea
                  label="Note (Optional)"
                  placeholder="Additional notes about the patient"
                  rows={3}
                  {...form.getInputProps("note")}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="address" pt="md">
              <Stack gap="md">
                <TextInput
                  label="Street (Optional)"
                  placeholder="Street address"
                  {...form.getInputProps("street")}
                />

                <Group grow>
                  <TextInput
                    label="City (Optional)"
                    placeholder="City"
                    {...form.getInputProps("city")}
                  />
                  <TextInput
                    label="State (Optional)"
                    placeholder="State/Province"
                    {...form.getInputProps("state")}
                  />
                </Group>
              </Stack>
            </Tabs.Panel>
          </Tabs>

          <Group justify="flex-end" mt="xl">
            <Button
              variant="light"
              onClick={() => {
                close();
                setSelectedPatient(null);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#19b5af] hover:bg-[#14918c]"
              loading={isCreating || isUpdating}
            >
              {selectedPatient ? "Update" : "Add "} Patient Info
            </Button>
          </Group>
        </form>
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
        {selectedPatient && (() => {
          const fullName = `${selectedPatient.profile?.user?.first_name || ""} ${selectedPatient.profile?.user?.last_name || ""}`.trim() || selectedPatient.name || "N/A";
          const address = selectedPatient.address ?
            [selectedPatient.address.street, selectedPatient.address.city, selectedPatient.address.state].filter(Boolean).join(", ") :
            "N/A";
          return (
            <Stack gap="md">
              <Group>
                <Avatar src={selectedPatient.profile_picture} size={80} radius="xl" />
                <div>
                  <Text size="lg" fw={600}>{fullName}</Text>
                  <Badge variant="light" color={statusColors[selectedPatient.status || ""] || "gray"} className="capitalize">
                    {selectedPatient.status || "N/A"}
                  </Badge>
                  <Text size="sm" c="dimmed" mt={4}>Patient ID: #{selectedPatient.id}</Text>
                </div>
              </Group>

              <Card className="bg-gray-50">
                <Group grow>
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Age</Text>
                    <Text size="sm" fw={500}>{selectedPatient.age || "N/A"}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Gender</Text>
                    <Text size="sm" fw={500}>{selectedPatient.gender || "N/A"}</Text>
                  </div>
                </Group>
              </Card>

              <div>
                <Text size="sm" c="dimmed" mb={4}>Contact Information</Text>
                <Stack gap={8}>
                  <Group gap={8}>
                    <Phone size={16} className="text-gray-400" />
                    <Text size="sm">{selectedPatient.profile?.phone_number || "N/A"}</Text>
                  </Group>
                  {selectedPatient.profile?.user?.email && (
                    <Group gap={8}>
                      <Mail size={16} className="text-gray-400" />
                      <Text size="sm">{selectedPatient.profile.user.email}</Text>
                    </Group>
                  )}
                </Stack>
              </div>

              {address !== "N/A" && (
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Address</Text>
                  <Text size="sm">{address}</Text>
                </div>
              )}

              {selectedPatient.note && (
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Note</Text>
                  <Card className="bg-gray-50">
                    <Text size="sm">{selectedPatient.note}</Text>
                  </Card>
                </div>
              )}

              {selectedPatient.dob && (
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Date of Birth</Text>
                  <Group gap={6}>
                    <Calendar size={16} className="text-gray-400" />
                    <Text size="sm">{selectedPatient.dob}</Text>
                  </Group>
                </div>
              )}

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
          );
        })()}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Group gap="xs">
            <Trash2 size={20} className="text-red-600" />
            <Text fw={600} size="lg" c="red">
              Delete Patient
            </Text>
          </Group>
        }
        size="md"
        centered
      >
        {patientToDelete && (
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Are you sure you want to delete this patient? This action cannot be undone.
            </Text>
            <Card className="bg-red-50 border border-red-200" p="md">
              <Group gap="xs">
                <Avatar src={patientToDelete.profile_picture} size={40} radius="xl" />
                <div>
                  <Text size="sm" fw={600}>
                    {patientToDelete.profile?.user?.first_name || ""} {patientToDelete.profile?.user?.last_name || ""}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Patient ID: #{patientToDelete.id}
                  </Text>
                </div>
              </Group>
            </Card>
            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  closeDeleteModal();
                  setPatientToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleDeletePatient}
                loading={isDeleting}
                leftSection={<Trash2 size={16} />}
              >
                Delete Patient
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        opened={bulkDeleteModalOpened}
        onClose={closeBulkDeleteModal}
        title={
          <Group gap="xs">
            <Trash2 size={20} className="text-red-600" />
            <Text fw={600} size="lg" c="red">
              Delete Selected Patients
            </Text>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Are you sure you want to delete {selectedPatientIds.length} patient(s)? This action cannot be undone.
          </Text>
          <Card className="bg-red-50 border border-red-200" p="md">
            <Text size="sm" fw={600} c="red" mb={4}>
              Warning: This will permanently delete the selected patients.
            </Text>
            <Text size="xs" c="dimmed">
              Selected Patient IDs: {selectedPatientIds.join(", ")}
            </Text>
          </Card>
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={closeBulkDeleteModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleBulkDelete}
              loading={isDeleting}
              leftSection={<Trash2 size={16} />}
            >
              Delete {selectedPatientIds.length} Patient(s)
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Payment Records Modal */}
      <Modal
        opened={recordsModalOpened}
        onClose={closeRecordsModal}
        title={
          <Text fw={600} size="lg">
            Payment Records
          </Text>
        }
        size="xl"
      >
        {patientForRecords && (() => {
          const fullName = `${patientForRecords.profile?.user?.first_name || ""} ${patientForRecords.profile?.user?.last_name || ""}`.trim() || patientForRecords.name || "N/A";

          // Use real invoice data
          const patientInvoices = patientInvoicesData?.results || [];
          const totalAmount = patientInvoices.reduce(
            (sum: number, inv: any) => sum + parseFloat(inv.total_amount || "0"),
            0
          );
          const totalPaid = patientInvoices.reduce(
            (sum: number, inv: any) => sum + parseFloat(inv.paid_amount || "0"),
            0
          );
          const totalRemaining = totalAmount - totalPaid;

          if (isLoadingPatientInvoices) {
            return (
              <div className="flex justify-center items-center py-16">
                <Loader size="lg" color="teal" />
              </div>
            );
          }

          return (
            <Stack gap="md">
              <Group>
                <Avatar src={patientForRecords.profile_picture} size={50} radius="xl" />
                <div>
                  <Text size="lg" fw={600}>{fullName}</Text>
                  <Text size="sm" c="dimmed">Patient ID: #{patientForRecords.id}</Text>
                </div>
              </Group>

              {/* Payment Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card shadow="sm" p="md" className="border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>Total Amount</Text>
                  <Text size="lg" fw={700}>ETB {totalAmount.toLocaleString()}</Text>
                </Card>
                <Card shadow="sm" p="md" className="border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>Total Paid</Text>
                  <Text size="lg" fw={700} className="text-green-600">ETB {totalPaid.toLocaleString()}</Text>
                </Card>
                <Card shadow="sm" p="md" className="border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>Remaining</Text>
                  <Text size="lg" fw={700} className={totalRemaining > 0 ? "text-red-600" : "text-gray-600"}>
                    ETB {totalRemaining.toLocaleString()}
                  </Text>
                </Card>
              </div>

              {/* Payment Records Table */}
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
                          No payment records found for this patient
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

              <Group justify="space-between" mt="md">
                <Button
                  leftSection={<Plus size={16} />}
                  className="bg-[#19b5af] hover:bg-[#14918c]"
                  onClick={() => {
                    router.push(`/patients/payments/add?patientId=${patientForRecords.id}`);
                    closeRecordsModal();
                  }}
                >
                  Add Payment
                </Button>
                <Button variant="light" onClick={closeRecordsModal}>
                  Close
                </Button>
              </Group>
            </Stack>
          );
        })()}
      </Modal>

    </Box>
  );
}
