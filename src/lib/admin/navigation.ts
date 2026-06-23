import {
  LayoutDashboard,
  Package,
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
];

export function getAdminPageMeta(pathname: string) {
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
