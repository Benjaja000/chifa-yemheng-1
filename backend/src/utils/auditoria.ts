import type { Request } from 'express';
import { isIP } from 'node:net';

/** Guarda la IP del cliente resuelta por Express; no confía en cabeceras enviadas por el navegador. */
export function getPc(req: Request): string {
  const candidates = [req.ip, req.socket?.remoteAddress];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const ip = normalizarIp(candidate);
    if (ip) return ip;
  }
  return 'UNKNOWN';
}

function normalizarIp(value: string): string | null {
  const address = value.trim().replace(/^\[([^\]]+)\](?::\d+)?$/, '$1');
  const normalized = address.toLowerCase().startsWith('::ffff:')
    ? address.slice('::ffff:'.length)
    : address;
  return isIP(normalized) ? normalized : null;
}

export function createAudit(logeo: string, pc: string): { usucre: string; pccre: string | null; feccre: string } {
  return { usucre: logeo, pccre: pc || null, feccre: new Date().toISOString() };
}

export function updateAudit(logeo: string, pc: string): { usumod: string; pcmod: string | null; fecmod: string } {
  return { usumod: logeo, pcmod: pc || null, fecmod: new Date().toISOString() };
}
