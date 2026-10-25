import { Router } from 'express';
import { getPendientesRendicion, getRendicionPdf, patchObservarRendicion, patchValidarRendicion, postRendicion } from '../controllers/rendicion-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const rendicionRouter = Router();

rendicionRouter.use(authGuard);
rendicionRouter.get('/pendientes', requirePermisos('REN_VER'), asyncHandler(getPendientesRendicion));
rendicionRouter.post('/', requirePermisos('REN_REGISTRAR'), asyncHandler(postRendicion));
rendicionRouter.patch('/:id/validar', requirePermisos('REN_VALIDAR'), asyncHandler(patchValidarRendicion));
rendicionRouter.patch('/:id/observar', requirePermisos('REN_REGISTRAR'), asyncHandler(patchObservarRendicion));
rendicionRouter.get('/:id/pdf', requirePermisos('REN_VER'), asyncHandler(getRendicionPdf));