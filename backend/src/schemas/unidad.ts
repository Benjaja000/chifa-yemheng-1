import { z } from 'zod';

const estadoSchema = z.enum(['A', 'I']);

export const unidadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  buscar: z.string().max(30).optional(),
  estado: estadoSchema.optional(),
});

export const unidadCreateSchema = z.object({
  nombre: z.string().min(1).max(30),
  abreviatura: z.string().min(1).max(10),
  codigoSunat: z.string().max(5).optional(),
  estado: estadoSchema.default('A'),
});

export const unidadUpdateSchema = unidadCreateSchema.partial();

export const unidadEstadoSchema = z.object({
  estado: estadoSchema,
  confirmar: z.boolean().optional().default(false),
});

export type UnidadQuery = z.infer<typeof unidadQuerySchema>;
export type UnidadCreate = z.infer<typeof unidadCreateSchema>;
export type UnidadUpdate = z.infer<typeof unidadUpdateSchema>;
export type UnidadEstado = z.infer<typeof unidadEstadoSchema>;
