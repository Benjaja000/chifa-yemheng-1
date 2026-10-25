import { supabase } from '../config/supabase.js';
import type { Delivery, DeliveryLista } from '../models/delivery.js';
import { updateAudit } from '../utils/auditoria.js';

interface DeliveryRow {
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

function mapRow(row: DeliveryRow): Delivery {
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

export async function listarMisEntregas(empleadoId: number, estado?: 'P' | 'R' | 'E' | 'C', page = 1, limit = 20): Promise<DeliveryLista> {
  const desde = (page - 1) * limit;
  const hasta = desde + limit - 1;

  let query = supabase
    .from('pedido_delivery')
    .select(SELECT, { count: 'exact' })
    .eq('id_empleado', empleadoId)
    .order('feccre', { ascending: false })
    .range(desde, hasta);

  if (estado) query = query.eq('situacion', estado);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as DeliveryRow[]).map(mapRow),
    page,
    limit,
    total: count ?? 0,
  };
}

export async function getMiEntregaDetalle(id: number, empleadoId: number): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(SELECT)
    .eq('id_pedidodelivery', id)
    .eq('id_empleado', empleadoId)
    .maybeSingle();

  if (error) throw new Error(`DB_GET_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function iniciarRutaRepartidor(id: number, empleadoId: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'R', f_salida: new Date().toISOString(), ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .eq('id_empleado', empleadoId)
    .select(SELECT)
    .maybeSingle();

  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function confirmarEntregaRepartidor(id: number, empleadoId: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'E', f_entrega: new Date().toISOString(), ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .eq('id_empleado', empleadoId)
    .select(SELECT)
    .maybeSingle();

  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function actualizarUbicacionRepartidor(id: number, lat: number, lng: number): Promise<void> {
  const { error } = await supabase.rpc('usp_actualizar_ubicacion_delivery', {
    p_id_pedido: (await supabase.from('pedido_delivery').select('id_pedido').eq('id_pedidodelivery', id).single()).data?.id_pedido,
    p_lat: lat,
    p_lng: lng,
    p_quien: 'REPARTIDOR',
  });
  if (error) throw new Error(`UBI_ACTUALIZAR_FAIL: ${error.message}`);
}

export interface PorRendirItem {
  idPedidoDelivery: number;
  pedidoId: number;
  cliente: string;
  direccion: string;
  total: number;
  fechaEntrega: string;
}

export async function getPorRendir(empleadoId: number): Promise<PorRendirItem[]> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(`
      id_pedidodelivery,
      id_pedido,
      direccion_entrega,
      costo_envio,
      f_entrega,
      pedido:pedido!inner(
        id_cliente,
        cliente:cliente!inner(
          persona:persona!inner(nombre, ap_paterno)
        )
      ),
      pago_venta:pago_venta!inner(
        metodo_pago,
        monto
      )
    `)
    .eq('id_empleado', empleadoId)
    .eq('situacion', 'E')
    .eq('pago_venta.metodo_pago', 'EFECTIVO');

  if (error) throw new Error(`POR_RENDIR_FAIL: ${error.message}`);

  return (data ?? []).map((row: any) => ({
    idPedidoDelivery: row.id_pedidodelivery,
    pedidoId: row.id_pedido,
    cliente: row.pedido?.cliente?.persona
      ? `${row.pedido.cliente.persona.nombre} ${row.pedido.cliente.persona.ap_paterno ?? ''}`.trim()
      : 'Sin cliente',
    direccion: row.direccion_entrega,
    total: Number(row.pago_venta?.[0]?.monto ?? 0) + Number(row.costo_envio ?? 0),
    fechaEntrega: row.f_entrega,
  }));
}