export const WHATSAPP_NUMBER = '923082077721';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Generates a WhatsApp API link with encoded prefilled message text.
 * @param message The prefilled text message for WhatsApp
 */
export function getWhatsAppLink(message?: string): string {
  if (!message) {
    return WHATSAPP_BASE_URL;
  }
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
