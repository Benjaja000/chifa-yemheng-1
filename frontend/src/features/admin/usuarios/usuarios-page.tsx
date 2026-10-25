import { useEffect, useState } from 'react';
import { leerToken } from '../../auth/login/auth-service';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/seguridad`;

interface Usuario { id: number; logeo: string; tipo: string; empleado: string | null; bloqueado: string; estado: string; }
interface Rol { id: number; nombre: string; descripcion: string | null; estado: string; }
interface Permiso { id: number; modulo: string; nombre: string; clave: string; descripcion: string | null; }

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${leerToken() ?? ''}`, ...opts?.headers } });
  if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error ?? 'NETWORK_ERROR'); }
  return res.json();
}

export function AdminUsuariosPage() {
  const [tab, setTab] = useState<'usuarios' | 'roles' | 'permisos'>('usuarios');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      if (tab === 'usuarios') {
        const r = await api<{ data: Usuario[] }>('/usuarios');
        setUsuarios(r.data);
      } else if (tab === 'roles') {
        const r = await api<{ data: Rol[] }>('/roles');
        setRoles(r.data);
      } else {
        const r = await api<Permiso[]>('/permisos');
        setPermisos(Array.isArray(r) ? r : []);
      }
    } catch { setError('No fue posible cargar los datos.'); }
    finally { setCargando(false); }
  };

  useEffect(() => { void cargar(); }, [tab]);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--fg)' }}>Seguridad</h1>

      <div className="flex gap-2 mb-4">
        {(['usuarios', 'roles', 'permisos'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === t ? 'bg-[#A61E22] text-white' : 'bg-[#F5F5F5] hover:bg-[#D9D9D9]'}`}>
            {t === 'usuarios' ? 'Usuarios' : t === 'roles' ? 'Roles' : 'Permisos'}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      {cargando ? (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>Cargando...</div>
      ) : tab === 'usuarios' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Logeo</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Empleado</th>
                <th className="px-3 py-2">Bloqueado</th>
                <th className="px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{u.id}</td>
                  <td className="px-3 py-2 font-semibold">{u.logeo}</td>
                  <td className="px-3 py-2">{u.tipo}</td>
                  <td className="px-3 py-2">{u.empleado || '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.bloqueado === 'S' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {u.bloqueado === 'S' ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.estado === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.estado === 'A' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && <p className="text-center py-4 text-sm text-[#333]/60">Sin usuarios.</p>}
        </div>
      ) : tab === 'roles' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Descripción</th>
                <th className="px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {roles.map((r) => (
                <tr key={r.id} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2 font-semibold">{r.nombre}</td>
                  <td className="px-3 py-2">{r.descripcion || '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.estado === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {r.estado === 'A' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {roles.length === 0 && <p className="text-center py-4 text-sm text-[#333]/60">Sin roles.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Módulo</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Clave</th>
                <th className="px-3 py-2">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {permisos.map((p) => (
                <tr key={p.id} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.modulo}</td>
                  <td className="px-3 py-2">{p.nombre}</td>
                  <td className="px-3 py-2 font-mono text-xs">{p.clave}</td>
                  <td className="px-3 py-2">{p.descripcion || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {permisos.length === 0 && <p className="text-center py-4 text-sm text-[#333]/60">Sin permisos.</p>}
        </div>
      )}
    </div>
  );
}
