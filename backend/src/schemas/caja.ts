import { z } from 'zod';

/** Apertura de turno de caja */
export const turnoCajaSchema = z.object({
  cajaId: z.number().int().positive(),
  montoInicial: z.number().min(0, 'MONTO_INVALIDO'),
});

/** Cobro de pedido por caja (factura/boleta + pago + movimiento) */
export const cobroCajaSchema = z.object({
  pedidoId: z.number().int().positive(),
  cajaId: z.number().int().positive(),
  tipoDocumento: z.enum(['03', '01']).default('03'),
  clienteId: z.number().int().positive().nullable().default(null),
  metodoPagoId: z.number().int().positive(),
  montoRecibido: z.number().min(0).nullable().default(null),
  referencia: z.string().max(100).default(''),
});

export type TurnoCajaInput = z.infer<typeof turnoCajaSchema>;
export type CobroCajaInput = z.infer<typeof cobroCajaSchema>;
