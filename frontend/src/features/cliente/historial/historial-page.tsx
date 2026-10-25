import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Receipt } from 'lucide-react';
import { Loading, Empty } from '../../../components/ui';
import { fmtDate, fmtPEN } from '../../../lib/format';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

export function ClienteHistorialPage() {
  const [tab, setTab] = useState<'pedidos' | 'reservas'>('pedidos');
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    const token = localStorage.getItem('chifa.cliente.token') ?? '';
    // Pedidos y reservas backend aún no implementados para cliente; mock por ahora
    Promise.all([
      fetch(`${API_URL}/cliente/pedidos?limit=20`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch(`${API_URL}/cliente/reservas`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([p, r]) => {
      if (cancelado) return;
      setPedidos(Array.isArray(p) ? p : (p.data ?? []));
      setReservas(Array.isArray(r) ? r : (r.data ?? []));
      setLoading(false);
    });
    return () => { cancelado = true; };
  }, []);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 520, margin: '0 auto' }}>
      <div className="y-head">
        <Link to="/cliente/inicio" className="y-icon-btn" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Mi historial</h2>
      </div>
      <div className="y-tabs">
        <button className={tab === 'pedidos' ? 'on' : ''} onClick={() => setTab('pedidos')}>Pedidos</button>
        <button className={tab === 'reservas' ? 'on' : ''} onClick={() => setTab('reservas')}>Reservas</button>
      </div>

      {loading ? (
        <Loading text="Cargando historial…" />
      ) : tab === 'pedidos' ? (
        pedidos.length === 0 ? (
          <Empty title="Sin pedidos aún" sub="Tus comandas aparecerán aquí." />
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {pedidos.map((p) => (
              <Link key={p.id_pedido ?? p.id} to={`/cliente/pedido/${p.id_pedido ?? p.id}`} className="y-panel y-rcard">
                <div className="y-avatar"><Receipt size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 14 }}>Pedido #{p.numero_pedido ?? p.numero ?? p.id}</b>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, margin: '3px 0 6px' }}>{fmtDate(p.f_pedido ?? p.fecha)}</div>
                  <span className={`y-chip ${p.facturado === 'S' ? 'ok' : 'warn'}`}>{p.facturado === 'S' ? 'Entregado' : 'En proceso'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <b style={{ fontFamily: 'var(--font-d)', fontSize: 15 }}>{fmtPEN(p.total)}</b>
                  <ChevronRight size={14} style={{ color: 'var(--muted)', marginLeft: 6 }} />
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        reservas.length === 0 ? (
          <Empty title="Sin reservas aún" sub="Tus reservas aparecerán aquí." />
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {reservas.map((r) => (
              <div key={r.id_reserva ?? r.id} className="y-panel y-rcard">
                <div className="y-avatar">{(r.cliente_nombre ?? 'R').charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 14 }}>Reserva #{r.id_reserva ?? r.id}</b>
                  <div style={{ color: 'var(--muted)', fontSize: 12, margin: '3px 0 6px' }}>{fmtDate(r.f_reserva ?? r.fecha)} · {r.n_personas ?? 1} personas</div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}