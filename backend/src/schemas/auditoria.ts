import { z } from 'zod';

const fechaAuditoriaSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  });

export const auditoriaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  usuarioId: z.coerce.number().int().positive().optional(),
  tabla: z.string().max(50).optional(),
  accion: z.string().max(20).optional(),
  desde: fechaAuditoriaSchema.optional(),
  hasta: fechaAuditoriaSchema.optional(),
}).refine(
  (query) => !query.desde || !query.hasta || query.desde <= query.hasta,
  { message: 'La fecha inicial debe ser anterior o igual a la fecha final', path: ['hasta'] },
);

export type AuditoriaQuery = z.infer<typeof auditoriaQuerySchema>;
