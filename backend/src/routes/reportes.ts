import { Router } from 'express';
import {
  getArqueoCaja,
  getAnalisisComercial,
  getComprobantes,
  getReporteDelivery,
  getReporteReservas,
  getMovimientosCaja,
  getPagosPorMedio,
  getProductosMasVendidos,
  getVentasPorCategoria,
  getVentasDiarias,
} from '../controllers/reportes-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const reportesRouter = Router();

reportesRouter.use(authGuard);
reportesRouter.get('/ventas-diarias', requirePermisos('REP_VER'), asyncHandler(getVentasDiarias));
reportesRouter.get('/productos-mas-vendidos', requirePermisos('REP_VER'), asyncHandler(getProductosMasVendidos));
reportesRouter.get('/arqueo-caja', requirePermisos('REP_VER'), asyncHandler(getArqueoCaja));
reportesRouter.get('/pagos-por-medio', requirePermisos('REP_VER'), asyncHandler(getPagosPorMedio));
reportesRouter.get('/comprobantes', requirePermisos('REP_VER'), asyncHandler(getComprobantes));
reportesRouter.get('/movimientos-caja', requirePermisos('REP_VER'), asyncHandler(getMovimientosCaja));
reportesRouter.get('/ventas-por-categoria', requirePermisos('REP_VER'), asyncHandler(getVentasPorCategoria));
reportesRouter.get('/reservas', requirePermisos('REP_VER'), asyncHandler(getReporteReservas));
reportesRouter.get('/delivery', requirePermisos('REP_VER'), asyncHandler(getReporteDelivery));
reportesRouter.get('/analisis-comercial', requirePermisos('REP_VER'), asyncHandler(getAnalisisComercial));
