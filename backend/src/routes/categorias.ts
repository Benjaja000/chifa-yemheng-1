import { Router } from 'express';
import {
  getCategoria,
  getCategorias,
  patchCategoriaEstado,
  postCategoria,
  putCategoria,
} from '../controllers/categorias-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const categoriasRouter = Router();

// Publico (sin sesion): las categorias de la carta son publicas.
categoriasRouter.get('/', getCategorias);
categoriasRouter.get('/:id', getCategoria);

categoriasRouter.use(authGuard);
categoriasRouter.post('/', requirePermisos('CAT_CREAR'), postCategoria);
categoriasRouter.put('/:id', requirePermisos('CAT_EDITAR'), putCategoria);
categoriasRouter.patch('/:id/estado', requirePermisos('CAT_ELIMINAR'), patchCategoriaEstado);