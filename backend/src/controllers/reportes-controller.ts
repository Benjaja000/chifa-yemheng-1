import type { Request, Response } from 'express';
import { reportesArqueoQuerySchema, reportesProductosQuerySchema, reportesVentasQuerySchema } from '../schemas/reportes.js';
import { arqueoCajaService, productosMasVendidosService, ventasDiariasService } from '../services/reportes-service.js';

export async function getVentasDiarias(req: Request, res: Response): Promise<void> {
  const parsed = reportesVentasQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await ventasDiariasService(parsed.data));
}
export async function getProductosMasVendidos(req: Request, res: Response): Promise<void> {
  const parsed = reportesProductosQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await productosMasVendidosService(parsed.data));
}
export async function getArqueoCaja(req: Request, res: Response): Promise<void> {
  const parsed = reportesArqueoQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await arqueoCajaService(parsed.data));
}
