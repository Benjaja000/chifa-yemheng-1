import { Router } from 'express';
import {
  getPermisos,
  getRoles,
  getUsuarios,
  postRol,
  postUsuario,
  putRolPermisos,
  putUsuario,
} from '../controllers/seguridad-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';
import { asyncHandler } from '../utils/async-handler.js';

export const seguridadRouter = Router();

seguridadRouter.use(authGuard);
seguridadRouter.get('/usuarios', requirePermisos('SEG_USUARIO'), asyncHandler(getUsuarios));
seguridadRouter.post('/usuarios', requirePermisos('SEG_USUARIO'), asyncHandler(postUsuario));
seguridadRouter.put('/usuarios/:id', requirePermisos('SEG_USUARIO'), asyncHandler(putUsuario));
seguridadRouter.get('/roles', requirePermisos('SEG_ROL'), asyncHandler(getRoles));
seguridadRouter.post('/roles', requirePermisos('SEG_ROL'), asyncHandler(postRol));
seguridadRouter.get('/permisos', requirePermisos('SEG_ROL'), asyncHandler(getPermisos));
seguridadRouter.put('/roles/:id/permisos', requirePermisos('SEG_ROL'), asyncHandler(putRolPermisos));
