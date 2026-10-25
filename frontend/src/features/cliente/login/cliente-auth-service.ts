const TOKEN_KEY = 'chifa.cliente.token';
const USER_KEY = 'chifa.cliente.user';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

export interface ClienteSesion {
  id: number;
  nombre: string;
  email: string;
  puntos: number;
  token: string;
}

export async function clienteGoogleLogin(idToken: string): Promise<ClienteSesion> {
  const res = await fetch(`${API_URL}/cliente/oauth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'LOGIN_FAILED');
  }
  const data = (await res.json()) as { token: string; cliente: { id: number; nombre: string; email: string; puntos: number } };
  return { token: data.token, id: data.cliente.id, nombre: data.cliente.nombre, email: data.cliente.email, puntos: data.cliente.puntos };
}

export function guardarSesionCliente(s: ClienteSesion): void {
  localStorage.setItem(TOKEN_KEY, s.token);
  localStorage.setItem(USER_KEY, JSON.stringify({ id: s.id, nombre: s.nombre, email: s.email, puntos: s.puntos }));
}

export function limpiarSesionCliente(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function leerTokenCliente(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function leerCliente(): Omit<ClienteSesion, 'token'> | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Omit<ClienteSesion, 'token'>;
  } catch {
    return null;
  }
}

export async function clienteSesionRequest(): Promise<Omit<ClienteSesion, 'token'> | null> {
  const token = leerTokenCliente();
  if (!token) return null;
  const res = await fetch(`${API_URL}/cliente/sesion`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    limpiarSesionCliente();
    return null;
  }
  const data = (await res.json()) as { id: number; nombre: string; email: string; puntos: number };
  localStorage.setItem(USER_KEY, JSON.stringify(data));
  return data;
}

export async function clienteLogoutRequest(): Promise<void> {
  const token = leerTokenCliente();
  if (!token) return;
  await fetch(`${API_URL}/cliente/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => undefined);
  limpiarSesionCliente();
}