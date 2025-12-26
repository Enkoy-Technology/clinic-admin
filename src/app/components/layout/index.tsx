"use client";

import {
    ActionIcon,
    AppShell,
    Avatar,
    Box,
    Group,
    Indicator,
    Menu,
    ScrollArea,
    Text,
    UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconBell,
    IconChevronDown,
    IconLogout,
    IconMenu2 as IconMenu,
    IconSettings,
    IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "../../../shared/api/authApi";
import { useGetUnreadMessagesQuery } from "../../../shared/api/messagesApi";
import AuthGuard from "../../../shared/components/AuthGuard";
import {
    logout,
    selectCurrentUser,
    setUser,
} from "../../../shared/slices/authSlice";
import ClientNavWrapper from "../clientNavWrapper/clientNavWrapper";
import menuItems from "../dashboard/menu_items";

const RootAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpened, setMobileOpened] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    notifications.show({
      title: "Logged out",
      message: "You have been successfully logged out",
      color: "blue",
    });
    router.push("/login");
  };

  // Don't wrap login page in AuthGuard
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedLayout
      user={user}
      mobileOpened={mobileOpened}
      setMobileOpened={setMobileOpened}
      handleLogout={handleLogout}
    >
      {children}
    </ProtectedLayout>
  );
};

// Separate component for protected layout to avoid hook issues
const ProtectedLayout = ({
  children,
  user: userFromRedux,
  mobileOpened,
  setMobileOpened,
  handleLogout,
}: {
  children: React.ReactNode;
  user: any;
  mobileOpened: boolean;
  setMobileOpened: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: userData } = useGetCurrentUserQuery(undefined, {
    skip: !!userFromRedux,
  });

  // Only fetch messages after initial render to avoid blocking
  // Fetch only 2 unread messages for the notification dropdown (page 0, page_size 2)
  const [shouldFetchMessages, setShouldFetchMessages] = useState(false);
  const { data: messagesData } = useGetUnreadMessagesQuery(
    { page: 0, page_size: 2 },
    {
      skip: !shouldFetchMessages,
    }
  );

  // Delay messages fetch to not block initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetchMessages(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update user in Redux when fetched from API
  useEffect(() => {
    if (userData && !userFromRedux) {
      dispatch(setUser(userData));
    }
  }, [userData, userFromRedux, dispatch]);

  const displayUser = userFromRedux || userData;
  // Handle both array response and object with count/results
  const unreadCount = messagesData
    ? (messagesData.count ?? messagesData.results?.length ?? 0)
    : 0;
  const profileImageUrl = displayUser?.profile_picture?.startsWith("/media/")
    ? `https://demo-oxua.onrender.com${displayUser.profile_picture}`
    : displayUser?.profile_picture;

  return (
    <AuthGuard>
      <AppShell
        navbar={{
          width: 280,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened },
        }}
        padding={0}
      >
        {/* Sidebar Navigation - Full Height */}
        <AppShell.Navbar className="bg-[#19b5af]">
          {/* Logo at top */}
          <div className="px-4 py-6 flex items-center justify-center border-b border-white/20">
            <Image
              src="/logo1.png"
              alt="Dr. Hilina Specialty Dental Clinic"
              width={180}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          <ScrollArea className="flex-1 px-4 py-4">
            <ClientNavWrapper menuItems={menuItems} />
          </ScrollArea>

          {/* Footer */}
          <Box className="px-4 py-3 border-t border-white/20">
            <Text size="xs" className="text-center text-white/60">
              © 2024 Dr. Hilina Specialty Dental
            </Text>
          </Box>
        </AppShell.Navbar>

        {/* Main Content with Header */}
        <AppShell.Main className="bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="h-[70px] flex items-center justify-between px-6">
              {/* Left: Menu Toggle (Mobile) */}
              <div className="md:hidden">
                <UnstyledButton
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileOpened(!mobileOpened)}
                >
                  <IconMenu size={24} className="text-gray-700" />
                </UnstyledButton>
              </div>
              <div></div>

              {/* Right: Quick Actions */}
              <Group gap="sm">
                {/* Notifications */}
                <Menu shadow="md" width={320}>
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      size="lg"
                      className="hover:bg-gray-100 text-gray-700"
                    >
                      <Indicator
                        inline
                        size={unreadCount > 0 ? 20 : 8}
                        color="red"
                        processing={unreadCount === 0}
                        label={unreadCount > 0 ? unreadCount : undefined}
                        offset={5}
                        position="top-end"
                      >
                        <IconBell size={22} />
                      </Indicator>
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>
                      Notifications
                      {unreadCount > 0 && (
                        <Text size="xs" c="dimmed" component="span" ml="xs">
                          ({unreadCount} unread)
                        </Text>
                      )}
                    </Menu.Label>
                    {(() => {
                      const messages = messagesData?.results ?? [];
                      if (messages.length > 0) {
                        return (
                          <>
                            {messages.slice(0, 2).map((message) => (
                              <Menu.Item key={message.id}>
                                <div>
                                  <Text size="sm" fw={500}>
                                    {message.name}
                                  </Text>
                                  <Text size="xs" c="dimmed" lineClamp={2}>
                                    {message.message}
                                  </Text>
                                  <Text size="xs" c="dimmed" mt={4}>
                                    {new Date(message.created_at).toLocaleDateString()}
                                  </Text>
                                </div>
                              </Menu.Item>
                            ))}
                            {unreadCount > 2 && (
                              <>
                                <Menu.Divider />
                                <Menu.Item
                                  className="text-center text-[#19b5af]"
                                  onClick={() => router.push("/notifications")}
                                >
                                  View all ({unreadCount} messages)
                                </Menu.Item>
                              </>
                            )}
                          </>
                        );
                      }
                      return (
                        <Menu.Item disabled>
                          <Text size="sm" c="dimmed">
                            No unread messages
                          </Text>
                        </Menu.Item>
                      );
                    })()}
                  </Menu.Dropdown>
                </Menu>

                {/* User Profile */}
                <Menu shadow="md" width={220}>
                  <Menu.Target>
                    <UnstyledButton className="hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                      <Group gap="sm">
                        <Avatar
                          src={profileImageUrl}
                          size="sm"
                          className="bg-gradient-to-br from-[#19b5af] to-[#14918c]"
                        >
                          {!profileImageUrl && <IconUser size={18} />}
                        </Avatar>
                        <div className="hidden md:block text-left">
                          <Text size="sm" fw={600} className="text-gray-900">
                            {displayUser?.name ||
                              displayUser?.profile?.user?.first_name ||
                              "Admin"}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {displayUser?.admin_type ||
                              displayUser?.profile?.role ||
                              "Administrator"}
                          </Text>
                        </div>
                        <IconChevronDown size={16} className="text-gray-600" />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item
                      leftSection={<IconUser size={16} />}
                      onClick={() => router.push("/profile")}
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Item leftSection={<IconSettings size={16} />}>
                      Settings
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<IconLogout size={16} />}
                      color="red"
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </div>
          </div>

          {/* Page Content */}
          <Box p="md">{children}</Box>
        </AppShell.Main>
      </AppShell>
    </AuthGuard>
  );
};

export default RootAdminLayout;
