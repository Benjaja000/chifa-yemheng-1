import { Router } from 'express';
import { getArqueoCaja, getProductosMasVendidos, getVentasDiarias } from '../controllers/reportes-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const reportesRouter = Router();

reportesRouter.use(authGuard);
reportesRouter.get('/ventas-diarias', requirePermisos('REP_VER'), asyncHandler(getVentasDiarias));
reportesRouter.get('/productos-mas-vendidos', requirePermisos('REP_VER'), asyncHandler(getProductosMasVendidos));
reportesRouter.get('/arqueo-caja', requirePermisos('REP_VER'), asyncHandler(getArqueoCaja));
