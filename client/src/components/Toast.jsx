import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--secondary)';
        let borderColor = '#86efac';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--danger)';
          borderColor = '#fca5a5';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--info)';
          borderColor = '#93c5fd';
        }

        return (
          <div
            key={toast.id}
            className="toast"
            style={{ borderLeft: `4px solid ${iconColor}` }}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, color: 'var(--dark)' }}>
              {toast.message}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ color: 'var(--text-light)', padding: '2px' }}
              aria-label="Dismiss toast notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
