import type { Pedido, ParticipantePedido } from '../models/pedido.js';

export interface ParticipanteConsumo extends ParticipantePedido {
  consumoEstimado: number;
}

export function distribuirConsumoPedido(
  pedido: Pedido,
  participantes: ParticipantePedido[],
): ParticipanteConsumo[] {
  const ids = participantes.map((participante) => participante.clienteId).sort((a, b) => a - b);
  const basePorCliente = new Map(ids.map((id) => [id, 0]));
  const detalles = (pedido.detalles ?? []).filter(
    (detalle) =>
      detalle.estadoRegistro === 'A' &&
      detalle.estadoPreparacion !== 'A' &&
      detalle.esCortesia !== 'S',
  );

  for (const detalle of detalles) {
    const base = Math.max(
      0,
      Math.round((detalle.subTotal || detalle.cantidad * detalle.precioUnitario) * 100),
    );
    if (detalle.clienteId != null && basePorCliente.has(detalle.clienteId)) {
      basePorCliente.set(detalle.clienteId, (basePorCliente.get(detalle.clienteId) ?? 0) + base);
      continue;
    }

    const parte = ids.length > 0 ? Math.floor(base / ids.length) : 0;
    let restante = ids.length > 0 ? base - parte * ids.length : 0;
    for (const id of ids) {
      basePorCliente.set(id, (basePorCliente.get(id) ?? 0) + parte + (restante-- > 0 ? 1 : 0));
    }
  }

  const baseTotal = Array.from(basePorCliente.values()).reduce((sum, amount) => sum + amount, 0);
  const totalCentimos = Math.max(0, Math.round(pedido.total * 100));
  let asignado = 0;
  const importes = new Map<number, number>();
  ids.forEach((id, index) => {
    const monto = ids.length === 0
      ? 0
      : baseTotal === 0
        ? index === ids.length - 1
          ? totalCentimos - asignado
          : Math.floor(totalCentimos / ids.length)
      : index === ids.length - 1
        ? totalCentimos - asignado
        : Math.floor((totalCentimos * (basePorCliente.get(id) ?? 0)) / baseTotal);
    importes.set(id, monto / 100);
    asignado += monto;
  });

  return participantes.map((participante) => ({
    ...participante,
    consumoEstimado: importes.get(participante.clienteId) ?? 0,
  }));
}
