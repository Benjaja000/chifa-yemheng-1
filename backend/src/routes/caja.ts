import { Router } from 'express';
import {
  getCajaMaestros,
  getCajaPendientes,
  postCajaCobro,
  postCajaTurno,
} from '../controllers/caja-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const cajaRouter = Router();

cajaRouter.use(authGuard);
cajaRouter.get(
  '/maestros',
  requirePermisos('CAJ_APERTURAR', 'CAJA_APERTURA', 'VEN_COBRAR', 'PED_VER', 'PED_REGISTRAR'),
  getCajaMaestros,
);
cajaRouter.get(
  '/pendientes',
  requirePermisos('CAJ_APERTURAR', 'CAJA_APERTURA', 'VEN_COBRAR', 'PED_VER', 'PED_REGISTRAR'),
  getCajaPendientes,
);
cajaRouter.post(
  '/turno',
  requirePermisos('CAJ_APERTURAR', 'CAJA_APERTURA'),
  postCajaTurno,
);
cajaRouter.post(
  '/cobro',
  requirePermisos('VEN_COBRAR', 'VEN_EMITIR'),
  postCajaCobro,
);
