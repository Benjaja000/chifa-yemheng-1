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
unidadesRouter.get('/', requirePermisos('UNI_VER'), getUnidades);
unidadesRouter.get('/:id', requirePermisos('UNI_VER'), getUnidad);
unidadesRouter.post('/', requirePermisos('UNI_CREAR'), postUnidad);
unidadesRouter.put('/:id', requirePermisos('UNI_EDITAR'), putUnidad);
unidadesRouter.patch('/:id/estado', requirePermisos('UNI_ELIMINAR'), patchUnidadEstado);
