import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardList, ReceiptText, ShoppingBag, Star, UserRound, UtensilsCrossed } from 'lucide-react';
import { useClienteAuth } from '../auth/cliente-auth-context';
import { useCart } from '../../../contexts/CartContext';

export function ClienteHubPage() {
  const { cliente, logoutCliente } = useClienteAuth();
  const { mesaId, count, total } = useCart();

  return (
    <div className="y-shell">
      <main className="y-cliente-page">
        <section className="y-flow-hero y-cliente-flow-hero" aria-labelledby="cliente-home-title">
          <div className="y-flow-hero__content">
            <span className="y-flow-hero__eyebrow">Chifa Yemheng</span>
            <h1 id="cliente-home-title" className="y-flow-hero__title">
              {cliente?.nombre ? `Hola, ${cliente.nombre}.` : 'Bienvenido.'}
            </h1>
            <p className="y-flow-hero__description">
              Consulta la carta, revisa tus pedidos y gestiona tus reservas desde aquí.
            </p>
            <div className="y-cliente-hero__details">
              {cliente && (
                <span className="y-cliente-hero__detail"><Star size={15} /> {cliente.puntos} puntos</span>
              )}
              {mesaId && <span className="y-cliente-hero__detail">Mesa {mesaId}</span>}
              {count > 0 && (
                <span className="y-cliente-hero__detail">
                  <ShoppingBag size={15} /> {count} {count === 1 ? 'producto' : 'productos'} · S/ {total.toFixed(2)}
                </span>
              )}
            </div>
            <div className="y-flow-hero__actions y-client-actions">
              {mesaId && count > 0 ? (
                <Link className="y-btn y-btn-hero y-client-action-primary" to="/cliente/menu">
                  Agregar platos
                </Link>
              ) : (
                <Link className="y-btn y-btn-hero y-client-action-primary" to={mesaId ? '/cliente/mi-consumo' : '/cliente/menu'}>
                  {mesaId ? `Ver mi mesa · ${mesaId}` : 'Ver carta'}
                </Link>
              )}
              {mesaId && count > 0 && <Link className="y-btn y-btn-hero-secondary y-client-action-secondary" to="/cliente/mi-consumo">Ver mi comanda</Link>}
              {mesaId && count === 0 && <Link className="y-btn y-btn-hero-secondary y-client-action-secondary" to="/cliente/menu">Agregar platos</Link>}
            </div>
          </div>
        </section>

        <section aria-labelledby="cliente-secciones-title">
          <div className="y-cliente-section-heading">
            <div>
              <span className="y-cliente-kicker">Tu cuenta</span>
              <h2 id="cliente-secciones-title" className="font-d">¿Qué necesitas hoy?</h2>
            </div>
          </div>
          {mesaId ? (
            <div className="y-panel y-cliente-table-card">
              <div>
                <b>Mesa vinculada: {mesaId}</b>
                <p>{count > 0 ? 'Tu selección actual está guardada en el carrito.' : 'Aún no tienes productos en el carrito.'}</p>
              </div>
            </div>
          ) : (
            <div className="y-banner y-cliente-table-card">
              <p>Para asociar un pedido a una mesa, escanea su QR desde la carta.</p>
            </div>
          )}
        </section>

        <div className="y-tiles y-cliente-tiles">
          <Link to="/cliente/menu" className="y-tile">
            <div className="ic"><UtensilsCrossed size={20} /></div>
            <b>Carta</b>
            <span>Consulta los platos disponibles.</span>
          </Link>
          <Link to="/cliente/reservas" className="y-tile">
            <div className="ic"><CalendarDays size={20} /></div>
            <b>Reservas</b>
            <span>Solicita o consulta una reserva.</span>
          </Link>
          <Link to="/cliente/historial" className="y-tile">
            <div className="ic"><ClipboardList size={20} /></div>
            <b>Historial</b>
            <span>Consulta pedidos y reservas.</span>
          </Link>
          <Link to="/cliente/mi-consumo" className="y-tile">
            <div className="ic"><ReceiptText size={20} /></div>
            <b>Mi consumo</b>
            <span>Revisa la comanda de tu mesa.</span>
          </Link>
          <Link to="/cliente/perfil" className="y-tile">
            <div className="ic"><UserRound size={20} /></div>
            <b>Perfil</b>
            <span>Consulta los datos de tu cuenta.</span>
          </Link>
        </div>

        {cliente && (
          <button onClick={() => void logoutCliente()} className="y-btn line y-cliente-logout">Cerrar sesión</button>
        )}
      </main>
    </div>
  );
}