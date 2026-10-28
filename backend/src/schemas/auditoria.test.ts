import { describe, expect, it } from 'vitest';
import { auditoriaQuerySchema } from './auditoria.js';

describe('parámetros de consulta de auditoría', () => {
  it('acepta filtros válidos de usuario y fechas', () => {
    const parsed = auditoriaQuerySchema.safeParse({
      usuarioId: '12',
      desde: '2024-02-29',
      hasta: '2024-03-01',
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.usuarioId).toBe(12);
  });

  it('rechaza fechas inexistentes y rangos invertidos', () => {
    expect(auditoriaQuerySchema.safeParse({ desde: '2024-02-31' }).success).toBe(false);
    expect(auditoriaQuerySchema.safeParse({ desde: '2024-03-02', hasta: '2024-03-01' }).success).toBe(false);
  });
});
