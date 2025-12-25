"use client";

import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Group,
    Modal,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { Calendar, Eye, Mail, Phone, Search } from "lucide-react";
import { useState } from "react";
import {
    Message,
    useGetMessagesQuery,
    useMarkAsReadMutation,
} from "../../shared/api/messagesApi";

export default function NotificationsPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Get all messages (both read and unread)
  const { data: messagesData, isLoading, error } = useGetMessagesQuery({});
  const [markAsRead, { isLoading: isMarkingRead }] = useMarkAsReadMutation();

  const messages = messagesData?.results ?? [];

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.phone_number.includes(searchQuery) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter && message.status !== statusFilter) return false;
    if (readFilter === "read" && !message.is_read) return false;
    if (readFilter === "unread" && message.is_read) return false;
    return true;
  });

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    openView();

    // Mark as read if unread
    if (!message.is_read) {
      try {
        await markAsRead(message.id).unwrap();
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "yellow",
    RESOLVED: "green",
    ARCHIVED: "gray",
  };

  if (isLoading) {
    return (
      <Box>
        <Title order={2} mb="lg">
          Notifications
        </Title>
        <Text>Loading notifications...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Title order={2} mb="lg">
          Notifications
        </Title>
        <Text c="red">Error loading notifications</Text>
      </Box>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const pendingCount = messages.filter((m) => m.status === "PENDING").length;

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} className="text-gray-800">
            Notifications
          </Title>
          <Text size="sm" c="dimmed">
            Manage and view all messages
          </Text>
        </div>
      </Group>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Messages",
            value: messages.length.toString(),
            color: "bg-blue-500",
          },
          {
            label: "Unread",
            value: unreadCount.toString(),
            color: "bg-red-500",
          },
          {
            label: "Pending",
            value: pendingCount.toString(),
            color: "bg-yellow-500",
          },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" p="md" className="border border-gray-200">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  {stat.label}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
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
            placeholder="Search by name, phone, or message..."
            leftSection={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1"
          />
          <Select
            placeholder="Status"
            data={[
              { value: "PENDING", label: "Pending" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={150}
          />
          <Select
            placeholder="Read Status"
            data={[
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ]}
            value={readFilter}
            onChange={setReadFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Messages Table */}
      <Card shadow="sm" p="lg" className="border border-gray-200">
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Phone Number</Table.Th>
              <Table.Th>Message</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Read Status</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredMessages.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" py="xl" c="dimmed">
                    No messages found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredMessages.map((message) => (
                <Table.Tr
                  key={message.id}
                  className={!message.is_read ? "bg-blue-50" : ""}
                >
                  <Table.Td>
                    <Badge variant="light" color="gray">
                      {message.id}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {message.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <Phone size={14} className="text-gray-400" />
                      <Text size="sm" c="dimmed">
                        {message.phone_number}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2} style={{ maxWidth: "400px" }}>
                      {message.message}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={statusColors[message.status] || "gray"}
                      size="sm"
                    >
                      {message.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={message.is_read ? "green" : "red"}
                      size="sm"
                    >
                      {message.is_read ? "Read" : "Unread"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <Calendar size={14} className="text-gray-400" />
                      <Text size="xs" c="dimmed">
                        {dayjs(message.created_at).format("MMM DD, YYYY HH:mm")}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleViewMessage(message)}
                    >
                      <Eye size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* View Message Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        title={
          <Text fw={600} size="lg">
            Message Details
          </Text>
        }
        size="md"
      >
        {selectedMessage && (
          <Stack gap="md">
            <Group justify="space-between">
              <Badge variant="light" color="gray">
                ID: {selectedMessage.id}
              </Badge>
              <Group gap="xs">
                <Badge
                  variant="light"
                  color={
                    statusColors[selectedMessage.status] || "gray"
                  }
                  size="sm"
                >
                  {selectedMessage.status}
                </Badge>
                <Badge
                  variant="light"
                  color={selectedMessage.is_read ? "green" : "red"}
                  size="sm"
                >
                  {selectedMessage.is_read ? "Read" : "Unread"}
                </Badge>
              </Group>
            </Group>

            <div>
              <Text size="sm" c="dimmed" mb={4}>
                From
              </Text>
              <Text size="lg" fw={600}>
                {selectedMessage.name}
              </Text>
            </div>

            <Card className="bg-gray-50">
              <Stack gap="md">
                <div>
                  <Text size="xs" c="dimmed" mb={4}>
                    Phone Number
                  </Text>
                  <Group gap={8}>
                    <Phone size={16} className="text-gray-400" />
                    <Text size="sm">{selectedMessage.phone_number}</Text>
                  </Group>
                </div>
              </Stack>
            </Card>

            <div>
              <Text size="sm" c="dimmed" mb={8}>
                Message
              </Text>
              <Card className="bg-white border border-gray-200">
                <Text size="sm">{selectedMessage.message}</Text>
              </Card>
            </div>

            <Group grow>
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  Received
                </Text>
                <Group gap={6}>
                  <Calendar size={16} className="text-gray-400" />
                  <Text size="sm">
                    {dayjs(selectedMessage.created_at).format(
                      "MMM DD, YYYY HH:mm"
                    )}
                  </Text>
                </Group>
              </div>
              {selectedMessage.read_at && (
                <div>
                  <Text size="sm" c="dimmed" mb={4}>
                    Read At
                  </Text>
                  <Group gap={6}>
                    <Calendar size={16} className="text-green-500" />
                    <Text size="sm" c="green">
                      {dayjs(selectedMessage.read_at).format(
                        "MMM DD, YYYY HH:mm"
                      )}
                    </Text>
                  </Group>
                </div>
              )}
            </Group>

            <Group justify="flex-end" mt="md">
              <ActionIcon
                variant="light"
                color="blue"
                size="lg"
                onClick={() => {
                  if (selectedMessage.phone_number) {
                    window.open(`tel:${selectedMessage.phone_number}`);
                  }
                }}
              >
                <Phone size={18} />
              </ActionIcon>
              <ActionIcon
                variant="light"
                color="blue"
                size="lg"
                onClick={() => {
                  window.open(`mailto:${selectedMessage.name}`);
                }}
              >
                <Mail size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}
