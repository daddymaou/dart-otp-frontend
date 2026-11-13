export type ApiErrorCode =
  | 'invalid_request'
  | 'invalid_phone'
  | 'unauthorized'
  | 'account_suspended'
  | 'not_found'
  | 'conflict'
  | 'cooldown_active'
  | 'rate_limited'
  | 'quota_exceeded'
  | 'telegram_blocked'
  | 'delivery_failed'
  | 'internal';

type ErrorPayload = {
  error?: {
    code?: ApiErrorCode;
    message?: string;
    retry_after?: number;
  };
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly retryAfter?: number;

  constructor(
    message: string,
    code: ApiErrorCode,
    status: number,
    retryAfter?: number,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export type Tenant = {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  status?: 'active' | 'suspended';
};

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  is_test: boolean;
  last_used_at?: string | null;
  revoked_at?: string | null;
  revoked?: boolean;
};

export type CreatedApiKey = ApiKey & { key: string };

export type OtpTemplate = {
  id: string;
  name: string;
  body: string;
  is_default: boolean;
};

export type OtpLog = {
  id: string;
  phone: string;
  status: 'sent' | 'verified' | 'failed' | 'expired' | 'pending_link';
  delivery_status?: string;
  attempts?: number;
  is_test: boolean;
  created_at: string;
  expires_at: string;
  verified_at?: string | null;
};

export type DashboardStats = {
  sent: number;
  verified: number;
  failed: number;
  today: number;
  success_rate: number;
  daily: Array<{ date: string; sent: number; verified: number }>;
};

export type Webhook = {
  id: string;
  url: string;
  events: string[];
  active?: boolean;
};

export type PendingLinkResult = {
  otp_id: string;
  status: 'pending_link';
  deep_link: string;
  link_expires_at: string;
};

export type SendOtpResult =
  | { otp_id: string; status: 'sent'; expires_at: string }
  | PendingLinkResult;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`/api${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  let payload: unknown;
  try {
    const text = await response.text();
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    if (!response.ok) {
      throw new ApiError('The service could not complete that request.', 'internal', response.status);
    }
    throw new ApiError('The service returned an unreadable response.', 'internal', response.status);
  }

  if (!response.ok) {
    const error = (payload as ErrorPayload)?.error;
    const code = error?.code ?? 'internal';
    if (code === 'unauthorized' && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('dartotp:unauthorized'));
    }
    throw new ApiError(
      error?.message ?? 'The service could not complete that request.',
      code,
      response.status,
      error?.retry_after,
    );
  }

  return payload as T;
}

const json = (body: unknown): Pick<RequestInit, 'body' | 'method'> => ({
  method: 'POST',
  body: JSON.stringify(body),
});

export const api = {
  health: () => request<{ status: string }>('/health'),
  signup: (input: { name: string; email: string; password: string }) =>
    request<Tenant>('/v1/auth/signup', json(input)),
  login: (input: { email: string; password: string }) =>
    request<Tenant>('/v1/auth/login', json(input)),
  logout: () => request<void>('/v1/auth/logout', json({})),
  me: () => request<Tenant>('/v1/auth/me'),
  deleteAccount: (password: string) =>
    request<void>('/v1/auth/me', { method: 'DELETE', body: JSON.stringify({ password }) }),
  keys: () => request<{ api_keys: ApiKey[] }>('/v1/api-keys'),
  createKey: (input: { name: string; is_test: boolean }) =>
    request<CreatedApiKey>('/v1/api-keys', json(input)),
  revokeKey: (id: string) =>
    request<void>(`/v1/api-keys/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  templates: () => request<{ templates: OtpTemplate[] }>('/v1/templates'),
  createTemplate: (input: { name: string; body: string; is_default?: boolean }) =>
    request<OtpTemplate>('/v1/templates', json(input)),
  updateTemplate: (id: string, input: { name: string; body: string; is_default?: boolean }) =>
    request<OtpTemplate>(`/v1/templates/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  deleteTemplate: (id: string) =>
    request<void>(`/v1/templates/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  sendTemplateTest: (id: string, phone: string) =>
    request<{ ok: true } | PendingLinkResult>(`/v1/templates/${encodeURIComponent(id)}/test`, json({ phone })),
  logs: (params: { page?: number; page_size?: number; status?: string; phone?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.set(key, String(value));
    });
    return request<{ logs: OtpLog[]; total: number; page: number; page_size: number }>(
      `/v1/logs${query.size ? `?${query}` : ''}`,
    );
  },
  stats: () => request<DashboardStats>('/v1/stats'),
  webhooks: () => request<{ webhooks: Webhook[] }>('/v1/webhooks'),
  createWebhook: (input: { url: string; events: string[] }) =>
    request<Webhook & { secret: string }>('/v1/webhooks', json(input)),
  updateWebhook: (id: string, input: { url: string; events: string[]; active: boolean }) =>
    request<{ ok: true }>(`/v1/webhooks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  deleteWebhook: (id: string) =>
    request<void>(`/v1/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  webhookDeliveries: (id: string) =>
    request<{ deliveries: Array<{ id: string; event: string; status: string; attempts: number; created_at: string }> }>(
      `/v1/webhooks/${encodeURIComponent(id)}/deliveries`,
    ),
};

export function friendlyError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  switch (error.code) {
    case 'rate_limited':
      return 'That was a lot of requests. Give it a moment and try again.';
    case 'conflict':
      return 'An account with those details already exists.';
    case 'cooldown_active':
      return `Please wait ${error.retryAfter ?? 60} seconds before trying again.`;
    case 'quota_exceeded':
      return 'This account has reached its monthly send limit.';
    case 'telegram_blocked':
      return 'This user has blocked the Dart-OTP Telegram bot.';
    case 'invalid_phone':
      return 'Enter a phone number in international format, including + and the country code.';
    case 'account_suspended':
      return 'This account is currently suspended. Contact support for help.';
    case 'unauthorized':
      return 'Your session has expired. Please log in again.';
    case 'internal':
      return 'The service is having trouble. Please try again shortly.';
    default:
      return error.message;
  }
}
