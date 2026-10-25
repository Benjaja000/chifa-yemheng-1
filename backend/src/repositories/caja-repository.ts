import { supabase } from '../config/supabase.js';

export interface Caja {
  id: number;
  nombre: string;
  aperturada: 'S' | 'N';
  montoBase: number;
  estadoRegistro: 'A' | 'I';
}

export interface MetodoPago {
  id: number;
  nombre: string;
  afectaEfectivo: boolean;
  estadoRegistro: 'A' | 'I';
}

export interface TurnoCaja {
  id: number;
  cajaId: number;
  situacion: 'A' | 'C';
}

export interface CajaResponse {
  cajas: Caja[];
  metodosPago: MetodoPago[];
}

export async function listarCajas(): Promise<Caja[]> {
  const { data, error } = await supabase
    .from('caja')
    .select('id_caja, n_caja, aperturada, monto_base, estado')
    .eq('estado', 'A')
    .order('n_caja', { ascending: true })
    .order('id_caja', { ascending: false });
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
    id: Number(r['id_caja']),
    nombre: String(r['n_caja'] ?? ''),
    aperturada: (r['aperturada'] === 'S' ? 'S' : 'N') as 'S' | 'N',
    montoBase: Number(r['monto_base'] ?? 0),
    estadoRegistro: (r['estado'] === 'I' ? 'I' : 'A') as 'A' | 'I',
  }));
}

export async function listarMetodosPago(): Promise<MetodoPago[]> {
  const { data, error } = await supabase
    .from('metodo_pago')
    .select('id_metodopago, n_metodopago, afecta_efectivo, estado')
    .eq('estado', 'A')
    .order('n_metodopago', { ascending: true })
    .order('id_metodopago', { ascending: false });
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
    id: Number(r['id_metodopago']),
    nombre: String(r['n_metodopago'] ?? ''),
    afectaEfectivo: String(r['afecta_efectivo'] ?? 'N') === 'S',
    estadoRegistro: (r['estado'] === 'I' ? 'I' : 'A') as 'A' | 'I',
  }));
}

/** Turno de caja (apertura_caja) activo del usuario en la caja indicada. */
export async function turnoActivo(cajaId: number, usuarioId: number): Promise<TurnoCaja | null> {
  const { data, error } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja, id_caja, situacion')
    .eq('id_caja', cajaId)
    .eq('id_usuario', usuarioId)
    .eq('situacion', 'A')
    .order('f_apertura', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as Record<string, unknown>;
  return {
    id: Number(row['id_aperturacaja']),
    cajaId: Number(row['id_caja']),
    situacion: (row['situacion'] === 'C' ? 'C' : 'A') as 'A' | 'C',
  };
}

/** Cualquier turno activo de la caja (independiente del usuario), para cobro. */
export async function turnoAbiertoDeCaja(cajaId: number): Promise<TurnoCaja | null> {
  const { data, error } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja, id_caja, situacion')
    .eq('id_caja', cajaId)
    .eq('situacion', 'A')
    .order('f_apertura', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as Record<string, unknown>;
  return {
    id: Number(row['id_aperturacaja']),
    cajaId: Number(row['id_caja']),
    situacion: 'A',
  };
}

export async function abrirCaja(args: {
  cajaId: number;
  usuarioId: number;
  montoInicial: number;
  numeroTurno: string;
}): Promise<{ id: number; mensaje: string }> {
  const { data: existente, error: errExist } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja')
    .eq('id_caja', args.cajaId)
    .eq('situacion', 'A')
    .limit(1)
    .maybeSingle();
  if (errExist) {
    throw new Error(`DB_GET_FAIL: ${errExist.message}`);
  }
  if (existente) {
    throw new Error('CAJA_YA_ABIERTA');
  }

  const { data, error } = await supabase
    .from('apertura_caja')
    .insert({
      id_caja: args.cajaId,
      id_usuario: args.usuarioId,
      numero_turno: args.numeroTurno,
      monto_inicial: args.montoInicial,
      monto_sistema: args.montoInicial,
      situacion: 'A',
      estado: 'A',
    })
    .select('id_aperturacaja')
    .single();
  if (error) {
    throw new Error(`DB_APERTURA_FAIL: ${error.message}`);
  }
  await supabase.from('caja').update({ aperturada: 'S' }).eq('id_caja', args.cajaId);
  const row = data as { id_aperturacaja: number };
  return { id: Number(row.id_aperturacaja), mensaje: 'Caja aperturada correctamente' };
}

function codigoConcepto(metodo: MetodoPago): number {
  if (metodo.afectaEfectivo) {
    return 1;
  }
  if (['YAPE', 'PLIN'].includes(metodo.nombre.toUpperCase())) {
    return 3;
  }
  return 2;
}

export async function cobrar(args: {
  pedidoId: number;
  usuarioId: number;
  aperturaId: number;
  tipoDocumento: string;
  clienteId: number | null;
  metodoPagoId: number;
  montoRecibido: number | null;
  referencia: string;
}): Promise<{ idVenta: number; serie: string; numero: string; total: number; vuelto: number }> {
  const { data: pedidoExistente, error: errPedExist } = await supabase
    .from('pedido')
    .select('id_pedido, facturado, anulado')
    .eq('id_pedido', args.pedidoId)
    .maybeSingle();
  if (errPedExist) {
    throw new Error(`DB_GET_FAIL: ${errPedExist.message}`);
  }
  if (!pedidoExistente) {
    throw new Error('PEDIDO_NOT_FOUND');
  }
  if (pedidoExistente.facturado === 'S') {
    throw new Error('PEDIDO_FACTURADO');
  }
  if (pedidoExistente.anulado === 'S') {
    throw new Error('PEDIDO_ANULADO');
  }

  const { data: ape, error: errApe } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja')
    .eq('id_aperturacaja', args.aperturaId)
    .eq('situacion', 'A')
    .maybeSingle();
  if (errApe) {
    throw new Error(`DB_GET_FAIL: ${errApe.message}`);
  }
  if (!ape) {
    throw new Error('NO_CAJA_ABIERTA');
  }

  // Recalcular pedido antes de facturar (BR-EST-006).
  const { error: errRecalc } = await supabase.rpc('fn_recalcular_pedido', {
    p_id: args.pedidoId,
  });
  if (errRecalc) {
    throw new Error(`DB_RECALC_FAIL: ${errRecalc.message}`);
  }

  // Leer pedido ya recalculado.
  const { data: pedido, error: errPed2 } = await supabase
    .from('pedido')
    .select('id_pedido, id_mesa, id_cliente, subtotal, descuento, servicio, igv, total, facturado, anulado')
    .eq('id_pedido', args.pedidoId)
    .maybeSingle();
  if (errPed2) {
    throw new Error(`DB_GET_FAIL: ${errPed2.message}`);
  }
  if (!pedido) {
    throw new Error('PEDIDO_NOT_FOUND');
  }
  if (pedido.facturado === 'S') {
    throw new Error('PEDIDO_FACTURADO');
  }
  if (pedido.anulado === 'S') {
    throw new Error('PEDIDO_ANULADO');
  }

  const metodo = (await listarMetodosPago()).find((m) => m.id === args.metodoPagoId);
  const total = Number(pedido.total ?? 0);
  if (total <= 0) {
    throw new Error('TOTAL_CERO');
  }
  const recibido = args.montoRecibido ?? total;
  const vuelto = recibido > total ? recibido - total : 0;

  let idEmpresa: number | null = null;
  let clienteDocumento: string | null = null;
  let clienteNombre: string | null = null;
  if (args.tipoDocumento === '01') {
    if (!args.clienteId) {
      throw new Error('FACTURA_CLIENTE_REQUERIDO');
    }
    const { data: cli, error: errCli } = await supabase
      .from('cliente')
      .select('id_empresa, empresa(ruc)')
      .eq('id_cliente', args.clienteId)
      .maybeSingle();
    if (errCli) {
      throw new Error(`DB_GET_FAIL: ${errCli.message}`);
    }
    if (!cli) {
      throw new Error('FACTURA_CLIENTE_REQUERIDO');
    }
    const c = cli as Record<string, unknown>;
    idEmpresa = Number(c['id_empresa'] ?? null);
    if (!idEmpresa) {
      throw new Error('FACTURA_CLIENTE_REQUERIDO');
    }
    // BR-RES-016: la FACTURA (01) solo se emite a clientes asociados a una EMPRESA con RUC válido (11 dígitos).
    const ruc = String((c['empresa'] as Record<string, unknown> | null)?.['ruc'] ?? '');
    if (!/^\d{11}$/.test(ruc)) {
      throw new Error('RUC_INVALIDO');
    }
  } else if (args.tipoDocumento === '03' && args.clienteId) {
    // Boleta: poblar cliente_documento y cliente_nombre.
    const { data: cli, error: errCli } = await supabase
      .from('cliente')
      .select('n_documento, persona(nombre, ap_paterno, ap_materno)')
      .eq('id_cliente', args.clienteId)
      .maybeSingle();
    if (errCli) {
      throw new Error(`DB_GET_FAIL: ${errCli.message}`);
    }
    if (cli) {
      const c = cli as Record<string, unknown>;
      clienteDocumento = String(c['n_documento'] ?? '');
      const pe = c['persona'] as Record<string, unknown> | null;
      const partes = [
        String(pe?.['nombre'] ?? ''),
        String(pe?.['ap_paterno'] ?? ''),
        String(pe?.['ap_materno'] ?? ''),
      ].filter((p) => p);
      clienteNombre = partes.length > 0 ? partes.join(' ') : null;
    }
  }

  const { data: venta, error: errVen } = await supabase
    .from('venta')
    .insert({
      id_pedido: args.pedidoId,
      id_cliente: args.clienteId,
      id_usuario: args.usuarioId,
      id_aperturacaja: args.aperturaId,
      tipodocumento: args.tipoDocumento,
      subtotal: Number(pedido.subtotal ?? 0),
      descuento: Number(pedido.descuento ?? 0),
      servicio: Number(pedido.servicio ?? 0),
      igv: Number(pedido.igv ?? 0),
      total,
      total_pagado: total,
      vuelto,
    })
    .select('id_venta')
    .single();
  if (errVen) {
    throw new Error(`DB_COBRO_FAIL: ${errVen.message}`);
  }
  const idVenta = Number((venta as { id_venta: number }).id_venta);

  const { data: detalles, error: errDet } = await supabase
    .from('detalle_pedido')
    .select('id_producto, cantidad, precio_unitario, descuento')
    .eq('id_pedido', args.pedidoId)
    .neq('estado_preparacion', 'A')
    .eq('estado', 'A')
    .eq('es_cortesia', 'N');
  if (errDet) {
    throw new Error(`DB_GET_FAIL: ${errDet.message}`);
  }
  if (detalles && detalles.length > 0) {
    const { error: errDetIns } = await supabase.from('detalle_venta').insert(
      (detalles as unknown[]).map((d) => {
        const x = d as Record<string, unknown>;
        return {
          id_venta: idVenta,
          id_producto: x['id_producto'],
          cantidad: x['cantidad'],
          precio: x['precio_unitario'],
          descuento: x['descuento'],
        };
      }),
    );
    if (errDetIns) {
      throw new Error(`DB_COBRO_FAIL: ${errDetIns.message}`);
    }
  }

  // Correlativo atómico vía función Postgres con FOR UPDATE.
  let serie: string | null = null;
  let numero: string | null = null;
  try {
    const { data: serieResult, error: errSerie } = await supabase.rpc(
      'fn_incrementar_correlativo_serie',
      { p_tipodoc: args.tipoDocumento },
    );
    if (errSerie) throw errSerie;
    const serieRows = (serieResult as unknown[]) ?? [];
    if (serieRows.length > 0) {
      const firstRow = serieRows[0] as Record<string, unknown>;
      serie = String(firstRow['serie'] ?? '');
      numero = String(firstRow['numero'] ?? '');
    }
  } catch {
    // Fallback: leer + actualizar (menos atómico, pero funcional si la función no existe).
    const { data: serieRow, error: errSerieRow } = await supabase
      .from('serie_documento')
      .select('id_serie, serie, correlativo')
      .eq('tipo_documento', args.tipoDocumento)
      .eq('estado', 'A')
      .order('id_serie', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (errSerieRow) throw errSerieRow;
    if (!serieRow) {
      throw new Error('SERIE_NO_EXISTE');
    }
    const firstRow = serieRow as Record<string, unknown>;
    serie = String(firstRow['serie'] ?? '');
    const correlativo = Number(firstRow['correlativo'] ?? 0) + 1;
    numero = String(correlativo).padStart(8, '0');
    const { error: errSerieUpd } = await supabase
      .from('serie_documento')
      .update({ correlativo })
      .eq('id_serie', Number(firstRow['id_serie']));
    if (errSerieUpd) throw errSerieUpd;
  }

  if (!serie || !numero) {
    throw new Error('SERIE_NO_EXISTE');
  }

  if (args.tipoDocumento === '03') {
    const { error: errBol } = await supabase.from('boleta').insert({
      id_venta: idVenta,
      serie,
      numero,
      cliente_documento: clienteDocumento,
      cliente_nombre: clienteNombre,
    });
    if (errBol) {
      throw new Error(`DB_COBRO_FAIL: ${errBol.message}`);
    }
  } else if (args.tipoDocumento === '01') {
    const { error: errFac } = await supabase.from('factura').insert({
      id_venta: idVenta,
      id_empresa: idEmpresa,
      serie,
      numero,
      condicion_pago: 'CONTADO',
    });
    if (errFac) {
      throw new Error(`DB_COBRO_FAIL: ${errFac.message}`);
    }
  }

  const concepto = metodo ? codigoConcepto(metodo) : 1;
  const { error: errMov } = await supabase.from('movimiento_caja').insert({
    id_aperturacaja: args.aperturaId,
    id_tipomovimiento: 1, // INGRESO
    id_concepto: concepto,
    id_metodopago: args.metodoPagoId,
    id_usuario: args.usuarioId,
    monto: total,
    descripcion: 'Cobro comprobante',
    id_pedido: args.pedidoId,
    id_venta: idVenta,
    numero_operacion: args.referencia || null,
    documento: 'N',
    estado: 'A',
  });
  if (errMov) {
    throw new Error(`DB_COBRO_FAIL: ${errMov.message}`);
  }

  // BR-INF-051: los pagos digitales suman a Total_Ingresos pero NO modifican el efectivo físico (Monto_Sistema).
  if (metodo && metodo.afectaEfectivo) {
    const { error: errApeUpd } = await supabase.rpc('fn_sumar_efectivo_turno', {
      p_apertura: args.aperturaId,
      p_monto: total,
    });
    if (errApeUpd) {
      throw new Error(`DB_COBRO_FAIL: ${errApeUpd.message}`);
    }
  }

  const { error: errPedUpd } = await supabase
    .from('pedido')
    .update({ facturado: 'S', id_estadopedido: 4, f_cierre: new Date().toISOString() })
    .eq('id_pedido', args.pedidoId);
  if (errPedUpd) {
    throw new Error(`DB_COBRO_FAIL: ${errPedUpd.message}`);
  }

  if (pedido.id_mesa) {
    await supabase.from('mesa').update({ id_estadomesa: 1 }).eq('id_mesa', pedido.id_mesa);
  }

  return {
    idVenta,
    serie,
    numero,
    total,
    vuelto,
  };
}

/* ------------------------- Factura: clientes empresa ------------------------- */

export interface ClienteEmpresa {
  clienteId: number;
  razonSocial: string;
  ruc: string;
  nombreComercial: string | null;
}

/** Busca clientes tipo empresa (J) por RUC o razón social para emitir FACTURA (01). (BR-RES-016) */
export async function buscarClientesEmpresa(q: string): Promise<ClienteEmpresa[]> {
  const term = q.trim();
  if (term.length < 2) {
    return [];
  }
  const digits = term.replace(/\D/g, '');
  let query = supabase
    .from('cliente')
    .select('id_cliente, id_empresa, empresa(ruc, razon_social, nombre_comercial)')
    .eq('estado', 'A')
    .not('id_empresa', 'is', null)
    .limit(10);
  if (/^\d+$/.test(digits) && digits.length >= 4) {
    query = query.ilike('empresa.ruc', `%${digits}%`);
  } else {
    query = query.ilike('empresa.razon_social', `%${term}%`);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => {
    const emp = r['empresa'] as Record<string, unknown> | null;
    return {
      clienteId: Number(r['id_cliente']),
      razonSocial: String(emp?.['razon_social'] ?? ''),
      ruc: String(emp?.['ruc'] ?? ''),
      nombreComercial: emp?.['nombre_comercial'] ? String(emp['nombre_comercial']) : null,
    };
  });
}

/* ------------------------------ Cierre y arqueo ------------------------------ */

export interface MovimientoCaja {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  concepto: string;
  metodoPago: string;
  monto: number;
  afectaEfectivo: boolean;
  descripcion: string | null;
  numeroOperacion: string | null;
  idVenta: number | null;
  usuario: string;
}

export interface TurnoDetalle {
  id: number;
  cajaId: number;
  cajaNombre: string;
  cajero: string;
  numeroTurno: string;
  fApertura: string;
  montoInicial: number;
  montoSistema: number;
  totalIngresos: number;
  totalEgresos: number;
  situacion: 'A' | 'C';
}

export interface HistorialTurno {
  id: number;
  cajaNombre: string;
  cajero: string;
  usuarioCierre: string | null;
  numeroTurno: string;
  fApertura: string;
  fCierre: string | null;
  montoInicial: number;
  montoSistema: number;
  montoDeclarado: number;
  diferencia: number;
  resultado: 'CUADRADO' | 'SOBRANTE' | 'FALTANTE' | null;
  observacion: string | null;
  situacion: 'A' | 'C';
}

export interface CierreResultado {
  sistema: number;
  declarado: number;
  diferencia: number;
  resultado: string;
}

export interface ReporteZ {
  turno: TurnoDetalle;
  resultado: 'CUADRADO' | 'SOBRANTE' | 'FALTANTE' | null;
  montoDeclarado: number;
  usuarioCierre: string | null;
  fCierre: string | null;
  observacion: string | null;
  movimientos: MovimientoCaja[];
}

/** Turno completo de una caja (abierto o, si no hay, el último cerrado). */
export async function turnoDeCaja(cajaId: number): Promise<TurnoDetalle | null> {
  const { data, error } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja, id_caja, id_usuario, numero_turno, f_apertura, monto_inicial, monto_sistema, total_ingresos, total_egresos, situacion')
    .eq('id_caja', cajaId)
    .order('situacion', { ascending: true }) // 'A' primero
    .order('f_apertura', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as Record<string, unknown>;
  const cajaNombre = String((await listarCajas()).find((c) => c.id === Number(row['id_caja']))?.nombre ?? `Caja ${row['id_caja']}`);
  return {
    id: Number(row['id_aperturacaja']),
    cajaId: Number(row['id_caja']),
    cajaNombre,
    cajero: await logeoUsuarioSingle(Number(row['id_usuario'])),
    numeroTurno: String(row['numero_turno'] ?? ''),
    fApertura: new Date(String(row['f_apertura'])).toISOString(),
    montoInicial: Number(row['monto_inicial'] ?? 0),
    montoSistema: Number(row['monto_sistema'] ?? 0),
    totalIngresos: Number(row['total_ingresos'] ?? 0),
    totalEgresos: Number(row['total_egresos'] ?? 0),
    situacion: (row['situacion'] === 'C' ? 'C' : 'A') as 'A' | 'C',
  };
}

async function logeoUsuarioSingle(id: number): Promise<string> {
  const { data, error } = await supabase
    .from('usuario')
    .select('logeo')
    .eq('id_usuario', id)
    .maybeSingle();
  if (error) throw new Error(`DB_GET_FAIL: ${error.message}`);
  return String(data?.['logeo'] ?? '');
}

async function logeoUsuario(ids: number[]): Promise<Map<number, string>> {
  const mapa = new Map<number, string>();
  if (ids.length === 0) {
    return mapa;
  }
  const { data, error } = await supabase
    .from('usuario')
    .select('id_usuario, logeo')
    .in('id_usuario', ids);
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  for (const r of (data ?? []) as unknown as Record<string, unknown>[]) {
    mapa.set(Number(r['id_usuario']), String(r['logeo'] ?? ''));
  }
  return mapa;
}

/** Movimientos de caja del turno activo de la caja indicada. */
export async function listarMovimientos(cajaId: number): Promise<{ turno: TurnoDetalle | null; movimientos: MovimientoCaja[] }> {
  const turno = await turnoDeCaja(cajaId);
  if (!turno || turno.situacion !== 'A') {
    return { turno, movimientos: [] };
  }
  const { data, error } = await supabase
    .from('movimiento_caja')
    .select('id_movimientocaja, f_movimiento, monto, afecta_efectivo, descripcion, numero_operacion, id_venta, id_usuario, tipo_movimiento_caja(n_tipomovimiento), concepto_caja(n_concepto), metodo_pago(n_metodopago)')
    .eq('id_aperturacaja', turno.id)
    .eq('estado', 'A')
    .order('f_movimiento', { ascending: true });
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  const ids = [...new Set(((data ?? []) as unknown as Record<string, unknown>[]).map((r) => Number(r['id_usuario'])))];
  const usuarios = await logeoUsuario(ids);
  const movimientos = ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => {
    const tm = r['tipo_movimiento_caja'] as Record<string, unknown> | null;
    const cc = r['concepto_caja'] as Record<string, unknown> | null;
    const mp = r['metodo_pago'] as Record<string, unknown> | null;
    return {
      id: Number(r['id_movimientocaja']),
      fecha: new Date(String(r['f_movimiento'])).toISOString(),
      tipoMovimiento: String(tm?.['n_tipomovimiento'] ?? ''),
      concepto: String(cc?.['n_concepto'] ?? ''),
      metodoPago: String(mp?.['n_metodopago'] ?? ''),
      monto: Number(r['monto'] ?? 0),
      afectaEfectivo: String(r['afecta_efectivo'] ?? 'N') === 'S',
      descripcion: r['descripcion'] ? String(r['descripcion']) : null,
      numeroOperacion: r['numero_operacion'] ? String(r['numero_operacion']) : null,
      idVenta: r['id_venta'] ? Number(r['id_venta']) : null,
      usuario: usuarios.get(Number(r['id_usuario'])) ?? '',
    };
  });
  return { turno, movimientos };
}

/** Historial de turnos cerrados de todas las cajas. */
export async function historialCaja(limite = 20): Promise<HistorialTurno[]> {
  const { data, error } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja, id_caja, id_usuario, id_usuariocierre, numero_turno, f_apertura, f_cierre, monto_inicial, monto_sistema, monto_declarado, diferencia, situacion, observacion')
    .eq('situacion', 'C')
    .order('f_cierre', { ascending: false })
    .limit(Math.min(limite, 100));
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  if (rows.length === 0) {
    return [];
  }
  const cajasIds = Array.from(new Set(rows.map((r) => Number(r['id_caja']))));
  const { data: cajas, error: errCajas } = await supabase
    .from('caja')
    .select('id_caja, n_caja')
    .in('id_caja', cajasIds);
  if (errCajas) {
    throw new Error(`DB_GET_FAIL: ${errCajas.message}`);
  }
  const nombreCaja = new Map<number, string>(
    ((cajas ?? []) as unknown as Record<string, unknown>[]).map((c) => [Number(c['id_caja']), String(c['n_caja'] ?? '')]),
  );
  const allIds = rows.flatMap((r) => [Number(r['id_usuario']), Number(r['id_usuariocierre'] ?? 0)]);
  const uniqueIds = Array.from(new Set(allIds));
  const usuariosIds = uniqueIds.filter((x): x is number => x > 0);
  const usuarios = await logeoUsuario(usuariosIds);
  return rows.map((r) => {
    const diferencia = Number(r['diferencia'] ?? 0);
    return {
      id: Number(r['id_aperturacaja']),
      cajaNombre: nombreCaja.get(Number(r['id_caja'])) ?? `Caja ${r['id_caja']}`,
      cajero: usuarios.get(Number(r['id_usuario'])) ?? '',
      usuarioCierre: r['id_usuariocierre'] ? (usuarios.get(Number(r['id_usuariocierre'])) ?? null) : null,
      numeroTurno: String(r['numero_turno'] ?? ''),
      fApertura: new Date(String(r['f_apertura'])).toISOString(),
      fCierre: r['f_cierre'] ? new Date(String(r['f_cierre'])).toISOString() : null,
      montoInicial: Number(r['monto_inicial'] ?? 0),
      montoSistema: Number(r['monto_sistema'] ?? 0),
      montoDeclarado: Number(r['monto_declarado'] ?? 0),
      diferencia,
      resultado: (diferencia === 0 ? 'CUADRADO' : diferencia > 0 ? 'SOBRANTE' : 'FALTANTE') as 'CUADRADO' | 'SOBRANTE' | 'FALTANTE',
      observacion: r['observacion'] ? String(r['observacion']) : null,
      situacion: 'C' as const,
    };
  });
}

/**
 * Cierra el turno con arqueo (BR-DER-032, BR-INF-049, BR-ACC-046).
 * El USP deja: ID_UsuarioCierre, F_Cierre, Monto_Declarado, Diferencia, Situacion='C' y auditoría.
 */
export async function cerrarCaja(args: {
  aperturaId: number;
  usuarioCierreId: number;
  declarado: number;
  observacion: string;
}): Promise<CierreResultado> {
  const { error: errUpd } = await supabase
    .from('apertura_caja')
    .update({
      id_usuariocierre: args.usuarioCierreId,
      f_cierre: new Date().toISOString(),
      monto_declarado: args.declarado,
      diferencia: null,
      situacion: 'C',
      observacion: args.observacion || null,
      usumod: String(args.usuarioCierreId),
      fecmod: new Date().toISOString(),
    })
    .eq('id_aperturacaja', args.aperturaId)
    .eq('situacion', 'A');
  if (errUpd) {
    const msg = errUpd.message;
    if (msg.includes('check') || msg.includes('diferencia')) {
      throw new Error('MONTO_INVALIDO');
    }
    throw new Error(`DB_CIERRE_FAIL: ${msg}`);
  }
  const { error: errCajaUpd } = await supabase
    .from('caja')
    .update({ aperturada: 'N' })
    .eq('id_caja', (await supabase.from('apertura_caja').select('id_caja').eq('id_aperturacaja', args.aperturaId).maybeSingle()).data! ? Number(((await supabase.from('apertura_caja').select('id_caja').eq('id_aperturacaja', args.aperturaId).maybeSingle()).data as Record<string, unknown>)['id_caja']) : 0);
  if (errCajaUpd) {
    throw new Error(`DB_CIERRE_FAIL: ${errCajaUpd.message}`);
  }
  const { data: row, error: errRow } = await supabase
    .from('apertura_caja')
    .select('id_caja, monto_sistema, monto_declarado, diferencia')
    .eq('id_aperturacaja', args.aperturaId)
    .maybeSingle();
  if (errRow) {
    throw new Error(`DB_GET_FAIL: ${errRow.message}`);
  }
  if (!row) {
    throw new Error('TURNO_NO_ABIERTO');
  }
  const r = row as Record<string, unknown>;
  const diferencia = Number(r['diferencia'] ?? 0);
  return {
    sistema: Number(r['monto_sistema'] ?? 0),
    declarado: Number(r['monto_declarado'] ?? 0),
    diferencia,
    resultado: diferencia === 0 ? 'CUADRADO' : diferencia > 0 ? 'SOBRANTE' : 'FALTANTE',
  };
}

/** Reporte Z de un turno (abierto o cerrado). */
export async function reporteZ(aperturaId: number): Promise<ReporteZ | null> {
  const { data, error } = await supabase
    .from('apertura_caja')
    .select('id_aperturacaja, id_caja, id_usuario, id_usuariocierre, numero_turno, f_apertura, f_cierre, monto_inicial, monto_sistema, total_ingresos, total_egresos, monto_declarado, diferencia, situacion, observacion')
    .eq('id_aperturacaja', aperturaId)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const r = data as Record<string, unknown>;
  const cajaNombre = String((await listarCajas()).find((c) => c.id === Number(r['id_caja']))?.nombre ?? `Caja ${r['id_caja']}`);
  const usuarios = await logeoUsuario([Number(r['id_usuario']), Number(r['id_usuariocierre'] ?? 0)].filter((x) => x > 0));
  const diferencia = r['diferencia'] === null ? null : Number(r['diferencia']);
  const { movimientos } = await listarMovimientosDeApertura(aperturaId);
  return {
    turno: {
      id: Number(r['id_aperturacaja']),
      cajaId: Number(r['id_caja']),
      cajaNombre,
      cajero: usuarios.get(Number(r['id_usuario'])) ?? '',
      numeroTurno: String(r['numero_turno'] ?? ''),
      fApertura: new Date(String(r['f_apertura'])).toISOString(),
      montoInicial: Number(r['monto_inicial'] ?? 0),
      montoSistema: Number(r['monto_sistema'] ?? 0),
      totalIngresos: Number(r['total_ingresos'] ?? 0),
      totalEgresos: Number(r['total_egresos'] ?? 0),
      situacion: (r['situacion'] === 'C' ? 'C' : 'A') as 'A' | 'C',
    },
    resultado: diferencia === null ? null : (diferencia === 0 ? 'CUADRADO' : diferencia > 0 ? 'SOBRANTE' : 'FALTANTE'),
    montoDeclarado: r['monto_declarado'] === null ? 0 : Number(r['monto_declarado']),
    usuarioCierre: r['id_usuariocierre'] ? (usuarios.get(Number(r['id_usuariocierre'])) ?? null) : null,
    fCierre: r['f_cierre'] ? new Date(String(r['f_cierre'])).toISOString() : null,
    observacion: r['observacion'] ? String(r['observacion']) : null,
    movimientos,
  };
}

async function listarMovimientosDeApertura(aperturaId: number): Promise<{ movimientos: MovimientoCaja[] }> {
  const { data, error } = await supabase
    .from('movimiento_caja')
    .select('id_movimientocaja, f_movimiento, monto, afecta_efectivo, descripcion, numero_operacion, id_venta, id_usuario, tipo_movimiento_caja(n_tipomovimiento), concepto_caja(n_concepto), metodo_pago(n_metodopago)')
    .eq('id_aperturacaja', aperturaId)
    .eq('estado', 'A')
    .order('f_movimiento', { ascending: true });
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const ids = [...new Set(rows.map((r) => Number(r['id_usuario'])))];
  const usuarios = await logeoUsuario(ids);
  return {
    movimientos: rows.map((r) => {
      const tm = r['tipo_movimiento_caja'] as Record<string, unknown> | null;
      const cc = r['concepto_caja'] as Record<string, unknown> | null;
      const mp = r['metodo_pago'] as Record<string, unknown> | null;
      return {
        id: Number(r['id_movimientocaja']),
        fecha: new Date(String(r['f_movimiento'])).toISOString(),
        tipoMovimiento: String(tm?.['n_tipomovimiento'] ?? ''),
        concepto: String(cc?.['n_concepto'] ?? ''),
        metodoPago: String(mp?.['n_metodopago'] ?? ''),
        monto: Number(r['monto'] ?? 0),
        afectaEfectivo: String(r['afecta_efectivo'] ?? 'N') === 'S',
        descripcion: r['descripcion'] ? String(r['descripcion']) : null,
        numeroOperacion: r['numero_operacion'] ? String(r['numero_operacion']) : null,
        idVenta: r['id_venta'] ? Number(r['id_venta']) : null,
        usuario: usuarios.get(Number(r['id_usuario'])) ?? '',
      };
    }),
  };
}
