import type { Request, Response } from 'express';
import {
  reportesArqueoQuerySchema,
  reportesMovimientosQuerySchema,
  reportesPagosQuerySchema,
  reportesProductosQuerySchema,
  reportesAnalisisQuerySchema,
  reportesReservasQuerySchema,
  reportesDeliveryQuerySchema,
  reportesVentasQuerySchema,
} from '../schemas/reportes.js';
import {
  arqueoCajaService,
  analisisComercialService,
  comprobantesService,
  deliveryReporteService,
  movimientosCajaService,
  pagosPorMedioService,
  productosMasVendidosService,
  reservasReporteService,
  ventasPorCategoriaService,
  ventasDiariasService,
} from '../services/reportes-service.js';

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

export async function getPagosPorMedio(req: Request, res: Response): Promise<void> {
  const parsed = reportesPagosQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await pagosPorMedioService(parsed.data));
}

export async function getComprobantes(req: Request, res: Response): Promise<void> {
  const parsed = reportesMovimientosQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await comprobantesService(parsed.data));
}

export async function getMovimientosCaja(req: Request, res: Response): Promise<void> {
  const parsed = reportesMovimientosQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await movimientosCajaService(parsed.data));
}

export async function getVentasPorCategoria(req: Request, res: Response): Promise<void> {
  const parsed = reportesVentasQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await ventasPorCategoriaService(parsed.data));
}

export async function getReporteReservas(req: Request, res: Response): Promise<void> {
  const parsed = reportesReservasQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await reservasReporteService(parsed.data));
}

export async function getReporteDelivery(req: Request, res: Response): Promise<void> {
  const parsed = reportesDeliveryQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await deliveryReporteService(parsed.data));
}

export async function getAnalisisComercial(req: Request, res: Response): Promise<void> {
  const parsed = reportesAnalisisQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await analisisComercialService(parsed.data));
}
