import { Link } from 'react-router-dom';
import { useClienteAuth } from '../auth/cliente-auth-context';
import { useCart } from '../../../contexts/CartContext';

export function ClienteHubPage() {
  const { cliente, logoutCliente } = useClienteAuth();
  const { mesaId, count, total } = useCart();

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 520, margin: '0 auto' }}>
      <h1 className="font-d" style={{ fontSize: 28, margin: '0 0 8px' }}>Hola, {cliente?.nombre ?? 'Cliente'}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px' }}>Tus puntos: {cliente?.puntos ?? 0}</p>

      {mesaId ? (
        <div className="y-panel" style={{ padding: 16, marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13 }}>Mesa asignada: <b>{mesaId}</b> · Carrito: {count} items (S/ {total.toFixed(2)})</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <Link className="y-btn red sm" to="/cliente/menu">Ver carta</Link>
            <Link className="y-btn line sm" to="/cliente/comanda">Mi comanda</Link>
          </div>
        </div>
      ) : (
        <div className="y-panel" style={{ padding: 16, marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>No tienes mesa asignada. Escanea el QR de tu mesa para pedir.</p>
          <Link className="y-btn red sm" to="/cliente/login" style={{ marginTop: 12, display: 'inline-flex' }}>Escanear mesa</Link>
        </div>
      )}

      <div className="y-tiles" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Link to="/cliente/menu" className="y-tile" style={{ padding: 16 }}>
          <div className="ic"><span style={{ fontSize: 20 }}>🍽️</span></div>
          <b style={{ fontSize: 13 }}>Carta</b>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Ver menú y pedir</span>
        </Link>
        <Link to="/cliente/reservas" className="y-tile" style={{ padding: 16 }}>
          <div className="ic"><span style={{ fontSize: 20 }}>📅</span></div>
          <b style={{ fontSize: 13 }}>Reservas</b>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Reservar mesa</span>
        </Link>
        <Link to="/cliente/historial" className="y-tile" style={{ padding: 16 }}>
          <div className="ic"><span style={{ fontSize: 20 }}>📋</span></div>
          <b style={{ fontSize: 13 }}>Historial</b>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Mis pedidos</span>
        </Link>
        <Link to="/cliente/mi-consumo" className="y-tile" style={{ padding: 16 }}>
          <div className="ic"><span style={{ fontSize: 20 }}>🧾</span></div>
          <b style={{ fontSize: 13 }}>Mi consumo</b>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Comanda en vivo</span>
        </Link>
        <Link to="/cliente/perfil" className="y-tile" style={{ padding: 16 }}>
          <div className="ic"><span style={{ fontSize: 20 }}>👤</span></div>
          <b style={{ fontSize: 13 }}>Perfil</b>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Mis datos</span>
        </Link>
      </div>

      <button onClick={() => void logoutCliente()} className="y-btn line" style={{ marginTop: 24, width: '100%' }}>Cerrar sesión</button>
    </div>
  );
}