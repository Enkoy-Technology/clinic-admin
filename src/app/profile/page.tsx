"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Tabs,
  SimpleGrid,
  Loader,
  Alert,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconShield,
  IconEdit,
  IconLock,
  IconAlertCircle,
  IconKey,
  IconBuilding,
} from "@tabler/icons-react";
import { useGetCurrentUserQuery } from "../../shared/api/authApi";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" color="teal" />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box p="md">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
        >
          Failed to load profile information. Please try again later.
        </Alert>
      </Box>
    );
  }

  const profileImageUrl = user.profile_picture?.startsWith('/media/')
    ? `https://ff-gng8.onrender.com${user.profile_picture}`
    : user.profile_picture;

  return (
    <Box>
      {/* Header */}
      <div className="mb-6">
        <Title order={2} className="text-gray-800 mb-2">
          My Profile
        </Title>
        <Text size="sm" c="dimmed">
          Manage your account information and permissions
        </Text>
      </div>

      {/* Profile Header Card */}
      <Card shadow="sm" p="xl" radius="lg" className="mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <Avatar
            src={profileImageUrl}
            size={120}
            radius="xl"
            className="border-4 border-white shadow-lg"
          />

          {/* User Info */}
          <div className="flex-1">
            <Group gap="sm" mb="xs">
              <Title order={3}>{user.name}</Title>
              <Badge
                size="lg"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 90 }}
              >
                {user.admin_type}
              </Badge>
              <Badge
                size="sm"
                color={user.status === "ACTIVE" ? "green" : "gray"}
              >
                {user.status}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" mb="xs">
              {user.profile.user.email}
            </Text>
            {user.bio && (
              <Text size="sm" className="max-w-2xl">
                {user.bio}
              </Text>
            )}
            <Group gap="xs" mt="md">
              <Button
                leftSection={<IconEdit size={16} />}
                variant="light"
                color="teal"
              >
                Edit Profile
              </Button>
              <Button
                leftSection={<IconLock size={16} />}
                variant="outline"
                color="gray"
              >
                Change Password
              </Button>
            </Group>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" color="teal">
        <Tabs.List>
          <Tabs.Tab value="personal" leftSection={<IconUser size={16} />}>
            Personal Info
          </Tabs.Tab>
          <Tabs.Tab value="permissions" leftSection={<IconKey size={16} />}>
            Permissions
          </Tabs.Tab>
        </Tabs.List>

        {/* Personal Info Tab */}
        <Tabs.Panel value="personal" pt="xl">
          <Grid>
            {/* Contact Information */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" className="border border-gray-200 h-full">
                <Group gap="sm" mb="lg">
                  <IconUser size={20} className="text-[#19b5af]" />
                  <Title order={5}>Contact Information</Title>
                </Group>

                <Stack gap="md">
                  <div>
                    <Group gap="xs" mb={4}>
                      <IconMail size={16} className="text-gray-500" />
                      <Text size="xs" c="dimmed" fw={600}>
                        Email
                      </Text>
                    </Group>
                    <Text size="sm" pl={24}>
                      {user.profile.user.email}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Group gap="xs" mb={4}>
                      <IconPhone size={16} className="text-gray-500" />
                      <Text size="xs" c="dimmed" fw={600}>
                        Phone Number
                      </Text>
                    </Group>
                    <Text size="sm" pl={24}>
                      {user.profile.phone_number || "Not provided"}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Group gap="xs" mb={4}>
                      <IconBuilding size={16} className="text-gray-500" />
                      <Text size="xs" c="dimmed" fw={600}>
                        Role
                      </Text>
                    </Group>
                    <Text size="sm" pl={24}>
                      {user.profile.role}
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Personal Details */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" className="border border-gray-200 h-full">
                <Group gap="sm" mb="lg">
                  <IconShield size={20} className="text-[#19b5af]" />
                  <Title order={5}>Personal Details</Title>
                </Group>

                <Stack gap="md">
                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Full Name
                    </Text>
                    <Text size="sm">
                      {user.profile.user.first_name} {user.profile.user.last_name}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Gender
                    </Text>
                    <Text size="sm">{user.gender}</Text>
                  </div>

                  <Divider />

                  <div>
                    <Group gap="xs" mb={4}>
                      <IconCalendar size={16} className="text-gray-500" />
                      <Text size="xs" c="dimmed" fw={600}>
                        Date of Birth
                      </Text>
                    </Group>
                    <Text size="sm" pl={24}>
                      {new Date(user.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Address Information */}
            <Grid.Col span={12}>
              <Card shadow="sm" p="lg" radius="md" className="border border-gray-200">
                <Group gap="sm" mb="lg">
                  <IconMapPin size={20} className="text-[#19b5af]" />
                  <Title order={5}>Address</Title>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Street
                    </Text>
                    <Text size="sm">{user.address.street}</Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      City
                    </Text>
                    <Text size="sm">{user.address.city}</Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      State
                    </Text>
                    <Text size="sm">{user.address.state}</Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Postal Code
                    </Text>
                    <Text size="sm">{user.address.postal_code}</Text>
                  </div>
                </SimpleGrid>
              </Card>
            </Grid.Col>

            {/* Account Information */}
            <Grid.Col span={12}>
              <Card shadow="sm" p="lg" radius="md" className="border border-gray-200 bg-gradient-to-br from-blue-50 to-teal-50">
                <Title order={5} mb="md">
                  Account Information
                </Title>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Account Status
                    </Text>
                    <Badge color={user.status === "ACTIVE" ? "green" : "gray"}>
                      {user.status}
                    </Badge>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Member Since
                    </Text>
                    <Text size="sm">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed" fw={600} mb={4}>
                      Last Updated
                    </Text>
                    <Text size="sm">
                      {new Date(user.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </div>
                </SimpleGrid>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Permissions Tab */}
        <Tabs.Panel value="permissions" pt="xl">
          <Card shadow="sm" p="lg" radius="md" className="border border-gray-200">
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={5}>System Permissions</Title>
                <Text size="sm" c="dimmed">
                  You have {user.permissions.length} permissions assigned
                </Text>
              </div>
              <Badge size="lg" variant="light" color="teal">
                {user.admin_type}
              </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              {user.permissions.map((permission) => (
                <Card
                  key={permission.id}
                  className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-default border border-gray-200"
                  p="sm"
                >
                  <Group gap="xs">
                    <IconKey size={14} className="text-[#19b5af]" />
                    <Text size="xs" fw={500}>
                      {permission.label}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4} className="font-mono">
                    {permission.key}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

