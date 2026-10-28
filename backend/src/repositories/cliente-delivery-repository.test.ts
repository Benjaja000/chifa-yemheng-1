import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock('../config/supabase.js', () => ({
  supabase: { rpc: mocks.rpc },
}));

import { crearDeliveryCliente } from './cliente-delivery-repository.js';

describe('crearDeliveryCliente', () => {
  beforeEach(() => {
    mocks.rpc.mockReset();
  });

  it('creates the order and delivery through one atomic RPC', async () => {
    mocks.rpc.mockResolvedValueOnce({
      data: [{ id_pedidodelivery: 41, situacion: 'P', costo_envio: 7.5 }],
      error: null,
    });

    const delivery = await crearDeliveryCliente({
      clienteId: 8,
      items: [{ productoId: 3, cantidad: 2, nota: 'Sin cebolla' }],
      direccion: 'Av. Central 123',
      distritoId: 5,
      referencia: 'Frente al parque',
      telefono: '987654321',
      costoEnvio: 7.5,
      latCliente: -12.04,
      lngCliente: -77.03,
    }, '127.0.0.1', 1);

    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledWith('fn_crear_delivery_cliente', {
      p_cliente: 8,
      p_usuario: 1,
      p_distrito: 5,
      p_direccion: 'Av. Central 123',
      p_referencia: 'Frente al parque',
      p_telefono: '987654321',
      p_costo_envio: 7.5,
      p_lat_cliente: -12.04,
      p_lng_cliente: -77.03,
      p_items: [{ productoId: 3, cantidad: 2, nota: 'Sin cebolla' }],
      p_pc: '127.0.0.1',
    });
    expect(delivery).toEqual({ id: 41, estado: 'P', costo: 7.5, costoConfirmado: false });
  });

  it('returns a business error when an item is unavailable', async () => {
    mocks.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'Producto no disponible.' },
    });

    await expect(crearDeliveryCliente({
      clienteId: 8,
      items: [{ productoId: 3, cantidad: 1 }],
      direccion: 'Av. Central 123',
      distritoId: 5,
      telefono: '987654321',
      costoEnvio: 7.5,
    }, '', 1)).rejects.toMatchObject({ code: 'PRODUCTO_NO_DISPONIBLE' });
  });
});
