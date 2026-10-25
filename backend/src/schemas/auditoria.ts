import { z } from 'zod';

export const auditoriaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  usuarioId: z.coerce.number().int().positive().optional(),
  tabla: z.string().max(50).optional(),
  accion: z.string().max(20).optional(),
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export type AuditoriaQuery = z.infer<typeof auditoriaQuerySchema>;
