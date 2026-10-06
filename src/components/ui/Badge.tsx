import React, { ReactNode } from 'react';
import { DocumentStatus } from '@/types';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  status?: DocumentStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', status, className = '' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status) {
    switch (status) {
      case 'OK':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'EXPIRY_NEEDED':
      case 'EXPIRED':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'MISSING':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'NOT_PROVIDED':
        colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'warning':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      case 'danger':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'info':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'neutral':
        colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};
