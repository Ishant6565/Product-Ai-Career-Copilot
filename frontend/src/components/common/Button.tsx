import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverted' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium uppercase tracking-widest transition-colors duration-100 focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-3 disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-none active:translate-y-[1px]';

  const sizeStyles = {
    sm: 'text-2xs px-3 py-2 gap-1.5 border',
    md: 'text-xs px-5 py-3 gap-2 border',
    lg: 'text-xs sm:text-sm px-8 py-4 gap-2.5 border-2',
  };

  const variantStyles = {
    primary: 'bg-black text-white border-black hover:bg-white hover:text-black hover:border-black',
    secondary: 'bg-transparent text-black border-black hover:bg-black hover:text-white',
    outline: 'bg-white text-black border-black hover:bg-black hover:text-white',
    inverted: 'bg-white text-black border-white hover:bg-black hover:text-white hover:border-white',
    ghost: 'bg-transparent text-black border-transparent hover:underline hover:bg-mono-100',
    danger: 'bg-black text-white border-black hover:bg-white hover:text-black line-through-hover',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

