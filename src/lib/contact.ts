export const WHATSAPP_NUMBER_DISPLAY = "01778-016039";
export const WHATSAPP_NUMBER_E164 = "8801778016039";

const DEFAULT_WHATSAPP_MESSAGE =
  "হ্যালো, আমি VigoMax সম্পর্কে জানতে চাই। (ডাবল অর্ডার / প্রশ্ন)";

export function getWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(message)}`;
}
