import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, CalendarDays, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useClienteAuth } from '../auth/cliente-auth-context';

export function ClientePerfilPage() {
  const { cliente, logoutCliente } = useClienteAuth();
  const [datosAbiertos, setDatosAbiertos] = useState(false);

  return (
    <div className="y-shell">
      <main className="y-cliente-page">
        <section className="y-flow-hero y-cliente-flow-hero" aria-labelledby="perfil-title">
          <div className="y-flow-hero__content">
            <span className="y-flow-hero__eyebrow">Tu cuenta</span>
            <h1 id="perfil-title" className="y-flow-hero__title">Hola{cliente?.nombre ? `, ${cliente.nombre}` : ''}.</h1>
            <p className="y-flow-hero__description">
              Revisa los datos asociados a tu cuenta y accede a tus pedidos y reservas.
            </p>
            {cliente && <div className="y-cliente-hero__details"><span className="y-cliente-hero__detail">{cliente.puntos} puntos</span></div>}
          </div>
        </section>
      <div className="y-panel" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 className="font-d" style={{ margin: 0, fontSize: 24 }}>Datos de la cuenta</h2>
          <Link to="/cliente/inicio" aria-label="Cerrar" className="y-icon-btn" style={{ width: 32, height: 32 }}>
            <X size={16} />
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          <div className="y-avatar" style={{ width: 56, height: 56, fontSize: 20 }}>
            {(cliente?.nombre ?? 'C').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ fontSize: 16, display: 'block' }}>{cliente?.nombre ?? 'Cliente'}</b>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{cliente?.email ?? '—'}</span>
          </div>
        </div>

        <button
          onClick={() => setDatosAbiertos((v) => !v)}
          className="y-row y-profile-toggle"
          aria-expanded={datosAbiertos}
        >
          <span>Mis datos</span>
          <ChevronRight size={16} style={{ transform: datosAbiertos ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
        </button>
        <AnimatePresence>
          {datosAbiertos && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div className="y-panel" style={{ padding: 12 }}>
                  <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.6 }}>Nombre</dt>
                  <dd style={{ margin: '4px 0 0', fontWeight: 600, fontSize: 13 }}>{cliente?.nombre ?? '—'}</dd>
                </div>
                <div className="y-panel" style={{ padding: 12 }}>
                  <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.6 }}>Correo</dt>
                  <dd style={{ margin: '4px 0 0', fontWeight: 600, fontSize: 13, wordBreak: 'break-all' }}>{cliente?.email ?? '—'}</dd>
                </div>
                <div className="y-panel" style={{ padding: 12 }}>
                  <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.6 }}>Puntos</dt>
                  <dd style={{ margin: '4px 0 0', fontWeight: 600, fontSize: 13, color: 'var(--gold2)' }}>{cliente?.puntos ?? 0} pts</dd>
                </div>
                <div className="y-panel" style={{ padding: 12 }}>
                  <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.6 }}>ID Cliente</dt>
                  <dd style={{ margin: '4px 0 0', fontWeight: 600, fontSize: 13 }}>#{cliente?.id ?? '—'}</dd>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
                Los datos mostrados corresponden a la sesión de tu cuenta.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <Link to="/cliente/historial" className="y-row">
            <Receipt size={18} /> Mis pedidos <span className="r">Ver historial <ChevronRight size={14} /></span>
          </Link>
          <Link to="/cliente/reservas" className="y-row">
            <CalendarDays size={18} /> Mis reservas <span className="r">Ver reservas <ChevronRight size={14} /></span>
          </Link>
          <Link to="/cliente/delivery" className="y-row">
            <MapPin size={18} /> Delivery <span className="r">Hacer un pedido <ChevronRight size={14} /></span>
          </Link>
        </div>

        <button onClick={() => void logoutCliente()} className="y-btn line" style={{ width: '100%', marginTop: 20 }}>
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
      </main>
    </div>
  );
}