import { Router } from 'express';
import {
  buscarPersona,
  getPersona,
  getPersonas,
  postConvertir,
  postHacerCliente,
  postHacerPersonal,
  postPersona,
  putPersona,
} from '../controllers/personas-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const personasRouter = Router();

personasRouter.use(authGuard);
personasRouter.get('/buscar', requirePermisos('PER_VER'), buscarPersona);
personasRouter.get('/', requirePermisos('PER_VER'), getPersonas);
personasRouter.get('/:id', requirePermisos('PER_VER'), getPersona);
personasRouter.post('/', requirePermisos('PER_CREAR'), postPersona);
personasRouter.put('/:id', requirePermisos('PER_CREAR'), putPersona);
personasRouter.post('/:id/hacer-personal', requirePermisos('PER_ASIGNAR'), postHacerPersonal);
personasRouter.post('/:id/hacer-cliente', requirePermisos('PER_ASIGNAR'), postHacerCliente);
personasRouter.post('/:id/convertir', requirePermisos('PER_ASIGNAR'), postConvertir);
