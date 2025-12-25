"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
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
  Award,
  Calendar,
  Edit,
  Eye,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Trash2,
  User
} from "lucide-react";
import { useState } from "react";
import { useCreateDoctorMutation, useGetDoctorsQuery, useUpdateDoctorMutation, type CreateDoctorRequest } from "../../../shared/api/doctorsApi";


export default function DentistsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedDentist, setSelectedDentist] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const { data: doctorsData, isLoading: isLoadingDoctors, refetch } = useGetDoctorsQuery({
    page: currentPage,
    per_page: perPage,
  });

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "DENTIST",
      gender: "MALE" as "MALE" | "FEMALE",
      qualification: "",
      specialty: "",
      years_of_experience: undefined as number | undefined,
      bio: "",
      dob: null as Date | null,
      is_licensed: false,
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
      role: (value) => (!value ? "Role is required" : null),
      gender: (value) => (!value ? "Gender is required" : null),
      qualification: (value) => (!value ? "Qualification is required" : null),
    },
  });

  // Get dentists from API
  const dentists = doctorsData?.results || [];

  // Filter dentists
  const filteredDentists = dentists.filter((dentist) => {
    const fullName = `${dentist.profile?.user?.first_name || ""} ${dentist.profile?.user?.last_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      dentist.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dentist.profile?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dentist.qualification?.toLowerCase().includes(searchQuery.toLowerCase());

    // Note: Status filter removed since API doesn't provide status field
    return matchesSearch;
  });

  const handleViewDentist = (dentist: any) => {
    setSelectedDentist(dentist);
    openView();
  };

  const handleEditDentist = (dentist: any) => {
    setSelectedDentist(dentist);
    // Populate form with existing data if editing
    if (dentist) {
      form.setValues({
        first_name: dentist.profile?.user?.first_name || "",
        last_name: dentist.profile?.user?.last_name || "",
        email: dentist.profile?.user?.email || "",
        phone_number: dentist.profile?.phone_number || "",
        role: dentist.profile?.role || "DENTIST",
        gender: dentist.gender || "MALE",
        qualification: dentist.qualification || "",
        specialty: dentist.specialty || "",
        years_of_experience: dentist.years_of_experience,
        bio: dentist.bio || "",
        dob: dentist.dob ? new Date(dentist.dob) : null,
        is_licensed: dentist.is_licensed || false,
        street: dentist.address?.street || "",
        city: dentist.address?.city || "",
        state: dentist.address?.state || "",
      });
    }
    open();
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

      const doctorData: any = {
        profile: {
          user: userData,
          role: selectedDentist ? values.role : "DENTIST", // Always use "DENTIST" when creating
          phone_number: values.phone_number,
        },
        qualification: values.qualification,
        gender: values.gender,
      };

      // Add optional fields if provided
      if (dob) doctorData.dob = dob;
      if (values.specialty) doctorData.specialty = values.specialty;
      if (values.years_of_experience) doctorData.years_of_experience = values.years_of_experience;
      if (values.bio) doctorData.bio = values.bio;
      if (values.is_licensed !== undefined) doctorData.is_licensed = values.is_licensed;
      if (Object.keys(addressData).length > 0) doctorData.address = addressData;

      if (selectedDentist) {
        // Update doctor
        await updateDoctor({
          id: selectedDentist.id,
          data: doctorData,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Doctor updated successfully",
          color: "green",
        });
      } else {
        // Create doctor
        await createDoctor(doctorData as CreateDoctorRequest).unwrap();
        notifications.show({
          title: "Success",
          message: "Doctor created successfully",
          color: "green",
        });
      }

      form.reset();
      close();
      setSelectedDentist(null);
      refetch(); // Refetch doctors list
    } catch (error: any) {
      // Handle field-specific errors from backend
      const errorData = error?.data || {};
      const fieldErrors: string[] = [];

      // Extract field errors (format: {"field_name": ["error message"]})
      Object.keys(errorData).forEach((field) => {
        const fieldError = errorData[field];
        if (Array.isArray(fieldError)) {
          // Handle nested field errors (e.g., "profile.user.first_name")
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
        : errorData?.detail || errorData?.message || "Failed to save doctor";

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
          <Title order={2} className="text-gray-800">Dentists</Title>
          <Text size="sm" c="dimmed">Manage dentist profiles and schedules</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={() => {
            setSelectedDentist(null);
            form.reset();
            form.setFieldValue("role", "DENTIST"); // Ensure role is DENTIST when creating
            open();
          }}
        >
          Add Dentist
        </Button>
      </Group>

      {/* Filters */}
      <Card shadow="sm" p="md" mb="md" className="border border-gray-200">
        <Group>
          <TextInput
            placeholder="Search by name, specialty, qualification, or email..."
            leftSection={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />
        </Group>
      </Card>

      {/* Dentists Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        {isLoadingDoctors ? (
          <div className="flex justify-center py-8">
            <Loader size="lg" color="teal" />
          </div>
        ) : (
          <Table highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Dentist</Table.Th>
                <Table.Th>Specialty</Table.Th>
                <Table.Th>Qualification</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Experience</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredDentists.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" py="xl" c="dimmed">
                      No dentists found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredDentists.map((dentist) => {
                  const fullName = `${dentist.profile?.user?.first_name || ""} ${dentist.profile?.user?.last_name || ""}`.trim() || dentist.name || "N/A";
                  return (
                    <Table.Tr key={dentist.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar src={dentist.profile_picture} size={50} radius="xl" />
                          <div>
                            <Text size="sm" fw={600}>{fullName}</Text>
                            <Text size="xs" c="dimmed">{dentist.profile?.role || "DENTIST"}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{dentist.specialty || "N/A"}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{dentist.qualification || "N/A"}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={4}>
                          <Group gap={6}>
                            <Phone size={14} className="text-gray-400" />
                            <Text size="xs">{dentist.profile?.phone_number || "N/A"}</Text>
                          </Group>
                          {dentist.profile?.user?.email && (
                            <Group gap={6}>
                              <Mail size={14} className="text-gray-400" />
                              <Text size="xs">{dentist.profile.user.email}</Text>
                            </Group>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {dentist.years_of_experience ? `${dentist.years_of_experience} years` : "N/A"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={dentist.is_licensed ? "green" : "gray"}
                          size="sm"
                        >
                          {dentist.is_licensed ? "Licensed" : "Not Licensed"}
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
                              <Menu.Item leftSection={<Trash2 size={16} />} color="red">
                                Remove
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
        )}
        {/* Pagination */}
        {doctorsData && doctorsData.total_pages > 1 && (
          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Page {doctorsData.current_page} of {doctorsData.total_pages}
            </Text>
            <Group gap="xs">
              <Button
                variant="light"
                size="sm"
                disabled={!doctorsData.links.previous}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="light"
                size="sm"
                disabled={!doctorsData.links.next}
                onClick={() => setCurrentPage((p) => Math.min(doctorsData.total_pages, p + 1))}
              >
                Next
              </Button>
            </Group>
          </Group>
        )}
      </Card>

      {/* Add/Edit Dentist Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedDentist(null);
          form.reset();
          form.setFieldValue("role", "DENTIST"); // Ensure role is DENTIST when closing
        }}
        title={
          <Text fw={600} size="lg">
            {selectedDentist ? "Edit Dentist" : "Add New Dentist"}
          </Text>
        }
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Tabs defaultValue="basic">
            <Tabs.List>
              <Tabs.Tab value="basic" leftSection={<User size={16} />}>
                Basic Info
              </Tabs.Tab>
              <Tabs.Tab value="professional" leftSection={<Award size={16} />}>
                Professional
              </Tabs.Tab>
              <Tabs.Tab value="address" leftSection={<Calendar size={16} />}>
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

                <TextInput
                  label="Email (Optional)"
                  placeholder="email@clinic.com"
                  leftSection={<Mail size={16} />}
                  {...form.getInputProps("email")}
                />

                <TextInput
                  label="Phone Number"
                  placeholder="+251 911 234 567"
                  required
                  leftSection={<Phone size={16} />}
                  {...form.getInputProps("phone_number")}
                />

                <Group grow>
                  <Select
                    label="Role"
                    placeholder="Select role"
                    required
                    data={[
                      { value: "DENTIST", label: "Dentist" },
                      { value: "ASSISTANT", label: "Assistant" },
                    ]}
                    {...form.getInputProps("role")}
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

                <DatePickerInput
                  label="Date of Birth (Optional)"
                  placeholder="Select date"
                  leftSection={<Calendar size={16} />}
                  value={form.values.dob}
                  onChange={(date) => form.setFieldValue("dob", date)}
                />

                <Switch
                  label="Is Licensed"
                  {...form.getInputProps("is_licensed", { type: "checkbox" })}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="professional" pt="md">
              <Stack gap="md">
                <TextInput
                  label="Qualification"
                  placeholder="e.g., DDS, PhD Dental Surgery"
                  required
                  leftSection={<Award size={16} />}
                  {...form.getInputProps("qualification")}
                />

                <TextInput
                  label="Specialty (Optional)"
                  placeholder="e.g., Orthodontics, Endodontics"
                  leftSection={<Award size={16} />}
                  {...form.getInputProps("specialty")}
                />

                <NumberInput
                  label="Years of Experience (Optional)"
                  placeholder="Enter years"
                  min={0}
                  max={50}
                  value={form.values.years_of_experience}
                  onChange={(value) => form.setFieldValue("years_of_experience", typeof value === "number" ? value : undefined)}
                />

                <Textarea
                  label="Bio (Optional)"
                  placeholder="Brief biography or description..."
                  rows={4}
                  {...form.getInputProps("bio")}
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
                setSelectedDentist(null);
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
              {selectedDentist ? "Update" : "Add"} Dentist
            </Button>
          </Group>
        </form>
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
        {selectedDentist && (() => {
          const fullName = `${selectedDentist.profile?.user?.first_name || ""} ${selectedDentist.profile?.user?.last_name || ""}`.trim() || selectedDentist.name || "N/A";
          return (
            <Stack gap="md">
              <Group>
                <Avatar src={selectedDentist.profile_picture} size={80} radius="xl" />
                <div>
                  <Text size="lg" fw={600}>{fullName}</Text>
                  <Text size="sm" c="dimmed" mb={4}>{selectedDentist.specialty || "N/A"}</Text>
                  <Badge
                    variant="light"
                    color={selectedDentist.is_licensed ? "green" : "gray"}
                  >
                    {selectedDentist.is_licensed ? "Licensed" : "Not Licensed"}
                  </Badge>
                </div>
              </Group>

              <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={600}>Qualification</Text>
                    <Text size="xl" fw={700} mt={4}>{selectedDentist.qualification || "N/A"}</Text>
                  </div>
                  <div className="text-right">
                    <Text size="sm" fw={600}>Experience</Text>
                    <Text size="xl" fw={700} mt={4}>
                      {selectedDentist.years_of_experience ? `${selectedDentist.years_of_experience} years` : "N/A"}
                    </Text>
                  </div>
                </Group>
              </Card>

              <div>
                <Text size="sm" fw={600} mb={8}>Contact Information</Text>
                <Stack gap={8}>
                  <Group gap={8}>
                    <Phone size={16} className="text-gray-400" />
                    <Text size="sm">{selectedDentist.profile?.phone_number || "N/A"}</Text>
                  </Group>
                  {selectedDentist.profile?.user?.email && (
                    <Group gap={8}>
                      <Mail size={16} className="text-gray-400" />
                      <Text size="sm">{selectedDentist.profile.user.email}</Text>
                    </Group>
                  )}
                </Stack>
              </div>

              {selectedDentist.bio && (
                <div>
                  <Text size="sm" fw={600} mb={8}>Bio</Text>
                  <Card className="bg-gray-50">
                    <Text size="sm">{selectedDentist.bio}</Text>
                  </Card>
                </div>
              )}

              {selectedDentist.address && (
                <div>
                  <Text size="sm" fw={600} mb={8}>Address</Text>
                  <Card className="bg-gray-50">
                    <Stack gap={4}>
                      {selectedDentist.address.street && (
                        <Text size="sm">{selectedDentist.address.street}</Text>
                      )}
                      <Text size="sm">
                        {[selectedDentist.address.city, selectedDentist.address.state]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </Text>
                    </Stack>
                  </Card>
                </div>
              )}

              <div>
                <Text size="sm" fw={600} mb={8}>Additional Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border border-blue-200">
                    <Text size="xs" c="dimmed" mb={4}>Gender</Text>
                    <Text size="lg" fw={700}>{selectedDentist.gender || "N/A"}</Text>
                  </Card>
                  <Card className="bg-green-50 border border-green-200">
                    <Text size="xs" c="dimmed" mb={4}>Date of Birth</Text>
                    <Text size="lg" fw={700}>{selectedDentist.dob || "N/A"}</Text>
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
          );
        })()}
      </Modal>
    </Box>
  );
}
