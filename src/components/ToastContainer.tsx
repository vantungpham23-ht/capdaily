'use client';

import { Check, Info, AlertCircle, X } from 'lucide-react';
import { Toast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const kindMap = {
  success: {
    icon: Check,
    cls: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
    iconCls: 'bg-emerald-500 text-white',
  },
  info: {
    icon: Info,
    cls: 'border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-300',
    iconCls: 'bg-sky-500 text-white',
  },
  error: {
    icon: AlertCircle,
    cls: 'border-red-500/30 bg-red-500/12 text-red-700 dark:text-red-300',
    iconCls: 'bg-red-500 text-white',
  },
} as const;

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => {
        const kind = kindMap[toast.kind];
        const Icon = kind.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex animate-pop items-center gap-2.5 rounded-xl border px-3.5 py-2.5 shadow-float backdrop-blur-xl ${kind.cls}`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${kind.iconCls}`}
            >
              <Icon size={12} />
            </span>
            <span className="text-[12.5px] font-semibold">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Đóng"
              className="ml-1 rounded p-0.5 opacity-50 transition-opacity hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
