type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  action?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  subtitle,
  breadcrumb = "Admin",
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {breadcrumb}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
