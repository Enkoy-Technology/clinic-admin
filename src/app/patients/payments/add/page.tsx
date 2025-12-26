"use client";

import {
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  User
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetPatientsQuery } from "../../../../shared/api/patientsApi";
import { useCreateInvoiceMutation, useCreatePaymentMutation } from "../../../../shared/api/paymentsApi";
import { useCreateServiceMutation, useGetServicesQuery } from "../../../../shared/api/servicesApi";

export default function AddPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const invoicesParam = searchParams.get("invoices");

  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isAddingNewService, setIsAddingNewService] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  // Fetch patient data
  const { data: patientsData } = useGetPatientsQuery({ page: 1, per_page: 100 });
  const patient = patientsData?.results?.find((p: any) => p.id.toString() === patientId);

  // Fetch services
  const { data: servicesData, isLoading: isLoadingServices, refetch: refetchServices } = useGetServicesQuery({
    page: 1,
    per_page: 1000, // Get all services
  });
  const [createService, { isLoading: isCreatingService }] = useCreateServiceMutation();

  // Parse invoices from URL params (passed from records page)
  let invoicesData: any = null;
  try {
    if (invoicesParam) {
      const decoded = decodeURIComponent(invoicesParam);
      const parsed = JSON.parse(decoded);
      invoicesData = { results: parsed };
    }
  } catch (e) {
    console.error("Failed to parse invoices from URL:", e);
  }

  // API mutations
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation();
  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();

  // Check if patient has existing invoices (from passed data)
  const hasExistingInvoices = (invoicesData?.results?.length || 0) > 0;

  // Automatically determine payment type based on existing invoices
  // If patient has invoices → add payment to existing invoice
  // If patient has no invoices → create new invoice and add payment
  const paymentType: "new" | "existing" = hasExistingInvoices ? "existing" : "new";

  const paymentForm = useForm({
    initialValues: {
      // For new invoice
      service_name: "",
      total_amount: "",
      // For payment
      payment_amount: "",
      payment_date: new Date(),
      payment_method: "Cash",
      notes: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (paymentType === "new") {
        if (!values.service_name) {
          errors.service_name = "Service name is required";
        }
        if (!values.total_amount || parseFloat(values.total_amount) <= 0) {
          errors.total_amount = "Total amount must be greater than 0";
        }
      } else {
        if (!selectedInvoice) {
          // This will be handled separately in the submit
        }
      }

      if (!values.payment_amount || parseFloat(values.payment_amount) <= 0) {
        errors.payment_amount = "Payment amount must be greater than 0";
      }

      if (!values.payment_method) {
        errors.payment_method = "Payment method is required";
      }

      return errors;
    },
  });

  useEffect(() => {
    if (!patientId) {
      notifications.show({
        title: "Error",
        message: "Patient ID is required",
        color: "red",
      });
      router.push("/patients/list");
    }
  }, [patientId, router]);

  const handleSubmit = async (values: typeof paymentForm.values) => {
    if (!patientId) return;

    // Additional validation
    if (paymentType === "existing" && !selectedInvoice) {
      notifications.show({
        title: "Error",
        message: "Please select an invoice to add payment to",
        color: "red",
      });
      return;
    }

    try {
      if (paymentType === "new") {
        // Step 1: Create invoice
        const newInvoice = await createInvoice({
          patient: parseInt(patientId),
          service: values.service_name,
          total_amount: parseFloat(values.total_amount).toFixed(2),
          notes: values.notes || undefined,
        }).unwrap();

        // Step 2: Add payment to the new invoice
        const dateObj = values.payment_date || new Date();
        const paymentDate = dateObj.toISOString().split("T")[0]!;
        await createPayment({
          patient: parseInt(patientId),
          invoice: newInvoice.id,
          amount: parseFloat(values.payment_amount).toFixed(2),
          payment_date: paymentDate,
          payment_method: (values.payment_method || "Cash") as "Cash" | "Bank Transfer" | "Mobile Money" | "Credit Card" | "Check",
          notes: values.notes || undefined,
        }).unwrap();

        notifications.show({
          title: "Success",
          message: `Invoice created and payment of ETB ${parseFloat(values.payment_amount).toLocaleString()} recorded successfully`,
          color: "green",
        });
      } else {
        // Add payment to existing invoice
        const dateObj = values.payment_date || new Date();
        const paymentDate = dateObj.toISOString().split("T")[0]!;
        await createPayment({
          patient: parseInt(patientId),
          invoice: selectedInvoice ? parseInt(selectedInvoice) : null,
          amount: parseFloat(values.payment_amount).toFixed(2),
          payment_date: paymentDate,
          payment_method: (values.payment_method || "Cash") as "Cash" | "Bank Transfer" | "Mobile Money" | "Credit Card" | "Check",
          notes: values.notes || undefined,
        }).unwrap();

        notifications.show({
          title: "Success",
          message: `Payment of ETB ${parseFloat(values.payment_amount).toLocaleString()} added successfully`,
          color: "green",
        });
      }

      // Redirect back to patient records
      router.push(`/patients/records?patientId=${patientId}`);
    } catch (error: any) {
      // Handle field-specific errors
      const errorData = error?.data || {};
      const fieldErrors: string[] = [];

      Object.keys(errorData).forEach((field) => {
        const fieldError = errorData[field];
        if (Array.isArray(fieldError)) {
          const errorMessage = fieldError[0] || fieldError;
          fieldErrors.push(`${field}: ${errorMessage}`);
        } else if (typeof fieldError === "string") {
          fieldErrors.push(`${field}: ${fieldError}`);
        }
      });

      const errorMessage = fieldErrors.length > 0
        ? fieldErrors.join("\n")
        : errorData?.detail || errorData?.message || "Failed to process payment";

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
    }
  };

  if (!patient) {
    return (
      <Box>
        <Text>Loading patient data...</Text>
      </Box>
    );
  }

  const fullName = `${patient.profile?.user?.first_name || ""} ${patient.profile?.user?.last_name || ""}`.trim() || patient.name || "N/A";

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Group gap="md" mb="xs">
            <Button
              variant="light"
              leftSection={<ArrowLeft size={18} />}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Group>
          <Title order={2} className="text-gray-800">Add Payment</Title>
          <Text size="sm" c="dimmed">Record a new payment for patient</Text>
        </div>
      </Group>

      <form onSubmit={paymentForm.onSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card shadow="sm" p="lg" className="border border-gray-200 mb-6">
              <Stack gap="md">
                <div>
                  <Text size="sm" fw={600} mb={4}>Patient Information</Text>
                  <Card className="bg-gray-50" p="md">
                    <Group>
                      <User size={20} className="text-gray-400" />
                      <div>
                        <Text size="sm" fw={500}>{fullName}</Text>
                        <Text size="xs" c="dimmed">Patient ID: #{patient.id}</Text>
                        {patient.profile?.phone_number && (
                          <Text size="xs" c="dimmed">Phone: {patient.profile.phone_number}</Text>
                        )}
                      </div>
                    </Group>
                  </Card>
                </div>

                {/* Auto-determined payment type info */}
                {paymentType === "new" ? (
                  <Card className="bg-blue-50 border border-blue-200" p="sm">
                    <Group gap="xs">
                      <FileText size={16} className="text-blue-600" />
                      <Text size="sm" fw={500} className="text-blue-700">
                        New Patient - Creating new invoice and recording first payment
                      </Text>
                    </Group>
                  </Card>
                ) : (
                  <Card className="bg-green-50 border border-green-200" p="sm">
                    <Group gap="xs">
                      <FileText size={16} className="text-green-600" />
                      <Text size="sm" fw={500} className="text-green-700">
                        Existing Patient - Adding payment to existing invoice
                      </Text>
                    </Group>
                  </Card>
                )}

                {paymentType === "new" ? (
                  <>
                    {isAddingNewService ? (
                      <>
                        <TextInput
                          label="New Service Name"
                          placeholder="e.g., Root Canal Treatment, Consultation, etc."
                          description="Enter a new service name"
                          required
                          leftSection={<FileText size={16} />}
                          value={newServiceName}
                          onChange={(e) => {
                            setNewServiceName(e.currentTarget.value);
                            paymentForm.setFieldValue("service_name", e.currentTarget.value);
                          }}
                          rightSection={
                            <Button
                              variant="subtle"
                              size="xs"
                              onClick={async () => {
                                if (!newServiceName.trim()) {
                                  notifications.show({
                                    title: "Error",
                                    message: "Service name is required",
                                    color: "red",
                                  });
                                  return;
                                }
                                try {
                                  await createService({
                                    name: newServiceName.trim(),
                                    is_active: true,
                                    description: "",
                                  }).unwrap();
                                  notifications.show({
                                    title: "Success",
                                    message: "Service created successfully",
                                    color: "green",
                                  });
                                  // Refetch services to include the new one
                                  await refetchServices();
                                  // Set the service name and exit add mode
                                  paymentForm.setFieldValue("service_name", newServiceName.trim());
                                  setIsAddingNewService(false);
                                  setNewServiceName("");
                                } catch (error: any) {
                                  notifications.show({
                                    title: "Error",
                                    message: error?.data?.detail || "Failed to create service",
                                    color: "red",
                                  });
                                }
                              }}
                              loading={isCreatingService}
                            >
                              Save
                            </Button>
                          }
                        />
                        <Button
                          variant="light"
                          size="xs"
                          onClick={() => {
                            setIsAddingNewService(false);
                            setNewServiceName("");
                            paymentForm.setFieldValue("service_name", "");
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Select
                        label="Service/Invoice Name"
                        placeholder="Select a service or add a new one"
                        description="Choose from existing services or add a new one. Prices can vary per patient for the same service."
                        required
                        leftSection={<FileText size={16} />}
                        data={[
                          ...(servicesData?.results?.filter((s: any) => s.is_active)?.map((service: any) => ({
                            value: service.name,
                            label: service.name,
                          })) || []),
                          { value: "__add_new__", label: "+ Add New Service" },
                        ]}
                        value={paymentForm.values.service_name}
                        onChange={(value) => {
                          if (value === "__add_new__") {
                            setIsAddingNewService(true);
                            paymentForm.setFieldValue("service_name", "");
                          } else {
                            paymentForm.setFieldValue("service_name", value || "");
                          }
                        }}
                        searchable
                      />
                    )}
                    <Group grow>
                      <NumberInput
                        label="Total Invoice Amount"
                        placeholder="Enter total amount"
                        description="Set the total expected amount for THIS specific invoice. This can vary from patient to patient, even for the same service."
                        required
                        min={0}
                        step={0.01}
                        leftSection={<DollarSign size={16} />}
                        {...paymentForm.getInputProps("total_amount")}
                      />
                      <NumberInput
                        label="Payment Amount (Now)"
                        placeholder="Enter payment amount"
                        description="How much is being paid right now (can be partial or full payment)"
                        required
                        min={0}
                        step={0.01}
                        leftSection={<DollarSign size={16} />}
                        {...paymentForm.getInputProps("payment_amount")}
                      />
                    </Group>
                    {paymentForm.values.total_amount && paymentForm.values.payment_amount && (
                      <Card className="bg-blue-50 border border-blue-200" p="sm">
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">Remaining after this payment:</Text>
                          <Text size="sm" fw={600} className="text-blue-700">
                            ETB {(parseFloat(paymentForm.values.total_amount) - parseFloat(paymentForm.values.payment_amount || "0")).toLocaleString()}
                          </Text>
                        </Group>
                      </Card>
                    )}
                  </>
                ) : (
                  <>
                    <Select
                      label="Select Invoice/Service"
                      placeholder="Select invoice to apply payment to"
                      required
                      data={(invoicesData?.results || []).map((invoice: any) => {
                        const remaining = parseFloat(invoice.amount || invoice.total_amount || "0") - parseFloat(invoice.paid || invoice.paid_amount || "0");
                        const serviceName = invoice.service || invoice.service_name || "Unknown Service";
                        const totalAmount = parseFloat(invoice.amount || invoice.total_amount || "0");
                        return {
                          value: invoice.id.toString(),
                          label: `${serviceName} - ETB ${totalAmount.toLocaleString()} (Remaining: ETB ${remaining.toLocaleString()})`,
                        };
                      })}
                      value={selectedInvoice}
                      onChange={setSelectedInvoice}
                      leftSection={<FileText size={16} />}
                    />
                    <NumberInput
                      label="Payment Amount"
                      placeholder="Enter amount"
                      required
                      min={0}
                      step={0.01}
                      leftSection={<DollarSign size={16} />}
                      {...paymentForm.getInputProps("payment_amount")}
                    />
                  </>
                )}

                <Group grow>
                  <Select
                    label="Payment Method"
                    placeholder="Select method"
                    required
                    data={[
                      { value: "Cash", label: "Cash" },
                      { value: "Bank Transfer", label: "Bank Transfer" },
                      { value: "Mobile Money", label: "Mobile Money" },
                      { value: "Credit Card", label: "Credit Card" },
                      { value: "Check", label: "Check" },
                    ]}
                    {...paymentForm.getInputProps("payment_method")}
                  />
                  <DatePickerInput
                    label="Payment Date"
                    placeholder="Select date"
                    required
                    leftSection={<Calendar size={16} />}
                    value={paymentForm.values.payment_date}
                    onChange={(date) => paymentForm.setFieldValue("payment_date", date || new Date())}
                  />
                </Group>

                <Textarea
                  label="Notes (Optional)"
                  placeholder="Additional notes about this payment (e.g., reference number, payment confirmation)"
                  rows={4}
                  {...paymentForm.getInputProps("notes")}
                />
              </Stack>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div>
            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Text size="sm" fw={600} mb="md">Payment Summary</Text>
              <Stack gap="md">
                {paymentType === "new" && (
                  <>
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>Service</Text>
                      <Text size="sm" fw={500}>
                        {paymentForm.values.service_name || "Not entered"}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>Total Invoice Amount</Text>
                      <Text size="lg" fw={700}>
                        {paymentForm.values.total_amount
                          ? `ETB ${parseFloat(paymentForm.values.total_amount || "0").toLocaleString()}`
                          : "ETB 0.00"
                        }
                      </Text>
                    </div>
                  </>
                )}
                {paymentType === "existing" && selectedInvoice && (() => {
                  const selectedInv = invoicesData?.results?.find((inv: any) => inv.id.toString() === selectedInvoice);
                  if (selectedInv) {
                    const serviceName = selectedInv.service || selectedInv.service_name || "Unknown Service";
                    const totalAmount = parseFloat(selectedInv.amount || selectedInv.total_amount || "0");
                    const currentPaid = parseFloat(selectedInv.paid || selectedInv.paid_amount || "0");
                    return (
                      <>
                        <div>
                          <Text size="xs" c="dimmed" mb={4}>Invoice</Text>
                          <Text size="sm" fw={500}>{serviceName}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed" mb={4}>Invoice Total</Text>
                          <Text size="sm" fw={500}>ETB {totalAmount.toLocaleString()}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed" mb={4}>Already Paid</Text>
                          <Text size="sm" fw={500}>ETB {currentPaid.toLocaleString()}</Text>
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Payment Amount</Text>
                  <Text size="lg" fw={700}>
                    {paymentForm.values.payment_amount
                      ? `ETB ${parseFloat(paymentForm.values.payment_amount || "0").toLocaleString()}`
                      : "ETB 0.00"
                    }
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Payment Method</Text>
                  <Text size="sm" fw={500}>{paymentForm.values.payment_method}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>Payment Date</Text>
                  <Text size="sm" fw={500}>
                    {paymentForm.values.payment_date?.toLocaleDateString() || "Not selected"}
                  </Text>
                </div>
                {paymentType === "new" && paymentForm.values.total_amount && paymentForm.values.payment_amount && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Remaining After Payment</Text>
                    <Text size="sm" fw={600} className="text-orange-600">
                      ETB {(parseFloat(paymentForm.values.total_amount) - parseFloat(paymentForm.values.payment_amount || "0")).toLocaleString()}
                    </Text>
                  </div>
                )}
                {paymentType === "existing" && selectedInvoice && paymentForm.values.payment_amount && (() => {
                  const selectedInv = invoicesData?.results?.find((inv: any) => inv.id.toString() === selectedInvoice);
                  if (selectedInv) {
                    const totalAmount = parseFloat(selectedInv.amount || selectedInv.total_amount || "0");
                    const currentPaid = parseFloat(selectedInv.paid || selectedInv.paid_amount || "0");
                    const newPayment = parseFloat(paymentForm.values.payment_amount || "0");
                    const remaining = totalAmount - currentPaid - newPayment;
                    return (
                      <div>
                        <Text size="xs" c="dimmed" mb={4}>Remaining After Payment</Text>
                        <Text size="sm" fw={600} className="text-orange-600">
                          ETB {remaining.toLocaleString()}
                        </Text>
                      </div>
                    );
                  }
                  return null;
                })()}
              </Stack>

              <Group grow mt="xl">
                <Button
                  variant="light"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#19b5af] hover:bg-[#14918c]"
                  loading={isCreatingInvoice || isCreatingPayment}
                >
                  {paymentType === "new" ? "Create Invoice & Add Payment" : "Add Payment"}
                </Button>
              </Group>
            </Card>
          </div>
        </div>
      </form>
    </Box>
  );
}

