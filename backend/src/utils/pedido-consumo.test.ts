import { describe, expect, it } from 'vitest';
import type { Pedido, ParticipantePedido } from '../models/pedido.js';
import { distribuirConsumoPedido } from './pedido-consumo.js';

const participantes: ParticipantePedido[] = [
  { clienteId: 7, nombre: 'Ana', esOrganizador: true },
  { clienteId: 9, nombre: 'Luis', esOrganizador: false },
];

function pedido(detalles: NonNullable<Pedido['detalles']>, total: number): Pedido {
  return {
    id: 1,
    numero: 'PED-1',
    clienteId: 7,
    mesaId: 1,
    mesaNumero: '1',
    tipoId: 1,
    tipo: 'Mesa',
    canalOrigen: 'QR',
    modoPagoMesa: 'POR_CONSUMO',
    estadoId: 1,
    estado: 'ABIERTO',
    usuarioId: 1,
    empleadoId: null,
    fecha: '',
    fechaCierre: null,
    comensales: 2,
    subtotal: total,
    descuento: 0,
    servicio: 0,
    igv: 0,
    total,
    facturado: 'N',
    anulado: 'N',
    motivoAnulacion: null,
    observacion: null,
    estadoRegistro: 'A',
    detalles,
  };
}

describe('distribuirConsumoPedido', () => {
  it('asigna platos al cliente que los pidió y reparte platos compartidos', () => {
    const result = distribuirConsumoPedido(pedido([
      {
        id: 1,
        pedidoId: 1,
        productoId: 1,
        producto: 'Chaufa',
        cantidad: 1,
        precioUnitario: 20,
        descuento: 0,
        subTotal: 20,
        notaCocina: null,
        estadoPreparacion: 'P',
        esCortesia: 'N',
        fechaSolicitud: '',
        fechaAtencion: null,
        fechaEntregaMozo: null,
        clienteId: 7,
        estadoRegistro: 'A',
      },
      {
        id: 2,
        pedidoId: 1,
        productoId: 2,
        producto: 'Gaseosa',
        cantidad: 1,
        precioUnitario: 10,
        descuento: 0,
        subTotal: 10,
        notaCocina: null,
        estadoPreparacion: 'P',
        esCortesia: 'N',
        fechaSolicitud: '',
        fechaAtencion: null,
        fechaEntregaMozo: null,
        clienteId: null,
        estadoRegistro: 'A',
      },
    ], 30), participantes);

    expect(result.map((participante) => participante.consumoEstimado)).toEqual([25, 5]);
    expect(result.reduce((sum, participante) => sum + participante.consumoEstimado, 0)).toBe(30);
  });

  it('conserva exactamente el total al repartir centavos con redondeo', () => {
    const result = distribuirConsumoPedido(pedido([], 10), participantes);

    expect(result.map((participante) => participante.consumoEstimado)).toEqual([5, 5]);
    expect(result.reduce((sum, participante) => sum + participante.consumoEstimado, 0)).toBe(10);
  });
});
