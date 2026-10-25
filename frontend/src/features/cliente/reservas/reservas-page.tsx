import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle2 } from 'lucide-react';
import { Loading, Empty } from '../../../components/ui';
import { ReservaForm, ReservaCard } from '../../../components/ReservaParts';
import type { Reserva } from '../../../types/db';
import { useClienteAuth } from '../auth/cliente-auth-context';

export function ClienteReservasPage() {
  const { cliente } = useClienteAuth();
  const [tab, setTab] = useState<'mis' | 'nueva'>('mis');
  const [reservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  function onDone() {
    setTab('mis');
  }

  // Guest view: informational presentation
  if (!cliente) {
    return (
      <div className="y-shell y-responsive-page">
        <div className="y-head">
          <Link to="/cliente/inicio" className="y-icon-btn" aria-label="Volver"><ArrowLeft size={18} /></Link>
          <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Reservas</h2>
        </div>

        <div className="y-panel" style={{ padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <CalendarDays size={40} style={{ color: 'var(--gold2)', marginBottom: 8 }} />
          <h3 className="font-d" style={{ margin: '0 0 8px', fontSize: 20 }}>Reserva tu mesa</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.6 }}>
            Asegura tu mesa en Chifa Yemheng. Reserva en línea y te avisamos cuando esté confirmada.
          </p>
          <Link className="y-btn red" to="/cliente/login" style={{ display: 'inline-flex' }}>
            Iniciar sesión para reservar
          </Link>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          <div className="y-panel" style={{ padding: 16 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>¿Cómo funciona?</h4>
            <div style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>1</span>
                <span>Elige la fecha, hora y número de personas.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>2</span>
                <span>Confirma tu reserva con un adelanto opcional.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>3</span>
                <span>Te avisamos cuando el personal confirme tu mesa.</span>
              </div>
            </div>
          </div>

          <div className="y-panel" style={{ padding: 16 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Beneficios</h4>
            <div style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={14} style={{ color: 'var(--gold2)' }} /> Sin esperas al llegar</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={14} style={{ color: 'var(--gold2)' }} /> Mesa garantizada para tu grupo</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={14} style={{ color: 'var(--gold2)' }} /> Ocasiones especiales (cumpleaños, aniversarios)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={14} style={{ color: 'var(--gold2)' }} /> Adelanto opcional para confirmar</div>
            </div>
          </div>

          <div className="y-panel" style={{ padding: 16 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Horarios de atención</h4>
            <div style={{ display: 'grid', gap: 4, fontSize: 13, color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lunes a Jueves</span><b style={{ color: 'var(--cream)' }}>11:00 – 22:00</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Viernes y Sábado</span><b style={{ color: 'var(--cream)' }}>11:00 – 23:00</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Domingo</span><b style={{ color: 'var(--cream)' }}>11:00 – 21:00</b></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in view: full functionality
  return (
    <div className="y-shell y-responsive-page">
      <div className="y-head">
        <Link to="/cliente/inicio" className="y-icon-btn" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Reservas</h2>
      </div>
      <div className="y-tabs">
        <button className={tab === 'mis' ? 'on' : ''} onClick={() => setTab('mis')}>Mis reservas</button>
        <button className={tab === 'nueva' ? 'on' : ''} onClick={() => setTab('nueva')}>Nueva reserva</button>
      </div>

      {tab === 'nueva' ? (
<div className="y-reservas-layout">
            <div>
              <ReservaForm onDone={onDone} baseUrl="/api/v1/cliente/reservas" />
            </div>
          <div>
            {reservas.length > 0 && (
              <>
                <h3 className="font-d" style={{ fontSize: 16, margin: '0 0 10px' }}>Mis reservas</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {reservas.map((r) => (
                    <ReservaCard key={r.id_reserva} r={r} nombre={cliente?.nombre} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : loading ? (
        <Loading text="Cargando reservas…" />
      ) : reservas.length === 0 ? (
        <Empty title="Sin reservas aún" sub="Solicita una nueva reserva." />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {reservas.map((r) => (
            <ReservaCard key={r.id_reserva} r={r} nombre={cliente?.nombre} />
          ))}
        </div>
      )}
    </div>
  );
}