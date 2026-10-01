'use client';
import { useState } from 'react';
import useToast from '@/store/useToast';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ICON_MAP = {
  success: <CheckCircle2 size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
};

const COLOR_MAP = {
  success: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    bar: 'bg-primary',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-500',
    bar: 'bg-red-500',
  },
  info: {
    bg: 'bg-secondary/10',
    border: 'border-secondary/30',
    text: 'text-secondary',
    bar: 'bg-secondary',
  },
};

function ToastItem({ toast }) {
  const { dismiss } = useToast();
  const [exiting, setExiting] = useState(false);
  const colors = COLOR_MAP[toast.type] || COLOR_MAP.info;

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => dismiss(toast.id), 200);
  };

  return (
    <div
      className={`relative flex items-start gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-200 ${colors.bg} ${colors.border} ${exiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
      style={{ animation: exiting ? 'none' : 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <span className={`mt-0.5 flex-shrink-0 ${colors.text}`}>{ICON_MAP[toast.type]}</span>
      <p className="text-sm text-white font-medium flex-1 pr-4">{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors mt-0.5"
      >
        <X size={16} />
      </button>
      {/* CSS-driven progress bar - 0 CPU overhead */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
        <div
          className={`h-full ${colors.bar} origin-left`}
          style={{
            animation: `toastProgress ${(toast.duration || 4000) / 1000}s linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 w-[380px] max-w-[calc(100vw-3rem)]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
