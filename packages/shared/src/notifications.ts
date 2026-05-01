const WATI_API_ENDPOINT = process.env.WATI_API_ENDPOINT;
const WATI_BEARER_TOKEN = process.env.WATI_BEARER_TOKEN;

export const sendWhatsAppMessage = async (phone: string, templateName: string, parameters: any[]) => {
  if (!WATI_API_ENDPOINT || !WATI_BEARER_TOKEN) {
    console.warn("WhatsApp integration not configured. Skipping message.");
    return;
  }

  try {
    const response = await fetch(`${WATI_API_ENDPOINT}/api/v1/sendTemplateMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WATI_BEARER_TOKEN}`
      },
      body: JSON.stringify({
        whatsappNumber: phone.replace('+', ''),
        templateName,
        parameters
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to send WhatsApp message", error);
  }
};

// Templates for BAZAR
export const NOTIFICATION_TEMPLATES = {
  ORDER_PLACED: "bazar_order_placed_v1",
  SELLER_NEW_ORDER: "bazar_seller_new_order_v1",
  RUNNER_ASSIGNED: "bazar_runner_assigned_v1",
  DELIVERY_SUCCESS: "bazar_delivery_success_v1"
};
