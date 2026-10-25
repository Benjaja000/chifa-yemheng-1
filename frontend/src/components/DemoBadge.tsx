import { FlaskConical } from 'lucide-react';

export default function DemoBadge() {
  const isDemo = import.meta.env.VITE_DEMO === 'true';
  if (!isDemo) return null;
  return <span className="y-chip warn" style={{ position: 'fixed', top: 72, right: 10, zIndex: 90, pointerEvents: 'none', background: 'rgba(30,18,4,.92)' }}><FlaskConical size={12} /> Modo demo — datos de ejemplo</span>;
}