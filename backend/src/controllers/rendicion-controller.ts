import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { z } from 'zod';
import { listarPendientesRendicionService, registrarRendicionService, validarRendicionService, observarRendicionService, getRendicionPdfService } from '../services/rendicion-service.js';
import { getPc } from '../utils/auditoria.js';

const rendicionRegistrarSchema = z.object({
  repartidorId: z.number().int().positive(),
  pedidoIds: z.array(z.number().int().positive()).min(1),
  montoEntregado: z.number().min(0),
  observaciones: z.string().max(500).optional(),
});

const rendicionObservarSchema = z.object({
  motivo: z.string().min(1).max(500),
});

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

export async function getPendientesRendicion(req: Request, res: Response): Promise<void> {
  const repartidorId = Number(req.query.repartidorId);
  if (!repartidorId) { res.status(400).json({ error: 'VALIDATION_ERROR', details: 'repartidorId requerido' }); return; }
  res.json(await listarPendientesRendicionService(repartidorId));
}

export async function postRendicion(req: Request, res: Response): Promise<void> {
  const parsed = rendicionRegistrarSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() }); return; }
  const s = sesion(req);
  try {
    res.status(201).json(await registrarRendicionService(parsed.data, s.id));
  } catch (e: any) {
    const conflicto = ['PEDIDO_YA_RENDIDO', 'CAJA_NO_ABIERTA'].includes(e.message);
    res.status(conflicto ? 409 : 400).json({ error: e.message, details: e.message });
  }
}

export async function patchValidarRendicion(req: Request, res: Response): Promise<void> {
  const s = sesion(req);
  try { await validarRendicionService(Number(req.params.id), s.logeo, s.pc); res.json({ ok: true }); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}

export async function patchObservarRendicion(req: Request, res: Response): Promise<void> {
  const parsed = rendicionObservarSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() }); return; }
  const s = sesion(req);
  try { await observarRendicionService(Number(req.params.id), parsed.data.motivo, s.logeo, s.pc); res.json({ ok: true }); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}

export async function getRendicionPdf(req: Request, res: Response): Promise<void> {
  try {
    const pdf = await getRendicionPdfService(Number(req.params.id));
    res.json(pdf);
  } catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}