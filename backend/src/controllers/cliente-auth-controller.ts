import type { Request, Response } from 'express';
import { z } from 'zod';
import { ClienteAuthError, clienteLoginService, clienteLogoutService, clienteSesionService } from '../services/cliente-auth-service.js';

const oauthSchema = z.object({ idToken: z.string().min(10) });

export async function postClienteOAuth(req: Request, res: Response): Promise<void> {
  const parsed = oauthSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const result = await clienteLoginService(parsed.data.idToken, req.ip);
    res.json(result);
  } catch (err) {
    if (err instanceof ClienteAuthError) {
      const status = err.code === 'GOOGLE_NOT_CONFIGURED' ? 503 : 401;
      res.status(status).json({ error: err.code });
      return;
    }
    throw err;
  }
}

export async function getClienteSesion(req: Request, res: Response): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  try {
    const data = await clienteSesionService(token);
    res.json(data);
  } catch (err) {
    if (err instanceof ClienteAuthError) {
      res.status(401).json({ error: err.code });
      return;
    }
    throw err;
  }
}

export async function postClienteLogout(req: Request, res: Response): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  try {
    const data = await clienteSesionService(token);
    await clienteLogoutService(data.id, data.email, req.ip);
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof ClienteAuthError) {
      res.status(401).json({ error: err.code });
      return;
    }
    throw err;
  }
}