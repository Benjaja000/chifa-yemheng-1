import { z } from 'zod';

const estadoSchema = z.enum(['P', 'R', 'E', 'C']);

export const deliveryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  estado: estadoSchema.optional(),
});

export const deliveryCreateSchema = z.object({
  pedidoId: z.number().int().positive(),
  distritoId: z.number().int().positive().optional(),
  direccion: z.string().min(1).max(200),
  referencia: z.string().max(200).optional(),
  telefono: z.string().max(20).optional(),
  costo: z.number().min(0).default(0),
  latCliente: z.number().min(-90).max(90).optional(),
  lngCliente: z.number().min(-180).max(180).optional(),
});

export const deliveryAsignarSchema = z.object({
  repartidorId: z.number().int().positive(),
});

export const sugerirCostoQuerySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  distrito: z.coerce.number().int().positive(),
});

export const sugerirCostoResponseSchema = z.object({
  distanciaKm: z.number().nullable(),
  fueraRadio: z.boolean(),
  costoSugerido: z.number(),
});

export type DeliveryQuery = z.infer<typeof deliveryQuerySchema>;
export type DeliveryCreate = z.infer<typeof deliveryCreateSchema>;
export type DeliveryAsignar = z.infer<typeof deliveryAsignarSchema>;
export type SugerirCostoQuery = z.infer<typeof sugerirCostoQuerySchema>;
export type SugerirCostoResponse = z.infer<typeof sugerirCostoResponseSchema>;
