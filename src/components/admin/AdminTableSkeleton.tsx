export default function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3 p-4 sm:p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
