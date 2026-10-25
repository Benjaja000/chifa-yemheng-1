import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './features/auth/login/auth-context';
import { ClienteAuthProvider } from './features/cliente/auth/cliente-auth-context';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './theme/theme-context';
import { ToastProvider } from './shared/ui/use-toast';
import { ErrorBoundary } from './shared/ui/error-boundary';
import { router } from './routes';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ClienteAuthProvider>
                <CartProvider>
                  <RouterProvider router={router} />
                </CartProvider>
              </ClienteAuthProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
