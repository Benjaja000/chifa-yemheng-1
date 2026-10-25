import type { ReactNode } from 'react';
import { Ico } from './Icon';
import { UtensilsCrossed } from 'lucide-react';

export function PageHeader({ title, sub, right }: { title: ReactNode; sub?: string; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
      <div>
        <h2 className="font-d" style={{ margin: 0, fontSize: 28 }}>{title}</h2>
        {sub && <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>{sub}</p>}
      </div>
      <div>{right}</div>
    </div>
  );
}

export function Empty({ title, sub }: { title: ReactNode; sub?: string }) {
  return (
    <div className="card" style={{ padding: 36, textAlign: 'center' }}>
      <UtensilsCrossed size={40} style={{ color: 'var(--muted)' }} />
      <h3 style={{ margin: '8px 0' }}>{title}</h3>
      {sub && <p style={{ color: 'var(--muted)' }}>{sub}</p>}
    </div>
  );
}

export function Loading({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="skel" style={{ height: 56 }} />
      <div className="skel" style={{ height: 120 }} />
      <p style={{ color: 'var(--muted)' }}>{text}</p>
    </div>
  );
}

export function ErrorBox({ msg, retry }: { msg: string; retry?: () => void }) {
  return (
    <div className="card" style={{ padding: 24, borderColor: 'rgba(186,26,26,.35)', background: 'rgba(255,218,214,.6)' }}>
      <b><Ico n="alert" /> Ocurrió un problema</b>
      <p style={{ color: 'var(--muted)' }}>{msg}</p>
      {retry && <button className="btn btn-ghost" onClick={retry}>Reintentar</button>}
    </div>
  );
}

export function StatusBadge({ v }: { v?: string | null }) {
  const s = String(v ?? '').toUpperCase();
  const cls = ['S', 'SERVIDO', 'ENTREGADO', 'LIBRE', 'CONFIRMADA', 'ATENDIDA', 'CUADRADO', 'FACTURADO', 'ABIERTO'].includes(s)
    ? 'y-chip ok' : ['POR COBRAR', 'EN PREPARACION', 'EN PROCESO', 'EN RUTA', 'PENDIENTE', 'P', 'E', 'OCUPADA', 'RESERVADA'].includes(s)
    ? 'y-chip warn' : ['ANULADO', 'CANCELADA', 'CANCELADO', 'FALTANTE', 'BLOQUEADO', 'A', 'C', 'X'].includes(s) ? 'y-chip bad' : 'y-chip bad';
  const label: Record<string, string> = { P: 'PENDIENTE', E: 'EN PROCESO', S: 'SERVIDO', A: 'ANULADO', R: 'EN RUTA', C: 'CANCELADA', X: 'CANCELADA' };
  return <span className={cls}>{label[s] ?? s ?? '—'}</span>;
}

export function Skeleton({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`skel ${className}`} style={{ ...style, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
  );
}