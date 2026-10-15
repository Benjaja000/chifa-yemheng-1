import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { PersonaError } from '../models/persona.js';
import {
  convertirSchema,
  hacerClienteSchema,
  hacerPersonalSchema,
  personaBuscarSchema,
  personaCreateSchema,
  personaQuerySchema,
  personaUpdateSchema,
} from '../schemas/persona.js';
import {
  actualizarService,
  buscarService,
  convertirService,
  crearService,
  hacerClienteService,
  hacerPersonalService,
  listarService,
  obtenerService,
} from '../services/personas-service.js';
import { getPc } from '../utils/auditoria.js';

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

function errorPersona(res: Response, err: unknown): void {
  if (err instanceof PersonaError) {
    const status = err.code === 'NOT_FOUND' ? 404 : 409;
    res.status(status).json({ error: err.code });
    return;
  }
  throw err;
}

export async function getPersonas(req: Request, res: Response): Promise<void> {
  const parsed = personaQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await listarService(parsed.data));
}

export async function buscarPersona(req: Request, res: Response): Promise<void> {
  const parsed = personaBuscarSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    res.json(await buscarService(parsed.data));
  } catch (err) {
    errorPersona(res, err);
  }
}

export async function getPersona(req: Request, res: Response): Promise<void> {
  try {
    res.json(await obtenerService(Number(req.params['id'])));
  } catch (err) {
    errorPersona(res, err);
  }
}

export async function postPersona(req: Request, res: Response): Promise<void> {
  const parsed = personaCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.status(201).json(await crearService(parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorPersona(res, err);
  }
}

export async function putPersona(req: Request, res: Response): Promise<void> {
  const parsed = personaUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.json(await actualizarService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorPersona(res, err);
  }
}

export async function postHacerPersonal(req: Request, res: Response): Promise<void> {
  const parsed = hacerPersonalSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.status(201).json(await hacerPersonalService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorPersona(res, err);
  }
}

export async function postHacerCliente(req: Request, res: Response): Promise<void> {
  const parsed = hacerClienteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.status(201).json(await hacerClienteService(Number(req.params['id']), parsed.data, s.id, s.logeo, s.pc));
  } catch (err) {
    errorPersona(res, err);
  }
}

export async function postConvertir(req: Request, res: Response): Promise<void> {
  const parsed = convertirSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const s = sesion(req);
    res.json(
      await convertirService(Number(req.params['id']), parsed.data.destino, parsed.data.datos ?? {}, s.id, s.logeo, s.pc),
    );
  } catch (err) {
    errorPersona(res, err);
  }
}
