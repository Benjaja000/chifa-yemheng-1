import { leerToken } from '../../auth/login/auth-service';
import { headerEquipo } from '../../../utils/equipo';
import type { TipoMesa, TipoMesaForm, TipoMesaLista } from './tipos-mesa-types';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/tipos-mesa`;

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
      mesasAsociadas?: number;
    };
    const err = new Error(body.error ?? 'NETWORK_ERROR') as Error & {
      mesasAsociadas?: number;
    };
    err.mesasAsociadas = body.mesasAsociadas;
    throw err;
  }
  return (await res.json()) as T;
}

export function listarTiposMesa(params: {
  page: number;
  limit: number;
  nombre: string;
  estado: '' | 'A' | 'I';
}): Promise<TipoMesaLista> {
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
  return fetch(`${BASE}?${q.toString()}`, { headers: headers() }).then(lanzar<TipoMesaLista>);
}

export function crearTipoMesa(input: TipoMesaForm): Promise<TipoMesa> {
  return fetch(BASE, { method: 'POST', headers: headers(), body: JSON.stringify(input) }).then(
    lanzar<TipoMesa>,
  );
}

export function actualizarTipoMesa(id: number, input: Partial<TipoMesaForm>): Promise<TipoMesa> {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(input),
  }).then(lanzar<TipoMesa>);
}

export function cambiarEstadoTipoMesa(
  id: number,
  estado: 'A' | 'I',
  confirmar = false,
): Promise<TipoMesa> {
  return fetch(`${BASE}/${id}/estado`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ estado, confirmar }),
  }).then(lanzar<TipoMesa>);
}

/** Tipos activos para selects (sin hardcodear: vacío [] si la API falla). */
export async function listarTiposActivos(): Promise<{ id: number; descripcion: string }[]> {
  try {
    const res = await fetch(`${BASE}?limit=100&estado=A`, { headers: headers() }).then(
      lanzar<{ data: { id: number; descripcion: string }[] }>,
    );
    return res.data;
  } catch {
    return [];
  }
}
