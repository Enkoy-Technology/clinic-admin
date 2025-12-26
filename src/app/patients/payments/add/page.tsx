"use client";

import {
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  Tabs,
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

// Mock invoices data - will be replaced with API call
const mockInvoices = [
  {
    id: 1,
    service: "Root Canal Treatment",
    total_amount: 15000,
    paid_amount: 0,
    remaining: 15000,
    status: "pending",
  },
  {
    id: 2,
    service: "Crown Preparation",
    total_amount: 12000,
    paid_amount: 5000,
    remaining: 7000,
    status: "partial",
  },
];

export default function AddPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Fetch patient data
  const { data: patientsData } = useGetPatientsQuery({ page: 1, per_page: 100 });
  const patient = patientsData?.results?.find((p: any) => p.id.toString() === patientId);

  // Check if patient has existing invoices
  // In real app, this would come from API: GET /api/patients/{id}/invoices
  // For now, using mock data - if patient has any invoices, they're existing
  const hasExistingInvoices = mockInvoices.length > 0; // TODO: Replace with actual API call to check patient's invoices

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
        // TODO: Create new invoice and add first payment
        // Step 1: Create invoice
        // await createInvoiceMutation({
        //   patient_id: parseInt(patientId!),
        //   service: values.service_name,
        //   total_amount: parseFloat(values.total_amount),
        // }).unwrap();

        // Step 2: Add payment to the new invoice
        // await addPaymentMutation({
        //   patient_id: parseInt(patientId!),
        //   invoice_id: newInvoiceId,
        //   amount: parseFloat(values.payment_amount),
        //   payment_date: values.payment_date.toISOString().split("T")[0],
        //   payment_method: values.payment_method,
        //   notes: values.notes,
        // }).unwrap();

        notifications.show({
          title: "Success",
          message: `Invoice created and payment of ETB ${parseFloat(values.payment_amount).toLocaleString()} recorded successfully`,
          color: "green",
        });
      } else {
        // TODO: Add payment to existing invoice
        // await addPaymentMutation({
        //   patient_id: parseInt(patientId!),
        //   invoice_id: selectedInvoice ? parseInt(selectedInvoice) : null,
        //   amount: parseFloat(values.payment_amount),
        //   payment_date: values.payment_date.toISOString().split("T")[0],
        //   payment_method: values.payment_method,
        //   notes: values.notes,
        // }).unwrap();

        notifications.show({
          title: "Success",
          message: `Payment of ETB ${parseFloat(values.payment_amount).toLocaleString()} added successfully`,
          color: "green",
        });
      }

      // Redirect back to patient records
      router.push(`/patients/records?patientId=${patientId}`);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.detail || error?.data?.message || "Failed to process payment",
        color: "red",
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
                    <TextInput
                      label="Service/Invoice Name"
                      placeholder="e.g., Root Canal Treatment, Consultation, Teeth Cleaning, etc."
                      description="Enter the service name. You can use the same service name for different patients with different prices."
                      required
                      leftSection={<FileText size={16} />}
                      {...paymentForm.getInputProps("service_name")}
                    />
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
                      data={mockInvoices.map((invoice) => ({
                        value: invoice.id.toString(),
                        label: `${invoice.service} - ETB ${invoice.total_amount.toLocaleString()} (Remaining: ETB ${invoice.remaining.toLocaleString()})`,
                      }))}
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
                {paymentType === "existing" && selectedInvoice && (
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>Invoice</Text>
                    <Text size="sm" fw={500}>
                      {mockInvoices.find(inv => inv.id.toString() === selectedInvoice)?.service || "N/A"}
                    </Text>
                  </div>
                )}
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

