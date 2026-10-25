import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);
    setTimeout(() => dismiss(id), 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

function ToastViewport() {
  const context = useContext(ToastContext);
  if (!context) return null;
  const { toasts, dismiss } = context;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 animate-slide-in ${
            t.variant === 'destructive' ? 'bg-red-50 border-red-500' :
            t.variant === 'success' ? 'bg-green-50 border-green-500' :
            'bg-blue-50 border-blue-500'
          }`}
        >
          <div className="flex-1">
            <p className="font-medium text-gray-900">{t.title}</p>
            {t.description && <p className="text-sm text-gray-600 mt-1">{t.description}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function toast(props: Omit<Toast, 'id'>) {
  // This is a simplified version - in real app use useToast()
  console.log('Toast:', props);
}