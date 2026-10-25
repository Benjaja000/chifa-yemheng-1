import type { Delivery } from '../models/delivery.js';
import type { SugerirCostoResult } from '../repositories/delivery-repository.js';
import { crearDeliveryCliente, getDeliveryDetalle, getDeliveryUbicacion } from '../repositories/cliente-delivery-repository.js';
import { sugerirCosto } from '../repositories/delivery-repository.js';
import { DeliveryError } from '../models/delivery.js';

export async function crearDeliveryClienteService(input: {
  clienteId: number;
  items: Array<{ productoId: number; cantidad: number; nota?: string; descuento?: number }>;
  direccion: string;
  distritoId: number;
  referencia?: string;
  telefono?: string;
  costoEnvio: number;
  latCliente?: number;
  lngCliente?: number;
  metodoDigital: 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';
}, usucre: string, pc?: string): Promise<Delivery> {
  try { return await crearDeliveryCliente(input, usucre, pc); }
  catch (err) { throw err; }
}

export async function sugerirCostoClienteService(lat: number, lng: number, distritoId: number): Promise<SugerirCostoResult> {
  return sugerirCosto(lat, lng, distritoId);
}

export async function getDeliveryDetalleClienteService(id: number, clienteId: number): Promise<Delivery> {
  const r = await getDeliveryDetalle(id, clienteId);
  if (!r) throw new DeliveryError('NOT_FOUND');
  return r;
}

export async function getDeliveryUbicacionClienteService(id: number, clienteId: number) {
  const r = await getDeliveryUbicacion(id, clienteId);
  if (!r) throw new DeliveryError('NOT_FOUND');
  return r;
}