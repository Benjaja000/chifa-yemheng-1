import { Router } from 'express';
import { getClienteSesion, postClienteEmailSession, postClienteLogout, postClienteOAuth } from '../controllers/cliente-auth-controller.js';
import { postClienteReserva, getMisReservasCli } from '../controllers/cliente-reservas-controller.js';

export const clienteAuthRouter = Router();

clienteAuthRouter.post('/oauth/google', postClienteOAuth);
clienteAuthRouter.post('/email/session', postClienteEmailSession);
clienteAuthRouter.get('/sesion', getClienteSesion);
clienteAuthRouter.post('/logout', postClienteLogout);
clienteAuthRouter.post('/reservas', postClienteReserva);
clienteAuthRouter.get('/reservas', getMisReservasCli);