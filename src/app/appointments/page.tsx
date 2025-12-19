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
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetActiveAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "../../shared/api/appointmentsApi";

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

// Mock data
const existingPatients = [
  { value: "1", label: "Abebe Kebede", phone: "+251 911 234 567" },
  { value: "2", label: "Tigist Alemu", phone: "+251 912 345 678" },
  { value: "3", label: "Dawit Tadesse", phone: "+251 913 456 789" },
  { value: "4", label: "Sara Getachew", phone: "+251 914 567 890" },
];

const mockReminders = [
  { id: 1, patient: "Abebe Kebede", phone: "+251 911 234 567", date: "Today", time: "02:00 PM", reminderSent: false },
  { id: 2, patient: "Tigist Alemu", phone: "+251 912 345 678", date: "Tomorrow", time: "09:00 AM", reminderSent: true },
  { id: 3, patient: "Dawit Tadesse", phone: "+251 913 456 789", date: "Dec 18", time: "10:30 AM", reminderSent: false },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<string>("daily");
  const [bookModalOpened, { open: openBook, close: closeBook }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<"new" | "followup" | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [bookingTab, setBookingTab] = useState<string>("new");

  const [reminders, setReminders] = useState(mockReminders);
  const [autoReminders, setAutoReminders] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0];
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
  const { data: appointmentsData, isLoading, refetch } = useGetActiveAppointmentsQuery(dateRange);
  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  // Debug: Log the data
  console.log("Appointments Data:", appointmentsData);
  console.log("Date Range:", dateRange);

  // Convert API appointments to time slot format
  const appointments = useMemo(() => {
    if (!appointmentsData?.appointments) {
      console.log("No appointments data");
      return {};
    }

    console.log("Processing appointments:", appointmentsData.appointments);

    const slots: Record<string, any> = {};
    appointmentsData.appointments.forEach((apt) => {
      // Use formatted_start_time in 24-hour format, convert to 12-hour for display
      const timeKey24 = apt.formatted_start_time; // e.g., "14:30"
      const timeKey12 = convertTo12Hour(timeKey24); // e.g., "2:30 PM"
      console.log("Mapping appointment to time slot:", timeKey24, "->", timeKey12, apt);

      slots[timeKey12] = {
        ...apt,
        time24: timeKey24, // Keep 24-hour format for API calls
        patient: apt.doctor?.name || apt.service?.name || "Unnamed Patient",
        phone: apt.doctor?.phone || "N/A",
        type: apt.status === "SCHEDULED" ? "new" : "followup",
        duration: 30, // Calculate from start_time and end_time if needed
      };
    });

    console.log("Final time slots:", slots);
    return slots;
  }, [appointmentsData]);

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

  // Booking handlers
  const handleNewPatient = () => {
    setAppointmentType("new");
    setBookingTab("new");
    openBook();
  };

  const handleFollowUp = () => {
    setAppointmentType("followup");
    setBookingTab("followup");
    openBook();
  };

  const handleQuickSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedSlot) {
      try {
        // Convert 12-hour format to 24-hour format for API
        const time24 = convertTo24Hour(selectedSlot);

        // Calculate end time (add 30 minutes to start time)
        const [hours, minutes] = time24.split(":");
        const startDate = new Date(selectedDate);
        startDate.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0);
        const endDate = new Date(startDate.getTime() + 30 * 60000);

        const scheduledDate = formatDateForAPI(selectedDate);
        if (!scheduledDate) return;

        await createAppointment({
          scheduled_date: scheduledDate,
          start_time: time24 + ":00",
          end_time: `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}:00`,
          status: "SCHEDULED",
        }).unwrap();

        refetch();
        closeBook();
        setAppointmentType(null);
      } catch (error) {
        console.error("Failed to create appointment:", error);
      }
    }
  };

  const handleEditAppointment = (time: string, appointment: any) => {
    setEditingAppointment({ time, ...appointment });
    openEdit();
  };

  const handleUpdateAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingAppointment) {
      try {
        await updateAppointment({
          id: editingAppointment.id,
          data: {
            // Update with actual fields from your API
            status: editingAppointment.status,
          },
        }).unwrap();

        refetch();
        closeEdit();
      } catch (error) {
        console.error("Failed to update appointment:", error);
      }
    }
  };

  const handleDeleteAppointment = async (time: string) => {
    const appointment = appointments[time];
    if (appointment?.id) {
      try {
        await deleteAppointment(appointment.id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete appointment:", error);
      }
    }
  };

  // Date navigation
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => setSelectedDate(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button
          size="xl"
          className="h-20 bg-gradient-to-r from-[#19b5af] to-[#14918c] hover:opacity-90"
          leftSection={<UserPlus size={24} />}
          onClick={handleNewPatient}
        >
          <div className="text-left">
            <Text size="lg" fw={700}>
              New Patient
            </Text>
            <Text size="xs" opacity={0.9}>
              First-time visitor
            </Text>
          </div>
        </Button>

        <Button
          size="xl"
          className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
          leftSection={<RefreshCw size={24} />}
          onClick={handleFollowUp}
        >
          <div className="text-left">
            <Text size="lg" fw={700}>
              Follow-up Visit
            </Text>
            <Text size="xs" opacity={0.9}>
              Schedule return appointment
            </Text>
          </div>
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
          <Group>
            <ActionIcon size="lg" variant="light" onClick={goToPreviousDay}>
              <ChevronLeft size={20} />
            </ActionIcon>
            <Button variant="light" onClick={goToToday} size="sm">
              Today
            </Button>
            <ActionIcon size="lg" variant="light" onClick={goToNextDay}>
              <ChevronRight size={20} />
            </ActionIcon>
          </Group>
              <Text size="lg" fw={600}>
                {formatDate(selectedDate)}
              </Text>
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
                        <ActionIcon
                          size="sm"
                          variant="light"
                          color="blue"
                          onClick={() => handleEditAppointment(time, appointment)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="light"
                          color="green"
                              onClick={() => (window.location.href = `tel:${appointment.phone}`)}
                          title="Call"
                        >
                          <Phone size={14} />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteAppointment(time)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </ActionIcon>
                      </Group>
                    </div>
                  ) : (
                    <Button
                      variant="subtle"
                      color="gray"
                      fullWidth
                      size="sm"
                      onClick={() => {
                        setSelectedSlot(time);
                        setAppointmentType(null);
                        openBook();
                      }}
                      className="text-gray-400 hover:text-[#19b5af] hover:bg-[#19b5af]/5"
                    >
                      Click to book
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
                                {convertTo12Hour(apt.formatted_start_time)}
                              </Text>
                            </Group>
                            <Text size="sm" fw={600}>
                              {apt.doctor?.name || apt.service?.name || "Appointment"}
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
            {bookingTab === "new" ? (
              <UserPlus size={20} className="text-[#19b5af]" />
            ) : (
              <RefreshCw size={20} className="text-blue-600" />
            )}
            <Text fw={600} size="lg">
              {bookingTab === "new" ? "New Patient" : "Follow-up Visit"}
            </Text>
          </Group>
        }
        size="lg"
      >
        <Tabs value={bookingTab} onChange={(value) => setBookingTab(value || "new")}>
          <Tabs.List grow mb="md">
            <Tabs.Tab value="new" leftSection={<UserPlus size={16} />}>
              New Patient
            </Tabs.Tab>
            <Tabs.Tab value="followup" leftSection={<RefreshCw size={16} />}>
              Follow-up
            </Tabs.Tab>
          </Tabs.List>

          <form onSubmit={handleQuickSave}>
            <Stack gap="md">
              {bookingTab === "new" && (
                <>
                  <TextInput name="patient" label="Patient Name" placeholder="Full name" required size="lg" autoFocus />
                  <TextInput name="phone" label="Phone Number" placeholder="+251 911 234 567" required size="lg" />
                </>
              )}

              {bookingTab === "followup" && (
                  <Select
                    name="selectedPatient"
                    label="Select Patient"
                    placeholder="Choose existing patient"
                    required
                    size="lg"
                  data={existingPatients.map((p) => ({ value: p.value, label: `${p.label} - ${p.phone}` }))}
                    searchable
                    autoFocus
                  />
              )}

              <Select
                label="Select Time"
                placeholder="Choose available time slot"
                required
                size="lg"
                data={timeSlots.filter((t) => !appointments[t])}
                value={selectedSlot}
                onChange={(value) => setSelectedSlot(value)}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={closeBook} size="lg">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#19b5af] hover:bg-[#14918c]"
                  leftSection={<Check size={18} />}
                  disabled={!selectedSlot}
                >
                  Book Appointment
                </Button>
              </Group>
            </Stack>
          </form>
        </Tabs>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEdit}
        title={
          <Group>
            <Edit size={20} className="text-blue-600" />
            <Text fw={600} size="lg">
              Edit Appointment
            </Text>
          </Group>
        }
        size="md"
      >
        <form onSubmit={handleUpdateAppointment}>
          <Stack gap="md">
            <TextInput name="patient" label="Patient Name" defaultValue={editingAppointment?.patient} required size="lg" />
            <TextInput name="phone" label="Phone Number" defaultValue={editingAppointment?.phone} required size="lg" />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeEdit} size="lg">
                Cancel
              </Button>
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700" leftSection={<Check size={18} />}>
                Update
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
