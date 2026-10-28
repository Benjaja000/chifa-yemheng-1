import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Stepper } from '@/shared/ui/Stepper';
import { DireccionStep } from './DireccionStep';
import { ConfirmarStep } from './ConfirmarStep';
import { api } from '@/shared/services/api-client';
import { toast } from '@/shared/ui/use-toast';

type Step = 'direccion' | 'confirmar';

interface WizardState {
  step: Step;
  direccion: string;
  distritoId: number | null;
  referencia: string;
  telefono: string;
  costoEnvio: number;
  latCliente?: number;
  lngCliente?: number;
}

const STEPS: Step[] = ['direccion', 'confirmar'];
const STEP_LABELS = { direccion: 'Dirección', confirmar: 'Confirmar' };

export function DeliveryWizard({ onCreated }: { onCreated?: (idPedidoDelivery: number) => void }) {
  const navigate = useNavigate();
  const { items: cartItems, clear } = useCart();
  const [state, setState] = useState<WizardState>({
    step: 'direccion',
    direccion: '',
    distritoId: null,
    referencia: '',
    telefono: '',
    costoEnvio: 0,
  });
  const [loading, setLoading] = useState(false);

  const items = cartItems.map(({ producto, cantidad, nota }) => ({
    productoId: producto.id_producto,
    cantidad,
    precioUnit: Number(producto.precio),
    nombre: producto.n_producto,
    nota,
  }));
  const currentIndex = STEPS.indexOf(state.step);

  const updateState = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentIndex < STEPS.length - 1) {
      updateState({ step: STEPS[currentIndex + 1] });
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      updateState({ step: STEPS[currentIndex - 1] });
    }
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast({ title: 'Error', description: 'Agrega al menos un producto', variant: 'destructive' });
      return;
    }
    if (!state.direccion || !state.distritoId) {
      toast({ title: 'Error', description: 'Dirección y distrito son obligatorios', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const result = await api.crearDelivery({
        items: items.map(({ productoId, cantidad, nota }) => ({ productoId, cantidad, nota })),
        direccion: state.direccion,
        distritoId: state.distritoId,
        referencia: state.referencia,
        telefono: state.telefono,
        latCliente: state.latCliente,
        lngCliente: state.lngCliente,
      });
      toast({
        title: 'Solicitud recibida',
        description: `Pedido #${result.idPedidoDelivery} registrado. El equipo confirmará el costo de envío.`,
      });
      clear();
      if (onCreated) onCreated(result.idPedidoDelivery);
      else navigate(`/cliente/pedido/${result.idPedidoDelivery}`);
    } catch (error: unknown) {
      const code = error instanceof Error ? error.message : '';
      const messages: Record<string, string> = {
        FUERA_DE_COBERTURA: 'La dirección está fuera de la cobertura del restaurante.',
        PRODUCTO_NO_DISPONIBLE: 'Uno de los productos ya no está disponible. Actualiza tu pedido.',
        DISTRITO_NOT_FOUND: 'El distrito seleccionado no está disponible. Selecciónalo nuevamente.',
        CLIENTE_NOT_FOUND: 'No encontramos tu cuenta. Inicia sesión nuevamente.',
        DELIVERY_CREATE_FAIL: 'No se pudo registrar el pedido. Inténtalo nuevamente en unos minutos.',
        VALIDATION_ERROR: 'Revisa la dirección, el teléfono y los productos del pedido.',
      };
      toast({ title: 'No se pudo crear el pedido', description: messages[code] ?? 'Ocurrió un error inesperado. Inténtalo nuevamente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 'direccion':
        return <DireccionStep
          direccion={state.direccion}
          distritoId={state.distritoId}
          referencia={state.referencia}
          telefono={state.telefono}
          costoEnvio={state.costoEnvio}
          onDireccionChange={direccion => updateState({ direccion })}
          onDistritoChange={distritoId => updateState({ distritoId })}
          onReferenciaChange={referencia => updateState({ referencia })}
          onTelefonoChange={telefono => updateState({ telefono })}
          onCostoChange={costoEnvio => updateState({ costoEnvio })}
          onGpsChange={(lat, lng) => updateState({ latCliente: lat, lngCliente: lng })}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 'confirmar':
        return <ConfirmarStep
          items={items}
          direccion={state.direccion}
          referencia={state.referencia}
          telefono={state.telefono}
          costoEnvio={state.costoEnvio}
          onSubmit={handleSubmit}
          onPrev={prevStep}
          loading={loading}
        />;
    }
  };

  if (items.length === 0) {
    return (
      <section className="y-delivery-empty-cart" aria-labelledby="delivery-empty-title">
        <span className="y-delivery-empty-cart__icon"><ShoppingBag size={26} aria-hidden="true" /></span>
        <span className="y-cliente-kicker">Tu pedido empieza en la carta</span>
        <h2 id="delivery-empty-title">Aún no agregaste platos</h2>
        <p>Explora la carta, agrega tus favoritos y vuelve aquí para indicar dónde los entregamos.</p>
        <Link to="/cliente/menu" className="y-btn red y-delivery-empty-cart__link">
          Ir a la carta <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <div className="y-delivery-wizard">
      <Stepper
        steps={STEPS.map(s => ({ key: s, label: STEP_LABELS[s] }))}
        currentStep={currentIndex}
        className="y-delivery-stepper"
      />
      <div className="y-delivery-wizard__content">{renderStep()}</div>
    </div>
  );
}