import { Router } from 'express';
import { getReservas, patchConfirmar, patchAtender, patchAnular, patchReprogramar, getDisponibilidad, postReserva } from '../controllers/reservas-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const reservasRouter = Router();

reservasRouter.use(authGuard);
reservasRouter.get('/', requirePermisos('RES_VER'), asyncHandler(getReservas));
reservasRouter.post('/', requirePermisos('RES_CREAR'), asyncHandler(postReserva));
reservasRouter.patch('/:id/confirmar', requirePermisos('RES_CONFIRMAR'), asyncHandler(patchConfirmar));
reservasRouter.patch('/:id/atender', requirePermisos('RES_ATENDER'), asyncHandler(patchAtender));
reservasRouter.patch('/:id/anular', requirePermisos('RES_ANULAR'), asyncHandler(patchAnular));
reservasRouter.patch('/:id/reprogramar', requirePermisos('RES_REPROGRAMAR'), asyncHandler(patchReprogramar));
reservasRouter.get('/disponibilidad', requirePermisos('RES_VER'), asyncHandler(getDisponibilidad));