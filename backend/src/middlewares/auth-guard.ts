import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtPayload } from '../models/auth.js';
import { leerEstadoSesion } from '../repositories/auth-repository.js';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/** AuthGuard: exige JWT válido en Authorization: Bearer. */
export async function authGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  if (!isJwtPayload(decoded)) {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }

  try {
    const state = await leerEstadoSesion(decoded.sub);
    const fechaActual = new Date().toISOString().slice(0, 10);
    if (
      !state ||
      state.estado !== 'A' ||
      state.bloqueado !== 'N' ||
      state.authVersion !== decoded.authVersion ||
      state.empleado?.estado !== 'A' ||
      (state.empleado.f_cese !== null && state.empleado.f_cese <= fechaActual)
    ) {
      res.status(401).json({ error: 'SESION_REVOCADA' });
      return;
    }
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    res.status(503).json({ error: 'AUTHORIZATION_STATE_UNAVAILABLE' });
  }
}

function isJwtPayload(value: unknown): value is JwtPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v['sub'] === 'number' &&
    typeof v['logeo'] === 'string' &&
    typeof v['tipo'] === 'string' &&
    Array.isArray(v['roles']) &&
    Array.isArray(v['permisos']) &&
    typeof v['authVersion'] === 'number' &&
    Number.isInteger(v['authVersion']) &&
    v['authVersion'] >= 0
  );
}
