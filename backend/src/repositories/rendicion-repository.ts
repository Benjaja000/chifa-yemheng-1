import { supabase } from '../config/supabase.js';

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

export async function listarPendientesRendicion(repartidorId: number): Promise<PendienteRendicionItem[]> {
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
      ),
      movimiento_caja:movimiento_caja!left(
        id_movimiento
      )
    `)
    .eq('id_empleado', repartidorId)
    .eq('situacion', 'E')
    .eq('pago_venta.metodo_pago', 'EFECTIVO')
    .is('movimiento_caja.id_movimiento', null);

  if (error) throw new Error(`PENDIENTES_RENDICION_FAIL: ${error.message}`);

  return (data ?? []).map((row: any) => ({
    idPedidoDelivery: row.id_pedidodelivery,
    pedidoId: row.id_pedido,
    cliente: row.pedido?.cliente?.persona
      ? `${row.pedido.cliente.persona.nombre} ${row.pedido.cliente.persona.ap_paterno ?? ''}`.trim()
      : 'Sin cliente',
    direccion: row.direccion_entrega,
    total: Number(row.pago_venta?.[0]?.monto ?? 0) + Number(row.costo_envio ?? 0),
    metodoPago: 'EFECTIVO',
    fechaEntrega: row.f_entrega,
    estadoRendicion: 'P',
  }));
}

export async function registrarRendicion(input: RendicionRegistrarInput, usucre: string, pc = ''): Promise<RendicionResultado> {
  const { data: pedidos, error: pedidosError } = await supabase
    .from('pedido_delivery')
    .select(`
      id_pedidodelivery,
      costo_envio,
      pago_venta:pago_venta!inner(monto)
    `)
    .in('id_pedidodelivery', input.pedidoIds)
    .eq('id_empleado', input.repartidorId)
    .eq('situacion', 'E')
    .eq('pago_venta.metodo_pago', 'EFECTIVO');

  if (pedidosError) throw new Error(`PEDIDOS_RENDICION_FAIL: ${pedidosError.message}`);

  const totalEsperado = (pedidos ?? []).reduce((sum, p: any) => sum + Number(p.pago_venta?.[0]?.monto ?? 0) + Number(p.costo_envio ?? 0), 0);
  const diferencia = input.montoEntregado - totalEsperado;
  const estado = diferencia === 0 ? 'Rendido' : 'Observado';

  const { data: caja, error: cajaError } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja')
    .eq('situacion', 'A')
    .order('feccre', { ascending: false })
    .limit(1)
    .single();

  if (cajaError || !caja) throw new Error('CAJA_NO_ABIERTA');

  const { data: movimiento, error: movError } = await supabase
    .from('movimiento_caja')
    .insert({
      id_aperturacaja: caja.id_aperturacaja,
      concepto: 'VENTA AL CONTADO',
      monto: input.montoEntregado,
      afecta_efectivo: true,
      descripcion: `Rendición delivery repartidor ${input.repartidorId} - ${input.pedidoIds.length} pedidos`,
      ...(await import('../utils/auditoria.js')).createAudit(usucre, pc),
    })
    .select('id_movimiento')
    .single();

  if (movError) throw new Error(`MOVIMIENTO_CAJA_FAIL: ${movError.message}`);

  const { error: updateError } = await supabase
    .from('pedido_delivery')
    .update({ fecmod: new Date().toISOString() })
    .in('id_pedidodelivery', input.pedidoIds);

  if (updateError) throw new Error(`UPDATE_PEDIDO_RENDICION_FAIL: ${updateError.message}`);

  return {
    id: movimiento.id_movimiento,
    estado,
    diferencia,
    totalEsperado,
  };
}

export async function validarRendicion(id: number, usumod: string, pc = ''): Promise<void> {
  const { error } = await supabase
    .from('movimiento_caja')
    .update({ ...(await import('../utils/auditoria.js')).updateAudit(usumod, pc) })
    .eq('id_movimiento', id);

  if (error) throw new Error(`VALIDAR_RENDICION_FAIL: ${error.message}`);
}

export async function observarRendicion(id: number, motivo: string, usumod: string, pc = ''): Promise<void> {
  const { error } = await supabase
    .from('movimiento_caja')
    .update({ descripcion: motivo, ...(await import('../utils/auditoria.js')).updateAudit(usumod, pc) })
    .eq('id_movimiento', id);

  if (error) throw new Error(`OBSERVAR_RENDICION_FAIL: ${error.message}`);
}

export async function getRendicionPdf(id: number) {
  const { data, error } = await supabase
    .from('movimiento_caja')
    .select(`
      id_movimiento,
      monto,
      concepto,
      descripcion,
      feccre,
      apertura_caja:apertura_caja!inner(
        id_aperturacaja,
        caja:caja!inner(nombre),
        empleado:empleado!inner(persona:persona!inner(nombre, ap_paterno))
      )
    `)
    .eq('id_movimiento', id)
    .single();

  if (error) throw new Error(`PDF_RENDICION_FAIL: ${error.message}`);
  return data;
}