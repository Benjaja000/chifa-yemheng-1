import { supabase } from '../config/supabase.js';
import type { Delivery, DeliveryLista } from '../models/delivery.js';
import type { DeliveryCreate, DeliveryQuery } from '../schemas/delivery.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';

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

interface DistritoGPSRow {
  id_distrito: number;
  d_distrito: string;
  lat_ref: number | null;
  lng_ref: number | null;
  radio_km: number | null;
  costo_base: number | null;
  recargo_km: number | null;
}

const SELECT = 'id_pedidodelivery, id_pedido, id_distrito, distrito(d_distrito), direccion_entrega, referencia, telefono_contacto, id_empleado, repartidor:empleado(persona(nombre, ap_paterno)), costo_envio, situacion, feccre';

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

export async function listarDelivery(q: DeliveryQuery): Promise<DeliveryLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('pedido_delivery')
    .select(SELECT, { count: 'exact' })
    .order('feccre', { ascending: false })
    .order('id_pedidodelivery', { ascending: false })
    .range(desde, hasta);

  if (q.estado) query = query.eq('situacion', q.estado);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as DeliveryRow[]).map(mapRow),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function crearDelivery(input: DeliveryCreate, usucre: string, pc = ''): Promise<Delivery> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .insert({
      id_pedido: input.pedidoId,
      id_distrito: input.distritoId ?? null,
      direccion_entrega: input.direccion,
      referencia: input.referencia || null,
      telefono_contacto: input.telefono || null,
      costo_envio: input.costo,
      situacion: 'P',
      ...createAudit(usucre, pc),
    })
    .select(SELECT)
    .single();
  if (error) throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  return mapRow(data as unknown as DeliveryRow);
}

export async function asignarRepartidor(id: number, repartidorId: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ id_empleado: repartidorId, situacion: 'R', ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .select(SELECT)
    .maybeSingle();
  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function despacharDelivery(id: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'E', f_salida: new Date().toISOString(), ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .select(SELECT)
    .maybeSingle();
  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export async function entregarDelivery(id: number, usumod: string, pc = ''): Promise<Delivery | null> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .update({ situacion: 'C', f_entrega: new Date().toISOString(), ...updateAudit(usumod, pc) })
    .eq('id_pedidodelivery', id)
    .select(SELECT)
    .maybeSingle();
  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapRow(data as unknown as DeliveryRow);
}

export interface SugerirCostoResult {
  distanciaKm: number | null;
  fueraRadio: boolean;
  costoSugerido: number;
}

export async function sugerirCosto(lat: number | null, lng: number | null, distritoId: number): Promise<SugerirCostoResult> {
  const { data: distrito, error } = await supabase
    .from('distrito')
    .select('id_distrito, d_distrito, lat_ref, lng_ref, radio_km, costo_base, recargo_km')
    .eq('id_distrito', distritoId)
    .single();

  if (error) throw new Error(`DB_DISTRITO_FAIL: ${error.message}`);
  if (!distrito) throw new Error('DISTRITO_NOT_FOUND');

  const d = distrito as unknown as DistritoGPSRow;

  // Sin GPS (BR-GPS-001) o sin centroide del distrito: sugerir solo costo_base.
  if (lat === null || lng === null || d.lat_ref === null || d.lng_ref === null) {
    return {
      distanciaKm: null,
      fueraRadio: false,
      costoSugerido: Number(d.costo_base ?? 0),
    };
  }

  const { data: distancia, error: distError } = await supabase.rpc('haversine_km', {
    lat1: lat,
    lng1: lng,
    lat2: d.lat_ref,
    lng2: d.lng_ref,
  });

  if (distError) throw new Error(`HAVERSINE_FAIL: ${distError.message}`);

  const distanciaKm = Number(distancia ?? 0);
  const radioKm = Number(d.radio_km ?? 0);
  const costoBase = Number(d.costo_base ?? 0);
  // Recargo por km fuera de radio: dato de negocio (distrito.recargo_km), nunca constante (BR-GPS-002).
  const recargoKm = Number(d.recargo_km ?? 0);

  let costoSugerido = costoBase;
  let fueraRadio = false;

  if (distanciaKm > radioKm) {
    fueraRadio = true;
    costoSugerido += (distanciaKm - radioKm) * recargoKm;
  }

  return {
    distanciaKm: Number(distanciaKm.toFixed(2)),
    fueraRadio,
    costoSugerido: Number(costoSugerido.toFixed(2)),
  };
}
