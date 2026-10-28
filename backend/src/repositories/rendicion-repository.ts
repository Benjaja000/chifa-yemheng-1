import { supabase } from '../config/supabase.js';
import { updateAudit } from '../utils/auditoria.js';

export interface PendienteRendicionItem {
  idPedidoDelivery: number;
  pedidoId: number;
  cliente: string;
  direccion: string;
  total: number;
  metodoPago: string;
  fechaEntrega: string;
  estadoRendicion: 'P';
}

export interface RendicionRegistrarInput {
  repartidorId: number;
  pedidoIds: number[];
  montoEntregado: number;
  observaciones?: string;
}

export interface RendicionResultado {
  id: number;
  estado: 'Rendido' | 'Observado';
  diferencia: number;
  totalEsperado: number;
}

/**
 * Embed único del pedido delivery: cliente + venta + pago (con método de pago).
 * El pago efectivo se discrimina por metodo_pago.afecta_efectivo = 'S'
 * (BR-INF-051: los pagos digitales no entran a la rendición física).
 */
const PEDIDO_EMBED = `
  id_pedidodelivery,
  id_pedido,
  direccion_entrega,
  costo_envio,
  f_entrega,
  pedido:pedido!inner(
    id_cliente,
    cliente:cliente!fk_pedido_cliente!inner(
      persona:persona!inner(nombre, ap_paterno)
    ),
    venta:venta!inner(
      id_venta,
      pago_venta:pago_venta!inner(
        monto,
        metodo_pago:metodo_pago!inner(n_metodopago, afecta_efectivo)
      )
    )
  )
`;

function totalPedido(row: any): number {
  const pago = Number(row.pedido?.venta?.[0]?.pago_venta?.[0]?.monto ?? 0);
  return pago + Number(row.costo_envio ?? 0);
}

function nombreCliente(row: any): string {
  const persona = row.pedido?.cliente?.persona;
  return persona ? `${persona.nombre} ${persona.ap_paterno ?? ''}`.trim() : 'Sin cliente';
}

/** Pedidos ya rendidos (VU-DEL-005: un pedido solo puede rendirse una vez). */
async function idsPedidosRendidos(pedidoIds: number[]): Promise<Set<number>> {
  if (pedidoIds.length === 0) return new Set();
  const { data, error } = await supabase
    .from('movimiento_caja')
    .select('id_pedido')
    .in('id_pedido', pedidoIds)
    .eq('estado', 'A');

  if (error) throw new Error(`RENDIDOS_FAIL: ${error.message}`);
  return new Set((data ?? []).map((r: any) => Number(r.id_pedido)));
}

/** IDs de catálogo necesarios para registrar el movimiento (nunca literales de negocio). */
async function idsCatalogoCaja(): Promise<{ idConcepto: number; idMetodo: number }> {
  const { data: concepto, error: conceptoError } = await supabase
    .from('concepto_caja')
    .select('id_concepto')
    .eq('n_concepto', 'VENTA AL CONTADO')
    .eq('estado', 'A')
    .single();
  if (conceptoError || !concepto) throw new Error('CONCEPTO_CAJA_NO_DISPONIBLE');

  const { data: metodo, error: metodoError } = await supabase
    .from('metodo_pago')
    .select('id_metodopago')
    .eq('afecta_efectivo', 'S')
    .eq('estado', 'A')
    .order('id_metodopago', { ascending: true })
    .limit(1)
    .single();
  if (metodoError || !metodo) throw new Error('METODO_PAGO_EFECTIVO_NO_DISPONIBLE');

  return { idConcepto: concepto.id_concepto, idMetodo: metodo.id_metodopago };
}

export async function listarPendientesRendicion(repartidorId: number): Promise<PendienteRendicionItem[]> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(PEDIDO_EMBED)
    .eq('id_empleado', repartidorId)
    .eq('situacion', 'E')
    .eq('pedido.venta.pago_venta.metodo_pago.afecta_efectivo', 'S');

  if (error) throw new Error(`PENDIENTES_RENDICION_FAIL: ${error.message}`);

  const filas = (data ?? []) as any[];
  const rendidos = await idsPedidosRendidos(filas.map((r) => Number(r.id_pedido)));

  return filas
    .filter((row) => !rendidos.has(Number(row.id_pedido)))
    .map((row) => ({
      idPedidoDelivery: row.id_pedidodelivery,
      pedidoId: row.id_pedido,
      cliente: nombreCliente(row),
      direccion: row.direccion_entrega,
      total: totalPedido(row),
      metodoPago: row.pedido?.venta?.[0]?.pago_venta?.[0]?.metodo_pago?.n_metodopago ?? '',
      fechaEntrega: row.f_entrega,
      estadoRendicion: 'P' as const,
    }));
}

export async function registrarRendicion(
  input: RendicionRegistrarInput,
  usuarioId: number,
): Promise<RendicionResultado> {
  const { data, error } = await supabase
    .from('pedido_delivery')
    .select(PEDIDO_EMBED)
    .in('id_pedido', input.pedidoIds)
    .eq('id_empleado', input.repartidorId)
    .eq('situacion', 'E')
    .eq('pedido.venta.pago_venta.metodo_pago.afecta_efectivo', 'S');

  if (error) throw new Error(`PEDIDOS_RENDICION_FAIL: ${error.message}`);

  const filas = (data ?? []) as any[];
  if (filas.length !== input.pedidoIds.length) throw new Error('PEDIDO_NO_VALIDO');

  const rendidos = await idsPedidosRendidos(input.pedidoIds);
  if (rendidos.size > 0) throw new Error('PEDIDO_YA_RENDIDO');

  const totalEsperado = filas.reduce((sum, row) => sum + totalPedido(row), 0);
  const diferencia = input.montoEntregado - totalEsperado;
  const estado: RendicionResultado['estado'] = diferencia === 0 ? 'Rendido' : 'Observado';

  if (diferencia !== 0 && !input.observaciones?.trim()) throw new Error('OBSERVACION_REQUERIDA');

  const { data: caja, error: cajaError } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja')
    .eq('situacion', 'A')
    .order('feccre', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cajaError || !caja) throw new Error('CAJA_NO_ABIERTA');

  const { idConcepto, idMetodo } = await idsCatalogoCaja();
  const lote = `Rendición delivery repartidor ${input.repartidorId} (${input.pedidoIds.length} pedidos)`;

  let primerMovimiento = 0;
  for (const row of filas) {
    const { data: mov, error: movError } = await supabase.rpc('fn_registrar_movimiento_caja', {
      p_id_apertura: caja.id_aperturacaja,
      p_id_concepto: idConcepto,
      p_id_metodo: idMetodo,
      p_id_usuario: usuarioId,
      p_monto: totalPedido(row),
      p_descripcion: `${lote} · pedido ${row.id_pedido}`,
      p_id_pedido: row.id_pedido,
      p_id_venta: row.pedido?.venta?.[0]?.id_venta ?? null,
      p_numero_op: null,
    });

    if (movError) throw new Error(`MOVIMIENTO_CAJA_FAIL: ${movError.message}`);

    const idMov = Number((mov as any[])?.[0]?.id_movimientocaja ?? 0);
    if (primerMovimiento === 0) primerMovimiento = idMov;

    if (input.observaciones) {
      const { error: obsError } = await supabase
        .from('movimiento_caja')
        .update({ documento: input.observaciones.slice(0, 200) })
        .eq('id_movimientocaja', idMov);
      if (obsError) throw new Error(`OBSERVACION_MOVIMIENTO_FAIL: ${obsError.message}`);
    }
  }

  return { id: primerMovimiento, estado, diferencia, totalEsperado };
}

export async function validarRendicion(id: number, usumod: string, pc = ''): Promise<void> {
  const { error } = await supabase
    .from('movimiento_caja')
    .update({ ...updateAudit(usumod, pc) })
    .eq('id_movimientocaja', id);

  if (error) throw new Error(`VALIDAR_RENDICION_FAIL: ${error.message}`);
}

export async function observarRendicion(id: number, motivo: string, usumod: string, pc = ''): Promise<void> {
  const { error } = await supabase
    .from('movimiento_caja')
    .update({ documento: motivo.slice(0, 200), ...updateAudit(usumod, pc) })
    .eq('id_movimientocaja', id);

  if (error) throw new Error(`OBSERVAR_RENDICION_FAIL: ${error.message}`);
}

export async function getRendicionPdf(id: number) {
  const { data, error } = await supabase
    .from('movimiento_caja')
    .select(`
      id_movimientocaja,
      monto,
      documento,
      descripcion,
      f_movimiento,
      feccre,
      id_pedido,
      id_venta,
      concepto:concepto_caja!inner(n_concepto),
      pedido:pedido(
        cliente:cliente(
          persona:persona(nombre, ap_paterno)
        )
      )
    `)
    .eq('id_movimientocaja', id)
    .single();

  if (error) throw new Error(`PDF_RENDICION_FAIL: ${error.message}`);
  return data;
}
