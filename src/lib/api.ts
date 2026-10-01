// Cliente HTTP para la API de RemodelaUSA (mismo origen: /api)

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  project_type: string;
  start_date?: string;
  message?: string;
  state?: string;
  city?: string;
  lang: string;
  source?: string;
}

export interface ContractorPayload {
  name: string;
  company?: string;
  trade: string;
  state?: string;
  city?: string;
  phone?: string;
  email: string;
  license?: string;
  years?: number;
  description?: string;
  services?: string[];
  website?: string;
  password?: string;
}

export interface PublicContractor {
  id: number;
  name: string;
  company: string;
  trade: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  license: string;
  years: number;
  description: string;
  services: string[];
  website: string;
  logo: string;
  photos: string[];
  rating: number;
  jobs_done: number;
  verified: number;
  created_at: string;
}

export interface MyRequest {
  id: number;
  name: string;
  project_type: string;
  state: string;
  city: string;
  status: string;
  created_at: string;
  contractors: {
    id: number; name: string; company: string; trade: string;
    phone: string; email: string; rating: number; verified: number;
    logo: string; jobs_done: number; assigned_at: string;
  }[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // OJO al orden: las opciones van primero y los headers DESPUÉS, fusionados.
  // Si se hace al revés, cualquier petición con headers propios (p. ej.
  // x-contractor-token del portal) pisa el Content-Type y el servidor no
  // parsea el cuerpo → la subida de fotos y el guardado de perfil fallaban
  // con "image data required" aunque el navegador enviara todo bien.
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json()).error ?? '';
    } catch {
      /* ignore */
    }
    throw new Error(detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  submitLead: (payload: LeadPayload) =>
    request<{ ok: boolean; id: number; matched: number }>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  registerContractor: (payload: ContractorPayload) =>
    request<{ ok: boolean; id: number; access_token: string; session_token?: string }>('/api/contractors', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitLeadAuthed: (payload: LeadPayload, sessionToken: string) =>
    request<{ ok: boolean; id: number; matched: number }>('/api/leads', {
      method: 'POST',
      headers: { 'x-homeowner-token': sessionToken },
      body: JSON.stringify(payload),
    }),

  track: (type: string, payload: Record<string, unknown> = {}) => {
    // Sin await: el seguimiento no debe bloquear la interfaz
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    }).catch(() => {});
  },
};

// ==================== Autenticación (dueños y contratistas) ===============
export interface AuthUser {
  id: number;
  type: 'homeowner' | 'contractor';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  verified?: number;
  status?: string;
  access_token?: string;
}

const SESSION_KEY = 'remodelausa-session';

export function getSession(): { token: string; user: AuthUser } | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { token: string; user: AuthUser }) : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUser): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem('remodelausa-contractor-token'); // legado
}

function sessionRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const tk = token ?? getSession()?.token ?? '';
  return request<T>(path, {
    ...options,
    headers: { 'x-session-token': tk, ...(options.headers ?? {}) },
  });
}

export const authApi = {
  registerHomeowner: (body: { name: string; email: string; phone?: string; password: string }) =>
    request<{ ok: boolean; token: string; user: AuthUser }>('/api/auth/register-homeowner', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (type: 'homeowner' | 'contractor', email: string, password: string) =>
    request<{ ok: boolean; token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ type, email, password }),
    }),
  logout: () => sessionRequest<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  me: () => sessionRequest<{ user: AuthUser }>('/api/auth/me'),
  homeownerLeads: () =>
    sessionRequest<MyRequest[]>('/api/homeowner/leads'),
  updateHomeowner: (body: { name?: string; phone?: string }) =>
    sessionRequest<AuthUser>('/api/homeowner/me', { method: 'PATCH', body: JSON.stringify(body) }),
};

// ==================== API pública (directorio y seguimiento) ==============
export const publicApi = {
  directory: (state?: string, trade?: string) => {
    const params = new URLSearchParams();
    if (state) params.set('state', state);
    if (trade) params.set('trade', trade);
    const q = params.toString();
    return request<PublicContractor[]>(`/api/directory${q ? `?${q}` : ''}`);
  },
  contractor: (id: number) => request<PublicContractor>(`/api/directory/${id}`),
  myRequests: (email: string, phone: string) =>
    request<MyRequest[]>(`/api/my-requests?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`),
};

// ==================== Portal del contratista (/portal) ====================
function contractorRequest<T>(token: string, path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: { 'x-contractor-token': token, ...(options.headers ?? {}) },
  });
}

export const contractorApi = {
  me: (token: string) => contractorRequest<PublicContractor>(token, '/api/me'),
  updateMe: (token: string, body: Record<string, unknown>) =>
    contractorRequest<PublicContractor>(token, '/api/me', { method: 'PATCH', body: JSON.stringify(body) }),
  myLeads: (token: string) =>
    contractorRequest<(LeadRecord & { assigned_at: string })[]>(token, '/api/my-leads'),
  upload: (token: string, data: string, name?: string) =>
    contractorRequest<{ ok: boolean; path: string }>(token, '/api/upload', {
      method: 'POST',
      body: JSON.stringify({ data, name }),
    }),
};

// Token de administración (panel /admin)
export function getAdminToken(): string {
  return window.localStorage.getItem('remodelausa-admin-token') ?? '';
}

export function setAdminToken(token: string): void {
  if (token) window.localStorage.setItem('remodelausa-admin-token', token);
  else window.localStorage.removeItem('remodelausa-admin-token');
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const adminApi = {
  stats: () => adminRequest<{
    totals: Record<string, number>;
    byStatus: Record<string, { count: number; commission: number }>;
    settings: { commission_rate: string; avg_ticket: string };
  }>('/api/stats'),

  leads: (status?: string) =>
    adminRequest<LeadRecord[]>(`/api/leads${status ? `?status=${status}` : ''}`),

  updateLead: (id: number, body: { status?: string; job_value?: number }) =>
    adminRequest<LeadRecord>(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  contractors: () => adminRequest<ContractorRecord[]>('/api/contractors'),

  updateContractor: (id: number, body: { status?: string; verified?: boolean; rating?: number; jobs_done?: number }) =>
    adminRequest<ContractorRecord>(`/api/contractors/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  outbox: () => adminRequest<{ id: number; to_email: string; subject: string; body: string; sent: number; created_at: string }[]>('/api/outbox'),

  settings: () => adminRequest<{ commission_rate: string; avg_ticket: string; admin_token: string; resend: boolean; stripe: boolean }>('/api/settings'),

  saveSettings: (body: { commission_rate?: number; avg_ticket?: number; admin_token?: string }) =>
    adminRequest<{ ok: boolean }>('/api/settings', { method: 'PATCH', body: JSON.stringify(body) }),

  commissionCheckout: (leadId: number) =>
    adminRequest<{ ok?: boolean; demo?: boolean; message?: string; url?: string }>(`/api/billing/commission/${leadId}`, { method: 'POST' }),
};

export interface LeadRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  start_date: string;
  message: string;
  state: string;
  city: string;
  lang: string;
  status: string;
  job_value: number;
  commission: number;
  source: string;
  created_at: string;
}

export interface ContractorRecord {
  id: number;
  name: string;
  company: string;
  trade: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  license: string;
  years: number;
  description: string;
  services: string;
  website: string;
  logo: string;
  photos: string;
  rating: number;
  jobs_done: number;
  status: string;
  verified: number;
  created_at: string;
}
