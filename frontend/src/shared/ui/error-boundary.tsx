import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary capturó:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', maxWidth: 900, margin: '40px auto' }}>
          <h1 style={{ color: '#A61E22', fontSize: 20 }}>Se produjo un error en la aplicación</h1>
          <p style={{ color: '#555' }}>Copia este mensaje y repórtalo:</p>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#A61E22', color: '#fff', border: 0, cursor: 'pointer' }}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
