import { PageHeader } from '../../../components/ui';

export function AdminEmpleadosPage() {
  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="Empleados" sub="Gestión de personal y fichas." />
      <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Maqueta — funcionalidad en desarrollo.</p>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
          Aquí se gestionarán empleados y fichas de personal.
        </p>
      </div>
    </div>
  );
}