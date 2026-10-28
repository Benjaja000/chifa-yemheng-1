import { supabase } from '../config/supabase.js';
import type { ArqueoCaja, ProductoMasVendido, VentaDiaria } from '../models/reportes.js';
import type {
  ReportesArqueoQuery,
  ReportesMovimientosQuery,
  ReportesPagosQuery,
  ReportesProductosQuery,
  ReportesReservasQuery,
  ReportesDeliveryQuery,
  ReportesAnalisisQuery,
  ReportesVentasQuery,
} from '../schemas/reportes.js';

interface VentaDiariaRow {
  fecha: string;
  tipodocumento: string;
  n_comprobantes: number;
  subtotal: number;
  igv: number;
  total: number;
}

interface ArqueoCajaRow {
  id_aperturacaja: number;
  n_caja: string;
  numero_turno: number;
  f_apertura: string;
  f_cierre: string | null;
  usuario_apertura: string;
  usuario_cierre: string | null;
  monto_inicial: number;
  total_ingresos: number;
  total_egresos: number;
  monto_sistema: number;
  monto_declarado: number;
  diferencia: number;
  situacion: string;
}

interface DetalleVentaProductoRow {
  id_detalle: number;
  id_producto: number;
  cantidad: number;
  sub_total: number;
  producto: {
    n_producto: string;
    categoria_producto: { n_categoriaproducto: string }[] | null;
  }[] | null;
}

interface DetalleCategoriaRow {
  id_detalle: number;
  id_producto: number;
  cantidad: number;
  sub_total: number;
  producto: {
    categoria_producto: { id_categoriaproducto: number; n_categoriaproducto: string }[] | null;
  }[] | null;
}

interface ReservaReporteRow {
  id_reserva: number;
  cliente: { persona: { nombre: string; ap_paterno: string | null }[] | null }[] | null;
  mesa: { numero: string }[] | null;
  usuario: { logeo: string }[] | null;
  f_reserva: string;
  n_personas: number;
  adelanto: number;
  situacion: string;
  observacion: string | null;
}

interface DeliveryReporteRow {
  id_pedidodelivery: number;
  id_distrito: number | null;
  distrito: { d_distrito: string }[] | null;
  id_empleado: number | null;
  repartidor: { persona: { nombre: string; ap_paterno: string | null }[] | null }[] | null;
  pedido: { numero_pedido: string }[] | null;
  costo_envio: number;
  situacion: string;
  feccre: string;
  f_salida: string | null;
  f_entrega: string | null;
}

interface AnalisisVentaRow {
  id_venta: number;
  id_cliente: number | null;
  id_aperturacaja: number;
  f_venta: string;
  tipodocumento: string;
  subtotal: number;
  descuento: number;
  servicio: number;
  igv: number;
  total: number;
  cliente: { tipo_cliente: string }[] | null;
  pedido: {
    canal_origen: string | null;
    n_comensales: number;
    tipo_pedido: { n_tipopedido: string }[] | null;
    mesa: { numero: string; ambiente: { n_ambiente: string }[] | null }[] | null;
    empleado: { persona: { nombre: string; ap_paterno: string | null }[] | null }[] | null;
  }[] | null;
}

interface PedidoAnuladoRow {
  id_pedido: number;
  numero_pedido: string;
  f_pedido: string;
  motivo_anulacion: string | null;
  total: number;
  n_comensales: number;
  tipo_pedido: { n_tipopedido: string }[] | null;
  usuario: { logeo: string }[] | null;
}

interface VentaAnuladaRow {
  id_venta: number;
  f_venta: string;
  tipodocumento: string;
  total: number;
  motivo_anulacion: string | null;
  usuario: { logeo: string }[] | null;
}

interface NotaCreditoRow {
  id_notacredito: number;
  id_venta: number;
  serie: string;
  numero: string;
  tipo_doc_referencia: string;
  serie_referencia: string;
  numero_referencia: string;
  motivo: string;
  monto: number;
  f_emision: string;
  estado_sunat: string | null;
}

interface ClienteFrecuenteRow {
  id_cliente: number;
  cliente: string;
}

interface PagoDetalleReporteRow {
  id_pago: number;
  id_venta: number;
  monto: number;
  referencia: string | null;
  f_pago: string;
  metodo_pago: { n_metodopago: string }[] | null;
  venta: {
    f_venta: string;
    tipodocumento: string;
    id_aperturacaja: number;
  }[] | null;
}

interface DocumentoFiscalReporteRow {
  id_venta: number;
  serie: string;
  numero: string;
  f_emision: string;
  estado_sunat: string | null;
  venta: { f_venta: string; total: number }[] | null;
}

interface AperturaResumenRow {
  id_aperturacaja: number;
  numero_turno: string | number;
  f_apertura: string;
  f_cierre: string | null;
  monto_inicial: number;
  total_ingresos: number;
  total_egresos: number;
  monto_sistema: number;
  monto_declarado: number | null;
  diferencia: number | null;
  situacion: string;
  caja: { n_caja: string }[] | null;
}

async function cargarTodasLasFilas<T>(
  crearConsulta: (desde: number, hasta: number) => PromiseLike<{
    data: T[] | null;
    error: { message: string } | null;
  }>,
): Promise<T[]> {
  const rows: T[] = [];
  const pageSize = 1000;

  for (let desde = 0; ; desde += pageSize) {
    const { data, error } = await crearConsulta(desde, desde + pageSize - 1);
    if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

export async function ventasDiarias(q: ReportesVentasQuery): Promise<VentaDiaria[]> {
  const rows = await cargarTodasLasFilas<VentaDiariaRow>((desde, hasta) => {
    let query = supabase
      .from('vw_ventas_diarias')
      .select('*')
      .order('fecha', { ascending: false })
      .order('tipodocumento', { ascending: true });
    if (q.desde) query = query.gte('fecha', q.desde);
    if (q.hasta) query = query.lte('fecha', q.hasta);
    return query.range(desde, hasta);
  });
  return rows.map((r) => ({
    fecha: r.fecha,
    tipodocumento: r.tipodocumento,
    comprobantes: Number(r.n_comprobantes ?? 0),
    subtotal: Number(r.subtotal ?? 0),
    igv: Number(r.igv ?? 0),
    total: Number(r.total ?? 0),
  }));
}

export async function ventasPorCategoria(q: ReportesVentasQuery) {
  const rows = await cargarTodasLasFilas<DetalleCategoriaRow>((desde, hasta) => {
    let query = supabase
      .from('detalle_venta')
      .select('id_detalle, id_producto, cantidad, sub_total, producto:producto(categoria_producto(id_categoriaproducto, n_categoriaproducto)), venta:venta!inner(f_venta, anulada, estado)')
      .eq('estado', 'A')
      .eq('venta.anulada', 'N')
      .eq('venta.estado', 'A')
      .order('id_detalle', { ascending: true });
    if (q.desde) query = query.gte('venta.f_venta', q.desde);
    if (q.hasta) query = query.lte('venta.f_venta', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });
  const categorias = new Map<number | null, {
    categoriaId: number | null;
    categoria: string;
    productos: Set<number>;
    unidades: number;
    total: number;
  }>();
  for (const row of rows) {
    const producto = row.producto?.[0];
    const categoria = producto?.categoria_producto?.[0];
    const categoriaId = categoria?.id_categoriaproducto ?? null;
    const item = categorias.get(categoriaId) ?? {
      categoriaId,
      categoria: categoria?.n_categoriaproducto ?? 'Sin categoría',
      productos: new Set<number>(),
      unidades: 0,
      total: 0,
    };
    item.productos.add(row.id_producto);
    item.unidades += Number(row.cantidad ?? 0);
    item.total += Number(row.sub_total ?? 0);
    categorias.set(categoriaId, item);
  }
  return Array.from(categorias.values())
    .map(({ productos, ...row }) => ({ ...row, cantidadProductos: productos.size }))
    .sort((a, b) => b.total - a.total || a.categoria.localeCompare(b.categoria, 'es'));
}

export async function productosMasVendidos(q: ReportesProductosQuery): Promise<ProductoMasVendido[]> {
  const rows = await cargarTodasLasFilas<DetalleVentaProductoRow>((desde, hasta) => {
    let query = supabase
      .from('detalle_venta')
      .select('id_detalle, id_producto, cantidad, sub_total, producto:producto!inner(n_producto, categoria_producto(n_categoriaproducto)), venta:venta!inner(f_venta, anulada, estado)')
      .eq('estado', 'A')
      .eq('venta.anulada', 'N')
      .eq('venta.estado', 'A')
      .order('id_detalle', { ascending: true });
    if (q.desde) query = query.gte('venta.f_venta', q.desde);
    if (q.hasta) query = query.lte('venta.f_venta', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });
  const productos = new Map<number, ProductoMasVendido>();
  for (const row of rows) {
    const producto = row.producto?.[0];
    if (!producto) continue;
    const categoria = producto.categoria_producto?.[0]?.n_categoriaproducto ?? '';
    const item = productos.get(row.id_producto) ?? {
      productoId: row.id_producto,
      producto: producto.n_producto,
      categoria,
      cantidad: 0,
      total: 0,
    };
    item.cantidad += Number(row.cantidad ?? 0);
    item.total += Number(row.sub_total ?? 0);
    productos.set(row.id_producto, item);
  }
  return Array.from(productos.values())
    .sort((a, b) => b.cantidad - a.cantidad || b.total - a.total)
    .slice(0, q.limit);
}

export async function arqueoCaja(q: ReportesArqueoQuery): Promise<ArqueoCaja[]> {
  const rows = await cargarTodasLasFilas<ArqueoCajaRow>((desde, hasta) => {
    let query = supabase
      .from('vw_arqueo_caja')
      .select('*')
      .order('f_apertura', { ascending: false })
      .order('id_aperturacaja', { ascending: false });
    if (q.desde) query = query.gte('f_apertura', q.desde);
    if (q.hasta) query = query.lte('f_apertura', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });
  return rows.map((r) => ({
    turnoId: r.id_aperturacaja,
    caja: r.n_caja,
    numeroTurno: Number(r.numero_turno ?? 0),
    fechaApertura: r.f_apertura,
    fechaCierre: r.f_cierre,
    usuarioApertura: r.usuario_apertura,
    usuarioCierre: r.usuario_cierre,
    montoInicial: Number(r.monto_inicial ?? 0),
    totalIngresos: Number(r.total_ingresos ?? 0),
    totalEgresos: Number(r.total_egresos ?? 0),
    montoSistema: Number(r.monto_sistema ?? 0),
    montoDeclarado: Number(r.monto_declarado ?? 0),
    diferencia: Number(r.diferencia ?? 0),
    situacion: r.situacion,
  }));
}

export async function pagosPorMedio(q: ReportesPagosQuery) {
  const rows = await cargarTodasLasFilas<Record<string, unknown>>((desde, hasta) => {
    let query = supabase
      .from('vw_reportes_pagos_medio')
      .select('*')
      .order('fecha', { ascending: false })
      .order('id_metodopago', { ascending: true })
      .order('id_usuario', { ascending: true });
    if (q.desde) query = query.gte('fecha', q.desde);
    if (q.hasta) query = query.lte('fecha', q.hasta);
    if (q.metodoPagoId) query = query.eq('id_metodopago', q.metodoPagoId);
    if (q.usuarioId) query = query.eq('id_usuario', q.usuarioId);
    return query.range(desde, hasta);
  });
  return rows.map((row) => ({
    fecha: String(row['fecha'] ?? ''),
    metodoPagoId: Number(row['id_metodopago']),
    metodoPago: String(row['metodo_pago'] ?? ''),
    usuarioId: Number(row['id_usuario']),
    usuario: String(row['usuario'] ?? ''),
    comprobantes: Number(row['comprobantes'] ?? 0),
    operaciones: Number(row['operaciones'] ?? 0),
    total: Number(row['total'] ?? 0),
    efectivoFisico: String(row['afecta_efectivo'] ?? 'N') === 'S',
  }));
}

export async function comprobantesEmitidos(q: ReportesMovimientosQuery) {
  const rows = await cargarTodasLasFilas<Record<string, unknown>>((desde, hasta) => {
    let query = supabase
      .from('vw_reportes_comprobantes')
      .select('*')
      .order('fecha', { ascending: false })
      .order('id_venta', { ascending: false });
    if (q.desde) query = query.gte('fecha', q.desde);
    if (q.hasta) query = query.lte('fecha', `${q.hasta}T23:59:59`);
    if (q.usuarioId) query = query.eq('id_usuario', q.usuarioId);
    return query.range(desde, hasta);
  });
  return rows.map((row) => ({
    ventaId: Number(row['id_venta']),
    fecha: String(row['fecha'] ?? ''),
    tipoDocumento: String(row['tipo_documento'] ?? ''),
    serie: String(row['serie'] ?? ''),
    numero: String(row['numero'] ?? ''),
    caja: String(row['caja'] ?? ''),
    turno: String(row['turno'] ?? ''),
    usuario: String(row['usuario'] ?? ''),
    usuarioId: Number(row['id_usuario']),
    total: Number(row['total'] ?? 0),
  }));
}

export async function movimientosCajaReporte(q: ReportesMovimientosQuery) {
  const rows = await cargarTodasLasFilas<Record<string, unknown>>((desde, hasta) => {
    let query = supabase
      .from('vw_reportes_movimientos_caja')
      .select('*')
      .order('fecha', { ascending: false })
      .order('id_movimientocaja', { ascending: false });
    if (q.desde) query = query.gte('fecha', q.desde);
    if (q.hasta) query = query.lte('fecha', `${q.hasta}T23:59:59`);
    if (q.usuarioId) query = query.eq('id_usuario', q.usuarioId);
    return query.range(desde, hasta);
  });
  return rows.map((row) => ({
    id: Number(row['id_movimientocaja']),
    fecha: String(row['fecha'] ?? ''),
    caja: String(row['caja'] ?? ''),
    turno: String(row['turno'] ?? ''),
    tipoMovimiento: String(row['tipo_movimiento'] ?? ''),
    concepto: String(row['concepto'] ?? ''),
    metodoPago: String(row['metodo_pago'] ?? ''),
    monto: Number(row['monto'] ?? 0),
    afectaEfectivo: String(row['afecta_efectivo'] ?? 'N') === 'S',
    descripcion: row['descripcion'] ? String(row['descripcion']) : null,
    referencia: row['numero_operacion'] ? String(row['numero_operacion']) : null,
    banco: row['banco'] ? String(row['banco']) : null,
    usuario: String(row['usuario'] ?? ''),
    usuarioId: Number(row['id_usuario']),
  }));
}

export async function reservasReporte(q: ReportesReservasQuery) {
  const rows = await cargarTodasLasFilas<ReservaReporteRow>((desde, hasta) => {
    let query = supabase
      .from('reserva')
      .select('id_reserva, cliente:cliente(persona(nombre, ap_paterno)), mesa:mesa(numero), usuario:usuario(logeo), f_reserva, n_personas, adelanto, situacion, observacion')
      .eq('estado', 'A')
      .order('f_reserva', { ascending: false })
      .order('id_reserva', { ascending: false });
    if (q.desde) query = query.gte('f_reserva', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_reserva', `${q.hasta}T23:59:59`);
    if (q.estado) query = query.eq('situacion', q.estado);
    return query.range(desde, hasta);
  });
  return rows.map((row) => ({
    id: row.id_reserva,
    cliente: row.cliente?.[0]?.persona?.[0]
      ? `${row.cliente[0].persona[0].nombre} ${row.cliente[0].persona[0].ap_paterno ?? ''}`.trim()
      : '—',
    mesa: row.mesa?.[0]?.numero ?? 'Sin asignar',
    responsable: row.usuario?.[0]?.logeo ?? '—',
    fecha: row.f_reserva,
    personas: Number(row.n_personas ?? 0),
    adelanto: Number(row.adelanto ?? 0),
    estado: row.situacion,
    observacion: row.observacion,
  }));
}

export async function deliveryReporte(q: ReportesDeliveryQuery) {
  const rows = await cargarTodasLasFilas<DeliveryReporteRow>((desde, hasta) => {
    let query = supabase
      .from('pedido_delivery')
      .select('id_pedidodelivery, id_distrito, distrito(d_distrito), id_empleado, repartidor:empleado(persona(nombre, ap_paterno)), pedido:pedido(numero_pedido), costo_envio, situacion, feccre, f_salida, f_entrega')
      .eq('estado', 'A')
      .order('feccre', { ascending: false })
      .order('id_pedidodelivery', { ascending: false });
    if (q.desde) query = query.gte('feccre', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('feccre', `${q.hasta}T23:59:59`);
    if (q.estado) query = query.eq('situacion', q.estado);
    if (q.distritoId) query = query.eq('id_distrito', q.distritoId);
    if (q.repartidorId) query = query.eq('id_empleado', q.repartidorId);
    return query.range(desde, hasta);
  });
  return rows.map((row) => ({
    id: row.id_pedidodelivery,
    pedido: row.pedido?.[0]?.numero_pedido ?? '—',
    distritoId: row.id_distrito,
    distrito: row.distrito?.[0]?.d_distrito ?? 'Sin distrito',
    repartidorId: row.id_empleado,
    repartidor: row.repartidor?.[0]?.persona?.[0]
      ? `${row.repartidor[0].persona[0].nombre} ${row.repartidor[0].persona[0].ap_paterno ?? ''}`.trim()
      : 'Sin asignar',
    estado: row.situacion,
    costoEnvio: Number(row.costo_envio ?? 0),
    fechaCreacion: row.feccre,
    fechaSalida: row.f_salida,
    fechaEntrega: row.f_entrega,
  }));
}

export async function analisisComercial(q: ReportesAnalisisQuery) {
  const ventas = await cargarTodasLasFilas<AnalisisVentaRow>((desde, hasta) => {
    let query = supabase
      .from('venta')
      .select('id_venta, id_cliente, id_aperturacaja, f_venta, tipodocumento, subtotal, descuento, servicio, igv, total, cliente:cliente(tipo_cliente), pedido:pedido!inner(canal_origen, n_comensales, tipo_pedido(n_tipopedido), mesa(numero, ambiente(n_ambiente)), empleado(persona(nombre, ap_paterno)))')
      .eq('estado', 'A')
      .eq('anulada', 'N')
      .order('f_venta', { ascending: true })
      .order('id_venta', { ascending: true });
    if (q.desde) query = query.gte('f_venta', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_venta', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });

  const canales = new Map<string, { canal: string; tipoPedido: string; comprobantes: number; total: number }>();
  const horas = new Map<string, {
    diaSemana: string;
    hora: string;
    comprobantes: number;
    total: number;
  }>();
  const dias = new Map<string, {
    fecha: string;
    comprobantes: number;
    total: number;
    comensales: number;
  }>();
  const clientes = new Map<number, {
    clienteId: number;
    compras: number;
    total: number;
    ultimaCompra: string;
  }>();
  const mesas = new Map<string, { mesa: string; ambiente: string; comprobantes: number; total: number }>();
  const empleados = new Map<string, { empleado: string; comprobantes: number; total: number }>();
  const impuestos = new Map<string, {
    fecha: string;
    comprobantes: number;
    subtotal: number;
    descuento: number;
    servicio: number;
    igv: number;
    total: number;
  }>();
  const tiposCliente = new Map<string, { tipo: string; comprobantes: number; total: number }>();
  const ventasPorApertura = new Map<number, number>();
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  for (const venta of ventas) {
    const pedido = venta.pedido?.[0];
    const canal = pedido?.canal_origen || 'No especificado';
    const tipoPedido = pedido?.tipo_pedido?.[0]?.n_tipopedido || 'No especificado';
    const grupoCanal = `${canal}\u0000${tipoPedido}`;
    const resumenCanal = canales.get(grupoCanal) ?? {
      canal,
      tipoPedido,
      comprobantes: 0,
      total: 0,
    };
    resumenCanal.comprobantes += 1;
    resumenCanal.total += Number(venta.total ?? 0);
    canales.set(grupoCanal, resumenCanal);

    const timestamp = venta.f_venta.slice(0, 19).replace('T', ' ');
    const fecha = timestamp.slice(0, 10);
    const horaNumero = Number(timestamp.slice(11, 13));
    const hora = Number.isInteger(horaNumero) && horaNumero >= 0 && horaNumero <= 23
      ? `${String(horaNumero).padStart(2, '0')}:00`
      : 'Hora no disponible';
    const dateParts = fecha.split('-').map(Number);
    const diaSemana = dateParts.length === 3 && dateParts.every(Number.isFinite)
      ? diasSemana[new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])).getUTCDay()]
      : 'Día no disponible';
    const grupoHora = `${diaSemana}\u0000${hora}`;
    const resumenHora = horas.get(grupoHora) ?? { diaSemana, hora, comprobantes: 0, total: 0 };
    resumenHora.comprobantes += 1;
    resumenHora.total += Number(venta.total ?? 0);
    horas.set(grupoHora, resumenHora);

    const resumenDia = dias.get(fecha) ?? { fecha, comprobantes: 0, total: 0, comensales: 0 };
    resumenDia.comprobantes += 1;
    resumenDia.total += Number(venta.total ?? 0);
    resumenDia.comensales += Number(pedido?.n_comensales ?? 0);
    dias.set(fecha, resumenDia);

    const mesaNombre = pedido?.mesa?.[0]?.numero ?? 'Sin mesa';
    const ambienteNombre = pedido?.mesa?.[0]?.ambiente?.[0]?.n_ambiente ?? 'Sin ambiente';
    const mesaKey = `${mesaNombre}\u0000${ambienteNombre}`;
    const resumenMesa = mesas.get(mesaKey) ?? {
      mesa: mesaNombre,
      ambiente: ambienteNombre,
      comprobantes: 0,
      total: 0,
    };
    resumenMesa.comprobantes += 1;
    resumenMesa.total += Number(venta.total ?? 0);
    mesas.set(mesaKey, resumenMesa);

    const empleado = pedido?.empleado?.[0]?.persona?.[0];
    const empleadoNombre = empleado
      ? `${empleado.nombre} ${empleado.ap_paterno ?? ''}`.trim()
      : 'Sin empleado asignado';
    const resumenEmpleado = empleados.get(empleadoNombre) ?? {
      empleado: empleadoNombre,
      comprobantes: 0,
      total: 0,
    };
    resumenEmpleado.comprobantes += 1;
    resumenEmpleado.total += Number(venta.total ?? 0);
    empleados.set(empleadoNombre, resumenEmpleado);

    const resumenImpuesto = impuestos.get(fecha) ?? {
      fecha,
      comprobantes: 0,
      subtotal: 0,
      descuento: 0,
      servicio: 0,
      igv: 0,
      total: 0,
    };
    resumenImpuesto.comprobantes += 1;
    resumenImpuesto.subtotal += Number(venta.subtotal ?? 0);
    resumenImpuesto.descuento += Number(venta.descuento ?? 0);
    resumenImpuesto.servicio += Number(venta.servicio ?? 0);
    resumenImpuesto.igv += Number(venta.igv ?? 0);
    resumenImpuesto.total += Number(venta.total ?? 0);
    impuestos.set(fecha, resumenImpuesto);

    const tipoCliente = venta.cliente?.[0]?.tipo_cliente === 'N'
      ? 'Persona'
      : venta.cliente?.[0]?.tipo_cliente === 'J' ? 'Empresa' : 'Sin cliente identificado';
    const resumenTipoCliente = tiposCliente.get(tipoCliente) ?? {
      tipo: tipoCliente,
      comprobantes: 0,
      total: 0,
    };
    resumenTipoCliente.comprobantes += 1;
    resumenTipoCliente.total += Number(venta.total ?? 0);
    tiposCliente.set(tipoCliente, resumenTipoCliente);

    ventasPorApertura.set(
      venta.id_aperturacaja,
      (ventasPorApertura.get(venta.id_aperturacaja) ?? 0) + Number(venta.total ?? 0),
    );

    if (venta.id_cliente !== null) {
      const resumenCliente = clientes.get(venta.id_cliente) ?? {
        clienteId: venta.id_cliente,
        compras: 0,
        total: 0,
        ultimaCompra: venta.f_venta,
      };
      resumenCliente.compras += 1;
      resumenCliente.total += Number(venta.total ?? 0);
      if (venta.f_venta > resumenCliente.ultimaCompra) resumenCliente.ultimaCompra = venta.f_venta;
      clientes.set(venta.id_cliente, resumenCliente);
    }
  }

  const clientesPorId = new Map<number, string>();
  const clienteIds = Array.from(clientes.keys());
  for (let offset = 0; offset < clienteIds.length; offset += 500) {
    const ids = clienteIds.slice(offset, offset + 500);
    const { data, error } = await supabase
      .from('vw_clientes')
      .select('id_cliente, cliente')
      .in('id_cliente', ids);
    if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
    for (const row of (data ?? []) as ClienteFrecuenteRow[]) {
      clientesPorId.set(row.id_cliente, row.cliente);
    }
  }

  const pagosDetalle = await cargarTodasLasFilas<PagoDetalleReporteRow>((desde, hasta) => {
    let query = supabase
      .from('pago_venta')
      .select('id_pago, id_venta, monto, referencia, f_pago, metodo_pago(n_metodopago), venta!inner(f_venta, tipodocumento, id_aperturacaja)')
      .eq('estado', 'A')
      .order('f_pago', { ascending: false })
      .order('id_pago', { ascending: false });
    if (q.desde) query = query.gte('f_pago', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_pago', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });

  const [boletas, facturas] = await Promise.all([
    cargarTodasLasFilas<DocumentoFiscalReporteRow>((desde, hasta) => {
      let query = supabase
        .from('boleta')
        .select('id_venta, serie, numero, f_emision, estado_sunat, venta!inner(f_venta, total)')
        .eq('estado', 'A')
        .order('f_emision', { ascending: false });
      if (q.desde) query = query.gte('f_emision', `${q.desde}T00:00:00`);
      if (q.hasta) query = query.lte('f_emision', `${q.hasta}T23:59:59`);
      return query.range(desde, hasta);
    }),
    cargarTodasLasFilas<DocumentoFiscalReporteRow>((desde, hasta) => {
      let query = supabase
        .from('factura')
        .select('id_venta, serie, numero, f_emision, estado_sunat, venta!inner(f_venta, total)')
        .eq('estado', 'A')
        .order('f_emision', { ascending: false });
      if (q.desde) query = query.gte('f_emision', `${q.desde}T00:00:00`);
      if (q.hasta) query = query.lte('f_emision', `${q.hasta}T23:59:59`);
      return query.range(desde, hasta);
    }),
  ]);

  const anulacionesVenta = await cargarTodasLasFilas<VentaAnuladaRow>((desde, hasta) => {
    let query = supabase
      .from('venta')
      .select('id_venta, f_venta, tipodocumento, total, motivo_anulacion, usuario:usuario(logeo)')
      .eq('estado', 'A')
      .eq('anulada', 'S')
      .order('f_venta', { ascending: false })
      .order('id_venta', { ascending: false });
    if (q.desde) query = query.gte('f_venta', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_venta', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });

  const reservasEstados = await cargarTodasLasFilas<{ situacion: string }>((desde, hasta) => {
    let query = supabase
      .from('reserva')
      .select('situacion')
      .eq('estado', 'A');
    if (q.desde) query = query.gte('f_reserva', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_reserva', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });
  const reservasPorEstado = new Map<string, number>();
  for (const reserva of reservasEstados) {
    reservasPorEstado.set(reserva.situacion, (reservasPorEstado.get(reserva.situacion) ?? 0) + 1);
  }

  const aperturas = await cargarTodasLasFilas<AperturaResumenRow>((desde, hasta) => {
    let query = supabase
      .from('apertura_caja')
      .select('id_aperturacaja, numero_turno, f_apertura, f_cierre, monto_inicial, total_ingresos, total_egresos, monto_sistema, monto_declarado, diferencia, situacion, caja(n_caja)')
      .eq('estado', 'A')
      .order('f_apertura', { ascending: false })
      .order('id_aperturacaja', { ascending: false });
    if (q.desde) query = query.gte('f_apertura', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_apertura', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });

  let ventasPrevias: { total: number }[] = [];
  let rangoComparacionAnterior: { desde: string; hasta: string } | null = null;
  if (q.desde && q.hasta) {
    const inicioActual = new Date(`${q.desde}T00:00:00.000Z`);
    const finActual = new Date(`${q.hasta}T00:00:00.000Z`);
    const diasPeriodo = Math.floor((finActual.getTime() - inicioActual.getTime()) / 86_400_000) + 1;
    if (
      Number.isFinite(inicioActual.getTime())
      && Number.isFinite(finActual.getTime())
      && diasPeriodo > 0
      && inicioActual.toISOString().slice(0, 10) === q.desde
      && finActual.toISOString().slice(0, 10) === q.hasta
    ) {
      const inicioPrevio = new Date(inicioActual.getTime() - diasPeriodo * 86_400_000);
      const finPrevio = new Date(inicioActual.getTime() - 1);
      rangoComparacionAnterior = {
        desde: inicioPrevio.toISOString().slice(0, 10),
        hasta: finPrevio.toISOString().slice(0, 10),
      };
      ventasPrevias = await cargarTodasLasFilas<{ total: number }>((desde, hasta) =>
        supabase
          .from('venta')
          .select('total')
          .eq('estado', 'A')
          .eq('anulada', 'N')
          .gte('f_venta', inicioPrevio.toISOString())
          .lte('f_venta', finPrevio.toISOString())
          .order('f_venta', { ascending: true })
          .range(desde, hasta));
    }
  }

  const anulados = await cargarTodasLasFilas<PedidoAnuladoRow>((desde, hasta) => {
    let query = supabase
      .from('pedido')
      .select('id_pedido, numero_pedido, f_pedido, motivo_anulacion, total, n_comensales, tipo_pedido(n_tipopedido), usuario:usuario(logeo)')
      .eq('estado', 'A')
      .eq('anulado', 'S')
      .order('f_pedido', { ascending: false })
      .order('id_pedido', { ascending: false });
    if (q.desde) query = query.gte('f_pedido', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_pedido', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });

  const notasCredito = await cargarTodasLasFilas<NotaCreditoRow>((desde, hasta) => {
    let query = supabase
      .from('nota_credito')
      .select('id_notacredito, id_venta, serie, numero, tipo_doc_referencia, serie_referencia, numero_referencia, motivo, monto, f_emision, estado_sunat')
      .eq('estado', 'A')
      .order('f_emision', { ascending: false })
      .order('id_notacredito', { ascending: false });
    if (q.desde) query = query.gte('f_emision', `${q.desde}T00:00:00`);
    if (q.hasta) query = query.lte('f_emision', `${q.hasta}T23:59:59`);
    return query.range(desde, hasta);
  });

  const totalPeriodoActual = Array.from(dias.values()).reduce((total, dia) => total + dia.total, 0);
  const totalPeriodoAnterior = ventasPrevias.reduce((total, venta) => total + Number(venta.total ?? 0), 0);
  const documentosSunat = [
    ...boletas.map((documento) => ({
      ventaId: documento.id_venta,
      tipoDocumento: 'Boleta',
      serie: documento.serie.trim(),
      numero: documento.numero.trim(),
      fecha: documento.f_emision,
      total: Number(documento.venta?.[0]?.total ?? 0),
      estadoRegistrado: documento.estado_sunat ?? 'Sin estado registrado',
    })),
    ...facturas.map((documento) => ({
      ventaId: documento.id_venta,
      tipoDocumento: 'Factura',
      serie: documento.serie.trim(),
      numero: documento.numero.trim(),
      fecha: documento.f_emision,
      total: Number(documento.venta?.[0]?.total ?? 0),
      estadoRegistrado: documento.estado_sunat ?? 'Sin estado registrado',
    })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return {
    ventasCanal: Array.from(canales.values())
      .sort((a, b) => b.total - a.total || a.canal.localeCompare(b.canal, 'es')),
    ventasHorario: Array.from(horas.values())
      .sort((a, b) => b.total - a.total || a.diaSemana.localeCompare(b.diaSemana, 'es') || a.hora.localeCompare(b.hora)),
    ticketPromedio: Array.from(dias.values())
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map((dia) => ({
        ...dia,
        ticketPromedio: dia.comprobantes > 0 ? dia.total / dia.comprobantes : 0,
        ticketPorComensal: dia.comensales > 0 ? dia.total / dia.comensales : null,
      })),
    pedidosAnulados: anulados.map((pedido) => ({
      id: pedido.id_pedido,
      numero: pedido.numero_pedido,
      fechaPedido: pedido.f_pedido,
      tipo: pedido.tipo_pedido?.[0]?.n_tipopedido ?? 'No especificado',
      responsable: pedido.usuario?.[0]?.logeo ?? '—',
      total: Number(pedido.total ?? 0),
      comensales: Number(pedido.n_comensales ?? 0),
      motivo: pedido.motivo_anulacion,
    })),
    notasCredito: notasCredito.map((nota) => ({
      id: nota.id_notacredito,
      ventaId: nota.id_venta,
      serie: nota.serie.trim(),
      numero: nota.numero.trim(),
      tipoDocumentoReferencia: nota.tipo_doc_referencia,
      serieReferencia: nota.serie_referencia.trim(),
      numeroReferencia: nota.numero_referencia.trim(),
      motivo: nota.motivo,
      monto: Number(nota.monto ?? 0),
      fecha: nota.f_emision,
      estadoSunat: nota.estado_sunat,
    })),
    clientesFrecuentes: Array.from(clientes.values())
      .map((cliente) => ({
        ...cliente,
        nombre: clientesPorId.get(cliente.clienteId) ?? `Cliente ${cliente.clienteId}`,
        ticketPromedio: cliente.compras > 0 ? cliente.total / cliente.compras : 0,
      }))
      .sort((a, b) => b.total - a.total || b.compras - a.compras)
      .slice(0, 100),
    ventasPorMesa: Array.from(mesas.values())
      .sort((a, b) => b.total - a.total || a.mesa.localeCompare(b.mesa, 'es')),
    ventasPorEmpleado: Array.from(empleados.values())
      .sort((a, b) => b.total - a.total || a.empleado.localeCompare(b.empleado, 'es')),
    desgloseFiscal: Array.from(impuestos.values())
      .sort((a, b) => b.fecha.localeCompare(a.fecha)),
    ventasAnuladas: anulacionesVenta.map((venta) => ({
      id: venta.id_venta,
      fechaVenta: venta.f_venta,
      tipoDocumento: venta.tipodocumento.trim(),
      total: Number(venta.total ?? 0),
      motivo: venta.motivo_anulacion,
      responsable: venta.usuario?.[0]?.logeo ?? '—',
    })),
    estadoSunat: documentosSunat,
    pagosPorOperacion: pagosDetalle.map((pago) => ({
      id: pago.id_pago,
      ventaId: pago.id_venta,
      fechaPago: pago.f_pago,
      fechaVenta: pago.venta?.[0]?.f_venta ?? '',
      tipoDocumento: pago.venta?.[0]?.tipodocumento.trim() ?? '',
      aperturaId: pago.venta?.[0]?.id_aperturacaja ?? null,
      metodoPago: pago.metodo_pago?.[0]?.n_metodopago ?? 'Sin método',
      monto: Number(pago.monto ?? 0),
      referencia: pago.referencia,
    })),
    reservasPorEstado: Array.from(reservasPorEstado, ([estado, cantidad]) => ({ estado, cantidad }))
      .sort((a, b) => a.estado.localeCompare(b.estado)),
    ventasPorTipoCliente: Array.from(tiposCliente.values())
      .sort((a, b) => b.total - a.total || a.tipo.localeCompare(b.tipo, 'es')),
    comparacionPeriodos: rangoComparacionAnterior
      ? {
          desde: q.desde,
          hasta: q.hasta,
          anteriorDesde: rangoComparacionAnterior.desde,
          anteriorHasta: rangoComparacionAnterior.hasta,
          ventasActuales: totalPeriodoActual,
          ventasAnteriores: totalPeriodoAnterior,
          diferencia: totalPeriodoActual - totalPeriodoAnterior,
          variacionPorcentual: totalPeriodoAnterior > 0
            ? ((totalPeriodoActual - totalPeriodoAnterior) / totalPeriodoAnterior) * 100
            : null,
        }
      : null,
    resumenCaja: aperturas.map((apertura) => ({
      aperturaId: apertura.id_aperturacaja,
      caja: apertura.caja?.[0]?.n_caja ?? 'Caja sin nombre',
      turno: String(apertura.numero_turno),
      fechaApertura: apertura.f_apertura,
      fechaCierre: apertura.f_cierre,
      situacion: apertura.situacion,
      ventasRegistradas: ventasPorApertura.get(apertura.id_aperturacaja) ?? 0,
      ingresosTurno: Number(apertura.total_ingresos ?? 0),
      egresosTurno: Number(apertura.total_egresos ?? 0),
      montoSistema: Number(apertura.monto_sistema ?? 0),
      montoDeclarado: Number(apertura.monto_declarado ?? 0),
      diferencia: Number(apertura.diferencia ?? 0),
    })),
  };
}
