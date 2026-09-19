export const WHATSAPP_NUMBER_DISPLAY = "01626-002281";
export const WHATSAPP_NUMBER_E164 = "8801626002281";

import { PRODUCT_NAME, PRODUCT_NAME_BN } from "@/lib/products";

const DEFAULT_WHATSAPP_MESSAGE =
  `হ্যালো, আমি ${PRODUCT_NAME} (${PRODUCT_NAME_BN}) থেকে অর্ডার করতে চাই।`;

export function getWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(message)}`;
}
