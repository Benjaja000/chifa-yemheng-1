import { z } from 'zod';

export const reportesVentasQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export const reportesProductosQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export const reportesArqueoQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export type ReportesVentasQuery = z.infer<typeof reportesVentasQuerySchema>;
export type ReportesProductosQuery = z.infer<typeof reportesProductosQuerySchema>;
export type ReportesArqueoQuery = z.infer<typeof reportesArqueoQuerySchema>;
