import type { NotaCredito, NotaCreditoEmitida } from '../models/nota-credito.js';
import { emitirNotaCredito, listarNotasPorVenta } from '../repositories/ventas-repository.js';

export function emitirNcService(
  idVenta: number,
  idUsuario: number,
  motivo: string,
): Promise<NotaCreditoEmitida> {
  return emitirNotaCredito(idVenta, idUsuario, motivo);
}

export function listarNcService(idVenta: number): Promise<NotaCredito[]> {
  return listarNotasPorVenta(idVenta);
}
