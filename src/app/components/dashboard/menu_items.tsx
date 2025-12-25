import {
  IconAd,
  IconAlertTriangle,
  IconBellRinging,
  IconBrandFacebook,
  IconBuildingHospital,
  IconCalendar,
  IconChartBar,
  IconComponents,
  IconDashboard,
  IconMail,
  IconMoneybag,
  IconReportMedical,
  IconSettings,
  IconStethoscope,
  IconUsers,
} from "@tabler/icons-react";

// Enhanced Menu Items with Categories
const menuItems = [
  // Main
  { icon: IconDashboard, label: "Dashboard", link: "/", category: "Main" },
  { icon: IconBellRinging, label: "Notifications", link: "/notifications", category: "Main" },

  // Clinical Operations
  {
    icon: IconCalendar,
    label: "Appointments",
    link: "/appointments",
    category: "Clinical",
  },
  {
    icon: IconUsers,
    label: "Patients",
    category: "Clinical",
    subItems: [
      { label: "Patient List", link: "/patients/list" },
      { label: "Patient Records", link: "/patients/records" },
      { label: "Treatment Plans", link: "/patients/treatment-plans" },
    ],
  },
  {
    icon: IconStethoscope,
    label: "Staff",
    category: "Clinical",
    subItems: [
      { label: "Dentists", link: "/staff/dentists" },
      { label: "Hygienists", link: "/staff/hygienists" },
      { label: "Assistants", link: "/staff/assistants" },
      { label: "Receptionists", link: "/staff/receptionists" },
    ],
  },
  {
    icon: IconReportMedical,
    label: "Services",
    category: "Clinical",
    subItems: [
      { label: "Treatments", link: "/services/treatments" },
      { label: "Procedures", link: "/services/procedures" },
      { label: "Specialties", link: "/services/specialties" },
    ],
  },

  // Business Management
  {
    icon: IconBuildingHospital,
    label: "Inventory",
    category: "Business",
    subItems: [
      { label: "Equipment", link: "/inventory/equipment" },
      { label: "Supplies", link: "/inventory/supplies" },
      { label: "Orders", link: "/inventory/orders" },
    ],
  },
  {
    icon: IconMoneybag,
    label: "Billing",
    category: "Business",
    subItems: [
      { label: "Invoices", link: "/billing/invoices" },
      { label: "Payments", link: "/billing/payments" },
      { label: "Insurance Claims", link: "/billing/insurance-claims" },
    ],
  },
  {
    icon: IconChartBar,
    label: "Reports",
    category: "Business",
    subItems: [
      { label: "Financial Reports", link: "/reports/financial" },
      { label: "Patient Statistics", link: "/reports/patient-stats" },
      { label: "Performance Metrics", link: "/reports/performance" },
    ],
  },

  // Digital Presence
  {
    icon: IconComponents,
    label: "Website",
    category: "Digital",
    subItems: [
      { label: "Hero", link: "/website/hero" },
      { label: "Pages", link: "/website/pages" },
      { label: "Menu", link: "/website/menu" },
      { label: "Sections", link: "/website/sections" },
      { label: "Media", link: "/website/media" },
      { label: "SEO", link: "/website/seo" },
    ],
  },
  { icon: IconMail, label: "Communication", link: "/communication", category: "Digital" },
  { icon: IconBrandFacebook, label: "Social Media", link: "/social", category: "Digital" },
  { icon: IconAd, label: "Marketing", link: "/marketing", category: "Digital" },

  // System
  {
    icon: IconSettings,
    label: "Settings",
    category: "System",
    subItems: [
      { label: "General", link: "/settings/general" },
      { label: "Security", link: "/settings/security" },
      { label: "Integrations", link: "/settings/integrations" },
    ],
  },
  { icon: IconAlertTriangle, label: "Compliance", link: "/compliance", category: "System" },
];

export default menuItems;
