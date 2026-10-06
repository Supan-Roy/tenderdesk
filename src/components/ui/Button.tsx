import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  let variantClasses = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
  if (variant === 'secondary') {
    variantClasses = 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-700';
  } else if (variant === 'outline') {
    variantClasses = 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-blue-500';
  } else if (variant === 'ghost') {
    variantClasses = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400';
  } else if (variant === 'danger') {
    variantClasses = 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500';
  }

  let sizeClasses = 'px-4 py-2 text-sm';
  if (size === 'sm') {
    sizeClasses = 'px-3 py-1.5 text-xs';
  } else if (size === 'lg') {
    sizeClasses = 'px-5 py-2.5 text-base';
  }

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
