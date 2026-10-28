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
  pagos: z.array(z.object({
    metodoPagoId: z.number().int().positive(),
    monto: z.number().positive(),
    montoRecibido: z.number().min(0).nullable().default(null),
    referencia: z.string().max(50).default(''),
    banco: z.string().max(60).default(''),
    clienteId: z.number().int().positive().nullable().default(null),
  })).min(1).max(20),
  aportes: z.array(z.object({
    clienteId: z.number().int().positive(),
    monto: z.number().positive(),
    referencia: z.string().max(50).default(''),
  })).min(1).max(50).optional(),
});

export const movimientoCajaSchema = z.object({
  cajaId: z.number().int().positive(),
  conceptoId: z.number().int().positive(),
  metodoPagoId: z.number().int().positive(),
  monto: z.number().positive(),
  descripcion: z.string().trim().min(3).max(200),
  referencia: z.string().max(30).default(''),
  banco: z.string().max(60).default(''),
});

export const cierreCajaSchema = z.object({
  cajaId: z.number().int().positive(),
  montoDeclarado: z.number().min(0, 'MONTO_INVALIDO'),
  observacion: z.string().max(200).default(''),
});

export const confirmarCierreCajaSchema = z.object({
  aperturaId: z.number().int().positive(),
});

export type TurnoCajaInput = z.infer<typeof turnoCajaSchema>;
export type CobroCajaInput = z.infer<typeof cobroCajaSchema>;
export type CierreCajaInput = z.infer<typeof cierreCajaSchema>;
