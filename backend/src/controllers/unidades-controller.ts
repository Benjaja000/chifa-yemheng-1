import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { UnidadError } from '../models/unidad.js';
import {
  unidadCreateSchema,
  unidadEstadoSchema,
  unidadQuerySchema,
  unidadUpdateSchema,
} from '../schemas/unidad.js';
import {
  actualizarService,
  cambiarEstadoService,
  crearService,
  listarService,
  obtenerService,
} from '../services/unidades-service.js';
import { getPc } from '../utils/auditoria.js';

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

function errorUnidad(res: Response, err: unknown): void {
  if (err instanceof UnidadError) {
    const status = err.code === 'NOT_FOUND' ? 404 : 409;
    res.status(status).json({
      error: err.code,
      ...(err.productosAsociados !== undefined
        ? { productosAsociados: err.productosAsociados }
        : {}),
    });
    return;
  }
  throw err;
}

export async function getUnidades(req: Request, res: Response): Promise<void> {
  const parsed = unidadQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await listarService(parsed.data));
}

export async function getUnidad(req: Request, res: Response): Promise<void> {
  try {
    res.json(await obtenerService(Number(req.params['id'])));
  } catch (err) {
    errorUnidad(res, err);
  }
}

export async function postUnidad(req: Request, res: Response): Promise<void> {
  const parsed = unidadCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.status(201).json(await crearService(parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorUnidad(res, err);
  }
}

export async function putUnidad(req: Request, res: Response): Promise<void> {
  const parsed = unidadUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.json(await actualizarService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorUnidad(res, err);
  }
}

export async function patchUnidadEstado(req: Request, res: Response): Promise<void> {
  const parsed = unidadEstadoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.json(await cambiarEstadoService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorUnidad(res, err);
  }
}
