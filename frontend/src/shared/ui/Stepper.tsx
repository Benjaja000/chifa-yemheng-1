import { cn } from '@/lib/utils';

interface StepperProps {
  steps: Array<{ key: string; label: string }>;
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = '' }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0" />
        <div className="relative flex justify-between z-10">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-4 flex items-center justify-center text-sm font-medium transition-all',
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                )}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn('mt-2 text-xs text-center', index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500')}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}