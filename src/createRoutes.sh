#!/bin/bash

# Base directory for your Next.js app routing
BASE_DIR="./app"

# Create folders for all menu routes and sub-routes
mkdir -p $BASE_DIR
mkdir -p $BASE_DIR/appointments/schedule
mkdir -p $BASE_DIR/appointments/calendar
mkdir -p $BASE_DIR/appointments/reminders
mkdir -p $BASE_DIR/patients/list
mkdir -p $BASE_DIR/patients/records
mkdir -p $BASE_DIR/patients/treatment-plans
mkdir -p $BASE_DIR/staff/dentists
mkdir -p $BASE_DIR/staff/hygienists
mkdir -p $BASE_DIR/staff/assistants
mkdir -p $BASE_DIR/staff/receptionists
mkdir -p $BASE_DIR/services/treatments
mkdir -p $BASE_DIR/services/procedures
mkdir -p $BASE_DIR/services/specialties
mkdir -p $BASE_DIR/inventory/equipment
mkdir -p $BASE_DIR/inventory/supplies
mkdir -p $BASE_DIR/inventory/orders
mkdir -p $BASE_DIR/billing/invoices
mkdir -p $BASE_DIR/billing/payments
mkdir -p $BASE_DIR/billing/insurance-claims
mkdir -p $BASE_DIR/reports/financial
mkdir -p $BASE_DIR/reports/patient-stats
mkdir -p $BASE_DIR/reports/performance
mkdir -p $BASE_DIR/website/hero
mkdir -p $BASE_DIR/website/pages
mkdir -p $BASE_DIR/website/menu
mkdir -p $BASE_DIR/website/sections
mkdir -p $BASE_DIR/website/media
mkdir -p $BASE_DIR/website/seo
mkdir -p $BASE_DIR/communication
mkdir -p $BASE_DIR/social
mkdir -p $BASE_DIR/marketing
mkdir -p $BASE_DIR/settings/general
mkdir -p $BASE_DIR/settings/security
mkdir -p $BASE_DIR/settings/integrations
mkdir -p $BASE_DIR/compliance
mkdir -p $BASE_DIR/notifications

# Create page.tsx file in each subfolder
echo "export default function Page() { return <h1>Dashboard</h1>; }" > $BASE_DIR/page.tsx

# Appointments
echo "export default function Page() { return <h1>Schedule</h1>; }" > $BASE_DIR/appointments/schedule/page.tsx
echo "export default function Page() { return <h1>Calendar</h1>; }" > $BASE_DIR/appointments/calendar/page.tsx
echo "export default function Page() { return <h1>Reminders</h1>; }" > $BASE_DIR/appointments/reminders/page.tsx

# Patients
echo "export default function Page() { return <h1>Patient List</h1>; }" > $BASE_DIR/patients/list/page.tsx
echo "export default function Page() { return <h1>Patient Records</h1>; }" > $BASE_DIR/patients/records/page.tsx
echo "export default function Page() { return <h1>Treatment Plans</h1>; }" > $BASE_DIR/patients/treatment-plans/page.tsx

# Staff
echo "export default function Page() { return <h1>Dentists</h1>; }" > $BASE_DIR/staff/dentists/page.tsx
echo "export default function Page() { return <h1>Hygienists</h1>; }" > $BASE_DIR/staff/hygienists/page.tsx
echo "export default function Page() { return <h1>Assistants</h1>; }" > $BASE_DIR/staff/assistants/page.tsx
echo "export default function Page() { return <h1>Receptionists</h1>; }" > $BASE_DIR/staff/receptionists/page.tsx

# Services
echo "export default function Page() { return <h1>Treatments</h1>; }" > $BASE_DIR/services/treatments/page.tsx
echo "export default function Page() { return <h1>Procedures</h1>; }" > $BASE_DIR/services/procedures/page.tsx
echo "export default function Page() { return <h1>Specialties</h1>; }" > $BASE_DIR/services/specialties/page.tsx

# Inventory
echo "export default function Page() { return <h1>Equipment</h1>; }" > $BASE_DIR/inventory/equipment/page.tsx
echo "export default function Page() { return <h1>Supplies</h1>; }" > $BASE_DIR/inventory/supplies/page.tsx
echo "export default function Page() { return <h1>Orders</h1>; }" > $BASE_DIR/inventory/orders/page.tsx

# Billing
echo "export default function Page() { return <h1>Invoices</h1>; }" > $BASE_DIR/billing/invoices/page.tsx
echo "export default function Page() { return <h1>Payments</h1>; }" > $BASE_DIR/billing/payments/page.tsx
echo "export default function Page() { return <h1>Insurance Claims</h1>; }" > $BASE_DIR/billing/insurance-claims/page.tsx

# Reports
echo "export default function Page() { return <h1>Financial Reports</h1>; }" > $BASE_DIR/reports/financial/page.tsx
echo "export default function Page() { return <h1>Patient Statistics</h1>; }" > $BASE_DIR/reports/patient-stats/page.tsx
echo "export default function Page() { return <h1>Performance Metrics</h1>; }" > $BASE_DIR/reports/performance/page.tsx

# Website
echo "export default function Page() { return <h1>Hero</h1>; }" > $BASE_DIR/website/hero/page.tsx
echo "export default function Page() { return <h1>Pages</h1>; }" > $BASE_DIR/website/pages/page.tsx
echo "export default function Page() { return <h1>Menu</h1>; }" > $BASE_DIR/website/menu/page.tsx
echo "export default function Page() { return <h1>Sections</h1>; }" > $BASE_DIR/website/sections/page.tsx
echo "export default function Page() { return <h1>Media</h1>; }" > $BASE_DIR/website/media/page.tsx
echo "export default function Page() { return <h1>SEO</h1>; }" > $BASE_DIR/website/seo/page.tsx

# Miscellaneous
echo "export default function Page() { return <h1>Communication</h1>; }" > $BASE_DIR/communication/page.tsx
echo "export default function Page() { return <h1>Social Media</h1>; }" > $BASE_DIR/social/page.tsx
echo "export default function Page() { return <h1>Marketing</h1>; }" > $BASE_DIR/marketing/page.tsx
echo "export default function Page() { return <h1>Compliance</h1>; }" > $BASE_DIR/compliance/page.tsx
echo "export default function Page() { return <h1>Notifications</h1>; }" > $BASE_DIR/notifications/page.tsx

# Settings
echo "export default function Page() { return <h1>General Settings</h1>; }" > $BASE_DIR/settings/general/page.tsx
echo "export default function Page() { return <h1>Security Settings</h1>; }" > $BASE_DIR/settings/security/page.tsx
echo "export default function Page() { return <h1>Integrations</h1>; }" > $BASE_DIR/settings/integrations/page.tsx

