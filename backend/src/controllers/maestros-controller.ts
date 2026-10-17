import type { Request, Response } from 'express';
import { IdentidadError } from '../models/identidad.js';
import { dniParamSchema, rucParamSchema, ubigeoQuerySchema } from '../schemas/identidad.js';
import { consultarDni, consultarRuc, distritoPorUbigeo } from '../services/identidad-service.js';
import {
  cargosService,
  contratosService,
  departamentosService,
  distritosService,
  provinciasService,
  tiposIdentidadService,
} from '../services/maestros-service.js';

export async function getDistritos(_req: Request, res: Response): Promise<void> {
  res.json(await distritosService());
}

/** Departamentos activos (cascada de ubicación en formularios). */
export async function getDepartamentos(_req: Request, res: Response): Promise<void> {
  res.json(await departamentosService());
}

/** Provincias activas con su departamento (cascada de ubicación). */
export async function getProvincias(_req: Request, res: Response): Promise<void> {
  res.json(await provinciasService());
}

export async function getCargos(_req: Request, res: Response): Promise<void> {
  res.json(await cargosService());
}

export async function getContratos(_req: Request, res: Response): Promise<void> {
  res.json(await contratosService());
}

export async function getTiposIdentidad(_req: Request, res: Response): Promise<void> {
  res.json(await tiposIdentidadService());
}

function errorIdentidad(res: Response, err: unknown): void {
  if (err instanceof IdentidadError) {
    const status =
      err.code === 'DOCUMENTO_NO_ENCONTRADO'
        ? 404
        : err.code === 'IDENTIDAD_NO_DISPONIBLE'
          ? 502
          : err.code === 'IDENTIDAD_NO_CONFIGURADA'
            ? 503
            : 400;
    res.status(status).json({ error: err.code });
    return;
  }
  throw err;
}

/** Proxy Factiliza DNI (RENIEC). El token vive solo en el backend. */
export async function getDni(req: Request, res: Response): Promise<void> {
  const parsed = dniParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    res.json(await consultarDni(parsed.data.numero));
  } catch (err) {
    errorIdentidad(res, err);
  }
}

/** Proxy Factiliza RUC (SUNAT). El token vive solo en el backend. */
export async function getRuc(req: Request, res: Response): Promise<void> {
  const parsed = rucParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    res.json(await consultarRuc(parsed.data.numero));
  } catch (err) {
    errorIdentidad(res, err);
  }
}

/** Resuelve un ubigeo SUNAT a distrito activo (preselección exacta del picker). */
export async function getDistritoPorUbigeo(req: Request, res: Response): Promise<void> {
  const parsed = ubigeoQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten() });
    return;
  }
  try {
    res.json(await distritoPorUbigeo(parsed.data.ubigeo));
  } catch (err) {
    errorIdentidad(res, err);
  }
}
