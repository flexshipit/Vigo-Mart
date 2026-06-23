"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createOrder,
  fetchOrderSummary,
  sendOrderSms,
} from "@/lib/api/orders";
import type { CreateOrderPayload } from "@/types/order";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (orderId: string) => [...orderKeys.all, orderId] as const,
};

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
  });
}

export function useOrderSummary(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => fetchOrderSummary(orderId),
    retry: 1,
  });
}

export function useSendOrderSms() {
  return useMutation({
    mutationFn: (orderId: string) => sendOrderSms(orderId),
  });
}
