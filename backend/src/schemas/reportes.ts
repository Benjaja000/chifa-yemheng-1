import { z } from 'zod';

export const reportesVentasQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export const reportesProductosQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(1000).default(50),
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export const reportesArqueoQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export const reportesPagosQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
  metodoPagoId: z.coerce.number().int().positive().optional(),
  usuarioId: z.coerce.number().int().positive().optional(),
});

export const reportesMovimientosQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
  usuarioId: z.coerce.number().int().positive().optional(),
});

export const reportesReservasQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
  estado: z.enum(['P', 'C', 'A', 'X']).optional(),
});

export const reportesDeliveryQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
  estado: z.enum(['P', 'R', 'E', 'C']).optional(),
  distritoId: z.coerce.number().int().positive().optional(),
  repartidorId: z.coerce.number().int().positive().optional(),
});

export const reportesAnalisisQuerySchema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional(),
});

export type ReportesVentasQuery = z.infer<typeof reportesVentasQuerySchema>;
export type ReportesProductosQuery = z.infer<typeof reportesProductosQuerySchema>;
export type ReportesArqueoQuery = z.infer<typeof reportesArqueoQuerySchema>;
export type ReportesPagosQuery = z.infer<typeof reportesPagosQuerySchema>;
export type ReportesMovimientosQuery = z.infer<typeof reportesMovimientosQuerySchema>;
export type ReportesReservasQuery = z.infer<typeof reportesReservasQuerySchema>;
export type ReportesDeliveryQuery = z.infer<typeof reportesDeliveryQuerySchema>;
export type ReportesAnalisisQuery = z.infer<typeof reportesAnalisisQuerySchema>;
