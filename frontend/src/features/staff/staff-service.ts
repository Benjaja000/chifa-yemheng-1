import { leerToken } from '../auth/login/auth-service';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}`;

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

/* ------------------------------- Tipos ------------------------------- */

export type EstadoPreparacion = 'P' | 'E' | 'S' | 'A';

export interface TicketLinea {
  id: number;
  producto: string;
  cantidad: number;
  notaCocina: string | null;
  estadoPreparacion: EstadoPreparacion;
  fechaSolicitud: string | null;
}

export interface Ticket {
  id: number;
  numero: string;
  mesaId: number | null;
  estado: string;
  fecha: string | null;
  comensales: number;
  total: number;
  anulado: 'S' | 'N';
  facturado: 'S' | 'N';
  detalles: TicketLinea[];
}

export interface CajaInfo {
  id: number;
  nombre: string;
  aperturada: 'S' | 'N';
  montoBase: number;
}

export interface MetodoPagoInfo {
  id: number;
  nombre: string;
  afectaEfectivo: boolean;
}

export interface CajaMaestros {
  cajas: CajaInfo[];
  metodosPago: MetodoPagoInfo[];
}

export interface CobroResult {
  idVenta: number;
  serie: string;
  numero: string;
  total: number;
  vuelto: number;
}

/* ------------------------------- Cocina ------------------------------- */

export function listarPedidosCocina(): Promise<Ticket[]> {
  return fetch(`${BASE}/pedidos/cocina`, { headers: headers() })
    .then(lanzar<{ data: Ticket[] }>)
    .then((r) => r.data);
}

export function cambiarPreparacion(
  pedidoId: number,
  detalleId: number,
  estado: EstadoPreparacion,
): Promise<{ ok: true }> {
  return fetch(`${BASE}/pedidos/${pedidoId}/detalles/${detalleId}/preparacion`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ estado }),
  }).then(lanzar<{ ok: true }>);
}

/* -------------------------------- Mozo -------------------------------- */

export function listarPedidoPorMesa(mesaId: number): Promise<Ticket[]> {
  return fetch(`${BASE}/pedidos?mesa=${mesaId}&limit=20`, { headers: headers() })
    .then(lanzar<{ data: Ticket[] }>)
    .then((r) => r.data);
}

export function agregarLinea(
  pedidoId: number,
  productoId: number,
  cantidad: number,
  nota: string,
): Promise<Ticket> {
  return fetch(`${BASE}/pedidos/${pedidoId}/detalles`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ producto: productoId, cantidad, nota }),
  }).then(lanzar<Ticket>);
}

export function abrirPedidoMesa(mesaId: number, comensales: number): Promise<Ticket> {
  return fetch(`${BASE}/pedidos`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ tipo: 1, mesa: mesaId, comensales }),
  }).then(lanzar<Ticket>);
}

export function pedirCuenta(pedidoId: number): Promise<{ ok: true; pedidoId: number; estado: string }> {
  return fetch(`${BASE}/pedidos/${pedidoId}/pedir-cuenta`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({}),
  }).then(lanzar<{ ok: true; pedidoId: number; estado: string }>);
}

/* -------------------------------- Caja -------------------------------- */

export function listarCajaMaestros(): Promise<CajaMaestros> {
  return fetch(`${BASE}/caja/maestros`, { headers: headers() }).then(lanzar<CajaMaestros>);
}

export function listarCajaPendientes(): Promise<Ticket[]> {
  return fetch(`${BASE}/caja/pendientes`, { headers: headers() }).then(lanzar<Ticket[]>);
}

export function aperturarCaja(cajaId: number, montoInicial: number): Promise<{ id: number; mensaje: string }> {
  return fetch(`${BASE}/caja/turno`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ cajaId, montoInicial }),
  }).then(lanzar<{ id: number; mensaje: string }>);
}

export function registrarCobro(input: {
  pedidoId: number;
  cajaId: number;
  metodoPagoId: number;
  tipoDocumento: string;
  clienteId: number | null;
  montoRecibido: number | null;
  referencia: string;
}): Promise<CobroResult> {
  return fetch(`${BASE}/caja/cobro`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(input),
  }).then(lanzar<CobroResult>);
}
