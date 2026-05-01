const GUPSHUP_API_URL = "https://api.gupshup.io/wa/api/v1/msg";

export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
) {
  const apiKey = process.env.GUPSHUP_API_KEY;
  const sourceNumber = process.env.GUPSHUP_SOURCE_NUMBER;

  if (!apiKey || !sourceNumber) {
    console.warn("Gupshup API key or source number not configured");
    return { success: false, error: "Missing config" };
  }

  // Format phone number to E.164 if not already (assuming India for TENI)
  let to = phoneNumber.replace(/\D/g, "");
  if (to.length === 10) {
    to = "91" + to;
  }

  try {
    const params = new URLSearchParams();
    params.append('channel', 'whatsapp');
    params.append('source', sourceNumber);
    params.append('destination', to);
    params.append('message', JSON.stringify({
      type: "text",
      text: message
    }));
    params.append('src.name', 'TENI');

    const response = await fetch(GUPSHUP_API_URL, {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        apikey: apiKey,
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gupshup Error:", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("WhatsApp Send Error:", error);
    return { success: false, error };
  }
}

export async function sendWhatsAppTemplate(
  phoneNumber: string,
  templateId: string,
  templateParams: string[]
) {
  const apiKey = process.env.GUPSHUP_API_KEY;
  const sourceNumber = process.env.GUPSHUP_SOURCE_NUMBER;

  if (!apiKey || !sourceNumber) {
    console.warn("Gupshup API key or source number not configured");
    return { success: false, error: "Missing config" };
  }

  let to = phoneNumber.replace(/\D/g, "");
  if (to.length === 10) {
    to = "91" + to;
  }

  try {
    const params = new URLSearchParams();
    params.append('channel', 'whatsapp');
    params.append('source', sourceNumber);
    params.append('destination', to);
    params.append('template', JSON.stringify({
      id: templateId,
      params: templateParams
    }));
    params.append('src.name', 'TENI');

    const response = await fetch(GUPSHUP_API_URL, {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        apikey: apiKey,
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gupshup Error:", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("WhatsApp Template Error:", error);
    return { success: false, error };
  }
}
