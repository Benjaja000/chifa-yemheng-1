import { cn } from '@/lib/utils';

interface TimelineStep {
  key: 'P' | 'R' | 'E' | 'C';
  label: string;
  timestamp?: string;
  active?: boolean;
  completed?: boolean;
}

const STEPS: TimelineStep[] = [
  { key: 'P', label: 'Pendiente' },
  { key: 'R', label: 'En ruta' },
  { key: 'E', label: 'Entregado' },
  { key: 'C', label: 'Cancelado' },
];

interface TimelineProps {
  currentState: 'P' | 'R' | 'E' | 'C';
  timestamps?: Partial<Record<'P' | 'R' | 'E' | 'C', string>>;
  className?: string;
}

export function Timeline({ currentState, timestamps, className = '' }: TimelineProps) {
  const currentIndex = STEPS.findIndex(s => s.key === currentState);
  const isCancelled = currentState === 'C';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {STEPS.map((step, index) => {
        const isCompleted = isCancelled ? false : index < currentIndex;
        const isCurrent = index === currentIndex && !isCancelled;
        
        const lineColor = isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200';
        const dotColor = isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300';
        const labelColor = isCompleted ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-gray-600';

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center min-w-[32px]">
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors',
                  dotColor,
                  isCompleted && 'border-green-500',
                  isCurrent && 'border-blue-500 animate-pulse',
                  !isCompleted && !isCurrent && 'border-gray-300'
                )}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn('w-1 h-full mt-1', lineColor)} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn('font-medium', labelColor)}>{step.label}</div>
              {timestamps?.[step.key] && (
                <div className="text-sm text-gray-500 mt-0.5">
                  {new Date(timestamps[step.key]!).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}