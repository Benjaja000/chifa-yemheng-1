import { z } from 'zod';

const estadoSchema = z.enum(['A', 'I']);

export const tipoMesaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  nombre: z.string().max(80).optional(),
  estado: estadoSchema.optional(),
});

export const tipoMesaCreateSchema = z.object({
  descripcion: z.string().min(1).max(80),
  cargoServicio: z.number().min(0).max(100).default(0),
  estado: estadoSchema.default('A'),
});

export const tipoMesaUpdateSchema = tipoMesaCreateSchema.partial();

export const tipoMesaEstadoSchema = z.object({
  estado: estadoSchema,
  confirmar: z.boolean().optional().default(false),
});

export type TipoMesaQuery = z.infer<typeof tipoMesaQuerySchema>;
export type TipoMesaCreate = z.infer<typeof tipoMesaCreateSchema>;
export type TipoMesaUpdate = z.infer<typeof tipoMesaUpdateSchema>;
export type TipoMesaEstado = z.infer<typeof tipoMesaEstadoSchema>;
