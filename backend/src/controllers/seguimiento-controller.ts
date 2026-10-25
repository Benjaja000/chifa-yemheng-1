import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { z } from 'zod';
import { listarSeguimientoService, iniciarRutaStaffService, confirmarEntregaStaffService, anularDeliveryService, getUbicacionSeguimientoService } from '../services/seguimiento-service.js';
import { getPc } from '../utils/auditoria.js';

const seguimientoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  estado: z.enum(['P', 'R', 'E', 'C']).optional(),
  repartidorId: z.coerce.number().int().positive().optional(),
});

const anularSchema = z.object({
  motivo: z.string().min(1).max(200),
});

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

export async function getSeguimiento(req: Request, res: Response): Promise<void> {
  const parsed = seguimientoQuerySchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() }); return; }
  res.json(await listarSeguimientoService(parsed.data));
}

export async function patchIniciarRutaStaff(req: Request, res: Response): Promise<void> {
  const s = sesion(req);
  try { res.json(await iniciarRutaStaffService(Number(req.params.id), s.logeo, s.pc)); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}

export async function patchConfirmarEntregaStaff(req: Request, res: Response): Promise<void> {
  const s = sesion(req);
  try { res.json(await confirmarEntregaStaffService(Number(req.params.id), s.logeo, s.pc)); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}

export async function patchAnular(req: Request, res: Response): Promise<void> {
  const parsed = anularSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() }); return; }
  const s = sesion(req);
  try { res.json(await anularDeliveryService(Number(req.params.id), parsed.data.motivo, s.logeo, s.pc)); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}

export async function getUbicacionSeguimiento(req: Request, res: Response): Promise<void> {
  try { res.json(await getUbicacionSeguimientoService(Number(req.params.id))); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}