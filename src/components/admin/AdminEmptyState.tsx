import { PackageOpen } from "lucide-react";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
};

export default function AdminEmptyState({
  title,
  description = "No data available yet.",
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <PackageOpen className="h-7 w-7 text-slate-400" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}
