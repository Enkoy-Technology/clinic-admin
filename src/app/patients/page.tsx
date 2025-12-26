"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import {
  ArrowRight,
  FileText,
  Phone,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetPatientsQuery } from "../../shared/api/patientsApi";

export default function PatientsPage() {
  const router = useRouter();

  // Fetch patients data from API - refetch on mount to ensure fresh data
  const { data: patientsData, isLoading: isLoadingPatients } = useGetPatientsQuery(
    {
      page: 1,
      per_page: 10, // Get recent 10 patients
    },
    {
      refetchOnMountOrArgChange: true, // Force refetch when navigating to this page
    }
  );

  const patients = patientsData?.results || [];
  const totalPatients = patientsData?.count || 0;

  // Calculate stats from API data
  const activePatients = patients.filter((p: any) => p.status?.toUpperCase() === "ACTIVE").length;
  const completedPatients = patients.filter((p: any) => p.status?.toUpperCase() === "COMPLETED").length;
  const pendingPatients = patients.filter((p: any) => p.status?.toUpperCase() === "PENDING").length;
  const archivedPatients = patients.filter((p: any) => p.status?.toUpperCase() === "ARCHIVED").length;

  // Calculate age distribution (mock for now - would need age data from API)
  const ageGroups = [
    { range: "0-18", count: 0, percentage: 0 },
    { range: "19-35", count: 0, percentage: 0 },
    { range: "36-50", count: 0, percentage: 0 },
    { range: "51+", count: 0, percentage: 0 },
  ];

  // Calculate gender distribution
  const maleCount = patients.filter((p: any) => p.gender === "MALE").length;
  const femaleCount = patients.filter((p: any) => p.gender === "FEMALE").length;
  const totalGender = maleCount + femaleCount;
  const malePercentage = totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 0;
  const femalePercentage = totalGender > 0 ? Math.round((femaleCount / totalGender) * 100) : 0;

  // Get recent patients (last 4 from API)
  const recentPatients = patients.slice(0, 4).map((patient: any) => {
    const fullName = `${patient.profile?.user?.first_name || ""} ${patient.profile?.user?.last_name || ""}`.trim() || patient.name || "N/A";
    return {
      id: patient.id,
      name: fullName,
      phone: patient.profile?.phone_number || "N/A",
      status: patient.status?.toLowerCase() || "active",
      avatar: patient.profile_picture,
      patient: patient, // Keep full patient object for navigation
    };
  });
  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">Patients</Title>
          <Text size="sm" c="dimmed">Manage patient information and records</Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          className="bg-[#19b5af] hover:bg-[#14918c]"
          onClick={() => router.push("/patients/list")}
        >
          Add New Patient
        </Button>
      </Group>

      {/* Stats Cards */}
      {isLoadingPatients ? (
        <div className="flex justify-center items-center py-16 mb-6">
          <Loader size="lg" color="teal" />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          {
            title: "Total Patients",
            value: totalPatients.toLocaleString(),
            change: `${patients.length} shown`,
            icon: Users,
            color: "bg-blue-500",
          },
          {
            title: "Active Patients",
            value: activePatients.toString(),
            change: `${totalPatients > 0 ? Math.round((activePatients / totalPatients) * 100) : 0}% of total`,
            icon: TrendingUp,
            color: "bg-green-500",
          },
          {
            title: "Completed",
            value: completedPatients.toString(),
            change: `${totalPatients > 0 ? Math.round((completedPatients / totalPatients) * 100) : 0}% of total`,
            icon: UserPlus,
            color: "bg-purple-500",
          },
          {
            title: "Pending",
            value: pendingPatients.toString(),
            change: `${totalPatients > 0 ? Math.round((pendingPatients / totalPatients) * 100) : 0}% of total`,
            icon: FileText,
            color: "bg-yellow-500",
          },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="lg" className="border border-gray-200">
            <Group justify="space-between" mb="md">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </Group>
            <Text size="sm" c="dimmed" mb={4}>{stat.title}</Text>
            <Text size="xl" fw={700} mb={4}>{stat.value}</Text>
            <Text size="xs" c="dimmed">{stat.change}</Text>
          </Card>
        ))}
      </div>
      )}

      {/* Quick Actions */}
      <Card shadow="sm" p="lg" mb="lg" className="border border-gray-200">
        <Title order={4} mb="md">Quick Actions</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/patients/list">
            <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 hover:border-[#19b5af] transition-all cursor-pointer h-full">
              <Group justify="space-between">
                <div>
                  <Text fw={600} mb={4}>View All Patients</Text>
                  <Text size="sm" c="dimmed">Browse complete patient directory</Text>
                </div>
                <ArrowRight className="text-[#19b5af]" />
              </Group>
            </Card>
          </Link>
          <Link href="/patients/records">
            <Card className="bg-blue-50 border border-blue-200 hover:border-blue-500 transition-all cursor-pointer h-full">
              <Group justify="space-between">
                <div>
                  <Text fw={600} mb={4}>Medical Records</Text>
                  <Text size="sm" c="dimmed">Access patient medical records</Text>
                </div>
                <ArrowRight className="text-blue-500" />
              </Group>
            </Card>
          </Link>
          <Link href="/patients/treatment-plans">
            <Card className="bg-purple-50 border border-purple-200 hover:border-purple-500 transition-all cursor-pointer h-full">
              <Group justify="space-between">
                <div>
                  <Text fw={600} mb={4}>Treatment Plans</Text>
                  <Text size="sm" c="dimmed">Manage treatment plans</Text>
                </div>
                <ArrowRight className="text-purple-500" />
              </Group>
            </Card>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Patients */}
        <Card shadow="sm" p="lg" className="border border-gray-200 lg:col-span-2">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Recent Patients</Title>
            <Link href="/patients/list">
              <Button variant="light" size="sm">
                View All
              </Button>
            </Link>
          </Group>

          <Stack gap="md">
            {isLoadingPatients ? (
              <div className="flex justify-center items-center py-8">
                <Loader size="md" color="teal" />
              </div>
            ) : recentPatients.length === 0 ? (
              <Text ta="center" py="xl" c="dimmed">
                No patients found
              </Text>
            ) : (
              recentPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className="bg-gray-50 border border-gray-200 hover:border-[#19b5af] transition-colors cursor-pointer"
                  onClick={() => router.push(`/patients/list`)}
                >
                  <Group justify="space-between">
                    <Group>
                      <Avatar src={patient.avatar} size={50} radius="xl" />
                      <div>
                        <Text size="sm" fw={600}>{patient.name}</Text>
                        <Group gap={6}>
                          <Phone size={14} className="text-gray-400" />
                          <Text size="xs" c="dimmed">{patient.phone}</Text>
                        </Group>
                        <Text size="xs" c="dimmed" mt={2}>ID: #{patient.id}</Text>
                      </div>
                    </Group>
                    <Group>
                      <Badge
                        variant="light"
                        color={patient.status === "active" ? "green" : patient.status === "completed" ? "blue" : "gray"}
                        size="sm"
                        className="capitalize"
                      >
                        {patient.status}
                      </Badge>
                    </Group>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </Card>

        {/* Patient Demographics */}
        <Card shadow="sm" p="lg" className="border border-gray-200">
          <Group justify="space-between" mb="lg">
            <Title order={4}>Age Distribution</Title>
          </Group>

          <Stack gap="lg">
            {ageGroups.map((group, index) => (
              <div key={index}>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>{group.range} years</Text>
                  <Group gap={8}>
                    <Text size="sm" c="dimmed">{group.count}</Text>
                    <Text size="xs" c="dimmed">({group.percentage}%)</Text>
                  </Group>
                </Group>
                <Progress
                  value={group.percentage}
                  color="teal"
                  size="md"
                  radius="xl"
                />
              </div>
            ))}
          </Stack>

          <Card className="bg-[#19b5af]/5 border border-[#19b5af]/20 mt-6">
            <Text size="sm" fw={600} mb={4}>Gender Distribution</Text>
            <Group justify="space-between" mb={8}>
              <Text size="xs" c="dimmed">Female</Text>
              <Text size="sm" fw={600}>{femalePercentage}%</Text>
            </Group>
            <Progress value={femalePercentage} color="pink" size="sm" radius="xl" mb="sm" />
            <Group justify="space-between" mb={8}>
              <Text size="xs" c="dimmed">Male</Text>
              <Text size="sm" fw={600}>{malePercentage}%</Text>
            </Group>
            <Progress value={malePercentage} color="blue" size="sm" radius="xl" />
          </Card>
        </Card>
      </div>

      {/* Search Section */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Title order={4} mb="md">Find a Patient</Title>
        <Group>
          <TextInput
            placeholder="Search by name, phone, or patient ID..."
            leftSection={<Search size={16} />}
            className="flex-1"
            size="md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push("/patients/list");
              }
            }}
          />
          <Button
            size="md"
            className="bg-[#19b5af] hover:bg-[#14918c]"
            onClick={() => router.push("/patients/list")}
          >
            Search
          </Button>
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          Tip: Use patient ID for faster search results
        </Text>
      </Card>
    </Box>
  );
}
