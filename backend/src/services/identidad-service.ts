import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';
import type { DistritoMatch, DniNormalizado, RucNormalizado, UbicacionOficial } from '../models/identidad.js';
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

/** Copia los nombres de ubicación solo si traen texto; son referencia, no identidad. */
function conUbicacion(d: { departamento?: unknown; provincia?: unknown; distrito?: unknown }): UbicacionOficial {
  const out: UbicacionOficial = {};
  const dep = texto(d.departamento);
  const prov = texto(d.provincia);
  const dist = texto(d.distrito);
  if (dep) {
    out.departamento = dep;
  }
  if (prov) {
    out.provincia = prov;
  }
  if (dist) {
    out.distrito = dist;
  }
  return out;
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
    direccion?: unknown;
    departamento?: unknown;
    provincia?: unknown;
    distrito?: unknown;
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
  const dir = texto(d.direccion);
  if (dir) {
    out.direccion = dir;
  }
  Object.assign(out, conUbicacion(d));
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
    tipo_contribuyente?: unknown;
    direccion?: unknown;
    departamento?: unknown;
    provincia?: unknown;
    distrito?: unknown;
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
  const tc = texto(d.tipo_contribuyente);
  if (tc) {
    out.tipoContribuyente = tc;
  }
  Object.assign(out, conUbicacion(d));
  const u = texto(d.ubigeo_sunat);
  if (/^\d{6}$/.test(u)) {
    out.ubigeo = u;
  }
  cache.set(clave, { exp: Date.now() + TTL_MS, data: out });
  return out;
}

/** Resuelve un ubigeo SUNAT 6 dígitos a distrito activo + su cadena dep/prov. */
export async function distritoPorUbigeo(ubigeo: string): Promise<DistritoMatch> {
  const { data: dist, error: eDist } = await supabase
    .from('distrito')
    .select('id_distrito, d_distrito, id_provincia')
    .eq('ubigeo', ubigeo)
    .eq('estado', 'A')
    .maybeSingle();
  if (eDist) {
    throw new Error(`DB_GET_FAIL: ${eDist.message}`);
  }
  if (!dist) {
    throw new IdentidadError('DOCUMENTO_NO_ENCONTRADO');
  }
  const d = dist as { id_distrito: number; d_distrito: string; id_provincia: number };
  const { data: prov, error: eProv } = await supabase
    .from('provincia')
    .select('id_provincia, n_provincia, id_departamento')
    .eq('id_provincia', d.id_provincia)
    .eq('estado', 'A')
    .maybeSingle();
  if (eProv) {
    throw new Error(`DB_GET_FAIL: ${eProv.message}`);
  }
  if (!prov) {
    throw new IdentidadError('DOCUMENTO_NO_ENCONTRADO');
  }
  const p = prov as { id_provincia: number; n_provincia: string; id_departamento: number };
  const { data: dep, error: eDep } = await supabase
    .from('departamento')
    .select('id_departamento, n_departamento')
    .eq('id_departamento', p.id_departamento)
    .eq('estado', 'A')
    .maybeSingle();
  if (eDep) {
    throw new Error(`DB_GET_FAIL: ${eDep.message}`);
  }
  if (!dep) {
    throw new IdentidadError('DOCUMENTO_NO_ENCONTRADO');
  }
  const t = dep as { id_departamento: number; n_departamento: string };
  return {
    id: d.id_distrito,
    nombre: d.d_distrito,
    provinciaId: p.id_provincia,
    provinciaNombre: p.n_provincia,
    departamentoId: t.id_departamento,
    departamentoNombre: t.n_departamento,
  };
}
