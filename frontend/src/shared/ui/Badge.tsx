import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-slate-100 text-slate-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function DeliveryStatusBadge({ estado }: { estado: 'P' | 'R' | 'E' | 'C' }) {
  const config = {
    P: { label: 'Pendiente', variant: 'info' as const },
    R: { label: 'En ruta', variant: 'warning' as const },
    E: { label: 'Entregado', variant: 'success' as const },
    C: { label: 'Cancelado', variant: 'danger' as const },
  };
  const { label, variant } = config[estado];
  return <Badge variant={variant}>{label}</Badge>;
}

export function PaymentMethodBadge({ metodo }: { metodo: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    EFECTIVO: { label: 'Efectivo', variant: 'neutral' },
    YAPE: { label: 'Yape', variant: 'success' },
    PLIN: { label: 'Plin', variant: 'success' },
    TARJETA: { label: 'Tarjeta', variant: 'info' },
    TRANSFERENCIA: { label: 'Transferencia', variant: 'default' },
  };
  const { label, variant } = config[metodo] || { label: metodo, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}