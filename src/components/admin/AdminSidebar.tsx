"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, X } from "lucide-react";
import { SITE } from "@/lib/site";
import AdminAvatar from "@/components/admin/AdminAvatar";
import ShopMark from "@/components/ui/ShopMark";
import { ADMIN_NAV } from "@/lib/admin/navigation";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  username?: string;
};

export default function AdminSidebar({
  open,
  onClose,
  onLogout,
  username = "Admin",
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] shrink-0 flex-col overflow-y-auto bg-slate-950 text-slate-300 transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <ShopMark size={40} className="h-10 w-10" />
            <div>
              <p className="text-sm font-bold text-white">{SITE.name}</p>
              <p className="text-xs text-secondary">Admin Console</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
          <nav className="mt-3 space-y-1">
            {ADMIN_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-start gap-3 rounded-md px-3 py-3 transition-all ${
                    active
                      ? "bg-primary/15 text-white ring-1 ring-primary/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      active
                        ? "bg-primary text-white"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    {item.description && (
                      <span className="mt-0.5 block text-xs text-slate-500 group-hover:text-slate-400">
                        {item.description}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View Website
          </a>

          <div className="rounded-md bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <AdminAvatar name={username} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{username}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
