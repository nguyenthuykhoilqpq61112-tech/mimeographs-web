import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-fadeIn">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/60 shadow-2xl shadow-cyan-500/20 text-white text-xs sm:text-sm font-medium backdrop-blur-xl">
        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="truncate max-w-sm">{message}</span>
      </div>
    </div>
  );
};
