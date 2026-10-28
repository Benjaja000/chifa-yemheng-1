import { describe, expect, it } from 'vitest';
import {
  reportesDeliveryQuerySchema,
  reportesProductosQuerySchema,
  reportesReservasQuerySchema,
} from './reportes.js';

describe('parámetros del ranking de productos', () => {
  it('permite pedir hasta 1000 productos para filtros y vistas Top configurables', () => {
    expect(reportesProductosQuerySchema.safeParse({ limit: '1000' }).success).toBe(true);
    expect(reportesProductosQuerySchema.safeParse({ limit: '1001' }).success).toBe(false);
  });

  describe('parámetros de reportes operativos', () => {
    it('valida estados de reservas y delivery', () => {
      expect(reportesReservasQuerySchema.safeParse({ estado: 'X' }).success).toBe(true);
      expect(reportesReservasQuerySchema.safeParse({ estado: 'R' }).success).toBe(false);
      expect(reportesDeliveryQuerySchema.safeParse({ estado: 'R' }).success).toBe(true);
      expect(reportesDeliveryQuerySchema.safeParse({ estado: 'X' }).success).toBe(false);
    });

    it('valida identificadores de distrito y repartidor', () => {
      expect(reportesDeliveryQuerySchema.safeParse({ distritoId: '4', repartidorId: '9' }).success).toBe(true);
      expect(reportesDeliveryQuerySchema.safeParse({ distritoId: '0' }).success).toBe(false);
    });
  });

  it('usa Top 50 como límite por defecto', () => {
    expect(reportesProductosQuerySchema.parse({}).limit).toBe(50);
  });
});
