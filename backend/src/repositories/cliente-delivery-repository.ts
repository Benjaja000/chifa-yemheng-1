import { supabase } from '../config/supabase.js';
import type { Delivery } from '../models/delivery.js';
import { createAudit } from '../utils/auditoria.js';

interface PedidoDeliveryRow {
  id_pedidodelivery: number;
  id_pedido: number;
  id_distrito: number | null;
  distrito: { d_distrito: string } | null;
  direccion_entrega: string;
  referencia: string | null;
  telefono_contacto: string | null;
  id_empleado: number | null;
  repartidor: { persona: { nombre: string; ap_paterno: string | null } } | null;
  costo_envio: number;
  situacion: string;
  feccre: string;
  lat_cliente: number | null;
  lng_cliente: number | null;
  lat_repartidor: number | null;
  lng_repartidor: number | null;
  f_ubicacion: string | null;
}

const SELECT = 'id_pedidodelivery, id_pedido, id_distrito, distrito(d_distrito), direccion_entrega, referencia, telefono_contacto, id_empleado, repartidor:empleado(persona(nombre, ap_paterno)), costo_envio, situacion, feccre, lat_cliente, lng_cliente, lat_repartidor, lng_repartidor, f_ubicacion';

function mapRow(row: PedidoDeliveryRow): Delivery {
  return {
    id: row.id_pedidodelivery,
    pedidoId: row.id_pedido,
    distritoId: row.id_distrito,
    distrito: row.distrito?.d_distrito ?? null,
    direccion: row.direccion_entrega,
    referencia: row.referencia,
    telefono: row.telefono_contacto,
    repartidorId: row.id_empleado,
    repartidor: row.repartidor?.persona
      ? `${row.repartidor.persona.nombre} ${row.repartidor.persona.ap_paterno ?? ''}`.trim()
      : null,
    costo: Number(row.costo_envio ?? 0),
    estado: (row.situacion ?? 'P') as Delivery['estado'],
    fechaCreacion: row.feccre,
  };
}

export interface ClienteDeliveryCreateInput {
  clienteId: number;
  items: Array<{ productoId: number; cantidad: number; nota?: string; descuento?: number }>;
  direccion: string;
  distritoId: number;
  referencia?: string;
  telefono?: string;
  costoEnvio: number;
  latCliente?: number;
  lngCliente?: number;
  metodoDigital: 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';
}

export async function crearDeliveryCliente(input: ClienteDeliveryCreateInput, usucre: string, pc = ''): Promise<Delivery> {
  const { data: pedido, error: pedidoError } = await supabase.rpc('usp_abrir_pedido', {
    p_id_tipo_pedido: 3, // DELIVERY
    p_id_cliente: input.clienteId,
    p_id_mesa: null,
    p_comensales: 1,
    p_observacion: `Delivery: ${input.direccion}`,
    p_usucre: usucre,
    p_pc: pc,
  });

  if (pedidoError) throw new Error(`PEDIDO_CREATE_FAIL: ${pedidoError.message}`);
  const pedidoId = Number(pedido?.[0]?.id_pedido ?? 0);
  if (!pedidoId) throw new Error('PEDIDO_ID_NOT_RETURNED');

  for (const item of input.items) {
    const { error: detError } = await supabase.rpc('usp_agregar_detalle_pedido', {
      p_id_pedido: pedidoId,
      p_id_producto: item.productoId,
      p_cantidad: item.cantidad,
      p_nota: item.nota ?? null,
      p_descuento: item.descuento ?? 0,
      p_usucre: usucre,
      p_pc: pc,
    });
    if (detError) throw new Error(`DETALLE_CREATE_FAIL: ${detError.message}`);
  }

  const { data: delivery, error: delError } = await supabase
    .from('pedido_delivery')
    .insert({
      id_pedido: pedidoId,
      id_distrito: input.distritoId,
      direccion_entrega: input.direccion,
      referencia: input.referencia || null,
      telefono_contacto: input.telefono || null,
      costo_envio: input.costoEnvio,
      lat_cliente: input.latCliente ?? null,
      lng_cliente: input.lngCliente ?? null,
      situacion: 'P',
      ...createAudit(usucre, pc),
    })
    .select(SELECT)
    .single();

  if (delError) throw new Error(`DELIVERY_CREATE_FAIL: ${delError.message}`);
  return mapRow(delivery as unknown as PedidoDeliveryRow);
}

export async function getDeliveryDetalle(id: number, clienteId: number): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(SELECT)
    .eq('id_pedidodelivery', id)
    .eq('pedido.id_cliente', clienteId)
    .maybeSingle();

  if (error) throw new Error(`DB_GET_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as PedidoDeliveryRow);
}

export async function getDeliveryUbicacion(id: number, _clienteId: number) {
  const { data, error } = await supabase
    .from('vw_delivery_ubicacion')
    .select('*')
    .eq('id_pedidodelivery', id)
    .eq('id_pedido', (await supabase.from('pedido_delivery').select('id_pedido').eq('id_pedidodelivery', id).single()).data?.id_pedido)
    .maybeSingle();

  if (error) throw new Error(`UBICACION_GET_FAIL: ${error.message}`);
  return data;
}