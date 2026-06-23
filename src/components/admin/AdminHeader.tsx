"use client";

import { Bell, Menu, RefreshCw } from "lucide-react";
import AdminAvatar from "@/components/admin/AdminAvatar";

type AdminHeaderProps = {
  title: string;
  breadcrumb: string;
  username?: string;
  onMenuClick: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export default function AdminHeader({
  title,
  breadcrumb,
  username = "Admin",
  onMenuClick,
  onRefresh,
  isRefreshing,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500">
              Admin / <span className="font-medium text-slate-700">{breadcrumb}</span>
            </p>
            <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          )}

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
            <AdminAvatar name={username} />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900">{username}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
