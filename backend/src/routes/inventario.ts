import { Router } from 'express';
import { getMovimientos, getRecetas, patchReceta, postMovimiento, postReceta } from '../controllers/inventario-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const inventarioRouter = Router();

inventarioRouter.use(authGuard);
inventarioRouter.get('/movimientos', requirePermisos('INV_VER'), asyncHandler(getMovimientos));
inventarioRouter.post('/movimientos', requirePermisos('INV_CREAR'), asyncHandler(postMovimiento));
inventarioRouter.get('/recetas', requirePermisos('REC_VER'), asyncHandler(getRecetas));
inventarioRouter.post('/recetas', requirePermisos('REC_CREAR'), asyncHandler(postReceta));
inventarioRouter.patch('/recetas/:id', requirePermisos('REC_CREAR'), asyncHandler(patchReceta));
