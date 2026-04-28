"use client";

import { useMemo, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

type PaypalCheckoutProps = {
  amount: string;
  currency?: string;
  description: string;
};

export function PaypalCheckout({
  amount,
  currency = "USD",
  description,
}: PaypalCheckoutProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const options = useMemo<ReactPayPalScriptOptions | null>(() => {
    if (!clientId) return null;

    return {
      clientId,
      currency,
      intent: "capture",
      components: "buttons",
    };
  }, [clientId, currency]);

  if (!clientId || !options) {
    return (
      <div className="paypal-placeholder">
        <strong>PayPal is not configured yet.</strong>
        <p>Set `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_ID`, and `PAYPAL_CLIENT_SECRET` to enable checkout.</p>
      </div>
    );
  }

  return (
    <div className="paypal-box">
      <PayPalScriptProvider options={options}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "pill", label: "pay" }}
          createOrder={async () => {
            setError(null);
            setMessage(null);

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount, currency, description }),
            });

            const json = (await response.json()) as { id?: string; error?: string };
            if (!response.ok || !json.id) {
              throw new Error(json.error ?? "Unable to create PayPal order.");
            }

            return json.id;
          }}
          onApprove={async (data) => {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });

            const json = (await response.json()) as {
              status?: string;
              error?: string;
              payer?: { email_address?: string };
            };

            if (!response.ok) {
              setError(json.error ?? "Unable to capture PayPal payment.");
              return;
            }

            setMessage(
              `Payment captured${json.payer?.email_address ? ` for ${json.payer.email_address}` : ""}.`,
            );
          }}
          onError={(err) => {
            const messageText = err instanceof Error ? err.message : "Unexpected PayPal error.";
            setError(messageText);
          }}
        />
      </PayPalScriptProvider>
      {message ? <p className="paypal-success">{message}</p> : null}
      {error ? <p className="paypal-error">{error}</p> : null}
    </div>
  );
}
