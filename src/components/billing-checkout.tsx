"use client";

import { useMemo, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { activateSignup, startCheckout } from "../../app/billing/actions";

type SuccessState = {
  email: string;
  message: string;
  loginUrl?: string;
  emailSent: boolean;
};

export function BillingCheckout() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [isPending, setIsPending] = useState(false);

  const options = useMemo<ReactPayPalScriptOptions | null>(() => {
    if (!clientId) return null;
    return {
      clientId,
      currency: "USD",
      intent: "capture",
      components: "buttons",
      locale: "en_US",
    };
  }, [clientId]);

  if (!clientId || !options) {
    return (
      <div className="paypal-placeholder">
        <strong>PayPal is not configured yet.</strong>
        <p>Set `NEXT_PUBLIC_PAYPAL_CLIENT_ID` before enabling checkout.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="paypal-success-panel">
        <strong>Workspace created successfully!</strong>
        <p>{success.message}</p>
        <p>
          We&apos;ve sent an email to <code>{success.email}</code>. Please check your inbox (including Spam) for login
          details.
        </p>
        {!success.emailSent ? (
          <p className="paypal-error">
            Email delivery failed. The Zenify team will contact you within 24 hours with your credentials.
          </p>
        ) : null}
        {success.loginUrl ? (
          <a className="button" href={success.loginUrl} target="_blank" rel="noreferrer">
            Go to login
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="paypal-box">
      <PayPalScriptProvider options={options}>
        <PayPalButtons
          disabled={isPending}
          style={{ layout: "vertical", shape: "pill", label: "pay", height: 42 }}
          createOrder={async () => {
            setError(null);
            setIsPending(true);
            try {
              const result = await startCheckout();
              if (!result.ok) {
                setError(result.message);
                throw new Error(result.message);
              }
              return result.paypalOrderId;
            } finally {
              setIsPending(false);
            }
          }}
          onApprove={async (data) => {
            setError(null);
            setIsPending(true);
            try {
              const result = await activateSignup(data.orderID);
              if (!result.ok) {
                setError(result.message);
                return;
              }
              setSuccess({
                email: result.email,
                message: result.message,
                loginUrl: result.loginUrl,
                emailSent: result.emailSent,
              });
            } finally {
              setIsPending(false);
            }
          }}
          onCancel={() => {
            setError("Payment cancelled. You can try again any time.");
          }}
          onError={(err) => {
            setError(err instanceof Error ? err.message : "Unknown PayPal error.");
          }}
        />
      </PayPalScriptProvider>
      {error ? <p className="paypal-error">{error}</p> : null}
    </div>
  );
}