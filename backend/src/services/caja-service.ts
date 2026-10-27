import type { CajaResponse } from '../repositories/caja-repository.js';
import type { Pedido } from '../models/pedido.js';
import {
  abrirCaja,
  cobrarAtomic,
  confirmarCierreCaja,
  listarCierresPendientes,
  listarCajas,
  listarMetodosPago,
  solicitarCierreCaja,
  turnoAbiertoDeCaja,
  type CierrePendiente,
} from '../repositories/caja-repository.js';
import { listarPedidosPorCobrar } from '../repositories/pedidos-repository.js';

export async function maestrosCajaService(): Promise<CajaResponse> {
  const [cajas, metodosPago] = await Promise.all([listarCajas(), listarMetodosPago()]);
  return { cajas, metodosPago };
}

export async function pendientesCajaService(): Promise<Pedido[]> {
  return listarPedidosPorCobrar();
}

export async function abrirCajaService(
  cajaId: number,
  usuarioId: number,
  montoInicial: number,
): Promise<{ id: number; mensaje: string }> {
  const numeroTurno = new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date());
  return abrirCaja({ cajaId, usuarioId, montoInicial, numeroTurno });
}

export async function cobrarService(args: {
  pedidoId: number;
  usuarioId: number;
  cajaId: number;
  tipoDocumento: string;
  clienteId: number | null;
  metodoPagoId: number;
  montoRecibido: number | null;
  referencia: string;
}): Promise<{ idVenta: number; serie: string; numero: string; total: number; vuelto: number }> {
  const apertura = await turnoAbiertoDeCaja(args.cajaId);
  if (!apertura) {
    throw new Error('NO_CAJA_ABIERTA');
  }
  const result = await cobrarAtomic({
    pedidoId: args.pedidoId,
    usuarioId: args.usuarioId,
    aperturaId: apertura.id,
    tipoDocumento: args.tipoDocumento,
    clienteId: args.clienteId,
    metodoPagoId: args.metodoPagoId,
    montoRecibido: args.montoRecibido,
    referencia: args.referencia,
  });
  return result;
}

export async function cierresPendientesService(): Promise<CierrePendiente[]> {
  return listarCierresPendientes();
}

export async function solicitarCierreCajaService(args: {
  cajaId: number;
  usuarioId: number;
  declarado: number;
  observacion: string;
}): Promise<{ aperturaId: number; sistema: number; declarado: number; diferencia: number; resultado: string }> {
  const turno = await turnoAbiertoDeCaja(args.cajaId);
  if (!turno) {
    throw new Error('TURNO_NO_ABIERTO');
  }
  if (turno.usuarioId !== args.usuarioId) {
    throw new Error('SOLO_CAJERO_APERTURA');
  }
  const result = await solicitarCierreCaja({
    aperturaId: turno.id,
    usuarioId: args.usuarioId,
    declarado: args.declarado,
    observacion: args.observacion,
  });
  return { aperturaId: turno.id, ...result };
}

export async function confirmarCierreCajaService(
  aperturaId: number,
  supervisorId: number,
): Promise<{ sistema: number; declarado: number; diferencia: number; resultado: string }> {
  return confirmarCierreCaja({ aperturaId, supervisorId });
}
