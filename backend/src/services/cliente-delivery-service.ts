import type { Delivery } from '../models/delivery.js';
import type { SugerirCostoResult } from '../repositories/delivery-repository.js';
import { crearDeliveryCliente, getDeliveryDetalle, getDeliveryUbicacion } from '../repositories/cliente-delivery-repository.js';
import { getParametrosNegocio, sugerirCosto } from '../repositories/delivery-repository.js';
import { DeliveryError } from '../models/delivery.js';

export async function crearDeliveryClienteService(input: {
  clienteId: number;
  items: Array<{ productoId: number; cantidad: number; nota?: string; descuento?: number }>;
  direccion: string;
  distritoId: number;
  referencia?: string;
  telefono?: string;
  latCliente?: number;
  lngCliente?: number;
  metodoDigital: 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';
}, usucre: string, pc?: string): Promise<Delivery> {
  // El monto de envio es autoridad del servidor: nunca se acepta el valor del cliente (BR-GPS-001/002).
  const { costoSugerido, dentroCobertura } = await sugerirCosto(input.latCliente ?? null, input.lngCliente ?? null, input.distritoId);
  // Limite duro de entrega para el cliente (BR-GPS-003); el staff puede forzar desde su propio flujo.
  if (!dentroCobertura) throw new DeliveryError('FUERA_DE_COBERTURA');
  return crearDeliveryCliente({ ...input, costoEnvio: costoSugerido }, usucre, pc);
}

export async function sugerirCostoClienteService(lat: number | null, lng: number | null, distritoId: number): Promise<SugerirCostoResult> {
  return sugerirCosto(lat, lng, distritoId);
}

export async function getCoberturaDeliveryClienteService() {
  return getParametrosNegocio();
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