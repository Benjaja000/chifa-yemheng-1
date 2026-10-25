import type { ReportesArqueoQuery, ReportesProductosQuery, ReportesVentasQuery } from '../schemas/reportes.js';
import { arqueoCaja, productosMasVendidos, ventasDiarias } from '../repositories/reportes-repository.js';

export async function ventasDiariasService(q: ReportesVentasQuery) {
  return ventasDiarias(q);
}
export async function productosMasVendidosService(q: ReportesProductosQuery) {
  return productosMasVendidos(q);
}
export async function arqueoCajaService(q: ReportesArqueoQuery) {
  return arqueoCaja(q);
}
