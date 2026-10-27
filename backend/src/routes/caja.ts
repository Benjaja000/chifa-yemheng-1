import { Router } from 'express';
import {
  getCajaMaestros,
  getCajaPendientes,
  getCierresPendientes,
  postCajaCierre,
  postCajaCobro,
  postCajaConfirmarCierre,
  postCajaTurno,
} from '../controllers/caja-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const cajaRouter = Router();

cajaRouter.use(authGuard);
cajaRouter.get(
  '/maestros',
  requirePermisos('CAJ_APERTURAR', 'CAJA_APERTURA', 'VEN_COBRAR', 'PED_VER', 'PED_REGISTRAR', 'CAJ_VALIDAR_CIERRE'),
  getCajaMaestros,
);
cajaRouter.get(
  '/pendientes',
  requirePermisos('CAJ_APERTURAR', 'CAJA_APERTURA', 'VEN_COBRAR', 'PED_VER', 'PED_REGISTRAR', 'CAJ_VALIDAR_CIERRE'),
  getCajaPendientes,
);
cajaRouter.get('/cierres/pendientes', requirePermisos('CAJ_VALIDAR_CIERRE'), getCierresPendientes);
cajaRouter.post(
  '/turno',
  requirePermisos('CAJ_APERTURAR', 'CAJA_APERTURA'),
  postCajaTurno,
);
cajaRouter.post('/turno/cierre', requirePermisos('CAJ_CERRAR'), postCajaCierre);
cajaRouter.post('/turno/cierre/confirmar', requirePermisos('CAJ_VALIDAR_CIERRE'), postCajaConfirmarCierre);
cajaRouter.post(
  '/cobro',
  requirePermisos('VEN_COBRAR', 'VEN_EMITIR'),
  postCajaCobro,
);
