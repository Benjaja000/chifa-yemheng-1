import { Router } from 'express';
import {
  getTipoMesa,
  getTiposMesa,
  patchTipoMesaEstado,
  postTipoMesa,
  putTipoMesa,
} from '../controllers/tipos-mesa-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const tiposMesaRouter = Router();

tiposMesaRouter.use(authGuard);
tiposMesaRouter.get('/', requirePermisos('TMESA_VER', 'MESA_VER'), getTiposMesa);
tiposMesaRouter.get('/:id', requirePermisos('TMESA_VER', 'MESA_VER'), getTipoMesa);
tiposMesaRouter.post('/', requirePermisos('TMESA_CREAR'), postTipoMesa);
tiposMesaRouter.put('/:id', requirePermisos('TMESA_EDITAR'), putTipoMesa);
tiposMesaRouter.patch('/:id/estado', requirePermisos('TMESA_ELIMINAR'), patchTipoMesaEstado);
