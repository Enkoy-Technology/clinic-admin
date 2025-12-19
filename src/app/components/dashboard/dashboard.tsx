import { Box, Group, rem, Text } from "@mantine/core";
import { IconDashboard, IconPhoto, IconStethoscope } from "@tabler/icons-react";

export const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { icon: IconDashboard, label: "Total Users", value: "3" },
        { icon: IconPhoto, label: "Total Photos", value: "9" },
        { icon: IconStethoscope, label: "Appointments", value: "15" },
      ].map((stat, index) => (
        <Box key={index} className="bg-white p-4 rounded-lg shadow-md">
          <Group>
            <Box className="bg-primary-100 p-3 rounded-full">
              <stat.icon
                size={rem(24)}
                stroke={1.5}
                className="text-primary-600"
              />
            </Box>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {stat.label}
              </Text>
              <Text fw={700} size="xl" className="text-secondary-800">
                {stat.value}
              </Text>
            </div>
          </Group>
        </Box>
      ))}
    </div>
  );
};








