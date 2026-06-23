import { NextResponse } from "next/server";
import { getSteadfastAccountInfo } from "@/lib/courier/adapters/steadfast";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { listCourierProviders } from "@/lib/couriers";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  const providers = await Promise.all(
    listCourierProviders().map(async (provider) => {
      if (provider.id !== "steadfast" || !provider.configured) {
        return provider;
      }

      const balanceInfo = await getSteadfastAccountInfo();

      return {
        ...provider,
        balance: balanceInfo.balance,
        balanceWarning: balanceInfo.warning,
      };
    })
  );

  return NextResponse.json({
    success: true,
    data: providers,
  });
}
