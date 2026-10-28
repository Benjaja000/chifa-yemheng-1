import { Button } from '@/shared/ui/Button';
import { MapPin, Phone, ReceiptText } from 'lucide-react';

interface ConfirmarStepProps {
  items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string }>;
  direccion: string;
  referencia: string;
  telefono: string;
  costoEnvio: number;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
}

export function ConfirmarStep({
  items,
  direccion,
  referencia,
  telefono,
  costoEnvio,
  onSubmit,
  onPrev,
  loading,
}: ConfirmarStepProps) {
  const subtotal = items.reduce((sum, item) => sum + item.precioUnit * item.cantidad, 0);
  const total = subtotal + costoEnvio;

  return (
    <div className="y-delivery-confirm">
      <div className="y-delivery-step-heading">
        <div>
          <span className="y-cliente-kicker">Paso 2 de 2</span>
          <h2>Revisa tu pedido</h2>
          <p>Confirma que los platos y los datos de entrega estén correctos.</p>
        </div>
        <ReceiptText size={25} aria-hidden="true" />
      </div>

      <div className="y-delivery-confirm__grid">
        <section className="y-delivery-section">
          <div className="y-delivery-section__heading">
            <div>
              <span className="y-cliente-kicker">Tu selección</span>
              <h3>Platos del pedido</h3>
            </div>
          </div>
          <div className="y-delivery-confirm__items">
            {items.map((item) => (
              <div key={item.productoId} className="y-delivery-confirm__item">
                <span><b>{item.cantidad}×</b> {item.nombre ?? `Producto #${item.productoId}`}</span>
                <strong>S/ {(item.precioUnit * item.cantidad).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="y-delivery-total">
            <div><span>Subtotal</span><strong>S/ {subtotal.toFixed(2)}</strong></div>
            <div><span>Envío estimado</span><strong>S/ {costoEnvio.toFixed(2)}</strong></div>
            <div className="y-delivery-total__grand"><span>Total estimado</span><strong>S/ {total.toFixed(2)}</strong></div>
          </div>
        </section>

        <section className="y-delivery-section y-delivery-address-summary">
          <div className="y-delivery-section__heading">
            <div>
              <span className="y-cliente-kicker">Entrega</span>
              <h3>¿Dónde lo llevamos?</h3>
            </div>
            <MapPin size={20} aria-hidden="true" />
          </div>
          <p className="y-delivery-address-summary__address">{direccion}</p>
          {referencia && <p className="y-delivery-address-summary__detail">Referencia: {referencia}</p>}
          <p className="y-delivery-address-summary__detail"><Phone size={15} aria-hidden="true" /> {telefono}</p>
        </section>
      </div>

      <div className="y-delivery-confirm__notice" role="note">
        <strong>El envío es estimado</strong>
        <p>
          Esta solicitud no realiza un cobro. El equipo confirmará el costo final del envío antes de preparar tu pedido; el pago se coordinará al momento de la entrega.
        </p>
      </div>

      <div className="y-delivery-step-actions">
        <Button type="button" variant="secondary" onClick={onPrev} size="lg">Volver a dirección</Button>
        <Button type="button" onClick={onSubmit} loading={loading} size="lg" className="y-delivery-primary-button">
          {loading ? 'Enviando solicitud…' : 'Confirmar pedido'}
        </Button>
      </div>
    </div>
  );
}