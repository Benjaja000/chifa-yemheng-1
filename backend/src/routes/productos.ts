import { Router } from 'express';
import {
  getProducto,
  getProductos,
  patchProductoEstado,
  postProducto,
  putProducto,
} from '../controllers/productos-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const productosRouter = Router();

// Publico (sin sesion): la carta es publica.
productosRouter.get('/', getProductos);
productosRouter.get('/:id', getProducto);

productosRouter.use(authGuard);
productosRouter.post('/', requirePermisos('PROD_CREAR'), postProducto);
productosRouter.put('/:id', requirePermisos('PROD_EDITAR'), putProducto);
productosRouter.patch('/:id/estado', requirePermisos('PROD_ELIMINAR'), patchProductoEstado);