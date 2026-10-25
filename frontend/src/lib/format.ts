export const fmtPEN = (n: number | null | undefined) =>
  `S/ ${(Number(n) || 0).toFixed(2)}`;

export const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
};

export const timeAgo = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return 'ahora mismo';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  return `hace ${h} h ${m % 60} min`;
};

export const igvOf = (total: number) => total - total / 1.18;
export const baseOf = (total: number) => total / 1.18;

export const errText = (e: unknown, fallback = 'Error'): string => {
  if (e instanceof Error) return e.message;
  if (e && typeof e === 'object') {
    const o = e as { message?: string; details?: string; hint?: string; code?: string };
    if (o.code === '42501' || /row-level security/i.test(o.message ?? '')) return `La base de datos rechazó el guardado por permisos (RLS). ${o.message ?? ''}`.trim();
    const extra = [o.details, o.hint].filter(Boolean).join(' · ');
    if (o.message) return `${o.message}${o.code ? ` [${o.code}]` : ''}${extra ? ` — ${extra}` : ''}`;
  }
  return fallback;
};