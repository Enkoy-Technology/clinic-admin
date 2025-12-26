"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetActiveAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "../../shared/api/appointmentsApi";
import { useGetDoctorsQuery } from "../../shared/api/doctorsApi";
import { useGetPatientsQuery } from "../../shared/api/patientsApi";
import { useGetServicesQuery } from "../../shared/api/servicesApi";

// Time slots in 24-hour format for backend
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
// System time 8:30 AM = 2:30 AM ET (6 hours behind)
const convertToEthiopianTime = (time24: string) => {
  const [hours, minutes] = time24.split(":");
  if (!hours || !minutes) return time24;

  let hour = parseInt(hours);
  hour = (hour - 6 + 24) % 24; // Subtract 6 hours to convert to ET

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

// Time slots in 12-hour format for display
const timeSlots = timeSlots24.map(convertTo12Hour);

// Removed mock patients - will use real data from API

const mockReminders = [
  { id: 1, patient: "Abebe Kebede", phone: "+251 911 234 567", date: "Today", time: "02:00 PM", reminderSent: false },
  { id: 2, patient: "Tigist Alemu", phone: "+251 912 345 678", date: "Tomorrow", time: "09:00 AM", reminderSent: true },
  { id: 3, patient: "Dawit Tadesse", phone: "+251 913 456 789", date: "Dec 18", time: "10:30 AM", reminderSent: false },
];

export default function AppointmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("daily");
  const [bookModalOpened, { open: openBook, close: closeBook }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<"new" | "followup" | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const [reminders, setReminders] = useState(mockReminders);
  const [autoReminders, setAutoReminders] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Format date for API (YYYY-MM-DD) - using local date components to avoid timezone issues
  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get week days - defined before use
  const getWeekDaysForDate = (date: Date) => {
    const days = [];
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();

    for (let i = 0; i < 7; i++) {
      days.push(new Date(curr.getFullYear(), curr.getMonth(), first + i));
    }
    return days;
  };

  // Get date range for API query based on active tab
  const dateRange = useMemo(() => {
    let start: Date;
    let end: Date;

    if (activeTab === "weekly") {
      // Get week range
      const weekDays = getWeekDaysForDate(selectedDate);
      start = weekDays[0]!;
      end = weekDays[6]!;
    } else if (activeTab === "monthly") {
      // Get month range
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      start = new Date(year, month, 1);
      end = new Date(year, month + 1, 0);
    } else {
      // Daily - same day
      start = selectedDate;
      end = selectedDate;
    }

    return {
      start_date: formatDateForAPI(start)!,
      end_date: formatDateForAPI(end)!
    };
  }, [selectedDate, currentMonth, activeTab]);

  // Fetch appointments from API
  const { data: appointmentsData, isLoading, refetch } = useGetActiveAppointmentsQuery(dateRange, {
    refetchOnMountOrArgChange: true, // Force refetch when navigating to this page
  });
  const [createAppointment, { isLoading: isCreatingAppointment }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdatingAppointment }] = useUpdateAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeletingAppointment }] = useDeleteAppointmentMutation();

  // Fetch patients for follow-up appointments dropdown
  const { data: patientsData } = useGetPatientsQuery(
    {
      page: 1,
      per_page: 1000, // Get all patients for dropdown
    },
    {
      refetchOnMountOrArgChange: true, // Force refetch when navigating to this page
    }
  );

  // Fetch doctors for edit form
  const { data: doctorsData } = useGetDoctorsQuery(
    { page: 1, per_page: 100 },
    { refetchOnMountOrArgChange: true }
  );

  // Fetch services for edit form
  const { data: servicesData } = useGetServicesQuery(
    { page: 1, per_page: 1000 },
    { refetchOnMountOrArgChange: true }
  );

  // Convert API appointments to time slot format
  const appointments = useMemo(() => {
    if (!appointmentsData?.appointments) {
      return {};
    }

    const slots: Record<string, any> = {};
    const selectedDateStr = formatDateForAPI(selectedDate);

    appointmentsData.appointments.forEach((apt) => {
      // Only process appointments for the selected date (for daily view)
      const aptDate = apt.formatted_date;
      if (aptDate !== selectedDateStr) {
        return; // Skip appointments not for the selected date
      }

      // Use formatted_start_time in 24-hour format, convert to 12-hour for display
      const timeKey24 = apt.formatted_start_time; // e.g., "10:00"
      const timeKey12 = convertTo12Hour(timeKey24); // e.g., "10:00 AM"

      // Calculate duration from start_time and end_time
      const startParts = timeKey24.split(":").map(Number);
      const endParts = apt.formatted_end_time.split(":").map(Number);
      const startHours = startParts[0] || 0;
      const startMins = startParts[1] || 0;
      const endHours = endParts[0] || 0;
      const endMins = endParts[1] || 0;
      const startMinutes = startHours * 60 + startMins;
      const endMinutes = endHours * 60 + endMins;
      const duration = endMinutes - startMinutes;

      // Find patient phone number from patients data if available
      const patientId = apt.patient?.id || apt.patient?.patient_id;
      const patientFromList = patientsData?.results?.find((p: any) => p.id === patientId);
      const phone = patientFromList?.profile?.phone_number || "N/A";

      slots[timeKey12] = {
        ...apt,
        time24: timeKey24, // Keep 24-hour format for API calls
        patient: apt.patient?.name || "Unnamed Patient",
        patientId: patientId,
        phone: phone,
        type: apt.status === "SCHEDULED" ? "new" : "followup",
        duration: duration || 30,
      };
    });

    return slots;
  }, [appointmentsData, selectedDate, patientsData]);

  // Group appointments by date for weekly/monthly views
  const appointmentsByDate = useMemo(() => {
    if (!appointmentsData?.appointments) return {};

    const grouped: Record<string, any[]> = {};
    appointmentsData.appointments.forEach((apt) => {
      const dateKey = apt.formatted_date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(apt);
    });

    return grouped;
  }, [appointmentsData]);

  // Booking handler
  const handleAddAppointment = () => {
    setAppointmentType(null);
    setSelectedSlot(null);
    openBook();
  };

  // Validation: Check if date/time is in the past
  const isPastDateTime = (date: Date, timeSlot: string): boolean => {
    const time24 = convertTo24Hour(timeSlot);
    const [hours, minutes] = time24.split(":");
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0, 0);

    const now = new Date();
    now.setSeconds(0, 0); // Remove seconds and milliseconds for comparison

    return appointmentDateTime < now;
  };

  // Check if appointment is in the future
  const isAppointmentInFuture = (appointment: any): boolean => {
    if (!appointment.scheduled_date || !appointment.formatted_start_time) {
      return false;
    }
    const appointmentDate = new Date(appointment.scheduled_date);
    const [hours, minutes] = appointment.formatted_start_time.split(":");
    appointmentDate.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0, 0);

    const now = new Date();
    now.setSeconds(0, 0);

    return appointmentDate > now;
  };

  // Check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [appointmentReason, setAppointmentReason] = useState<string>("");
  const [appointmentNotes, setAppointmentNotes] = useState<string>("");

  // Set default doctor when doctors data loads
  useEffect(() => {
    if (doctorsData?.results?.[0] && !selectedDoctor) {
      setSelectedDoctor(doctorsData.results[0].id.toString());
    }
  }, [doctorsData, selectedDoctor]);

  const handleQuickSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSlot || !selectedDate) {
      notifications.show({
        title: "Error",
        message: "Please select a time slot",
        color: "red",
      });
      return;
    }

    // Patient ID is required
    if (!selectedPatientId) {
      notifications.show({
        title: "Error",
        message: "Please select a patient",
        color: "red",
      });
      return;
    }

    // Service is required
    if (!selectedService) {
      notifications.show({
        title: "Error",
        message: "Please select a service",
        color: "red",
      });
      return;
    }

    try {
      // Format date as YYYY-MM-DD using local date components (avoid timezone issues)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const scheduledDate = `${year}-${month}-${day}`;

      // Convert 12-hour format to 24-hour format for API
      const time24 = convertTo24Hour(selectedSlot);

      // Calculate end time (add 30 minutes to start time)
      const [hours, minutes] = time24.split(":");
      const startDate = new Date(selectedDate);
      startDate.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0);
      const endDate = new Date(startDate.getTime() + 30 * 60000);
      const endTime24 = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

      // Prepare appointment payload
      const appointmentPayload: any = {
        scheduled_date: scheduledDate,
        start_time: time24 + ":00",
        end_time: endTime24 + ":00",
        status: "SCHEDULED",
      };

      // Add patient ID (required)
      appointmentPayload.patient = parseInt(selectedPatientId);

      // Add optional fields only if provided
      if (selectedDoctor) {
        appointmentPayload.doctor = parseInt(selectedDoctor);
      } else {
        appointmentPayload.doctor = 0; // Default to 0 if not provided
      }
      // Service is required
      appointmentPayload.service = parseInt(selectedService);
      if (appointmentReason) {
        appointmentPayload.reason = appointmentReason;
      }
      if (appointmentNotes) {
        appointmentPayload.notes = appointmentNotes;
      }

      await createAppointment(appointmentPayload).unwrap();

      notifications.show({
        title: "Success",
        message: "Appointment created successfully",
        color: "green",
      });

      refetch();
      closeBook();
      setAppointmentType(null);
      setSelectedSlot(null);
      setSelectedPatientId(null);
      setSelectedDoctor("");
      setSelectedService("");
      setAppointmentReason("");
      setAppointmentNotes("");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.detail || error?.data?.message || "Failed to create appointment",
        color: "red",
      });
    }
  };

  // Edit form
  const editForm = useForm({
    initialValues: {
      patient: "",
      doctor: "",
      service: "",
      scheduled_date: new Date(),
      start_time: "",
      end_time: "",
      status: "SCHEDULED" as "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW",
      reason: "",
      notes: "",
    },
    validate: {
      scheduled_date: (value) => (!value ? "Date is required" : null),
      start_time: (value) => (!value ? "Start time is required" : null),
    },
  });

  const handleEditAppointment = (time: string, appointment: any) => {
    if (!isAppointmentInFuture(appointment)) {
      notifications.show({
        title: "Cannot Edit",
        message: "Only future appointments can be edited",
        color: "orange",
      });
      return;
    }

    // Populate form with appointment data
    const appointmentDate = appointment.scheduled_date
      ? new Date(appointment.scheduled_date)
      : new Date();

    editForm.setValues({
      patient: appointment.patientId?.toString() || "",
      doctor: appointment.doctor?.id?.toString() || appointment.doctor?.toString() || "",
      service: appointment.service?.id?.toString() || appointment.service?.toString() || "",
      scheduled_date: appointmentDate,
      start_time: convertTo12Hour(appointment.formatted_start_time || appointment.start_time || ""),
      end_time: convertTo12Hour(appointment.formatted_end_time || appointment.end_time || ""),
      status: appointment.status || "SCHEDULED",
      reason: appointment.reason || "",
      notes: appointment.notes || "",
    });

    setEditingAppointment({ time, ...appointment });
    openEdit();
  };

  const handleUpdateAppointment = async (values: typeof editForm.values) => {
    if (!editingAppointment) return;

    try {
      const scheduledDate = values.scheduled_date.toISOString().split("T")[0];
      const time24 = convertTo24Hour(values.start_time);

      // Calculate end time (add 30 minutes to start time if end_time not provided)
      let endTime24 = "";
      if (values.end_time) {
        endTime24 = convertTo24Hour(values.end_time);
      } else {
        const [hours, minutes] = time24.split(":");
        const startDate = new Date(values.scheduled_date);
        startDate.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0);
        const endDate = new Date(startDate.getTime() + 30 * 60000);
        endTime24 = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
      }

      const updatePayload: any = {
        scheduled_date: scheduledDate,
        start_time: time24 + ":00",
        end_time: endTime24 + ":00",
        status: values.status,
      };

      // Add optional fields only if provided
      if (values.patient) {
        updatePayload.patient = parseInt(values.patient);
      } else {
        updatePayload.patient = editingAppointment.patientId || 0;
      }
      if (values.doctor) {
        updatePayload.doctor = parseInt(values.doctor);
      } else {
        updatePayload.doctor = 0;
      }
      if (values.service) {
        updatePayload.service = parseInt(values.service);
      } else {
        updatePayload.service = 0;
      }
      if (values.reason) {
        updatePayload.reason = values.reason;
      }
      if (values.notes) {
        updatePayload.notes = values.notes;
      }

        await updateAppointment({
          id: editingAppointment.id,
        data: updatePayload,
        }).unwrap();

      notifications.show({
        title: "Success",
        message: "Appointment updated successfully",
        color: "green",
      });

        refetch();
        closeEdit();
      setEditingAppointment(null);
      editForm.reset();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.detail || error?.data?.message || "Failed to update appointment",
        color: "red",
      });
    }
  };

  const handleDeleteAppointment = async (time: string) => {
    const appointment = appointments[time];
    if (appointment?.id) {
      if (!isAppointmentInFuture(appointment)) {
        notifications.show({
          title: "Cannot Delete",
          message: "Only future appointments can be deleted",
          color: "orange",
        });
        return;
      }

      setDeletingAppointmentId(appointment.id);
      try {
        await deleteAppointment(appointment.id).unwrap();
        notifications.show({
          title: "Success",
          message: "Appointment deleted successfully",
          color: "green",
        });
        refetch();
      } catch (error: any) {
        notifications.show({
          title: "Error",
          message: error?.data?.detail || error?.data?.message || "Failed to delete appointment",
          color: "red",
        });
      } finally {
        setDeletingAppointmentId(null);
      }
    }
  };

  // Date navigation
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    // Don't allow going to past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(newDate);
    compareDate.setHours(0, 0, 0, 0);
    if (compareDate >= today) {
    setSelectedDate(newDate);
    }
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => setSelectedDate(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Week navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const getWeekDays = () => {
    const days = [];
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay();

    for (let i = 0; i < 7; i++) {
      days.push(new Date(curr.getFullYear(), curr.getMonth(), first + i));
    }
    return days;
  };

  // Month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const isToday = (day: number | null, date?: Date) => {
    if (!day) return false;
    const today = new Date();
    const compareDate = date || currentMonth;
    return (
      day === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear()
    );
  };

  // Reminders
  const sendReminder = (id: number) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, reminderSent: true } : r)));
  };

  const sendAllReminders = () => {
    setReminders((prev) => prev.map((r) => ({ ...r, reminderSent: true })));
  };

  const bookedCount = Object.keys(appointments).length;
  const availableCount = timeSlots.length - bookedCount;
  const pendingCount = reminders.filter((r) => !r.reminderSent).length;
  const sentCount = reminders.filter((r) => r.reminderSent).length;
  const weekDays = getWeekDays();
  const monthDays = getDaysInMonth();
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800 mb-2">
            Appointments
          </Title>
          <Text size="sm" c="dimmed">
            Manage all your appointments in one place
          </Text>
        </div>
        <Group>
          <Badge size="lg" variant="light" color="green">
            {bookedCount} Booked
          </Badge>
          <Badge size="lg" variant="light" color="blue">
            {availableCount} Available
          </Badge>
        </Group>
      </Group>

      {/* Quick Action Button */}
      <div className="mb-6">
        <Button
          size="xl"
          className="h-16 w-full md:w-auto bg-gradient-to-r from-[#19b5af] to-[#14918c] hover:opacity-90"
          leftSection={<Calendar size={24} />}
          onClick={handleAddAppointment}
        >
            <Text size="lg" fw={700}>
            Add Appointment
            </Text>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "daily")} color="teal">
        <Tabs.List>
          <Tabs.Tab value="daily" leftSection={<Clock size={16} />}>
            Daily View
          </Tabs.Tab>
          <Tabs.Tab value="weekly" leftSection={<Calendar size={16} />}>
            Weekly
          </Tabs.Tab>
          <Tabs.Tab value="monthly" leftSection={<Calendar size={16} />}>
            Monthly
          </Tabs.Tab>
          <Tabs.Tab value="reminders" leftSection={<Bell size={16} />}>
            Reminders {pendingCount > 0 && `(${pendingCount})`}
          </Tabs.Tab>
        </Tabs.List>

        {/* Daily View */}
        <Tabs.Panel value="daily" pt="xl">
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="teal" />
            </div>
          )}

          {!isLoading && (
            <>
      {/* Date Navigation */}
      <Card shadow="sm" p="md" mb="lg" className="border border-gray-200">
        <Group justify="space-between">
          <Button variant="light" onClick={goToToday} size="sm">
            Today
          </Button>
          <Group>
            <ActionIcon size="lg" variant="light" onClick={goToPreviousDay}>
              <ChevronLeft size={20} />
            </ActionIcon>
            <Text size="lg" fw={600}>
              {formatDate(selectedDate)}
            </Text>
            <ActionIcon size="lg" variant="light" onClick={goToNextDay}>
              <ChevronRight size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Card>

          {/* Time Slots */}
      <Card shadow="sm" className="border border-gray-200">
        <div className="grid grid-cols-[100px_1fr] gap-0 border-b border-gray-200">
          <div className="p-3 bg-gray-50 border-r border-gray-200">
                <Text size="sm" fw={600} c="dimmed">
                  TIME
                </Text>
          </div>
          <div className="p-3 bg-gray-50">
                <Text size="sm" fw={600} c="dimmed">
                  APPOINTMENT
                </Text>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {timeSlots.map((time) => {
            const appointment = appointments[time];
            const isBooked = !!appointment;

            return (
              <div
                key={time}
                className={`grid grid-cols-[100px_1fr] gap-0 hover:bg-gray-50 transition-colors ${
                  isBooked ? "bg-green-50/50" : ""
                }`}
              >
                <div className="p-4 border-r border-gray-200">
                  <Text size="sm" fw={600} className="text-gray-700">
                    {time}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    ({convertToEthiopianTime(convertTo24Hour(time))} ET)
                  </Text>
                </div>

                <div className="p-3">
                  {isBooked ? (
                    <div className="flex items-center justify-between bg-white border-l-4 border-[#19b5af] rounded-lg p-3 shadow-sm">
                      <div className="flex-1">
                        <Group gap="xs" mb={4}>
                          <Text size="sm" fw={700}>
                            {appointment.patient}
                          </Text>
                          <Badge size="xs" color={appointment.type === "new" ? "cyan" : "violet"}>
                            {appointment.type === "new" ? "New" : "Follow-up"}
                          </Badge>
                        </Group>
                        <Group gap="xs">
                          <Phone size={14} className="text-gray-500" />
                          <Text size="xs" c="dimmed">
                            {appointment.phone}
                          </Text>
                          <Clock size={14} className="text-gray-500 ml-2" />
                          <Text size="xs" c="dimmed">
                            {appointment.duration || 30} min
                          </Text>
                        </Group>
                      </div>
                      <Group gap={4}>
                        {isAppointmentInFuture(appointment) && (
                          <>
                        <ActionIcon
                          size="sm"
                          variant="light"
                          color="blue"
                          onClick={() => handleEditAppointment(time, appointment)}
                          title="Edit"
                              disabled={isUpdatingAppointment || isDeletingAppointment}
                        >
                          <Edit size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="light"
                              color="red"
                              onClick={() => handleDeleteAppointment(time)}
                              title="Delete"
                              loading={deletingAppointmentId === appointment.id}
                              disabled={deletingAppointmentId === appointment.id || isDeletingAppointment}
                            >
                              <Trash2 size={14} />
                        </ActionIcon>
                          </>
                        )}
                        <ActionIcon
                          size="sm"
                          variant="light"
                          color="teal"
                          onClick={() => {
                            const patientId = appointment.patientId || appointment.patient?.id || appointment.patient?.patient_id;
                            if (patientId) {
                              router.push(`/patients/${patientId}`);
                            }
                          }}
                          title="View Patient Details"
                        >
                          <Eye size={14} />
                        </ActionIcon>
                      </Group>
                    </div>
                  ) : (
                    <Button
                      variant="subtle"
                      color="gray"
                      fullWidth
                      size="sm"
                      disabled={isPastDateTime(selectedDate, time)}
                      onClick={() => {
                        setSelectedSlot(time);
                        setAppointmentType(null);
                        openBook();
                      }}
                      className="text-gray-400 hover:text-[#19b5af] hover:bg-[#19b5af]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPastDateTime(selectedDate, time) ? "Past time" : "Click to book"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
            </>
          )}
        </Tabs.Panel>

        {/* Weekly View */}
        <Tabs.Panel value="weekly" pt="xl">
          <Card shadow="sm" p="md" mb="lg" className="border border-gray-200">
            <Group justify="space-between">
              <Group>
                <Button variant="light" leftSection={<ChevronLeft size={16} />} onClick={goToPreviousWeek}>
                  Previous
                </Button>
                <Button variant="filled" className="bg-[#19b5af]" onClick={goToToday}>
                  This Week
                </Button>
                <Button variant="light" rightSection={<ChevronRight size={16} />} onClick={goToNextWeek}>
                  Next
                </Button>
              </Group>
            </Group>
          </Card>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="teal" />
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map((day, index) => {
                const dateKey = formatDateForAPI(day);
                const dayAppointments = appointmentsByDate[dateKey || ""] || [];

                return (
                  <Card
                    key={index}
                    className={`border-2 ${
                      isToday(day.getDate(), day) ? "border-[#19b5af] bg-[#19b5af]/5" : "border-gray-200"
                    }`}
                    padding="lg"
                  >
                    <div className="text-center mb-4">
                      <Text size="xs" c="dimmed" tt="uppercase" mb={4}>
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </Text>
                      <Text size="xl" fw={700} className={isToday(day.getDate(), day) ? "text-[#19b5af]" : "text-gray-700"}>
                        {day.getDate()}
                      </Text>
                    </div>

                    <div className="space-y-2">
                      {dayAppointments.length > 0 ? (
                        dayAppointments.slice(0, 3).map((apt) => (
                          <div key={apt.id} className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <Group gap={6} mb={4}>
                              <Clock size={12} className="text-green-600" />
                              <Text size="xs" fw={600} className="text-green-700">
                                {formatTimeWithET(apt.formatted_start_time)}
                              </Text>
                            </Group>
                            <Text size="sm" fw={600}>
                              {apt.patient?.name || "Appointment"}
                            </Text>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Text size="sm" c="dimmed">
                            No appointments
                          </Text>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Badge variant="light" fullWidth>
                        {dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Tabs.Panel>

        {/* Monthly View */}
        <Tabs.Panel value="monthly" pt="xl">
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" color="teal" />
            </div>
          )}


          {!isLoading && (
            <>
          <Card shadow="sm" p="md" mb="lg" className="border border-gray-200">
            <Group justify="space-between">
              <Group>
                <Button variant="light" leftSection={<ChevronLeft size={16} />} onClick={goToPreviousMonth}>
                  Previous
                </Button>
                <Button variant="filled" className="bg-[#19b5af]" onClick={() => setCurrentMonth(new Date())}>
                  This Month
                </Button>
                <Button variant="light" rightSection={<ChevronRight size={16} />} onClick={goToNextMonth}>
                  Next
                </Button>
              </Group>
              <Text size="xl" fw={700}>
                {monthName}
              </Text>
            </Group>
          </Card>

          <Card shadow="sm" p="lg" className="border border-gray-200">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center">
                  <Text size="sm" fw={600} c="dimmed">
                    {day}
                  </Text>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="min-h-[80px] p-2 rounded-lg border-2 bg-gray-50 border-gray-100" />;
                }

                const dateKey = formatDateForAPI(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                const dayAppointments = appointmentsByDate[dateKey || ""] || [];

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md
                      ${isToday(day) ? "border-[#19b5af] bg-[#19b5af]/10" : "border-gray-200"}
                      ${dayAppointments.length > 0 ? "bg-green-50 hover:bg-green-100" : "bg-white"}
                    `}
                  >
                    <Text size="lg" fw={700} className={isToday(day) ? "text-[#19b5af]" : "text-gray-700"} mb="xs">
                      {day}
                    </Text>
                    {dayAppointments.length > 0 && (
                      <Badge size="sm" variant="filled" className="bg-green-500" fullWidth>
                        {dayAppointments.length} apt{dayAppointments.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
            </>
          )}
        </Tabs.Panel>

        {/* Reminders */}
        <Tabs.Panel value="reminders" pt="xl">
          <Group justify="space-between" mb="xl">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Bell size={18} className="text-gray-600" />
              <Text size="sm" fw={600}>
                Auto Reminders
              </Text>
              <Switch checked={autoReminders} onChange={(e) => setAutoReminders(e.currentTarget.checked)} color="teal" />
            </div>
            <Button
              size="md"
              className="bg-[#19b5af] hover:bg-[#14918c]"
              leftSection={<MessageSquare size={18} />}
              onClick={sendAllReminders}
              disabled={pendingCount === 0}
            >
              Send All ({pendingCount})
            </Button>
          </Group>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Pending
                  </Text>
                  <Text size="2xl" fw={700} className="text-orange-600">
                    {pendingCount}
                  </Text>
                </div>
                <Bell size={32} className="text-orange-500" />
              </Group>
            </Card>

            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Sent
                  </Text>
                  <Text size="2xl" fw={700} className="text-green-600">
                    {sentCount}
                  </Text>
                </div>
                <Check size={32} className="text-green-500" />
              </Group>
            </Card>

            <Card shadow="sm" p="lg" className="border border-gray-200">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Total
                  </Text>
                  <Text size="2xl" fw={700} className="text-[#19b5af]">
                    {reminders.length}
                  </Text>
                </div>
                <MessageSquare size={32} className="text-[#19b5af]" />
              </Group>
            </Card>
          </div>

          <div className="space-y-3">
            {reminders.map((reminder) => (
              <Card
                key={reminder.id}
                shadow="sm"
                p="lg"
                className={`border-2 transition-all ${
                  reminder.reminderSent ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-[#19b5af]"
                }`}
              >
                <Group justify="space-between">
                  <div className="flex-1">
                    <Group mb="sm">
                      <Text size="lg" fw={700}>
                        {reminder.patient}
                      </Text>
                      {reminder.reminderSent && (
                        <Badge color="green" leftSection={<Check size={12} />}>
                          Sent
                        </Badge>
                      )}
                    </Group>
                    <Group gap="xl">
                      <Group gap="xs">
                        <Phone size={16} className="text-gray-500" />
                        <Text size="sm" c="dimmed">
                          {reminder.phone}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <Text size="sm" fw={600} className="text-[#19b5af]">
                          {reminder.date}
                        </Text>
                        <Text size="sm" c="dimmed">
                          at
                        </Text>
                        <Text size="sm" fw={600}>
                          {reminder.time}
                        </Text>
                      </Group>
                    </Group>
                  </div>

                  <Group>
                    {!reminder.reminderSent ? (
                      <>
                        <Button
                          variant="light"
                          color="blue"
                          leftSection={<MessageSquare size={16} />}
                          onClick={() => sendReminder(reminder.id)}
                        >
                          Send SMS
                        </Button>
                        <ActionIcon size="lg" variant="light" color="teal" onClick={() => sendReminder(reminder.id)}>
                          <Mail size={18} />
                        </ActionIcon>
                      </>
                    ) : (
                      <Badge color="green" size="lg" leftSection={<Check size={14} />}>
                        Sent Successfully
                      </Badge>
                    )}
                  </Group>
                </Group>
              </Card>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs>

      {/* Book Appointment Modal */}
      <Modal
        opened={bookModalOpened}
        onClose={closeBook}
        title={
          <Group>
            <Calendar size={20} className="text-[#19b5af]" />
            <Text fw={600} size="lg">
              Book Appointment
            </Text>
          </Group>
        }
        size="lg"
      >
        <form onSubmit={handleQuickSave}>
          <Stack gap="md">
            <Select
              label="Select Patient"
              placeholder="Choose existing patient"
              required
              size="lg"
              data={(patientsData?.results || []).map((p: any) => {
                const fullName = `${p.profile?.user?.first_name || ""} ${p.profile?.user?.last_name || ""}`.trim() || p.name || "N/A";
                const phone = p.profile?.phone_number || "N/A";
                return {
                  value: p.id.toString(),
                  label: `${fullName} - ${phone}`,
                };
              })}
              value={selectedPatientId}
              onChange={setSelectedPatientId}
              searchable
              autoFocus
            />

            <DatePickerInput
              label="Scheduled Date"
              placeholder="Select date"
              required
              size="lg"
              leftSection={<Calendar size={16} />}
              minDate={new Date()}
              value={selectedDate}
              valueFormat="MMM D, YYYY"
              onChange={(date) => {
                if (date) {
                  setSelectedDate(date);
                  // Clear selected slot when date changes to avoid conflicts
                  setSelectedSlot(null);
                }
              }}
            />

              <Select
                label="Select Time"
                placeholder="Choose available time slot"
                required
                size="lg"
                data={timeSlots
                  .filter((t) => {
                    // Filter out booked slots for the selected date
                    const dateKey = formatDateForAPI(selectedDate);
                    if (!appointmentsData?.appointments) return true;

                    // Check if this time slot is booked on the selected date
                    const isBooked = appointmentsData.appointments.some((apt: any) => {
                      if (apt.formatted_date !== dateKey) return false;
                      const aptTime12 = convertTo12Hour(apt.formatted_start_time);
                      return aptTime12 === t;
                    });

                    return !isBooked;
                  })
                  .map((t) => ({
                    value: t,
                    label: `${t} (${convertToEthiopianTime(convertTo24Hour(t))} ET)`,
                    disabled: selectedDate ? isPastDateTime(selectedDate, t) : false,
                  }))}
                value={selectedSlot}
                onChange={(value) => setSelectedSlot(value)}
              />

              <Select
                label="Doctor (Optional)"
                placeholder="Select doctor"
                size="lg"
                data={(doctorsData?.results || []).map((doctor: any) => {
                  const doctorName = `${doctor.profile?.user?.first_name || ""} ${doctor.profile?.user?.last_name || ""}`.trim() || doctor.name || "N/A";
                  return {
                    value: doctor.id.toString(),
                    label: doctorName,
                  };
                })}
                value={selectedDoctor}
                onChange={(value) => setSelectedDoctor(value || "")}
                searchable
              />

              <Select
                label="Service"
                placeholder="Select service"
                required
                size="lg"
                data={(servicesData?.results || []).map((service: any) => ({
                  value: service.id.toString(),
                  label: service.name,
                }))}
                value={selectedService}
                onChange={(value) => setSelectedService(value || "")}
                searchable
              />

              <TextInput
                label="Reason (Optional)"
                placeholder="Reason for appointment"
                size="lg"
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.currentTarget.value)}
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional notes"
                rows={3}
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.currentTarget.value)}
              />

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={closeBook}
                size="lg"
                disabled={isCreatingAppointment}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-[#19b5af] hover:bg-[#14918c]"
                leftSection={<Check size={18} />}
                disabled={!selectedSlot || !selectedPatientId || !selectedService || isCreatingAppointment}
                loading={isCreatingAppointment}
              >
                Book Appointment
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => {
          closeEdit();
          setEditingAppointment(null);
          editForm.reset();
        }}
        title={
          <Group>
            <Edit size={20} className="text-[#19b5af]" />
            <Text fw={600} size="lg">
              Edit Appointment
            </Text>
          </Group>
        }
        size="lg"
      >
        <form onSubmit={editForm.onSubmit(handleUpdateAppointment)}>
          <Stack gap="md">
            <Select
              label="Patient"
              placeholder="Select patient"
              required
              data={(patientsData?.results || []).map((p: any) => {
                const fullName = `${p.profile?.user?.first_name || ""} ${p.profile?.user?.last_name || ""}`.trim() || p.name || "N/A";
                return {
                  value: p.id.toString(),
                  label: fullName,
                };
              })}
              {...editForm.getInputProps("patient")}
              searchable
            />

            <Select
              label="Doctor"
              placeholder="Select doctor"
              data={(doctorsData?.results || []).map((doctor: any) => {
                const doctorName = `${doctor.profile?.user?.first_name || ""} ${doctor.profile?.user?.last_name || ""}`.trim() || doctor.name || "N/A";
                return {
                  value: doctor.id.toString(),
                  label: doctorName,
                };
              })}
              {...editForm.getInputProps("doctor")}
              searchable
            />

            <Select
              label="Service"
              placeholder="Select service"
              data={(servicesData?.results || []).map((service: any) => ({
                value: service.id.toString(),
                label: service.name,
              }))}
              {...editForm.getInputProps("service")}
              searchable
            />

            <DatePickerInput
              label="Scheduled Date"
              placeholder="Select date"
              required
              leftSection={<Calendar size={16} />}
              minDate={new Date()}
              value={editForm.values.scheduled_date}
              onChange={(date) => {
                editForm.setFieldValue("scheduled_date", date || new Date());
              }}
              error={editForm.errors.scheduled_date}
            />

            <Select
              label="Start Time"
              placeholder="Select time"
              required
              data={timeSlots.map((t) => ({
                value: t,
                label: `${t} (${convertToEthiopianTime(convertTo24Hour(t))} ET)`,
              }))}
              {...editForm.getInputProps("start_time")}
            />

            {/* <Select
              label="End Time (Optional)"
              placeholder="Select time"
              data={timeSlots.map((t) => ({
                value: t,
                label: `${t} (${convertToEthiopianTime(convertTo24Hour(t))} ET)`,
              }))}
              {...editForm.getInputProps("end_time")}
            /> */}

            <Select
              label="Status"
              data={[
                { value: "SCHEDULED", label: "Scheduled" },
                { value: "CONFIRMED", label: "Confirmed" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
                { value: "NO_SHOW", label: "No Show" },
              ]}
              {...editForm.getInputProps("status")}
            />

            <TextInput
              label="Reason (Optional)"
              placeholder="Reason for appointment"
              {...editForm.getInputProps("reason")}
            />

            <Textarea
              label="Notes (Optional)"
              placeholder="Additional notes"
              rows={3}
              {...editForm.getInputProps("notes")}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                onClick={() => {
                  closeEdit();
                  setEditingAppointment(null);
                  editForm.reset();
                }}
                size="lg"
                disabled={isUpdatingAppointment}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-[#19b5af] hover:bg-[#14918c]"
                leftSection={<Check size={18} />}
                loading={isUpdatingAppointment}
                disabled={isUpdatingAppointment}
              >
                Update Appointment
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
