import type { Request, Response } from 'express';
import {
  cargosService,
  contratosService,
  distritosService,
  departamentosService,
  provinciasService,
  tiposIdentidadService,
} from '../services/maestros-service.js';

export async function getDepartamentos(_req: Request, res: Response): Promise<void> {
  res.json(await departamentosService());
}

export async function getProvincias(req: Request, res: Response): Promise<void> {
  const rawDepartamento = req.query.departamento;
  const idDepartamento = rawDepartamento === undefined ? undefined : Number(rawDepartamento);
  if (idDepartamento !== undefined && (!Number.isInteger(idDepartamento) || idDepartamento <= 0)) {
    res.status(400).json({ error: 'DEPARTAMENTO_REQUERIDO' });
    return;
  }
  res.json(await provinciasService(idDepartamento));
}

export async function getDistritos(req: Request, res: Response): Promise<void> {
  const idProvincia = req.query.provincia ? Number(req.query.provincia) : undefined;
  res.json(await distritosService(idProvincia));
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
