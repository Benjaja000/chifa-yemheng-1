import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import {
  asignarPermisosSchema,
  rolCreateSchema,
  rolQuerySchema,
  usuarioCreateSchema,
  usuarioQuerySchema,
  usuarioUpdateSchema,
} from '../schemas/seguridad.js';
import {
  asignarPermisosService,
  crearRolService,
  crearUsuarioService,
  listarPermisosService,
  listarRolesService,
  listarUsuariosService,
  actualizarUsuarioService,
} from '../services/seguridad-service.js';
import { getPc } from '../utils/auditoria.js';

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

export async function getUsuarios(req: Request, res: Response): Promise<void> {
  const parsed = usuarioQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await listarUsuariosService(parsed.data));
}
export async function postUsuario(req: Request, res: Response): Promise<void> {
  const parsed = usuarioCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    res.status(201).json(await crearUsuarioService(parsed.data, s.logeo, s.pc));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('YA_EXISTE')) {
      res.status(409).json({ error: 'YA_EXISTE' });
      return;
    }
    if (msg.includes('TIPO_INVALIDO')) {
      res.status(422).json({ error: 'TIPO_INVALIDO' });
      return;
    }
    res.status(500).json({ error: 'INTERNAL_ERROR', detalle: msg });
  }
}
export async function putUsuario(req: Request, res: Response): Promise<void> {
  const parsed = usuarioUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    res.json(await actualizarUsuarioService(Number(req.params['id']), parsed.data, s.logeo, s.pc));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('NOT_FOUND')) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    res.status(500).json({ error: 'INTERNAL_ERROR', detalle: msg });
  }
}
export async function getRoles(req: Request, res: Response): Promise<void> {
  const parsed = rolQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await listarRolesService(parsed.data));
}
export async function postRol(req: Request, res: Response): Promise<void> {
  const parsed = rolCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  res.status(201).json(await crearRolService(parsed.data, s.logeo, s.pc));
}
export async function getPermisos(_req: Request, res: Response): Promise<void> {
  res.json(await listarPermisosService());
}
export async function putRolPermisos(req: Request, res: Response): Promise<void> {
  const parsed = asignarPermisosSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  await asignarPermisosService(Number(req.params['id']), parsed.data, s.logeo, s.pc);
  res.json({ ok: true });
}
