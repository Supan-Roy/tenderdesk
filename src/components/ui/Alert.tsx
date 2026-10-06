import React, { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'danger',
  title,
  onDismiss,
  className = '',
}) => {
  let styleClasses = 'bg-rose-50 text-rose-800 border-rose-200';
  let IconComponent = AlertCircle;
  let iconColor = 'text-rose-600';

  if (variant === 'warning') {
    styleClasses = 'bg-amber-50 text-amber-900 border-amber-200';
    IconComponent = AlertTriangle;
    iconColor = 'text-amber-600';
  } else if (variant === 'info') {
    styleClasses = 'bg-blue-50 text-blue-900 border-blue-200';
    IconComponent = Info;
    iconColor = 'text-blue-600';
  } else if (variant === 'success') {
    styleClasses = 'bg-emerald-50 text-emerald-900 border-emerald-200';
    IconComponent = CheckCircle;
    iconColor = 'text-emerald-600';
  }

  return (
    <div className={`p-4 rounded-lg border flex items-start space-x-3 text-sm shadow-2xs ${styleClasses} ${className}`}>
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
