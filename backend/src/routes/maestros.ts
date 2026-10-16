import { Router } from 'express';
import {
  getCargos,
  getContratos,
  getDistritos,
  getDistritoPorUbigeo,
  getDni,
  getRuc,
  getTiposIdentidad,
} from '../controllers/maestros-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const maestrosRouter = Router();

maestrosRouter.use(authGuard);
maestrosRouter.get(
  '/distritos',
  requirePermisos('EMP_VER', 'CLI_VER'),
  getDistritos,
);
// Identidad (proxy Factiliza): el token nunca sale del backend.
maestrosRouter.get('/dni/:numero', requirePermisos('EMP_VER', 'CLI_VER'), getDni);
maestrosRouter.get('/ruc/:numero', requirePermisos('EMP_VER', 'CLI_VER'), getRuc);
maestrosRouter.get(
  '/distritos/por-ubigeo',
  requirePermisos('EMP_VER', 'CLI_VER'),
  getDistritoPorUbigeo,
);

maestrosRouter.get('/cargos', requirePermisos('EMP_VER'), getCargos);
maestrosRouter.get('/contratos', requirePermisos('EMP_VER'), getContratos);
maestrosRouter.get(
  '/tipos-identidad',
  requirePermisos('EMP_VER', 'CLI_VER'),
  getTiposIdentidad,
);
