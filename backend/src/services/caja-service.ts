import type { CajaResponse } from '../repositories/caja-repository.js';
import type { Pedido } from '../models/pedido.js';
import {
  abrirCaja,
  cobrar,
  listarCajas,
  listarMetodosPago,
  turnoAbiertoDeCaja,
} from '../repositories/caja-repository.js';
import { auditar, listarPedidosCocina } from '../repositories/pedidos-repository.js';

export async function maestrosCajaService(): Promise<CajaResponse> {
  const [cajas, metodosPago] = await Promise.all([listarCajas(), listarMetodosPago()]);
  return { cajas, metodosPago };
}

export async function pendientesCajaService(): Promise<Pedido[]> {
  return listarPedidosCocina();
}

export async function abrirCajaService(
  cajaId: number,
  usuarioId: number,
  montoInicial: number,
  logeo: string,
  pc: string,
): Promise<{ id: number; mensaje: string }> {
  const numeroTurno = new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date());
  const result = await abrirCaja({ cajaId, usuarioId, montoInicial, numeroTurno });
  await auditar(usuarioId, 'ABRIR_CAJA', result.id, `Caja ${cajaId} (${logeo}@${pc})`);
  return result;
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
  logeo: string;
  pc: string;
}): Promise<{ idVenta: number; serie: string; numero: string; total: number; vuelto: number }> {
  const apertura = await turnoAbiertoDeCaja(args.cajaId);
  if (!apertura) {
    throw new Error('NO_CAJA_ABIERTA');
  }
  const result = await cobrar({
    pedidoId: args.pedidoId,
    usuarioId: args.usuarioId,
    aperturaId: apertura.id,
    tipoDocumento: args.tipoDocumento,
    clienteId: args.clienteId,
    metodoPagoId: args.metodoPagoId,
    montoRecibido: args.montoRecibido,
    referencia: args.referencia,
  });
  await auditar(
    args.usuarioId,
    'COBRAR_VENTA',
    result.idVenta,
    `Pedido ${args.pedidoId} - ${result.serie}-${result.numero} por S/ ${result.total}`,
  );
  return result;
}
