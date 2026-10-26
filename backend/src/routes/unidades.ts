import { Router } from 'express';
import {
  getUnidad,
  getUnidades,
  patchUnidadEstado,
  postUnidad,
  putUnidad,
} from '../controllers/unidades-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const unidadesRouter = Router();

unidadesRouter.use(authGuard);
unidadesRouter.get('/', requirePermisos('UNIDAD_VER', 'CAT_VER', 'PROD_VER'), getUnidades);
unidadesRouter.get('/:id', requirePermisos('UNIDAD_VER', 'CAT_VER', 'PROD_VER'), getUnidad);
unidadesRouter.post('/', requirePermisos('UNIDAD_CREAR'), postUnidad);
unidadesRouter.put('/:id', requirePermisos('UNIDAD_EDITAR'), putUnidad);
unidadesRouter.patch('/:id/estado', requirePermisos('UNIDAD_ELIMINAR'), patchUnidadEstado);
