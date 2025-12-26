"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Modal,
  Stack,
  Switch,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Edit, Eye, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
  type CreateServiceRequest,
} from "../../shared/api/servicesApi";

export default function ServicesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const {
    data: servicesData,
    isLoading: isLoadingServices,
    refetch,
  } = useGetServicesQuery({
    page: currentPage,
    per_page: perPage,
  });

  const form = useForm({
    initialValues: {
      name: "",
      is_active: true,
      description: "",
    },
    validate: {
      name: (value) => (!value ? "Service name is required" : null),
    },
  });

  // Get services from API
  const services = servicesData?.results || [];

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleViewService = (service: any) => {
    setSelectedService(service);
    openView();
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    if (service) {
      form.setValues({
        name: service.name || "",
        is_active: service.is_active ?? true,
        description: service.description || "",
      });
    }
    open();
  };

  const handleDeleteClick = (service: any) => {
    setServiceToDelete(service);
    openDeleteModal();
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete.id).unwrap();
      notifications.show({
        title: "Success",
        message: "Service deleted successfully",
        color: "green",
      });
      closeDeleteModal();
      setServiceToDelete(null);
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error?.data?.detail ||
          error?.data?.message ||
          "Failed to delete service",
        color: "red",
      });
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const serviceData: CreateServiceRequest = {
        name: values.name,
        base_price: "0",
        min_price: "0",
        max_price: "0",
        time_unit: "DAY",
        duration: 1,
        is_active: values.is_active,
        description: values.description || undefined,
      };

      if (selectedService) {
        // Update service
        await updateService({
          id: selectedService.id,
          data: serviceData,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Service updated successfully",
          color: "green",
        });
      } else {
        // Create service
        await createService(serviceData).unwrap();
        notifications.show({
          title: "Success",
          message: "Service created successfully",
          color: "green",
        });
      }

      form.reset();
      close();
      setSelectedService(null);
      refetch();
    } catch (error: any) {
      // Handle field-specific errors from backend
      const errorData = error?.data || {};
      const fieldErrors: string[] = [];

      Object.keys(errorData).forEach((field) => {
        const fieldError = errorData[field];
        if (Array.isArray(fieldError)) {
          const errorMessage = fieldError[0] || fieldError;
          fieldErrors.push(`${field}: ${errorMessage}`);

          if (field in form.values) {
            form.setFieldError(field, errorMessage);
          }
        } else if (typeof fieldError === "string") {
          fieldErrors.push(`${field}: ${fieldError}`);
        }
      });

      const errorMessage =
        fieldErrors.length > 0
          ? fieldErrors.join("\n")
          : errorData?.detail || errorData?.message || "Failed to save service";

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
          <Title order={2} className="text-gray-800">
            Services
          </Title>
          <Text size="sm" c="dimmed">
            Manage clinic services
          </Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={() => {
            setSelectedService(null);
            form.reset();
            form.setFieldValue("is_active", true);
            open();
          }}
        >
          Add Service
        </Button>
      </Group>

      {isLoadingServices ? (
        <div className="flex justify-center items-center py-16">
          <Loader size="lg" color="teal" />
        </div>
      ) : (
        <>
          {/* Filters */}
          <Card shadow="sm" p="md" mb="md" className="border border-gray-200">
            <Group>
              <TextInput
                placeholder="Search by name or description..."
                leftSection={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                className="flex-1"
              />
            </Group>
          </Card>

          {/* Services Table */}
          <Card shadow="sm" p="lg" className="border border-gray-200">
            <Table highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Service Name</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredServices.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text ta="center" py="xl" c="dimmed">
                        {isLoadingServices ? "Loading..." : "No services found"}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredServices.map((service) => (
                    <Table.Tr key={service.id}>
                      <Table.Td>
                        <Text size="sm" fw={600}>
                          {service.name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          lineClamp={2}
                          c={service.description ? "dark" : "dimmed"}
                        >
                          {service.description || "No description"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={service.is_active ? "green" : "gray"}
                          size="sm"
                        >
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleViewService(service)}
                          >
                            <Eye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="teal"
                            onClick={() => handleEditService(service)}
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
                                leftSection={<Trash2 size={16} />}
                                color="red"
                                onClick={() => handleDeleteClick(service)}
                              >
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
            {/* Pagination */}
            {servicesData &&
              servicesData.total_pages &&
              servicesData.total_pages > 1 && (
                <Group justify="space-between" mt="md">
                  <Text size="sm" c="dimmed">
                    Page {servicesData.current_page || 1} of{" "}
                    {servicesData.total_pages || 1}
                  </Text>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="sm"
                      disabled={!servicesData.links?.previous}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      disabled={!servicesData.links?.next}
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(servicesData.total_pages || 1, p + 1)
                        )
                      }
                    >
                      Next
                    </Button>
                  </Group>
                </Group>
              )}
          </Card>
        </>
      )}

      {/* Add/Edit Service Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setSelectedService(null);
          form.reset();
        }}
        title={
          <Text fw={600} size="lg">
            {selectedService ? "Edit Service" : "Add New Service"}
          </Text>
        }
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Service Name"
              placeholder="e.g., Dental Cleaning, Root Canal"
              required
              {...form.getInputProps("name")}
            />

            <Textarea
              label="Description (Optional)"
              placeholder="Service description..."
              rows={4}
              {...form.getInputProps("description")}
            />

            <Switch
              label="Active"
              description="Service is available for booking"
              {...form.getInputProps("is_active", { type: "checkbox" })}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  close();
                  setSelectedService(null);
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
                {selectedService ? "Update" : "Add"} Service
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* View Service Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Service Details
          </Text>
        }
        size="md"
      >
        {selectedService && (
          <Stack gap="md">
            <Group>
              <div>
                <Text size="lg" fw={600}>
                  {selectedService.name}
                </Text>
                <Badge
                  variant="light"
                  color={selectedService.is_active ? "green" : "gray"}
                  mt={4}
                >
                  {selectedService.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </Group>

            {selectedService.description && (
              <div>
                <Text size="sm" fw={600} mb={8}>
                  Description
                </Text>
                <Card className="bg-gray-50">
                  <Text size="sm">{selectedService.description}</Text>
                </Card>
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
                  handleEditService(selectedService);
                }}
              >
                Edit Service
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Group gap="xs">
            <Trash2 size={20} className="text-red-600" />
            <Text fw={600} size="lg" c="red">
              Delete Service
            </Text>
          </Group>
        }
        size="md"
        centered
      >
        {serviceToDelete && (
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </Text>
            <Card className="bg-red-50 border border-red-200" p="md">
              <Group gap="xs">
                <div>
                  <Text size="sm" fw={600}>
                    {serviceToDelete.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Service ID: #{serviceToDelete.id}
                  </Text>
                </div>
              </Group>
            </Card>
            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  closeDeleteModal();
                  setServiceToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleDeleteService}
                loading={isDeleting}
                leftSection={<Trash2 size={16} />}
              >
                Delete Service
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
