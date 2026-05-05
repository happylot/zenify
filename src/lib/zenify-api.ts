import "server-only";

export class ZenifyApiError extends Error {
  statusCode: number;
  validationErrors?: Array<{ field: string; message: string }>;
  conflictField?: string;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      validationErrors?: Array<{ field: string; message: string }>;
      conflictField?: string;
    },
  ) {
    super(message);
    this.name = "ZenifyApiError";
    this.statusCode = statusCode;
    this.validationErrors = options?.validationErrors;
    this.conflictField = options?.conflictField;
  }
}

function getApiBaseUrl() {
  const base = process.env.ZENIFY_API_BASE_URL;
  if (!base) {
    throw new Error("Missing ZENIFY_API_BASE_URL. Configure backend URL before calling signup endpoints.");
  }
  return base.replace(/\/$/, "");
}

type EnvelopeSuccess = {
  error: false;
  status?: number;
  statusCode?: number;
  data?: unknown;
};

type EnvelopeError = {
  error: true;
  status?: number;
  statusCode?: number;
  message?: string;
  validationErrors?: Array<{ field: string; message: string }>;
  conflict_field?: string;
};

type Envelope = EnvelopeSuccess | EnvelopeError;

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
    throw new ZenifyApiError(`Invalid response from backend (HTTP ${response.status})`, response.status || 502);
  }

  if (json.error) {
    const statusCode = json.statusCode ?? json.status ?? response.status ?? 500;
    throw new ZenifyApiError(json.message ?? "Request failed", statusCode, {
      validationErrors: json.validationErrors,
      conflictField: json.conflict_field,
    });
  }

  return (json.data ?? null) as T;
}