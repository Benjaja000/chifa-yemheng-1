import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface ClienteAuthenticatedRequest extends Request {
  user: { sub: number; rol: string; email: string; nombre: string };
}

export function clienteAuthGuard(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  try {
    const decoded: unknown = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded !== 'object' || decoded === null) {
      res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
      return;
    }
    const v = decoded as Record<string, unknown>;
    if (typeof v['sub'] !== 'number' || v['rol'] !== 'CLIENTE') {
      res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
      return;
    }
    (req as ClienteAuthenticatedRequest).user = {
      sub: v['sub'] as number,
      rol: v['rol'] as string,
      email: (v['email'] as string) ?? '',
      nombre: (v['nombre'] as string) ?? '',
    };
    next();
  } catch {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
  }
}