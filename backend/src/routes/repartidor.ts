import { Router } from 'express';
import { getMiEntrega, getMisEntregas, getPorRendir, postConfirmarEntrega, postIniciarRuta, postUbicacion } from '../controllers/repartidor-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const repartidorRouter = Router();

repartidorRouter.use(authGuard);
repartidorRouter.get('/entregas', requirePermisos('DELIVERY_VER'), asyncHandler(getMisEntregas));
repartidorRouter.get('/entregas/:id', requirePermisos('DELIVERY_VER'), asyncHandler(getMiEntrega));
repartidorRouter.patch('/entregas/:id/ruta', requirePermisos('DELIVERY_ENTREGAR'), asyncHandler(postIniciarRuta));
repartidorRouter.patch('/entregas/:id/entregar', requirePermisos('DELIVERY_ENTREGAR'), asyncHandler(postConfirmarEntrega));
repartidorRouter.post('/entregas/:id/ubicacion', requirePermisos('DELIVERY_ENTREGAR'), asyncHandler(postUbicacion));
repartidorRouter.get('/por-rendir', requirePermisos('DELIVERY_VER'), asyncHandler(getPorRendir));