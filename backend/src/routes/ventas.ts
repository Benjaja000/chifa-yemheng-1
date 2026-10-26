import { Router } from 'express';
import { getNotasCredito, postNotaCredito } from '../controllers/ventas-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const ventasRouter = Router();

ventasRouter.use(authGuard);
ventasRouter.get(
  '/:id/nota-credito',
  requirePermisos('VEN_NOTACREDITO', 'VEN_VER', 'VEN_COBRAR'),
  getNotasCredito,
);
ventasRouter.post(
  '/:id/nota-credito',
  requirePermisos('VEN_NOTACREDITO'),
  postNotaCredito,
);
