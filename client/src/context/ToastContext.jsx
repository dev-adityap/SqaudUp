import React, { createContext, useCallback, useContext, useMemo, useState, useRef, useCallback as cb } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TONE = {
  success: { icon: CheckCircle2, cls: 'bg-emerald-950 border-emerald-700 text-emerald-300' },
  error: { icon: AlertCircle, cls: 'bg-red-950 border-red-700 text-red-300' },
  info: { icon: Info, cls: 'bg-neutral-900 border-neutral-700 text-neutral-200' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, tone = 'info', ttl = 4000) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-3), { id, message, tone }]);
    if (ttl) setTimeout(() => dismiss(id), ttl);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({
    toast: push,
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-24 right-4 sm:right-6 z-[100] flex flex-col gap-2 w-[min(22rem,calc(100vw-2rem))]"
        role="region"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const tone = TONE[t.tone] || TONE.info;
          const Icon = tone.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl border ${tone.cls}`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="flex-1 leading-snug">{t.message}</span>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="opacity-60 hover:opacity-100 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
