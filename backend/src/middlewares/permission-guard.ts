import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from './auth-guard.js';

/** PermissionGuard: exige al menos uno de los permisos (claves) indicados. */
export function requirePermisos(...claves: string[]) {
  const wanted = claves.map((c) => c.toUpperCase());
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
      return;
    }
    const mine = user.permisos.map((p) => p.toUpperCase());
    if (!wanted.some((c) => mine.includes(c))) {
      res.status(403).json({ error: 'FORBIDDEN' });
      return;
    }
    next();
  };
}

/** Allows a route when the user has any listed permission or belongs to any listed role. */
export function requirePermisosORoles(permisos: string[], roles: string[]) {
  const wantedPermisos = permisos.map((p) => p.toUpperCase());
  const wantedRoles = roles.map((r) => r.toUpperCase());
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
      return;
    }
    const minePermisos = user.permisos.map((p) => p.toUpperCase());
    const mineRoles = [...user.roles, user.tipo].map((r) => r.toUpperCase());
    if (
      !wantedPermisos.some((p) => minePermisos.includes(p)) &&
      !wantedRoles.some((r) => mineRoles.includes(r))
    ) {
      res.status(403).json({ error: 'FORBIDDEN' });
      return;
    }
    next();
  };
}
