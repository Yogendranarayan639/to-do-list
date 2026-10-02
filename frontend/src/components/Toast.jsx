import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--color-success)" />}
          {t.type === 'error' && <AlertTriangle size={18} color="var(--color-danger)" />}
          {(!t.type || t.type === 'info') && <Info size={18} color="var(--color-info)" />}
          
          <span style={{ flex: 1 }}>{t.message}</span>

          <button
            onClick={() => onDismiss(t.id)}
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
