import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RepartidorLoginPage() {
  const [usuario, setUsuario] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      // Simular login - en producción haría fetch al backend
      localStorage.setItem('token', 'repartidor-mock-token');
      localStorage.setItem('role', 'REPARTIDOR');
      navigate('/repartidor/mis-entregas');
    } catch (e) {
      alert('Error en el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="y-shell y-responsive-page y-bkg-auth">
      <div className="max-w-md mx-auto p-4 pt-20">
        <div className="y-panel y-panel-auth" style={{ padding: 32, borderRadius: 16 }}>
          <h2 className="text-center text-2xl font-bold text-[#7F1518] mb-6">Login Repartidor</h2>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario / Email</label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="juan.perez@example.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN o Clave</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                placeholder="1234"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => login()}
              disabled={loading}
              className="w-full rounded-xl bg-[#A61E22] py-3 text-lg font-semibold text-white hover:bg-[#7F1518] disabled:opacity-60 transition-colors"
            >
              {loading ? 'Ingresando…' : 'Entrar'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Chifa Yemheng - División Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}