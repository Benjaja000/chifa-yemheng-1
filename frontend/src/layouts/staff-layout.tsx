import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LayoutGrid, ShoppingBag, Tag, Users, UserRound, BarChart3, Menu, X, LogOut, Flame, CalendarDays, Armchair, ShieldCheck, Wallet, Bike, Package } from 'lucide-react';
import { useAuth } from '../features/auth/login/auth-context';
import { useTheme } from '../theme/theme-context';
import DemoBadge from '../components/DemoBadge';
import Logo from '../components/Logo';
import { cambiarClaveRequest } from '../features/auth/login/auth-service';

type L = { to: string; label: string; roles?: string[]; icon: typeof Flame };
const ALL = ['ADMINISTRADOR', 'SUPERVISOR'];
const SECTIONS: { title: string; links: L[] }[] = [
  { title: 'Operación', links: [
    { to: '/admin', label: 'Dashboard', roles: ALL, icon: LayoutDashboard },
    { to: '/admin/mesas', label: 'Mesas', roles: [...ALL, 'MOZO', 'CAJERO'], icon: LayoutGrid },
    { to: '/admin/pedidos', label: 'Pedidos', roles: [...ALL, 'MOZO', 'CAJERO', 'COCINA'], icon: ShoppingBag },
    { to: '/admin/cocina', label: 'Cocina KDS', roles: [...ALL, 'COCINA'], icon: Flame },
    { to: '/admin/mozo', label: 'Mozo', roles: [...ALL, 'MOZO'], icon: Users },
    { to: '/admin/caja', label: 'Caja', roles: [...ALL, 'CAJERO'], icon: Wallet },
    { to: '/admin/delivery', label: 'Delivery', roles: [...ALL, 'REPARTIDOR', 'CAJERO', 'MOZO'], icon: Bike },
    { to: '/admin/reservas-admin', label: 'Reservas', roles: [...ALL, 'MOZO', 'CAJERO'], icon: CalendarDays },
  ] },
  { title: 'Catálogo', links: [
    { to: '/admin/productos', label: 'Productos', roles: ALL, icon: ShoppingBag },
    { to: '/admin/categorias', label: 'Categorías', roles: ALL, icon: Tag },
    { to: '/admin/unidades', label: 'Unidades', roles: ALL, icon: ShoppingBag },
    { to: '/admin/mesas-admin', label: 'Mesas Admin', roles: ALL, icon: Armchair },
    { to: '/admin/inventario', label: 'Inventario', roles: ALL, icon: Package },
   ] },
  { title: 'Gestión', links: [
    { to: '/admin/clientes', label: 'Clientes', roles: [...ALL, 'CAJERO'], icon: Users },
    { to: '/admin/personas', label: 'Personas', roles: ALL, icon: Users },
    { to: '/admin/personal', label: 'Personal', roles: ALL, icon: UserRound },
    { to: '/admin/empleados', label: 'Empleados', roles: ALL, icon: UserRound },
    { to: '/admin/usuarios', label: 'Usuarios y Roles', roles: ALL, icon: ShieldCheck },
  ] },
  { title: 'Análisis', links: [
    { to: '/admin/reportes', label: 'Reportes', roles: [...ALL, 'CAJERO'], icon: BarChart3 },
    { to: '/admin/auditoria', label: 'Auditoría', roles: ALL, icon: ShieldCheck },
    { to: '/admin/crud', label: 'CRUD Genérico', roles: ALL, icon: ShoppingBag },
  ] },
];

export default function StaffLayout() {
  const { usuario, logout } = useAuth();
  const { tema, cambiarTema } = useTheme();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [verClave, setVerClave] = useState(false);
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const rol = (usuario?.tipo ?? '').toUpperCase();
  const can = (l: L) => !l.roles || l.roles.includes(rol) || rol === 'ADMINISTRADOR';

  const salir = () => {
    logout();
    nav('/auth/login', { replace: true });
  };

  const guardarClave = async () => {
    setError(null);
    setOk(false);
    if (!actual || !nueva || !repetir) { setError('Completa los 3 campos.'); return; }
    if (nueva.length < 4) { setError('La nueva debe tener mínimo 4 caracteres.'); return; }
    if (nueva === actual) { setError('La nueva debe ser distinta a la actual.'); return; }
    if (nueva !== repetir) { setError('Repetir no coincide con la nueva.'); return; }
    setGuardando(true);
    try {
      await cambiarClaveRequest(actual, nueva);
      setOk(true);
      setActual(''); setNueva(''); setRepetir('');
    } catch (e) {
      const codigo = (e as Error).message;
      setError(
        codigo === 'ACTUAL_INCORRECTA' ? 'La contraseña actual es incorrecta.'
        : codigo === 'BLOQUEADO' ? 'Usuario bloqueado. Contacte al administrador.'
        : codigo === 'INACTIVO' ? 'Usuario inactivo.'
        : 'No se pudo cambiar. Reintente.',
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="staff" style={{ display: 'flex' }}>
      <a href="#contenido" className="skip">Saltar al contenido</a>
      <DemoBadge />
      <div className={`ys-veil ${open ? 'on' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`ys-side ${open ? 'open' : ''}`}>
        <div style={{ padding: '18px 16px 4px' }}><Logo size={34} /></div>
        <div className="ys-user">
          <div className="y-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{(usuario?.logeo ?? '?').charAt(0).toUpperCase()}</div>
          <div style={{ minWidth: 0 }}><b style={{ fontSize: 13, display: 'block' }}>{usuario?.empleado || usuario?.logeo}</b><span className="y-chip warn" style={{ padding: '1px 8px', fontSize: 10 }}>{usuario?.tipo}</span></div>
        </div>
        <nav style={{ flex: 1 }}>
          {SECTIONS.map((s) => {
            const ls = s.links.filter(can);
            return ls.length === 0 ? null : (
              <div key={s.title}><div className="sec">{s.title}</div>
                {ls.map((l) => <NavLink key={l.to} to={l.to} end={l.to === '/admin'} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}><l.icon size={17} />{l.label}</NavLink>)}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="y-btn line sm" style={{ width: '100%' }} onClick={() => setVerClave(true)}><LogOut size={14} /> Cambiar clave</button>
          <button className="y-btn line sm" style={{ width: '100%' }} onClick={salir}><LogOut size={14} /> Cerrar sesión</button>
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ys-top">
          <button className="y-icon-btn ys-burger" onClick={() => setOpen(!open)} aria-label="Menú">{open ? <X size={17} /> : <Menu size={17} />}</button>
          <span style={{ textTransform: 'capitalize' }}>Panel del personal · {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="y-icon-btn" onClick={() => cambiarTema(tema === 'claro' ? 'oscuro' : 'claro')} aria-label="Tema">{tema === 'claro' ? '🌙' : '☀️'}</button>
          </div>
        </div>
        <motion.div id="contenido" tabIndex={-1} key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} style={{ padding: 22, maxWidth: 1240 }}><Outlet /></motion.div>
      </div>

      {verClave && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#2a0d0e]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Cambiar contraseña</h2>
                <p className="mt-1 text-sm opacity-60">La sesión sigue activa al guardar.</p>
              </div>
              <button type="button" onClick={() => setVerClave(false)} aria-label="Cerrar" className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A61E22]/50 dark:hover:bg-white/10">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {error && <div role="alert" className="mt-3 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-3 text-sm">{error}</div>}
            {ok && <div role="status" className="mt-3 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 p-3 text-sm">Clave actualizada. La sesión sigue activa.</div>}
            <div className="mt-3 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Actual</span>
                <input type="password" value={actual} onChange={(e) => setActual(e.target.value)} className="rounded-lg bg-[#F5F5F5] px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22] dark:bg-white/10 dark:focus:bg-white/15" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Nueva (mín 4)</span>
                <input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} className="rounded-lg bg-[#F5F5F5] px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22] dark:bg-white/10 dark:focus:bg-white/15" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Repetir nueva</span>
                <input type="password" value={repetir} onChange={(e) => setRepetir(e.target.value)} className="rounded-lg bg-[#F5F5F5] px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22] dark:bg-white/10 dark:focus:bg-white/15" />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setVerClave(false)} className="cursor-pointer rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#D9D9D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A61E22]/50 dark:bg-white/10 dark:hover:bg-white/20">Cancelar</button>
              <button type="button" onClick={() => void guardarClave()} disabled={guardando} className="cursor-pointer rounded-xl bg-[#A61E22] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A61E22]/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#A61E22]">{guardando ? 'Guardando…' : 'Guardar clave'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}