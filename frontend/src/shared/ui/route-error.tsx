import { useRouteError, Link } from 'react-router-dom';

export function RouteError() {
  const error = useRouteError() as { message?: string; stack?: string; statusText?: string };
  return (
    <div style={{ padding: 24, fontFamily: 'monospace', maxWidth: 900, margin: '40px auto' }}>
      <h1 style={{ color: '#A61E22', fontSize: 20 }}>Esta página falló</h1>
      <p style={{ color: '#555' }}>Las demás rutas siguen funcionando. Detalle del error:</p>
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto' }}>
        {error?.message || error?.statusText || 'Error desconocido'}
        {'\n\n'}
        {error?.stack}
      </pre>
      <Link to="/" style={{ color: '#A61E22' }}>Volver al inicio</Link>
    </div>
  );
}
