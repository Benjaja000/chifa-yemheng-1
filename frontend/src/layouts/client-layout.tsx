import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { House, BookOpen, CalendarDays, User, ScanLine, ShoppingCart, LogOut, Ellipsis, ClipboardList, Truck, ReceiptText } from 'lucide-react';
import { useClienteAuth } from '../features/cliente/auth/cliente-auth-context';
import { useCart } from '../contexts/CartContext';
import { QrScannerModal } from '../components/QrScannerModal';
import Logo from '../components/Logo';

const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

export default function ClientLayout() {
  const { cliente, logoutCliente } = useClienteAuth();
  const { count, mesaId, setMesaId } = useCart();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [loginNudgeKey, setLoginNudgeKey] = useState(0);
  const [loginToastVisible, setLoginToastVisible] = useState(false);
  const loginToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const out = async () => {
    await logoutCliente();
    setMesaId('');
    nav('/');
  };
  const irAlInicio = cliente ? '/cliente/inicio' : '/';
  const moreActive = ['/cliente/delivery', '/cliente/historial', '/cliente/perfil'].includes(pathname);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleLoginRequired = () => setLoginNudgeKey((key) => key + 1);
    window.addEventListener('cliente:login-required', handleLoginRequired);
    return () => window.removeEventListener('cliente:login-required', handleLoginRequired);
  }, []);

  useEffect(() => () => {
    if (loginToastTimer.current) clearTimeout(loginToastTimer.current);
  }, []);

  const handleGuestCartClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (cliente) return;
    event.preventDefault();
    setLoginNudgeKey((key) => key + 1);
    setLoginToastVisible(true);
    if (loginToastTimer.current) clearTimeout(loginToastTimer.current);
    loginToastTimer.current = setTimeout(() => setLoginToastVisible(false), 3000);
  };

  return (
    <div className="y-shell y-client-shell">
      <a href="#contenido" className="skip">Saltar al contenido</a>
      <header className="y-header">
        <div className="in">
          <Link to={irAlInicio}><Logo /></Link>
          <nav className="y-nav y-nav--client" aria-label="Navegación principal">
            <NavLink to={irAlInicio} end className={cls}>Inicio</NavLink>
            <NavLink to="/cliente/menu" className={cls}>Carta</NavLink>
            {cliente && mesaId && <NavLink to="/cliente/mi-consumo" className={cls}>Mi mesa</NavLink>}
            <NavLink to="/cliente/reservas" className={cls}>Reservas</NavLink>
            <NavLink to="/cliente/delivery" className={cls}>Delivery</NavLink>
            {cliente && <NavLink to="/cliente/historial" className={cls}>Historial</NavLink>}
            {cliente && <NavLink to="/cliente/perfil" className={cls}>Perfil</NavLink>}
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link
              to="/cliente/comanda"
              onClick={handleGuestCartClick}
              className="y-icon-btn y-client-cart-link"
              aria-label={`Carrito${count > 0 ? `, ${count} productos` : ''}`}
            >
              <ShoppingCart size={17} />
              <span>Carrito</span>
              {count > 0 && <motion.span key={count} className="y-badge" initial={{ scale: 1.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>{count}</motion.span>}
            </Link>
            {cliente ? (
              <>
                <button className="y-icon-btn desk" onClick={() => void out()} aria-label="Salir"><LogOut size={16} /></button>
              </>
            ) : (
              <Link
                key={loginNudgeKey}
                className={`y-btn gold sm${loginNudgeKey > 0 ? ' y-login-nudge' : ''}`}
                to="/cliente/login"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>
      <motion.main
        id="contenido"
        tabIndex={-1}
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      {loginToastVisible && (
        <div className="y-login-toast" role="status" aria-live="polite">
          Inicia sesión para ver tu carrito
        </div>
      )}
      <nav className="y-bnav">
        <NavLink to={irAlInicio} end className={cls}><House size={20} /><span>Inicio</span></NavLink>
        <NavLink to="/cliente/menu" className={cls}><BookOpen size={20} /><span>Carta</span></NavLink>
        {cliente && mesaId && (
          <NavLink to="/cliente/mi-consumo" className={cls}><ReceiptText size={20} /><span>Mi mesa</span></NavLink>
        )}
        <button
          type="button"
          className="qr"
          aria-label={cliente ? 'Escanear QR de mesa' : 'Iniciar sesión para escanear mesa'}
          onClick={() => cliente ? setScannerOpen(true) : nav('/cliente/login')}
        >
          <ScanLine size={28} />
        </button>
        <NavLink to="/cliente/reservas" className={cls}><CalendarDays size={20} /><span>Reservas</span></NavLink>
        <div className="y-bnav-more">
          <button
            type="button"
            className={`y-bnav-more-button${moreActive ? ' active' : ''}`}
            aria-label="Más opciones"
            aria-expanded={moreOpen}
            aria-controls="cliente-more-menu"
            onClick={() => setMoreOpen((open) => !open)}
          >
            <Ellipsis size={21} />
            <span>Más</span>
          </button>
          {moreOpen && (
            <div className="y-bnav-more-menu" id="cliente-more-menu" aria-label="Más secciones">
              <NavLink to="/cliente/delivery" className={cls} onClick={() => setMoreOpen(false)}><Truck size={18} /><span>Delivery</span></NavLink>
              {cliente && <NavLink to="/cliente/historial" className={cls} onClick={() => setMoreOpen(false)}><ClipboardList size={18} /><span>Historial</span></NavLink>}
              {cliente && <NavLink to="/cliente/perfil" className={cls} onClick={() => setMoreOpen(false)}><User size={18} /><span>Perfil</span></NavLink>}
            </div>
          )}
        </div>
      </nav>
      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={(codigo) => {
          setMesaId(codigo);
          setScannerOpen(false);
          nav('/cliente/menu');
        }}
      />
    </div>
  );
}