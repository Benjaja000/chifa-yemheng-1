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

export interface SeguimientoFiltros {
  estado?: 'P' | 'R' | 'E' | 'C';
  repartidorId?: number;
  page: number;
  limit: number;
}

export async function listarSeguimiento(f: SeguimientoFiltros): Promise<DeliveryLista> {
  const desde = (f.page - 1) * f.limit;
  const hasta = desde + f.limit - 1;

  let query = supabase
    .from('pedido_delivery')
    .select(SELECT, { count: 'exact' })
    .order('feccre', { ascending: false })
    .range(desde, hasta);

  if (f.estado) query = query.eq('situacion', f.estado);
  if (f.repartidorId) query = query.eq('id_empleado', f.repartidorId);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as DeliveryRow[]).map(mapRow),
    page: f.page,
    limit: f.limit,
    total: count ?? 0,
  };
}

export async function iniciarRutaStaff(id: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'R', f_salida: new Date().toISOString(), ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .select(SELECT)
    .maybeSingle();

  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function confirmarEntregaStaff(id: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'E', f_entrega: new Date().toISOString(), ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .select(SELECT)
    .maybeSingle();

  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function anularDelivery(id: number, motivo: string, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'C', descripcion: motivo, ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .eq('situacion', 'P')
    .select(SELECT)
    .maybeSingle();

  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function getUbicacionSeguimiento(id: number) {
  const { data, error } = await supabase
    .from('vw_delivery_ubicacion')
    .select('*')
    .eq('id_pedidodelivery', id)
    .maybeSingle();

  if (error) throw new Error(`UBICACION_GET_FAIL: ${error.message}`);
  return data;
}