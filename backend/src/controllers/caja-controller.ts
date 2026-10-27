import type { Request, Response } from 'express';
import {
  confirmarCierreCajaSchema,
  cierreCajaSchema,
  cobroCajaSchema,
  turnoCajaSchema,
} from '../schemas/caja.js';
import {
  abrirCajaService,
  cierresPendientesService,
  cobrarService,
  confirmarCierreCajaService,
  maestrosCajaService,
  pendientesCajaService,
  solicitarCierreCajaService,
} from '../services/caja-service.js';
import type { AuthenticatedRequest } from '../middlewares/auth-guard.js';

function sesion(req: Request): { id: number } {
  const user = (req as AuthenticatedRequest).user;
  return { id: user.sub };
}

const CODIGOS_409 = new Set([
  'PEDIDO_FACTURADO',
  'PEDIDO_ANULADO',
  'PEDIDO_NO_POR_COBRAR',
  'NO_CAJA_ABIERTA',
  'FACTURA_REQUIERE_EMPRESA',
  'CAJA_YA_ABIERTA',
  'TURNO_NO_ABIERTO',
  'CIERRE_NO_PENDIENTE',
  'SOLO_CAJERO_APERTURA',
  'VALIDADOR_DEBE_SER_DISTINTO',
  'PEDIDOS_POR_COBRAR',
]);
const CODIGOS_422 = new Set([
  'MONTO_INVALIDO',
  'EFECTIVO_INSUFICIENTE',
  'REFERENCIA_REQUERIDA',
  'RUC_INVALIDO',
  'METODO_PAGO_INVALIDO',
  'TIPO_DOCUMENTO_INVALIDO',
  'TOTAL_CERO',
]);

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
  if (base === 'PEDIDO_NOT_FOUND') {
    res.status(404).json({ error: base });
    return;
  }
  if (base === 'CAJA_NO_EXISTE') {
    res.status(404).json({ error: base });
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

export async function getCierresPendientes(_req: Request, res: Response): Promise<void> {
  try {
    res.json(await cierresPendientesService());
  } catch (err) {
    errorCaja(res, err);
  }
}

export async function postCajaTurno(req: Request, res: Response): Promise<void> {
  const parsed = turnoCajaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    res.status(201).json(await abrirCajaService(parsed.data.cajaId, s.id, parsed.data.montoInicial));
  } catch (err) {
    errorCaja(res, err);
  }
}

export async function postCajaCierre(req: Request, res: Response): Promise<void> {
  const parsed = cierreCajaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    res.json(
      await solicitarCierreCajaService({
        cajaId: parsed.data.cajaId,
        usuarioId: s.id,
        declarado: parsed.data.montoDeclarado,
        observacion: parsed.data.observacion,
      }),
    );
  } catch (err) {
    errorCaja(res, err);
  }
}

export async function postCajaConfirmarCierre(req: Request, res: Response): Promise<void> {
  const parsed = confirmarCierreCajaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  const s = sesion(req);
  try {
    res.json(await confirmarCierreCajaService(parsed.data.aperturaId, s.id));
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
      }),
    );
  } catch (err) {
    errorCaja(res, err);
  }
}
