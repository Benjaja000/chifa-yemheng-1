import { leerToken } from '../../auth/login/auth-service';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/inventario`;

function headers(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${leerToken() ?? ''}` };
}

async function lanzar<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? 'NETWORK_ERROR');
  }
  return (await res.json()) as T;
}

export interface Movimiento {
  id: number;
  productoId: number;
  producto: string;
  tipo: string;
  cantidad: number;
  costo: number;
  motivo: string | null;
  fecha: string;
}

export interface MovimientoLista {
  data: Movimiento[];
  page: number;
  limit: number;
  total: number;
}

export interface Receta {
  id: number;
  productoId: number;
  producto: string;
  insumoId: number;
  insumo: string;
  cantidad: number;
  unidad: string;
}

export interface RecetaLista {
  data: Receta[];
  page: number;
  limit: number;
  total: number;
}

export function listarMovimientos(f: { page: number; limit: number; productoId?: number; tipo?: string }): Promise<MovimientoLista> {
  const q = new URLSearchParams({ page: String(f.page), limit: String(f.limit) });
  if (f.productoId) q.set('productoId', String(f.productoId));
  if (f.tipo) q.set('tipo', f.tipo);
  return fetch(`${BASE}/movimientos?${q.toString()}`, { headers: headers() }).then(lanzar<MovimientoLista>);
}

export function crearMovimiento(input: { productoId: number; tipo: string; cantidad: number; costo?: number; motivo?: string }): Promise<Movimiento> {
  return fetch(`${BASE}/movimientos`, { method: 'POST', headers: headers(), body: JSON.stringify(input) }).then(lanzar<Movimiento>);
}

export function listarRecetas(f: { page: number; limit: number; productoId?: number }): Promise<RecetaLista> {
  const q = new URLSearchParams({ page: String(f.page), limit: String(f.limit) });
  if (f.productoId) q.set('productoId', String(f.productoId));
  return fetch(`${BASE}/recetas?${q.toString()}`, { headers: headers() }).then(lanzar<RecetaLista>);
}

export function crearReceta(input: { productoId: number; insumoId: number; cantidad: number }): Promise<Receta> {
  return fetch(`${BASE}/recetas`, { method: 'POST', headers: headers(), body: JSON.stringify(input) }).then(lanzar<Receta>);
}
