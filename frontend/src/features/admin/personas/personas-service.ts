import { leerToken } from '../../auth/login/auth-service';
import type { HacerPersonalForm, Persona, PersonaForm, PersonaLista, TipoDocPersona } from './personas-types';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/personas`;

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${leerToken() ?? ''}`,
  };
}

async function lanzar<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'NETWORK_ERROR');
  }
  return (await res.json()) as T;
}

export function listarPersonas(params: { page: number; limit: number; buscar: string }): Promise<PersonaLista> {
  const q = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.buscar) {
    q.set('buscar', params.buscar);
  }
  return fetch(`${BASE}?${q.toString()}`, { headers: headers() }).then(lanzar<PersonaLista>);
}

export function buscarPorDocumento(tipoDoc: TipoDocPersona, documento: string): Promise<Persona> {
  const q = new URLSearchParams({ tipoDoc, documento });
  return fetch(`${BASE}/buscar?${q.toString()}`, { headers: headers() }).then(lanzar<Persona>);
}

export function obtenerPersona(id: number): Promise<Persona> {
  return fetch(`${BASE}/${id}`, { headers: headers() }).then(lanzar<Persona>);
}

export function crearPersona(input: PersonaForm): Promise<Persona> {
  const body = {
    tipoDoc: input.tipoDoc,
    documento: input.documento.trim(),
    nombres: input.nombres.trim(),
    apPaterno: input.apPaterno.trim(),
    apMaterno: input.apMaterno.trim(),
    telefono: input.telefono.trim(),
    correo: input.correo.trim() || undefined,
    distritoId: input.distritoId || undefined,
    direccion: input.direccion.trim(),
    fNacimiento: input.fNacimiento || undefined,
    genero: input.genero || undefined,
  };
  return fetch(BASE, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(
    lanzar<Persona>,
  );
}

export function hacerPersonal(id: number, input: HacerPersonalForm): Promise<unknown> {
  const body = {
    cargoId: input.cargoId,
    contratoId: input.contratoId,
    turno: input.turno,
    sueldo: input.sueldo,
    fIngreso: input.fIngreso || undefined,
  };
  return fetch(`${BASE}/${id}/hacer-personal`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  }).then(lanzar<unknown>);
}

export function hacerCliente(id: number, codigoCliente: string): Promise<unknown> {
  const body = { codigoCliente: codigoCliente.trim() || undefined };
  return fetch(`${BASE}/${id}/hacer-cliente`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  }).then(lanzar<unknown>);
}

export function convertir(
  id: number,
  destino: 'personal' | 'cliente',
  datos: Record<string, unknown>,
): Promise<Persona> {
  return fetch(`${BASE}/${id}/convertir`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ destino, datos }),
  }).then(lanzar<Persona>);
}
