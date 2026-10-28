import { supabase } from '../config/supabase.js';
import { DeliveryError, type Delivery } from '../models/delivery.js';

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
  costo_envio_confirmado: boolean;
  situacion: string;
  feccre: string;
  lat_cliente: number | null;
  lng_cliente: number | null;
  lat_repartidor: number | null;
  lng_repartidor: number | null;
  f_ubicacion: string | null;
}

const SELECT = 'id_pedidodelivery, id_pedido, id_distrito, distrito(d_distrito), direccion_entrega, referencia, telefono_contacto, id_empleado, repartidor:empleado(persona(nombre, ap_paterno)), costo_envio, costo_envio_confirmado, situacion, feccre, lat_cliente, lng_cliente, lat_repartidor, lng_repartidor, f_ubicacion';

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
    costoConfirmado: row.costo_envio_confirmado ?? true,
    estado: (row.situacion ?? 'P') as Delivery['estado'],
    fechaCreacion: row.feccre,
  };
}

export interface ClienteDeliveryCreateInput {
  clienteId: number;
  items: Array<{ productoId: number; cantidad: number; nota?: string }>;
  direccion: string;
  distritoId: number;
  referencia?: string;
  telefono?: string;
  costoEnvio: number;
  latCliente?: number;
  lngCliente?: number;
}

export interface ClienteDeliveryCreado {
  id: number;
  estado: Delivery['estado'];
  costo: number;
  costoConfirmado: boolean;
}

export async function crearDeliveryCliente(
  input: ClienteDeliveryCreateInput,
  pc: string,
  usuarioId: number,
): Promise<ClienteDeliveryCreado> {
  const { data, error } = await supabase.rpc('fn_crear_delivery_cliente', {
    p_cliente: input.clienteId,
    p_usuario: usuarioId,
    p_distrito: input.distritoId,
    p_direccion: input.direccion,
    p_referencia: input.referencia ?? null,
    p_telefono: input.telefono ?? null,
    p_costo_envio: input.costoEnvio,
    p_lat_cliente: input.latCliente ?? null,
    p_lng_cliente: input.lngCliente ?? null,
    p_items: input.items.map(({ productoId, cantidad, nota }) => ({ productoId, cantidad, nota })),
    p_pc: pc,
  });

  if (error) {
    if (error.message.includes('CLIENTE_NOT_FOUND')) throw new DeliveryError('CLIENTE_NOT_FOUND');
    if (error.message.includes('DISTRITO_NOT_FOUND')) throw new DeliveryError('DISTRITO_NOT_FOUND');
    if (error.message.includes('AUTOSERVICIO_USER_NOT_READY')) throw new DeliveryError('AUTOSERVICIO_USER_NOT_READY');
    if (error.message.includes('Producto no disponible.')) throw new DeliveryError('PRODUCTO_NO_DISPONIBLE');
    if (error.message.includes('DELIVERY_VALIDATION_ERROR') || error.message.includes('DELIVERY_ITEMS_INVALID')) {
      throw new DeliveryError('VALIDATION_ERROR');
    }
    throw new Error(`DELIVERY_CREATE_FAIL: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') throw new Error('DELIVERY_CREATE_FAIL: DELIVERY_ID_NOT_RETURNED');
  const created = row as { id_pedidodelivery?: number; situacion?: string; costo_envio?: number };
  if (!created.id_pedidodelivery) throw new Error('DELIVERY_CREATE_FAIL: DELIVERY_ID_NOT_RETURNED');

  return {
    id: Number(created.id_pedidodelivery),
    estado: (created.situacion ?? 'P') as Delivery['estado'],
    costo: Number(created.costo_envio ?? 0),
    costoConfirmado: false,
  };
}

async function getPedidoDeliveryCliente(id: number, clienteId: number): Promise<number | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select('id_pedido, pedido!inner(id_cliente)')
    .eq('id_pedidodelivery', id)
    .eq('pedido.id_cliente', clienteId)
    .maybeSingle();

  if (error) throw new Error(`DB_GET_FAIL: ${error.message}`);
  if (!data) return null;
  return Number((data as unknown as { id_pedido: number }).id_pedido);
}

export async function getDeliveryDetalle(id: number, clienteId: number): Promise<Delivery | null> {
  const pedidoId = await getPedidoDeliveryCliente(id, clienteId);
  if (pedidoId === null) return null;

  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(SELECT)
    .eq('id_pedidodelivery', id)
    .eq('id_pedido', pedidoId)
    .maybeSingle();

  if (error) throw new Error(`DB_GET_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as PedidoDeliveryRow);
}

export async function getDeliveryActivoCliente(clienteId: number): Promise<number | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select('id_pedidodelivery, pedido!inner(id_cliente)')
    .eq('pedido.id_cliente', clienteId)
    .eq('estado', 'A')
    .in('situacion', ['P', 'R'])
    .order('id_pedidodelivery', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return data ? Number((data as unknown as { id_pedidodelivery: number }).id_pedidodelivery) : null;
}

export async function getDeliveryUbicacion(id: number, clienteId: number) {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(`
      id_pedidodelivery,
      id_pedido,
      id_distrito,
      distrito:distrito(d_distrito),
      direccion_entrega,
      costo_envio,
      costo_envio_confirmado,
      situacion,
      f_salida,
      f_entrega,
      lat_cliente,
      lng_cliente,
      lat_repartidor,
      lng_repartidor,
      f_ubicacion,
      id_empleado,
      repartidor:empleado(persona:persona(nombre, ap_paterno)),
      pedido:pedido!inner(id_cliente)
    `)
    .eq('id_pedidodelivery', id)
    .eq('pedido.id_cliente', clienteId)
    .eq('estado', 'A')
    .maybeSingle();

  if (error) throw new Error(`UBICACION_GET_FAIL: ${error.message}`);
  if (!data) return null;
  const row = data as unknown as {
    id_pedidodelivery: number;
    id_pedido: number;
    id_distrito: number | null;
    distrito: { d_distrito: string } | null;
    direccion_entrega: string;
    costo_envio: number;
    costo_envio_confirmado: boolean;
    situacion: string;
    f_salida: string | null;
    f_entrega: string | null;
    lat_cliente: number | null;
    lng_cliente: number | null;
    lat_repartidor: number | null;
    lng_repartidor: number | null;
    f_ubicacion: string | null;
    id_empleado: number | null;
    repartidor: { persona: { nombre: string; ap_paterno: string | null } | null } | null;
  };
  return {
    id_pedidodelivery: row.id_pedidodelivery,
    id_pedido: row.id_pedido,
    id_distrito: row.id_distrito,
    distrito: row.distrito?.d_distrito ?? null,
    direccion_entrega: row.direccion_entrega,
    costo_envio: Number(row.costo_envio ?? 0),
    costo_envio_confirmado: row.costo_envio_confirmado,
    situacion: row.situacion,
    f_salida: row.f_salida,
    f_entrega: row.f_entrega,
    lat_cliente: row.lat_cliente,
    lng_cliente: row.lng_cliente,
    lat_repartidor: row.lat_repartidor,
    lng_repartidor: row.lng_repartidor,
    f_ubicacion: row.f_ubicacion,
    id_repartidor: row.id_empleado,
    repartidor: row.repartidor?.persona
      ? `${row.repartidor.persona.nombre} ${row.repartidor.persona.ap_paterno ?? ''}`.trim()
      : null,
  };
}