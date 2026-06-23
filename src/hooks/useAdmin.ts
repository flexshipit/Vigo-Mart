"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminCouriers,
  fetchAdminOrders,
  fetchCourierHistory,
  sendOrderToCourier,
  trackCourierOrder,
  updateAdminOrder,
  type AdminOrdersParams,
} from "@/lib/api/admin";
import { normalizePhone } from "@/lib/phone";

export const adminKeys = {
  all: ["admin"] as const,
  orders: (params?: AdminOrdersParams) =>
    [...adminKeys.all, "orders", params ?? {}] as const,
  couriers: () => [...adminKeys.all, "couriers"] as const,
  courierHistory: (phone: string) =>
    [...adminKeys.all, "courier-history", phone] as const,
};

export function useAdminOrders(params: AdminOrdersParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: adminKeys.orders(queryParams),
    queryFn: () => fetchAdminOrders(queryParams),
    enabled,
    staleTime: 30_000,
  });
}

export function useAdminCouriers() {
  return useQuery({
    queryKey: adminKeys.couriers(),
    queryFn: fetchAdminCouriers,
    staleTime: 60_000,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: Parameters<typeof updateAdminOrder>[1];
    }) => updateAdminOrder(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "orders"] });
      queryClient.invalidateQueries({
        queryKey: [...adminKeys.all, "courier-history"],
      });
    },
  });
}

export function useSendOrderToCourier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => sendOrderToCourier(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "orders"] });
      queryClient.invalidateQueries({
        queryKey: [...adminKeys.all, "courier-history"],
      });
    },
  });
}

export function useTrackCourierOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => trackCourierOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "orders"] });
      queryClient.invalidateQueries({
        queryKey: [...adminKeys.all, "courier-history"],
      });
    },
  });
}

export function useCourierHistory(phone: string) {
  const normalized = normalizePhone(phone);

  return useQuery({
    queryKey: adminKeys.courierHistory(normalized ?? phone),
    queryFn: () => fetchCourierHistory(normalized!),
    enabled: Boolean(normalized),
    staleTime: 30_000,
  });
}
