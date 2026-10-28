import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '@/shared/ui/Stepper';
import { CartaStep } from './CartaStep';
import { DireccionStep } from './DireccionStep';
import { ConfirmarStep } from './ConfirmarStep';
import { api } from '@/shared/services/api-client';
import { toast } from '@/shared/ui/use-toast';

type Step = 'carta' | 'direccion' | 'confirmar';

interface WizardState {
  step: Step;
  items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string }>;
  direccion: string;
  distritoId: number | null;
  referencia: string;
  telefono: string;
  costoEnvio: number;
  latCliente?: number;
  lngCliente?: number;
}

const STEPS: Step[] = ['carta', 'direccion', 'confirmar'];
const STEP_LABELS = { carta: 'Carta', direccion: 'Dirección', confirmar: 'Confirmar' };

export function DeliveryWizard({ onCreated }: { onCreated?: (idPedidoDelivery: number) => void }) {
  const navigate = useNavigate();
  const [state, setState] = useState<WizardState>({
    step: 'carta',
    items: [],
    direccion: '',
    distritoId: null,
    referencia: '',
    telefono: '',
    costoEnvio: 0,
  });
  const [loading, setLoading] = useState(false);

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
    if (state.items.length === 0) {
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
        items: state.items.map(({ productoId, cantidad, nota }) => ({ productoId, cantidad, nota })),
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
      case 'carta':
        return <CartaStep items={state.items} onItemsChange={items => updateState({ items })} onNext={nextStep} />;
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
          items={state.items}
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Stepper
        steps={STEPS.map(s => ({ key: s, label: STEP_LABELS[s] }))}
        currentStep={currentIndex}
      />
      <div className="mt-6">{renderStep()}</div>
    </div>
  );
}