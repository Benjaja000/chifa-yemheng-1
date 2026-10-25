import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { House, BookOpen, CalendarDays, User, ScanLine, ShoppingCart, LogOut } from 'lucide-react';
import { useClienteAuth } from '../features/cliente/auth/cliente-auth-context';
import { useCart } from '../contexts/CartContext';
import Logo from '../components/Logo';

const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

export default function ClientLayout() {
  const { cliente, logoutCliente } = useClienteAuth();
  const { count, mesaId } = useCart();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const out = async () => { await logoutCliente(); nav('/'); };
  return (
    <div className="y-shell">
      <a href="#contenido" className="skip">Saltar al contenido</a>
      <header className="y-header">
        <div className="in">
          <Link to={cliente ? '/cliente/inicio' : '/'}><Logo /></Link>
          <nav className="y-nav">
            <NavLink to="/" end className={cls}>Inicio</NavLink>
            <NavLink to="/cliente/menu" className={cls}>Carta</NavLink>
            <NavLink to="/cliente/reservas" className={cls}>Reservas</NavLink>
            <NavLink to="/cliente/delivery" className={cls}>Delivery</NavLink>
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/cliente/comanda" className="y-icon-btn" aria-label="Comanda">
              <ShoppingCart size={17} />{count > 0 && <motion.span key={count} className="y-badge" initial={{ scale: 1.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>{count}</motion.span>}
            </Link>
            {cliente ? (
              <>
                <Link to="/cliente/perfil" className="y-btn line sm desk"><User size={14} /> {cliente.nombre}</Link>
                <button className="y-icon-btn desk" onClick={() => void out()} aria-label="Salir"><LogOut size={16} /></button>
              </>
            ) : (
              <Link className="y-btn gold sm" to="/cliente/login">Iniciar sesión</Link>
            )}
          </div>
        </div>
      </header>
      <motion.main id="contenido" tabIndex={-1} key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}><Outlet /></motion.main>
      <nav className="y-bnav">
        <NavLink to="/" end className={cls}><House size={20} /><span>Inicio</span></NavLink>
        <NavLink to="/cliente/menu" className={cls}><BookOpen size={20} /><span>Carta</span></NavLink>
        <Link to={`/cliente/mesa/${mesaId || 1}`} className="qr" aria-label="Escanear QR"><ScanLine size={28} /></Link>
        <NavLink to="/cliente/reservas" className={cls}><CalendarDays size={20} /><span>Reservas</span></NavLink>
        <NavLink to="/cliente/perfil" className={cls}><User size={20} /><span>Perfil</span></NavLink>
      </nav>
    </div>
  );
}