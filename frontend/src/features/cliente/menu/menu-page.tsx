import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { QrScannerModal } from '../../../components/QrScannerModal';
import { useClienteAuth } from '../auth/cliente-auth-context';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

interface ProductoApi {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
  categoria: string;
  imagen: string | null;
  detalle: string | null;
  estado: string;
}

export function ClienteMenuPage() {
  const { add, mesaId, setMesaId } = useCart();
  const { cliente } = useClienteAuth();
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState<string>('');
  const [q, setQ] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('chifa.cliente.token') ?? localStorage.getItem('chifa.token') ?? '';
    fetch(`${API_URL}/productos?limit=100`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(async (res) => {
        if (!res.ok) throw new Error('NETWORK_ERROR');
        return res.json();
      })
      .then((body: { data?: ProductoApi[] } | ProductoApi[]) => {
        if (cancelado) return;
        const list = Array.isArray(body) ? body : (body.data ?? []);
        setProductos(list);
      })
      .catch(() => {
        if (!cancelado) setError('No se pudo cargar la carta.');
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => { cancelado = true; };
  }, []);

  const categorias = Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean))) as string[];
  const filtrados = productos.filter((p) => {
    if (cat && p.categoria !== cat) return false;
    if (q && !p.nombre.toLowerCase().includes(q.toLowerCase())) return false;
    return p.disponible !== false && p.estado === 'A';
  });

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1280, margin: '0 auto' }}>
      <h1 className="font-d" style={{ fontSize: 28, margin: '0 0 12px' }}>Carta</h1>
      {!mesaId && (
        <div className="y-banner" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>Estás en modo delivery/web. Escanea el QR de tu mesa para pedir en el local.</span>
          {cliente ? (
            <button className="y-btn red sm" onClick={() => setScannerOpen(true)}>Escanear mesa</button>
          ) : (
            <Link className="y-btn red sm" to="/cliente/login">Iniciar sesión para escanear</Link>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar plato…"
          className="y-search"
          style={{ flex: 1, minWidth: 200 }}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="y-search" style={{ minWidth: 160 }}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Cargando carta…</p>
      ) : error ? (
        <p style={{ color: 'var(--rose-soft, #ffb4ab)' }}>{error}</p>
      ) : filtrados.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No hay platos disponibles.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filtrados.map((p) => (
            <div key={p.id} className="y-dish y-panel">
              {p.imagen ? (
                <img src={p.imagen} alt={p.nombre} />
              ) : (
                <div className="y-ph" />
              )}
              <div className="b">
                <b style={{ fontSize: 14 }}>{p.nombre}</b>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>{p.detalle}</p>
                <div className="row">
                  <span className="y-price">S/ {Number(p.precio).toFixed(2)}</span>
                  <button
                    className="y-plus"
                    onClick={() => add({ id_producto: p.id, n_producto: p.nombre, precio: p.precio, disponible: p.disponible ? 'S' : 'N', categoria: p.categoria, imagen: p.imagen, estado: p.estado } as any, 1)}
                    aria-label="Agregar"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="y-btn red" to="/cliente/comanda">Ver comanda</Link>
        <Link className="y-btn line" to="/cliente/inicio">Volver</Link>
      </div>

      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={(codigo) => {
          setMesaId(codigo);
          setScannerOpen(false);
        }}
      />
    </div>
  );
}