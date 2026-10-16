import { leerToken } from '../../auth/login/auth-service';
import { headerEquipo } from '../../../utils/equipo';
import type { Unidad, UnidadForm, UnidadLista } from './unidades-types';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/unidades`;

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${leerToken() ?? ''}`,
    ...headerEquipo(),
  };
}

async function lanzar<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      productosAsociados?: number;
    };
    const err = new Error(body.error ?? 'NETWORK_ERROR') as Error & {
      productosAsociados?: number;
    };
    err.productosAsociados = body.productosAsociados;
    throw err;
  }
  return (await res.json()) as T;
}

export function listarUnidades(params: {
  page: number;
  limit: number;
  nombre: string;
  estado: '' | 'A' | 'I';
}): Promise<UnidadLista> {
  const q = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.nombre) {
    q.set('nombre', params.nombre);
  }
  if (params.estado) {
    q.set('estado', params.estado);
  }
  return fetch(`${BASE}?${q.toString()}`, { headers: headers() }).then(lanzar<UnidadLista>);
}

export function crearUnidad(input: UnidadForm): Promise<Unidad> {
  return fetch(BASE, { method: 'POST', headers: headers(), body: JSON.stringify(input) }).then(
    lanzar<Unidad>,
  );
}

export function actualizarUnidad(id: number, input: Partial<UnidadForm>): Promise<Unidad> {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(input),
  }).then(lanzar<Unidad>);
}

export function cambiarEstadoUnidad(
  id: number,
  estado: 'A' | 'I',
  confirmar = false,
): Promise<Unidad> {
  return fetch(`${BASE}/${id}/estado`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ estado, confirmar }),
  }).then(lanzar<Unidad>);
}

/** Unidades activas para selects (sin hardcodear: vacío [] si la API falla). */
export async function listarUnidadesActivas(): Promise<{ id: number; nombre: string }[]> {
  try {
    const res = await fetch(`${BASE}?limit=100&estado=A`, { headers: headers() }).then(
      lanzar<{ data: { id: number; nombre: string }[] }>,
    );
    return res.data;
  } catch {
    return [];
  }
}
