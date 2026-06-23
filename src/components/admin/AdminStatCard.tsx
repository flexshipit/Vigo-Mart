import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  title: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "emerald" | "blue" | "violet";
};

const accents = {
  primary: {
    icon: "bg-primary/10 text-primary",
    ring: "ring-primary/10",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600",
    ring: "ring-emerald-500/10",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600",
    ring: "ring-blue-500/10",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600",
    ring: "ring-violet-500/10",
  },
};

export default function AdminStatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent = "primary",
}: AdminStatCardProps) {
  const styles = accents[accent];

  return (
    <div
      className={`rounded-md border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ${styles.ring}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p
            lang="en"
            className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {value}
          </p>
          {hint && (
            <p className="mt-2 text-xs text-slate-400">{hint}</p>
          )}
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
