import { Router } from 'express';
import { getAuditoria } from '../controllers/auditoria-controller.js';
import { authGuard } from '../middlewares/auth-guard.js';
import { requirePermisos } from '../middlewares/permission-guard.js';

export const auditoriaRouter = Router();

auditoriaRouter.use(authGuard);
auditoriaRouter.get('/', requirePermisos('AUD_VER'), getAuditoria);
