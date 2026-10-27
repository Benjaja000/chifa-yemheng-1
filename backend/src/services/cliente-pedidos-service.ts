import type { Pedido } from '../models/pedido.js';
import { PedidoError } from '../models/pedido.js';
import type { DetalleAdd, PedidoAbrir } from '../schemas/pedido.js';
import {
  agregarDetalle as repoAgregar,
  auditar,
  obtenerPedido as repoObtener,
  abrirPedido as repoAbrir,
  pedidosAbiertosPorMesa,
  recalcularPedido as repoRecalcular,
  obtenerEstadoMesa as repoEstadoMesa,
  idEstadoMesaPorNombre,
  clienteParticipa,
  pedirCuentaMesa,
} from '../repositories/pedidos-repository.js';

const AUTOSERVICIO_USER_ID = 1;

export interface PedidoClienteDetalle extends Pedido {
  estadoComandaDerivado: string;
}

export interface ComandaActivaCliente {
  id: number;
  numero: string;
  mesaId: number;
  estado: string;
  estadoComandaDerivado: string;
  total: number;
  cantidadDetalles: number;
  mesaEstado: string | null;
}

/** BR-INF-047/048: estado de la comanda derivado de sus ítems. */
function derivarEstadoComanda(pedido: Pedido): string {
  if (pedido.anulado === 'S') {
    return 'ANULADO';
  }
  if (pedido.facturado === 'S') {
    return 'FACTURADO';
  }
  const activos = (pedido.detalles ?? []).filter(
    (d) => d.estadoRegistro === 'A' && d.estadoPreparacion !== 'A',
  );
  if (activos.length === 0) {
    return pedido.estado;
  }
  if (activos.some((d) => d.estadoPreparacion === 'E')) {
    return 'EN PREPARACION';
  }
  if (activos.every((d) => d.estadoPreparacion === 'S')) {
    return 'SERVIDO';
  }
  return pedido.estado;
}

/** El cliente o un participante QR del pedido (BR-EST-013) puede verlo. */
async function validarParticipacion(pedido: Pedido, clienteId: number): Promise<void> {
  if (pedido.clienteId === clienteId) {
    return;
  }
  const participa = await clienteParticipa(pedido.id, clienteId);
  if (!participa) {
    throw new PedidoError('NO_PARTICIPANTE');
  }
}

export async function abrirClienteService(
  input: PedidoAbrir,
  clienteId: number,
  _pc = '',
): Promise<Pedido> {
  const result = await repoAbrir(
    input.tipo,
    AUTOSERVICIO_USER_ID,
    input.mesa ?? null,
    clienteId,
    null,
    input.comensales ?? 1,
    input.obs ?? '',
    'QR',
  );
  await auditar(AUTOSERVICIO_USER_ID, 'ABRIR_PEDIDO_CLIENTE', result.id, `Pedido ${result.numero} (cliente ${clienteId})`);
  const pedido = await repoObtener(result.id);
  if (!pedido) {
    throw new PedidoError('NOT_FOUND');
  }
  return pedido;
}

export async function agregarDetalleClienteService(
  pedidoId: number,
  input: DetalleAdd,
  clienteId: number,
  _pc = '',
): Promise<Pedido> {
  const pedido = await repoObtener(pedidoId);
  if (!pedido) {
    throw new PedidoError('NOT_FOUND');
  }
  if (pedido.facturado === 'S' || pedido.anulado === 'S') {
    throw new PedidoError('PEDIDO_FACTURADO');
  }
  // BR-RES-029: una mesa POR COBRAR no admite nuevos productos (el SP no lo valida).
  if (pedido.mesaId != null) {
    const mesa = await repoEstadoMesa(pedido.mesaId);
    if (mesa.descripcion === 'POR COBRAR') {
      throw new PedidoError('MESA_POR_COBRAR');
    }
  }
  await repoAgregar(pedidoId, input.producto, input.cantidad, input.nota ?? '', input.descuento ?? 0);
  // Asignar id_cliente al detalle recién creado (el SP no lo recibe)
  await asignarClienteDetalle(pedidoId, input.producto, clienteId);
  await repoRecalcular(pedidoId);
  await auditar(AUTOSERVICIO_USER_ID, 'AGREGAR_DETALLE_CLIENTE', pedidoId, `Producto ${input.producto} x${input.cantidad} (cliente ${clienteId})`);
  const updated = await repoObtener(pedidoId);
  if (!updated) {
    throw new PedidoError('NOT_FOUND');
  }
  return updated;
}

async function asignarClienteDetalle(pedidoId: number, productoId: number, clienteId: number): Promise<void> {
  // Actualizar el último detalle insertado para este producto en este pedido
  const { supabase } = await import('../config/supabase.js');
  const { data } = await supabase
    .from('detalle_pedido')
    .select('id_detallepedido')
    .eq('id_pedido', pedidoId)
    .eq('id_producto', productoId)
    .is('id_cliente', null)
    .order('f_solicitud', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data) {
    await supabase
      .from('detalle_pedido')
      .update({ id_cliente: clienteId })
      .eq('id_detallepedido', (data as { id_detallepedido: number }).id_detallepedido);
  }
}

export async function recalcularClienteService(pedidoId: number): Promise<Pedido> {
  const pedido = await repoObtener(pedidoId);
  if (!pedido) {
    throw new PedidoError('NOT_FOUND');
  }
  await repoRecalcular(pedidoId);
  const updated = await repoObtener(pedidoId);
  if (!updated) {
    throw new PedidoError('NOT_FOUND');
  }
  return updated;
}

export async function pedidosAbiertosPorMesaService(mesaId: number): Promise<Pedido[]> {
  return pedidosAbiertosPorMesa(mesaId);
}

export async function detalleClienteService(
  pedidoId: number,
  clienteId: number,
): Promise<PedidoClienteDetalle> {
  const pedido = await repoObtener(pedidoId);
  if (!pedido) {
    throw new PedidoError('NOT_FOUND');
  }
  await validarParticipacion(pedido, clienteId);
  return { ...pedido, estadoComandaDerivado: derivarEstadoComanda(pedido) };
}

export async function comandaActivaClienteService(
  mesaId: number,
): Promise<ComandaActivaCliente | null> {
  const abiertos = await pedidosAbiertosPorMesa(mesaId);
  const activo = abiertos[0];
  if (!activo) {
    return null;
  }
  const pedido = await repoObtener(activo.id);
  if (!pedido) {
    throw new PedidoError('NOT_FOUND');
  }
  const mesa = await repoEstadoMesa(mesaId);
  return {
    id: pedido.id,
    numero: pedido.numero,
    mesaId: pedido.mesaId ?? mesaId,
    estado: pedido.estado,
    estadoComandaDerivado: derivarEstadoComanda(pedido),
    total: pedido.total,
    cantidadDetalles: (pedido.detalles ?? []).filter((d) => d.estadoRegistro === 'A').length,
    mesaEstado: mesa.descripcion,
  };
}

export async function pedirCuentaClienteService(mesaId: number, clienteId: number): Promise<{
  ok: boolean;
  pedidoId: number;
  estado: string;
}> {
  const abiertos = await pedidosAbiertosPorMesa(mesaId);
  const activo = abiertos[0];
  if (!activo) {
    throw new PedidoError('NO_COMANDA_ACTIVA');
  }
  const pedido = await repoObtener(activo.id);
  if (!pedido) {
    throw new PedidoError('NOT_FOUND');
  }
  await validarParticipacion(pedido, clienteId);
  const mesa = await repoEstadoMesa(mesaId);
  if (mesa.descripcion === 'POR COBRAR') {
    throw new PedidoError('YA_POR_COBRAR');
  }
  const idPorCobrar = await idEstadoMesaPorNombre('POR COBRAR');
  if (idPorCobrar == null) {
    throw new Error('DB_CAT_FAIL: POR COBRAR sin id');
  }
  // BR-ACC-051/BR-RES-026: la cuenta es de toda la mesa; el pedido queda ABIERTO y el cobro es del cajero (BR-ACC-043).
  await pedirCuentaMesa(mesaId, idPorCobrar);
  await auditar(
    AUTOSERVICIO_USER_ID,
    'PEDIR_CUENTA',
    pedido.id,
    `Mesa ${mesaId} (cliente ${clienteId})`,
  );
  return { ok: true, pedidoId: pedido.id, estado: 'POR COBRAR' };
}