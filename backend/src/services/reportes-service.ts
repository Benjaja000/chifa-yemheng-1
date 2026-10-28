import type {
  ReportesArqueoQuery,
  ReportesMovimientosQuery,
  ReportesPagosQuery,
  ReportesProductosQuery,
  ReportesAnalisisQuery,
  ReportesReservasQuery,
  ReportesDeliveryQuery,
  ReportesVentasQuery,
} from '../schemas/reportes.js';
import {
  arqueoCaja,
  analisisComercial,
  comprobantesEmitidos,
  deliveryReporte,
  movimientosCajaReporte,
  pagosPorMedio,
  productosMasVendidos,
  reservasReporte,
  ventasPorCategoria,
  ventasDiarias,
} from '../repositories/reportes-repository.js';

export async function ventasDiariasService(q: ReportesVentasQuery) {
  return ventasDiarias(q);
}
export async function productosMasVendidosService(q: ReportesProductosQuery) {
  return productosMasVendidos(q);
}
export async function arqueoCajaService(q: ReportesArqueoQuery) {
  return arqueoCaja(q);
}
export async function pagosPorMedioService(q: ReportesPagosQuery) {
  return pagosPorMedio(q);
}
export async function comprobantesService(q: ReportesMovimientosQuery) {
  return comprobantesEmitidos(q);
}
export async function movimientosCajaService(q: ReportesMovimientosQuery) {
  return movimientosCajaReporte(q);
}

export async function ventasPorCategoriaService(q: ReportesVentasQuery) {
  return ventasPorCategoria(q);
}
export async function reservasReporteService(q: ReportesReservasQuery) {
  return reservasReporte(q);
}
export async function deliveryReporteService(q: ReportesDeliveryQuery) {
  return deliveryReporte(q);
}
export async function analisisComercialService(q: ReportesAnalisisQuery) {
  return analisisComercial(q);
}
