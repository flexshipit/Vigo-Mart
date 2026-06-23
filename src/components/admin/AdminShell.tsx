"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearAdminAuth,
  getAdminAuth,
  type AdminAuthData,
} from "@/lib/auth/adminAuth";
import { verifyAdminSession } from "@/lib/api/admin";
import { getAdminPageMeta } from "@/lib/admin/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState<AdminAuthData | null>(null);
  const [checking, setChecking] = useState(true);

  const pageMeta = getAdminPageMeta(pathname);

  useEffect(() => {
    async function checkAuth() {
      const stored = getAdminAuth();

      if (!stored?.token) {
        router.replace("/admin/login");
        return;
      }

      try {
        await verifyAdminSession();
        setAuth(stored);
      } catch {
        clearAdminAuth();
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    clearAdminAuth();
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4 rounded-md border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="text-center">
            <p className="text-sm font-medium text-slate-900">Loading admin panel</p>
            <p className="mt-1 text-xs text-slate-500">Verifying your session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!auth) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        username={auth.username}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader
          title={pageMeta.title}
          breadcrumb={pageMeta.breadcrumb}
          username={auth.username}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 px-3 py-5 sm:px-4 sm:py-6 lg:px-5">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
