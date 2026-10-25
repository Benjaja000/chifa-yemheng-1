import type { AuditoriaQuery } from '../schemas/auditoria.js';
import { listarAuditoria } from '../repositories/auditoria-repository.js';

export async function listarAuditoriaService(q: AuditoriaQuery) {
  return listarAuditoria(q);
}
