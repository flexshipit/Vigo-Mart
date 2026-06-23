"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminOrder } from "@/lib/api/admin";
import {
  buildOrdersBarData,
  buildPackageChartData,
  buildRevenueChartData,
} from "@/lib/admin/chartData";

type DashboardChartsProps = {
  orders: AdminOrder[];
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value}
          {entry.name.toLowerCase().includes("revenue") ? "৳" : ""}
        </p>
      ))}
    </div>
  );
}

export default function DashboardCharts({ orders }: DashboardChartsProps) {
  const revenueData = buildRevenueChartData(orders);
  const packageData = buildPackageChartData(orders);
  const ordersBarData = buildOrdersBarData(orders);

  const hasData = orders.length > 0;

  if (!hasData) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue Overview" subtitle="Last 7 days performance">
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            No chart data yet
          </div>
        </ChartCard>
        <ChartCard title="Package Distribution" subtitle="Orders by package type">
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            No chart data yet
          </div>
        </ChartCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <ChartCard
          title="Revenue Overview"
          subtitle="Daily revenue trend for the last 7 days"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d7c66" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0d7c66" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}৳`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#0d7c66"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 5, fill: "#0d7c66", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Package Distribution"
        subtitle="Share of orders by package"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={packageData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={88}
                paddingAngle={3}
              >
                {packageData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} orders`, name]}
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="xl:col-span-3">
        <ChartCard
          title="Daily Orders"
          subtitle="Number of confirmed orders per day"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersBarData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value} orders`, "Orders"]}
                  contentStyle={{
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
