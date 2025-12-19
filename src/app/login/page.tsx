"use client";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconLock, IconMail, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../shared/api/authApi";
import { selectIsAuthenticated, setCredentials } from "../../shared/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading }] = useLoginMutation();
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+$/.test(value)) return "Invalid email";
        return null;
      },
      password: (value) => (!value ? "Password is required" : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const result = await login(values).unwrap();

      dispatch(
        setCredentials({
          accessToken: result.token,
          refreshToken: result.refresh,
        })
      );

      notifications.show({
        title: "Welcome back! 👋",
        message: "Login successful",
        color: "teal",
        icon: <IconSparkles size={18} />,
      });

      router.push("/");
    } catch (err: any) {
      const errorMessage =
        err?.data?.detail ||
        err?.data?.message ||
        "Invalid credentials. Please try again.";

      notifications.show({
        title: "Login Failed",
        message: errorMessage,
        color: "red",
      });
    }
  };

  // Quick fill demo credentials
  const fillDemoCredentials = () => {
    form.setValues({
      email: "admin@gmail.com",
      password: "admin@561!",
    });
  };

  return (
    <Box className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#19b5af] via-[#16a8a3] to-[#14918c] relative overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center space-y-8">
            <Image
              src="/logo1.png"
              alt="Dr. Hilina Specialty Dental Clinic"
              width={280}
              height={100}
              className="object-contain mx-auto drop-shadow-2xl"
              priority
            />

            <div className="space-y-4">
              <Title order={1} className="text-5xl font-bold text-white drop-shadow-lg">
                Welcome Back
              </Title>
              <Text size="xl" className="text-white/90 leading-relaxed">
                Access your admin dashboard to manage appointments, patients, and clinic operations.
              </Text>
            </div>

            {/* Decorative element */}
            <div className="pt-8 flex items-center justify-center gap-3">
              <div className="h-1 w-12 bg-white/40 rounded-full"></div>
              <div className="h-1 w-12 bg-white/60 rounded-full"></div>
              <div className="h-1 w-12 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo1.png"
              alt="Dr. Hilina Specialty Dental Clinic"
              width={200}
              height={70}
              className="object-contain"
              priority
            />
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Title order={2} className="text-gray-900">
                Sign In
              </Title>
              <Text size="sm" c="dimmed">
                Enter your credentials to continue
              </Text>
            </div>

            {/* Demo Hint */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <IconSparkles size={20} className="text-[#19b5af] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Text size="xs" fw={600} className="text-gray-900 mb-1">
                    Quick Demo Access
                  </Text>
                  <Text size="xs" c="dimmed" className="mb-2">
                    Click below to auto-fill credentials
                  </Text>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-xs font-medium text-[#19b5af] hover:text-[#14918c] transition-colors"
                  >
                    Fill Demo Credentials →
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
              <TextInput
                label="Email Address"
                placeholder="your.email@example.com"
                leftSection={<IconMail size={18} stroke={1.5} />}
                size="md"
                {...form.getInputProps("email")}
                disabled={isLoading}
                classNames={{
                  input: "border-gray-300 focus:border-[#19b5af]",
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                leftSection={<IconLock size={18} stroke={1.5} />}
                size="md"
                {...form.getInputProps("password")}
                disabled={isLoading}
                classNames={{
                  input: "border-gray-300 focus:border-[#19b5af]",
                }}
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  size="sm"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.currentTarget.checked)}
                  classNames={{
                    input: "border-gray-300",
                  }}
                />
                <Text
                  size="sm"
                  className="text-[#19b5af] hover:text-[#14918c] cursor-pointer transition-colors"
                >
                  Forgot password?
                </Text>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isLoading}
                rightSection={!isLoading && <IconArrowRight size={18} />}
                className="bg-gradient-to-r from-[#19b5af] to-[#16a8a3] hover:from-[#14918c] hover:to-[#128882] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                styles={{
                  root: {
                    height: "48px",
                  },
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Divider label="Need Help?" labelPosition="center" />

            {/* Footer Links */}
            <div className="text-center space-y-2">
              <Text size="sm" c="dimmed">
                Having trouble signing in?{" "}
                <span className="text-[#19b5af] hover:text-[#14918c] cursor-pointer font-medium">
                  Contact Support
                </span>
              </Text>
            </div>
          </div>

          {/* Copyright */}
          <Text size="xs" c="dimmed" className="text-center mt-8">
            © 2024 Dr. Hilina Specialty Dental Clinic. All rights reserved.
          </Text>
        </div>
      </div>
    </Box>
  );
}

