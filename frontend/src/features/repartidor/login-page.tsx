import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/login/auth-context';

export function RepartidorLoginPage() {
  const { login, logout } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const ingresar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const destino = await login({ logeo: usuario.trim(), clave });
      if (!destino.startsWith('/repartidor')) {
        logout();
        setError('Esta cuenta no tiene un rol de repartidor asignado. Verifica con el administrador.');
        return;
      }
      navigate(destino, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="y-shell y-responsive-page y-bkg-auth">
      <div className="mx-auto max-w-md p-4 pt-20">
        <form onSubmit={(event) => void ingresar(event)} className="y-panel y-panel-auth space-y-4 p-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Chifa Yemheng · División Delivery</p>
            <h1 className="text-2xl font-bold text-[#7F1518]">Acceso repartidor</h1>
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

          <div>
            <label htmlFor="repartidor-usuario" className="mb-1 block text-sm font-medium">Usuario</label>
            <input
              id="repartidor-usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              autoComplete="username"
              required
              minLength={3}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="repartidor-clave" className="mb-1 block text-sm font-medium">Contraseña</label>
            <input
              id="repartidor-clave"
              value={clave}
              onChange={(event) => setClave(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <button type="submit" disabled={loading} className="y-btn red w-full">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
          <div className="text-center text-sm">
            <Link to="/auth/login" className="text-blue-700">Volver al acceso del personal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
