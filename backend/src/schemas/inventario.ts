import { z } from 'zod';

const tipoMovimientoSchema = z.enum(['E', 'S', 'A', 'M']);

export const movimientoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  productoId: z.coerce.number().int().positive().optional(),
  tipo: tipoMovimientoSchema.optional(),
});

export const movimientoCreateSchema = z.object({
  productoId: z.number().int().positive(),
  tipo: tipoMovimientoSchema,
  cantidad: z.number().positive(),
  costo: z.number().min(0).default(0),
  motivo: z.string().max(200).optional(),
});

export const recetaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  productoId: z.coerce.number().int().positive().optional(),
});

export const recetaCreateSchema = z.object({
  productoId: z.number().int().positive(),
  insumoId: z.number().int().positive(),
  cantidad: z.number().positive(),
});

export const recetaUpdateSchema = z.object({
  cantidad: z.number().positive().optional(),
  estado: z.enum(['A', 'I']).optional(),
}).refine((value) => value.cantidad !== undefined || value.estado !== undefined);

export type MovimientoQuery = z.infer<typeof movimientoQuerySchema>;
export type MovimientoCreate = z.infer<typeof movimientoCreateSchema>;
export type RecetaQuery = z.infer<typeof recetaQuerySchema>;
export type RecetaCreate = z.infer<typeof recetaCreateSchema>;
export type RecetaUpdate = z.infer<typeof recetaUpdateSchema>;
