const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function getPaypalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing PayPal credentials. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.",
    );
  }

  return { clientId, clientSecret };
}

export function getPaypalClientId() {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? process.env.PAYPAL_CLIENT_ID ?? null;
}

function getPaypalEnvironmentLabel() {
  return process.env.PAYPAL_ENVIRONMENT === "live" ? "live" : "sandbox";
}

type PaypalApiError = {
  error?: string;
  error_description?: string;
  message?: string;
  debug_id?: string;
};

async function readPaypalError(response: Response, fallback: string) {
  const debugId = response.headers.get("paypal-debug-id");
  const raw = await response.text();

  try {
    const json = JSON.parse(raw) as PaypalApiError;
    if (json.error === "invalid_client") {
      const environment = getPaypalEnvironmentLabel();
      return `PayPal credentials are invalid for ${environment}. Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET, and make sure both belong to the same ${environment} app.${debugId ? ` Debug ID: ${debugId}.` : ""}`;
    }

    const detail = json.error_description ?? json.message ?? json.error ?? raw;
    return `${fallback}: ${detail}${debugId ? ` (Debug ID: ${debugId})` : ""}`;
  } catch {
    return `${fallback}: ${raw}${debugId ? ` (Debug ID: ${debugId})` : ""}`;
  }
}

async function getPaypalAccessToken() {
  const { clientId, clientSecret } = getPaypalCredentials();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readPaypalError(response, "Failed to get PayPal access token"));
  }

  const json = (await response.json()) as { access_token: string };
  return json.access_token;
}

export async function createPaypalOrder({
  amount,
  currency = "USD",
  description,
}: {
  amount: string;
  currency?: string;
  description: string;
}) {
  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description,
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readPaypalError(response, "Failed to create PayPal order"));
  }

  return (await response.json()) as { id: string; status: string };
}

export async function capturePaypalOrder(orderId: string) {
  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readPaypalError(response, "Failed to capture PayPal order"));
  }

  return (await response.json()) as {
    id: string;
    status: string;
    payer?: { email_address?: string };
  };
}

export async function verifyPaypalWebhookSignature({
  authAlgo,
  certUrl,
  transmissionId,
  transmissionSig,
  transmissionTime,
  webhookEvent,
}: {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookEvent: unknown;
}) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    throw new Error("Missing PAYPAL_WEBHOOK_ID. Configure the PayPal webhook ID before enabling webhook processing.");
  }

  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readPaypalError(response, "Failed to verify PayPal webhook"));
  }

  const json = (await response.json()) as { verification_status?: string };
  return json.verification_status === "SUCCESS";
}
