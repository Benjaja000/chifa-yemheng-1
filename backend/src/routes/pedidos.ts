import { Router } from 'express';
import {
  getPedido,
  getPedidos,
  getCocina,
  patchAnular,
  patchPedirCuenta,
  patchPreparacion,
  postDetalle,
  postPedido,
  postRecalcular,
} from '../controllers/pedidos-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const pedidosRouter = Router();

pedidosRouter.use(authGuard);
pedidosRouter.get('/cocina', requirePermisos('PED_COCINA', 'PED_VER', 'PED_REGISTRAR'), getCocina);
pedidosRouter.get('/', requirePermisos('PED_VER'), getPedidos);
pedidosRouter.get('/:id', requirePermisos('PED_VER'), getPedido);
pedidosRouter.post('/', requirePermisos('PED_REGISTRAR'), postPedido);
pedidosRouter.post('/:id/detalles', requirePermisos('PED_REGISTRAR'), postDetalle);
pedidosRouter.patch(
  '/:id/detalles/:idDetalle/preparacion',
  requirePermisos('PED_COCINA', 'PED_REGISTRAR'),
  patchPreparacion,
);
pedidosRouter.patch(
  '/:id/pedir-cuenta',
  requirePermisos('PED_EDITAR', 'PED_REGISTRAR'),
  patchPedirCuenta,
);
pedidosRouter.patch('/:id/anular', requirePermisos('PED_ANULAR'), patchAnular);
pedidosRouter.post('/:id/recalcular', requirePermisos('PED_REGISTRAR'), postRecalcular);