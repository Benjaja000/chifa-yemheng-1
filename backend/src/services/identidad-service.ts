import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';
import type { DistritoMatch, DniNormalizado, RucNormalizado } from '../models/identidad.js';
import { IdentidadError } from '../models/identidad.js';

/** Caché en memoria 24h por `tipo:numero` (cuota free 100/mes; solo por pulsación). */
const cache = new Map<string, { exp: number; data: DniNormalizado | RucNormalizado }>();
const TTL_MS = 24 * 60 * 60 * 1000;

interface FactilizaEnvelope<T> {
  status?: number;
  success?: boolean;
  message?: string;
  data?: T | null;
}

function exigirToken(): string {
  if (!env.FACTILIZA_TOKEN) {
    throw new IdentidadError('IDENTIDAD_NO_CONFIGURADA');
  }
  return env.FACTILIZA_TOKEN;
}

async function pedir<T>(ruta: string): Promise<T> {
  const token = exigirToken();
  let res: Response;
  try {
    res = await fetch(`${env.FACTILIZA_BASE_URL}${ruta}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new IdentidadError('IDENTIDAD_NO_DISPONIBLE');
  }
  if (res.status === 401 || res.status === 403) {
    throw new IdentidadError('IDENTIDAD_NO_DISPONIBLE');
  }
  const body = (await res.json().catch(() => null)) as FactilizaEnvelope<T> | null;
  if (!res.ok || !body || body.success === false || !body.data) {
    throw new IdentidadError('DOCUMENTO_NO_ENCONTRADO');
  }
  return body.data;
}

function texto(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function generoDe(sexo: unknown): 'M' | 'F' | undefined {
  const s = texto(sexo).toUpperCase();
  if (s.startsWith('M')) {
    return 'M';
  }
  if (s.startsWith('F')) {
    return 'F';
  }
  return undefined;
}

export async function consultarDni(numero: string): Promise<DniNormalizado> {
  const clave = `DNI:${numero}`;
  const hit = cache.get(clave);
  if (hit && hit.exp > Date.now() && hit.data.tipo === 'DNI') {
    return hit.data;
  }
  const d = await pedir<{
    numero?: unknown;
    nombres?: unknown;
    apellido_paterno?: unknown;
    apellido_materno?: unknown;
    fecha_nacimiento?: unknown;
    sexo?: unknown;
    ubigeo_sunat?: unknown;
  }>(`/dni/info/${numero}`);
  const out: DniNormalizado = {
    tipo: 'DNI',
    numero: texto(d.numero) || numero,
    nombres: texto(d.nombres),
    apPaterno: texto(d.apellido_paterno),
    apMaterno: texto(d.apellido_materno),
  };
  const fn = texto(d.fecha_nacimiento);
  if (fn) {
    out.fNacimiento = fn;
  }
  const g = generoDe(d.sexo);
  if (g) {
    out.genero = g;
  }
  const u = texto(d.ubigeo_sunat);
  if (/^\d{6}$/.test(u)) {
    out.ubigeo = u;
  }
  cache.set(clave, { exp: Date.now() + TTL_MS, data: out });
  return out;
}

export async function consultarRuc(numero: string): Promise<RucNormalizado> {
  const clave = `RUC:${numero}`;
  const hit = cache.get(clave);
  if (hit && hit.exp > Date.now() && hit.data.tipo === 'RUC') {
    return hit.data;
  }
  const d = await pedir<{
    numero?: unknown;
    nombre_o_razon_social?: unknown;
    direccion?: unknown;
    ubigeo_sunat?: unknown;
    estado?: unknown;
    condicion?: unknown;
  }>(`/ruc/info/${numero}`);
  const estado = texto(d.estado).toUpperCase();
  const condicion = texto(d.condicion).toUpperCase();
  const out: RucNormalizado = {
    tipo: 'RUC',
    numero: texto(d.numero) || numero,
    razonSocial: texto(d.nombre_o_razon_social),
    estado,
    condicion,
    habilitado: estado === 'ACTIVO' && condicion === 'HABIDO',
  };
  const dir = texto(d.direccion);
  if (dir) {
    out.direccion = dir;
  }
  const u = texto(d.ubigeo_sunat);
  if (/^\d{6}$/.test(u)) {
    out.ubigeo = u;
  }
  cache.set(clave, { exp: Date.now() + TTL_MS, data: out });
  return out;
}

/** Resuelve un ubigeo SUNAT 6 dígitos a distrito activo (para preseleccionar el picker). */
export async function distritoPorUbigeo(ubigeo: string): Promise<DistritoMatch> {
  const { data, error } = await supabase
    .from('distrito')
    .select('id_distrito, d_distrito')
    .eq('ubigeo', ubigeo)
    .eq('estado', 'A')
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    throw new IdentidadError('DOCUMENTO_NO_ENCONTRADO');
  }
  const row = data as { id_distrito: number; d_distrito: string };
  return { id: row.id_distrito, nombre: row.d_distrito };
}
