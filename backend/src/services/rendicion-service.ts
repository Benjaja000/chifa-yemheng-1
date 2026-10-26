import type { PendienteRendicionItem, RendicionRegistrarInput, RendicionResultado } from '../repositories/rendicion-repository.js';
import { listarPendientesRendicion, registrarRendicion, validarRendicion, observarRendicion, getRendicionPdf } from '../repositories/rendicion-repository.js';

export async function listarPendientesRendicionService(repartidorId: number): Promise<PendienteRendicionItem[]> {
  return listarPendientesRendicion(repartidorId);
}

export async function registrarRendicionService(input: RendicionRegistrarInput, usuarioId: number): Promise<RendicionResultado> {
  return registrarRendicion(input, usuarioId);
}

export async function validarRendicionService(id: number, usumod: string, pc?: string): Promise<void> {
  return validarRendicion(id, usumod, pc);
}

export async function observarRendicionService(id: number, motivo: string, usumod: string, pc?: string): Promise<void> {
  return observarRendicion(id, motivo, usumod, pc);
}

export async function getRendicionPdfService(id: number) {
  return getRendicionPdf(id);
}