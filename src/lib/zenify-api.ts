import "server-only";

export type ApiFieldError = { field: string; message: string };

export class ZenifyApiError extends Error {
  statusCode: number;
  errors?: ApiFieldError[];
  conflictField?: string;
  idempotent?: boolean;
  paypalStatus?: string;
  currentTier?: string;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      errors?: ApiFieldError[];
      conflictField?: string;
      idempotent?: boolean;
      paypalStatus?: string;
      currentTier?: string;
    },
  ) {
    super(message);
    this.name = "ZenifyApiError";
    this.statusCode = statusCode;
    this.errors = options?.errors;
    this.conflictField = options?.conflictField;
    this.idempotent = options?.idempotent;
    this.paypalStatus = options?.paypalStatus;
    this.currentTier = options?.currentTier;
  }
}

function getApiBaseUrl() {
  const base = process.env.ZENIFY_API_BASE_URL;
  if (!base) {
    throw new Error("Missing ZENIFY_API_BASE_URL. Configure backend URL before calling signup endpoints.");
  }
  return base.replace(/\/$/, "");
}

type EnvelopeBase = {
  statusCode?: number;
  status?: number;
  success?: boolean;
  error?: boolean;
  message?: string;
};

type EnvelopeSuccess = EnvelopeBase & {
  success?: true;
  error?: false;
  data?: unknown;
};

type EnvelopeError = EnvelopeBase & {
  success?: false;
  error?: true;
  errors?: ApiFieldError[];
  validationErrors?: ApiFieldError[];
  conflict_field?: string;
  conflictField?: string;
  idempotent?: boolean;
  paypalStatus?: string;
  current_tier?: string;
  currentTier?: string;
};

type Envelope = EnvelopeSuccess | EnvelopeError;

function isErrorEnvelope(env: Envelope): env is EnvelopeError {
  if (typeof env.success === "boolean") return env.success === false;
  if (typeof env.error === "boolean") return env.error === true;
  return false;
}

export async function callZenifyApi<T = unknown>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<T> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let json: Envelope;
  try {
    json = (await response.json()) as Envelope;
  } catch {
    throw new ZenifyApiError(
      `Invalid response from backend (HTTP ${response.status})`,
      response.status || 502,
    );
  }

  if (isErrorEnvelope(json)) {
    const statusCode = json.statusCode ?? json.status ?? response.status ?? 500;
    throw new ZenifyApiError(json.message ?? "Request failed", statusCode, {
      errors: json.errors ?? json.validationErrors,
      conflictField: json.conflictField ?? json.conflict_field,
      idempotent: json.idempotent,
      paypalStatus: json.paypalStatus,
      currentTier: json.currentTier ?? json.current_tier,
    });
  }

  return ((json as EnvelopeSuccess).data ?? null) as T;
}
