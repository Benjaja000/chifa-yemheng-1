import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { TipoMesaError } from '../models/tipo-mesa.js';
import {
  tipoMesaCreateSchema,
  tipoMesaEstadoSchema,
  tipoMesaQuerySchema,
  tipoMesaUpdateSchema,
} from '../schemas/tipo-mesa.js';
import {
  actualizarService,
  cambiarEstadoService,
  crearService,
  listarService,
  obtenerService,
} from '../services/tipos-mesa-service.js';
import { getPc } from '../utils/auditoria.js';

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

function errorTipoMesa(res: Response, err: unknown): void {
  if (err instanceof TipoMesaError) {
    const status = err.code === 'NOT_FOUND' ? 404 : 409;
    res.status(status).json({
      error: err.code,
      ...(err.mesasAsociadas !== undefined
        ? { mesasAsociadas: err.mesasAsociadas }
        : {}),
    });
    return;
  }
  throw err;
}

export async function getTiposMesa(req: Request, res: Response): Promise<void> {
  const parsed = tipoMesaQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await listarService(parsed.data));
}

export async function getTipoMesa(req: Request, res: Response): Promise<void> {
  try {
    res.json(await obtenerService(Number(req.params['id'])));
  } catch (err) {
    errorTipoMesa(res, err);
  }
}

export async function postTipoMesa(req: Request, res: Response): Promise<void> {
  const parsed = tipoMesaCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.status(201).json(await crearService(parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorTipoMesa(res, err);
  }
}

export async function putTipoMesa(req: Request, res: Response): Promise<void> {
  const parsed = tipoMesaUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.json(await actualizarService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorTipoMesa(res, err);
  }
}

export async function patchTipoMesaEstado(req: Request, res: Response): Promise<void> {
  const parsed = tipoMesaEstadoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.json(await cambiarEstadoService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorTipoMesa(res, err);
  }
}
