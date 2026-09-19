export type BdCourierRiskVerdict = {
  level: string;
  label: string;
  action: string;
  color: string;
  reasons: string[];
};

export type BdCourierStats = {
  name?: string;
  logo?: string;
  total_parcel: number;
  success_parcel: number;
  cancelled_parcel: number;
  success_ratio: number;
};

export type BdCourierReport = {
  id: number | string;
  name?: string;
  details?: string;
  created_at?: string;
  courierLogo?: string;
  courierName?: string;
};

export type BdCourierCheckResult = {
  status: "success" | "error";
  phone: string;
  success_ratio: number;
  risk_level: string;
  risk_verdict: BdCourierRiskVerdict | null;
  summary: BdCourierStats | null;
  couriers: Array<BdCourierStats & { key: string }>;
  reports: BdCourierReport[];
  message?: string;
};

export type BdCourierPlan = {
  id: number | string;
  name: string;
  price: number | string;
  features?: string[];
};
