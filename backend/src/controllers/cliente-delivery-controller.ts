import type { Request, Response } from 'express';
import type { ClienteAuthenticatedRequest } from '../middlewares/cliente-auth-guard.js';
import { z } from 'zod';
import { crearDeliveryClienteService, sugerirCostoClienteService, getDeliveryDetalleClienteService, getDeliveryUbicacionClienteService } from '../services/cliente-delivery-service.js';
import { getPc } from '../utils/auditoria.js';

const clienteDeliveryCreateSchema = z.object({
  items: z.array(z.object({
    productoId: z.number().int().positive(),
    cantidad: z.number().int().positive(),
    nota: z.string().optional(),
    descuento: z.number().min(0).optional(),
  })).min(1),
  direccion: z.string().min(1).max(200),
  distritoId: z.number().int().positive(),
  referencia: z.string().max(200).optional(),
  telefono: z.string().max(20).optional(),
  costoEnvio: z.number().min(0),
  latCliente: z.number().min(-90).max(90).optional(),
  lngCliente: z.number().min(-180).max(180).optional(),
  metodoDigital: z.enum(['YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA']),
});

const sugerirCostoQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  distrito: z.coerce.number().int().positive(),
});

function sesion(req: Request): { id: number; logeo: string; pc: string } {
  const user = (req as ClienteAuthenticatedRequest).user;
  return { id: user.sub, logeo: user.email, pc: getPc(req) };
}

export async function postClienteDelivery(req: Request, res: Response): Promise<void> {
  const parsed = clienteDeliveryCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() }); return; }
  const s = sesion(req);
  try {
    const delivery = await crearDeliveryClienteService({ ...parsed.data, clienteId: s.id }, s.logeo, s.pc);
    res.status(201).json({ idPedidoDelivery: delivery.id, situacion: delivery.estado, costoEnvio: delivery.costo });
  } catch (e) {
    if (e instanceof Error && e.message.includes('VALIDATION')) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: e.message });
    } else {
      res.status(500).json({ error: 'SERVER_ERROR' });
    }
  }
}

export async function getSugerirCostoCliente(req: Request, res: Response): Promise<void> {
  const parsed = sugerirCostoQuerySchema.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() }); return; }
  res.json(await sugerirCostoClienteService(parsed.data.lat ?? null, parsed.data.lng ?? null, parsed.data.distrito));
}

export async function getClienteDeliveryDetalle(req: Request, res: Response): Promise<void> {
  const s = sesion(req);
  try { res.json(await getDeliveryDetalleClienteService(Number(req.params.id), s.id)); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}

export async function getClienteDeliveryUbicacion(req: Request, res: Response): Promise<void> {
  const s = sesion(req);
  try { res.json(await getDeliveryUbicacionClienteService(Number(req.params.id), s.id)); }
  catch { res.status(404).json({ error: 'NOT_FOUND' }); }
}