import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { NotaCreditoError } from '../models/nota-credito.js';
import { notaCreditoCreateSchema } from '../schemas/nota-credito.js';
import { emitirNcService, listarNcService } from '../services/ventas-service.js';

function errorNc(res: Response, err: unknown): void {
  if (err instanceof NotaCreditoError) {
    const statuses: Record<string, number> = {
      VENTA_NO_EXISTE: 404,
      VALIDATION_ERROR: 400,
      VENTA_ANULADA: 409,
      NO_CAJA_ABIERTA: 409,
      SERIE_NC_NO_DISPONIBLE: 409,
      SIN_PERMISO: 403,
    };
    res.status(statuses[err.code] ?? 409).json({ error: err.code });
    return;
  }
  throw err;
}

export async function postNotaCredito(req: Request, res: Response): Promise<void> {
  const parsed = notaCreditoCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    const user = (req as AuthenticatedRequest).user;
    const idVenta = Number(req.params['id']);
    res.status(201).json(await emitirNcService(idVenta, user.sub, parsed.data.motivo));
  } catch (err) {
    errorNc(res, err);
  }
}

export async function getNotasCredito(req: Request, res: Response): Promise<void> {
  res.json(await listarNcService(Number(req.params['id'])));
}
