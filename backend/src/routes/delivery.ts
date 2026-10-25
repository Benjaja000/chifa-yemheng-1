import { Router } from 'express';
import { getDelivery, patchAsignar, patchDespachar, patchEntregar, postDelivery, getSugerirCosto } from '../controllers/delivery-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const deliveryRouter = Router();

deliveryRouter.use(authGuard);
deliveryRouter.get('/', requirePermisos('DELIVERY_VER'), asyncHandler(getDelivery));
deliveryRouter.post('/', requirePermisos('DELIVERY_VER'), asyncHandler(postDelivery));
deliveryRouter.patch('/:id/asignar', requirePermisos('DELIVERY_ASIGNAR'), asyncHandler(patchAsignar));
deliveryRouter.patch('/:id/despachar', requirePermisos('DELIVERY_DESPACHAR'), asyncHandler(patchDespachar));
deliveryRouter.patch('/:id/entregar', requirePermisos('DELIVERY_ENTREGAR'), asyncHandler(patchEntregar));
deliveryRouter.get('/sugerir-costo', requirePermisos('DELIVERY_VER'), asyncHandler(getSugerirCosto));
