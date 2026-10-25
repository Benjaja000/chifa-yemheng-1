import type { Request, Response } from 'express';
import {
  cobroCajaSchema,
  turnoCajaSchema,
} from '../schemas/caja.js';
import {
  abrirCajaService,
  cobrarService,
  maestrosCajaService,
  pendientesCajaService,
} from '../services/caja-service.js';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';
import { getPc } from '../utils/auditoria.js';

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub, logeo: user.logeo, pc: getPc(req) };
}

const CODIGOS_409 = new Set([
  'PEDIDO_FACTURADO',
  'NO_CAJA_ABIERTA',
  'FACTURA_REQUIERE_EMPRESA',
]);
const CODIGOS_422 = new Set(['MONTO_INVALIDO']);

function errorCaja(res: Response, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  const base = msg.includes(': ') ? msg.slice(msg.indexOf(': ') + 2) : msg;
  if (CODIGOS_409.has(base)) {
    res.status(409).json({ error: base });
    return;
  }
  if (CODIGOS_422.has(base)) {
    res.status(422).json({ error: base });
    return;
  }
  if (msg.startsWith('DB_')) {
    res.status(500).json({ error: base.startsWith('DB_') ? base.slice(0, base.indexOf(':')) : 'DB_FAIL', detalle: msg });
    return;
  }
  res.status(500).json({ error: 'INTERNAL_ERROR', detalle: msg });
}

export async function getCajaMaestros(_req: Request, res: Response): Promise<void> {
  res.json(await maestrosCajaService());
}

export async function getCajaPendientes(_req: Request, res: Response): Promise<void> {
  res.json(await pendientesCajaService());
}

export async function postCajaTurno(req: Request, res: Response): Promise<void> {
  const parsed = turnoCajaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    res.status(201).json(await abrirCajaService(parsed.data.cajaId, s.id, parsed.data.montoInicial, s.logeo, s.pc));
  } catch (err) {
    errorCaja(res, err);
  }
}

export async function postCajaCobro(req: Request, res: Response): Promise<void> {
  const parsed = cobroCajaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    const input = parsed.data;
    res.json(
      await cobrarService({
        pedidoId: input.pedidoId,
        usuarioId: s.id,
        cajaId: input.cajaId,
        tipoDocumento: input.tipoDocumento,
        clienteId: input.clienteId,
        metodoPagoId: input.metodoPagoId,
        montoRecibido: input.montoRecibido,
        referencia: input.referencia,
        logeo: s.logeo,
        pc: s.pc,
      }),
    );
  } catch (err) {
    errorCaja(res, err);
  }
}
