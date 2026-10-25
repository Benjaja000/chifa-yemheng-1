import type { Request, Response } from 'express';
import { auditoriaQuerySchema } from '../schemas/auditoria.js';
import { listarAuditoriaService } from '../services/auditoria-service.js';

export async function getAuditoria(req: Request, res: Response): Promise<void> {
  const parsed = auditoriaQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  res.json(await listarAuditoriaService(parsed.data));
}
