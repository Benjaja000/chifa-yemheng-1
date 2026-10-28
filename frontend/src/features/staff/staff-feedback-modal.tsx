import { useEffect, useState } from 'react';
import { Ico } from '../../components/Icon';

export type StaffFeedbackKind = 'info' | 'warning' | 'error' | 'success';

export interface StaffFeedback {
  kind: StaffFeedbackKind;
  title: string;
  description: string;
}

export function StaffFeedbackModal({
  feedback,
  onClose,
  onAction,
  actionLabel = 'Actualizar',
  actionErrorMessage = 'No se pudo actualizar. Inténtalo nuevamente.',
}: {
  feedback: StaffFeedback;
  onClose: () => void;
  onAction?: () => Promise<void>;
  actionLabel?: string;
  actionErrorMessage?: string | ((error: unknown) => string);
}) {
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const icon = feedback.kind === 'success' ? 'ok' : feedback.kind === 'warning' ? 'alert' : feedback.kind === 'error' ? 'err' : 'note';

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [busy, onClose]);

  const runAction = async () => {
    if (!onAction) return;
    setBusy(true);
    setActionError(null);
    try {
      await onAction();
      onClose();
    } catch (error) {
      setActionError(
        typeof actionErrorMessage === 'function'
          ? actionErrorMessage(error)
          : actionErrorMessage,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="ys-veil staff-feedback-veil"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <section
        className={`card staff-feedback staff-feedback--${feedback.kind}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="staff-feedback-title"
        aria-describedby="staff-feedback-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="staff-feedback-icon">
          <Ico n={icon} size={26} />
        </div>
        <h2 id="staff-feedback-title">{feedback.title}</h2>
        <p id="staff-feedback-description">{feedback.description}</p>
        {actionError && <p className="staff-feedback-error" role="alert">{actionError}</p>}
        <div className="staff-feedback-actions">
          {onAction && (
            <button className="btn btn-gold" disabled={busy} onClick={() => void runAction()}>
              {busy ? 'Actualizando…' : actionLabel}
            </button>
          )}
          <button className="btn btn-ghost" disabled={busy} onClick={onClose}>
            {onAction ? 'Cerrar' : 'Entendido'}
          </button>
        </div>
      </section>
    </div>
  );
}
