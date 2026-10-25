import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { auditarCliente, buscarClienteActivoPorPersona, buscarPersonaPorEmail, crearClienteGmail, crearPersonaGmail } from '../repositories/cliente-auth-repository.js';

interface GoogleTokenInfo {
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface ClienteAuthResult {
  token: string;
  cliente: { id: number; nombre: string; email: string; puntos: number };
}

export class ClienteAuthError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenInfo> {
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new ClienteAuthError('GOOGLE_NOT_CONFIGURED');
  }
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) {
    throw new ClienteAuthError('TOKEN_INVALIDO');
  }
  const info = (await res.json()) as GoogleTokenInfo;
  if (info.aud !== clientId) {
    throw new ClienteAuthError('AUDIENCE_INVALIDA');
  }
  if (info.email_verified !== 'true') {
    throw new ClienteAuthError('EMAIL_NO_VERIFICADO');
  }
  if (!info.email) {
    throw new ClienteAuthError('TOKEN_INVALIDO');
  }
  return info;
}

export async function clienteLoginService(idToken: string, ip?: string): Promise<ClienteAuthResult> {
  const info = await verifyGoogleIdToken(idToken);

  let persona = await buscarPersonaPorEmail(info.email);
  let idPersona: number;
  if (!persona) {
    const nombre = info.given_name || (info.name ? info.name.split(' ')[0] : info.email.split('@')[0]);
    const apPaterno = info.family_name || null;
    idPersona = await crearPersonaGmail(nombre, apPaterno, null, info.email, 'CLIENTE', ip ?? '');
    persona = { id_persona: idPersona, nombre, ap_paterno: apPaterno, ap_materno: null, email: info.email };
  } else {
    idPersona = persona.id_persona;
  }

  let cliente = await buscarClienteActivoPorPersona(idPersona);
  if (!cliente) {
    const idCliente = await crearClienteGmail(idPersona, 'CLIENTE', ip ?? '');
    cliente = { id_cliente: idCliente, puntos: 0 };
  }

  const nombreCompleto = [persona.nombre, persona.ap_paterno, persona.ap_materno].filter(Boolean).join(' ').trim() || info.email;
  await auditarCliente('LOGIN', cliente.id_cliente, info.email, ip);

  const token = jwt.sign(
    { sub: cliente.id_cliente, rol: 'CLIENTE', email: info.email, nombre: nombreCompleto },
    env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return {
    token,
    cliente: { id: cliente.id_cliente, nombre: nombreCompleto, email: info.email, puntos: cliente.puntos },
  };
}

export async function clienteSesionService(token: string): Promise<{ id: number; nombre: string; email: string; puntos: number }> {
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new ClienteAuthError('CREDENCIALES_INVALIDAS');
  }
  const v = decoded as Record<string, unknown>;
  if (typeof v['sub'] !== 'number' || v['rol'] !== 'CLIENTE') {
    throw new ClienteAuthError('CREDENCIALES_INVALIDAS');
  }
  // fetch fresh data
  const { supabase } = await import('../config/supabase.js');
  const { data, error } = await supabase
    .from('cliente')
    .select('id_cliente, puntos, estado, persona(nombre, ap_paterno, ap_materno, email)')
    .eq('id_cliente', v['sub'])
    .maybeSingle();
  if (error || !data) {
    throw new ClienteAuthError('NOT_FOUND');
  }
  const row = data as unknown as { id_cliente: number; puntos: number; estado: string; persona: { nombre: string; ap_paterno: string | null; ap_materno: string | null; email: string | null } | null };
  if (row.estado !== 'A') {
    throw new ClienteAuthError('INACTIVO');
  }
  const nombre = row.persona ? [row.persona.nombre, row.persona.ap_paterno, row.persona.ap_materno].filter(Boolean).join(' ').trim() : '';
  return { id: row.id_cliente, nombre: nombre || (v['email'] as string), email: row.persona?.email ?? (v['email'] as string), puntos: row.puntos ?? 0 };
}

export async function clienteLogoutService(clienteId: number, email: string, ip?: string): Promise<void> {
  await auditarCliente('LOGOUT', clienteId, email, ip);
}