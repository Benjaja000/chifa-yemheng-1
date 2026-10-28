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
  fechaEntregaMozo: string | null;
}

export type CanalOrigenPedido = 'QR' | 'WEB' | 'PRESENCIAL';

export interface Ticket {
  id: number;
  numero: string;
  mesaId: number | null;
  mesaNumero: string | null;
  canalOrigen: CanalOrigenPedido;
  estado: string;
  fecha: string | null;
  comensales: number;
  total: number;
  modoPagoMesa: 'CUENTA_UNICA' | 'POR_CONSUMO';
  participantes?: {
    clienteId: number;
    nombre: string;
    esOrganizador: boolean;
    consumoEstimado: number;
  }[];
  anulado: 'S' | 'N';
  facturado: 'S' | 'N';
  detalles: TicketLinea[];
}

export interface CajaInfo {
  id: number;
  nombre: string;
  aperturada: 'S' | 'N';
  montoBase: number;
  turnoId: number | null;
  montoSistema: number | null;
  cierrePendiente: boolean;
  netoPorMedio: { medio: string; total: number }[];
}

export interface MetodoPagoInfo {
  id: number;
  nombre: string;
  afectaEfectivo: boolean;
  requiereReferencia: boolean;
}

export interface CajaMaestros {
  cajas: CajaInfo[];
  metodosPago: MetodoPagoInfo[];
  conceptos: ConceptoCajaInfo[];
}

export interface ConceptoCajaInfo {
  id: number;
  nombre: string;
  tipoMovimiento: string;
  afectaEfectivo: boolean;
}

export interface CobroResult {
  idVenta: number;
  serie: string;
  numero: string;
  total: number;
  vuelto: number;
}

export interface CierrePendiente {
  id: number;
  cajaId: number;
  cajaNombre: string;
  cajero: string;
  fechaSolicitud: string;
  montoSistema: number;
  montoDeclarado: number;
  diferencia: number;
  observacion: string | null;
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

export function listarEntregasMozo(): Promise<Ticket[]> {
  return fetch(`${BASE}/pedidos/mozo/entregas`, { headers: headers() }).then(lanzar<Ticket[]>);
}

export function confirmarEntregaMozo(pedidoId: number, detalleId: number): Promise<{ ok: true }> {
  return fetch(`${BASE}/pedidos/${pedidoId}/detalles/${detalleId}/entrega`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({}),
  }).then(lanzar<{ ok: true }>);
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
  tipoDocumento: string;
  clienteId: number | null;
  pagos: {
    metodoPagoId: number;
    monto: number;
    montoRecibido: number | null;
    referencia: string;
    banco: string;
    clienteId: number | null;
  }[];
  aportes?: { clienteId: number; monto: number; referencia: string }[];
}): Promise<CobroResult> {
  return fetch(`${BASE}/caja/cobro`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(input),
  }).then(lanzar<CobroResult>);
}

export function registrarMovimientoCaja(input: {
  cajaId: number;
  conceptoId: number;
  metodoPagoId: number;
  monto: number;
  descripcion: string;
  referencia: string;
  banco: string;
}): Promise<{ movimientoId: number }> {
  return fetch(`${BASE}/caja/movimientos`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(input),
  }).then(lanzar<{ movimientoId: number }>);
}

  export function listarCierresPendientes(): Promise<CierrePendiente[]> {
    return fetch(`${BASE}/caja/cierres/pendientes`, { headers: headers() }).then(lanzar<CierrePendiente[]>);
  }

  export function solicitarCierreCaja(input: {
    cajaId: number;
    montoDeclarado: number;
    observacion: string;
  }): Promise<{ aperturaId: number; sistema: number; declarado: number; diferencia: number; resultado: string }> {
    return fetch(`${BASE}/caja/turno/cierre`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(input),
    }).then(lanzar<{ aperturaId: number; sistema: number; declarado: number; diferencia: number; resultado: string }>);
  }

  export function confirmarCierreCaja(aperturaId: number): Promise<{ sistema: number; declarado: number; diferencia: number; resultado: string }> {
    return fetch(`${BASE}/caja/turno/cierre/confirmar`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ aperturaId }),
    }).then(lanzar<{ sistema: number; declarado: number; diferencia: number; resultado: string }>);
  }
