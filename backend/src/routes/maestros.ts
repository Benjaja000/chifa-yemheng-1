import { Router } from 'express';
import {
  getCargos,
  getContratos,
  getDistritos,
  getDepartamentos,
  getProvincias,
  getTiposIdentidad,
} from '../controllers/maestros-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const maestrosRouter = Router();

// Datos de referencia públicos (no requieren autenticación): usados por clientes en flujos de delivery sin sesión.
maestrosRouter.get('/departamentos', getDepartamentos);
maestrosRouter.get('/provincias', getProvincias);
maestrosRouter.get('/distritos', getDistritos);
maestrosRouter.get('/tipos-identidad', getTiposIdentidad);

// Datos de referencia de personal: requieren autenticación y permiso EMP_VER.
maestrosRouter.get('/cargos', authGuard, requirePermisos('EMP_VER'), getCargos);
maestrosRouter.get('/contratos', authGuard, requirePermisos('EMP_VER'), getContratos);
