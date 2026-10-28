import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  select: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock('../config/supabase.js', () => ({
  supabase: { from: mocks.from },
}));

import { actualizarUbicacionRepartidor } from './repartidor-repository.js';

describe('actualizarUbicacionRepartidor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.from.mockReturnValue({ update: mocks.update });
    mocks.update.mockReturnValue({ eq: mocks.eq });
    mocks.eq.mockReturnValue({ eq: mocks.eq, select: mocks.select });
    mocks.select.mockReturnValue({ maybeSingle: mocks.maybeSingle });
  });

  it('updates coordinates only for the assigned employee while en route', async () => {
    mocks.maybeSingle.mockResolvedValue({ data: { id_pedidodelivery: 41 }, error: null });

    await actualizarUbicacionRepartidor(41, 12, -12.04, -77.03, 'repartidor', '127.0.0.1');

    expect(mocks.from).toHaveBeenCalledWith('pedido_delivery');
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({
      lat_repartidor: -12.04,
      lng_repartidor: -77.03,
      usumod: 'repartidor',
      pcmod: '127.0.0.1',
    }));
    expect(mocks.eq).toHaveBeenNthCalledWith(1, 'id_pedidodelivery', 41);
    expect(mocks.eq).toHaveBeenNthCalledWith(2, 'id_empleado', 12);
    expect(mocks.eq).toHaveBeenNthCalledWith(3, 'estado', 'A');
    expect(mocks.eq).toHaveBeenNthCalledWith(4, 'situacion', 'R');
  });

  it('rejects location updates for deliveries not assigned or not en route', async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(
      actualizarUbicacionRepartidor(41, 12, -12.04, -77.03, 'repartidor'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
