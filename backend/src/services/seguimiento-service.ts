import type { Delivery, DeliveryLista } from '../models/delivery.js';
import type { SeguimientoFiltros } from '../repositories/seguimiento-repository.js';
import { listarSeguimiento, iniciarRutaStaff, confirmarEntregaStaff, anularDelivery, getUbicacionSeguimiento } from '../repositories/seguimiento-repository.js';
import { DeliveryError } from '../models/delivery.js';

export async function listarSeguimientoService(f: SeguimientoFiltros): Promise<DeliveryLista> {
  return listarSeguimiento(f);
}

export async function iniciarRutaStaffService(id: number, usumod: string, pc?: string): Promise<Delivery> {
  const r = await iniciarRutaStaff(id, usumod, pc);
  if (!r) throw new DeliveryError('NOT_FOUND');
  return r;
}

export async function confirmarEntregaStaffService(id: number, usumod: string, pc?: string): Promise<Delivery> {
  const r = await confirmarEntregaStaff(id, usumod, pc);
  if (!r) throw new DeliveryError('NOT_FOUND');
  return r;
}

export async function anularDeliveryService(id: number, motivo: string, usumod: string, pc?: string): Promise<Delivery> {
  const r = await anularDelivery(id, motivo, usumod, pc);
  if (!r) throw new DeliveryError('NOT_FOUND');
  return r;
}

export async function getUbicacionSeguimientoService(id: number) {
  const r = await getUbicacionSeguimiento(id);
  if (!r) throw new DeliveryError('NOT_FOUND');
  return r;
}