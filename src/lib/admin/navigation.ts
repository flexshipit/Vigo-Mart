import {
  LayoutDashboard,
  Package,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: Package,
    description: "Manage all orders",
  },
  {
    label: "Customer Check",
    href: "/admin/courier-check",
    icon: ShieldAlert,
    description: "BD Courier risk & history",
  },
];

export function getAdminPageMeta(pathname: string) {
  if (pathname.startsWith("/admin/courier-check")) {
    return {
      title: "Customer Check",
      subtitle:
        "Look up courier delivery history and AI risk analysis by phone number",
      breadcrumb: "Customer Check",
    };
  }

  if (pathname.startsWith("/admin/orders")) {
    return {
      title: "Orders",
      subtitle: "Update status, send to courier API and track shipments",
      breadcrumb: "Orders",
    };
  }

  return {
    title: "Dashboard",
    subtitle: "Welcome back — here's what's happening with your store today",
    breadcrumb: "Dashboard",
  };
}
