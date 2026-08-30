import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' | 'indigo' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'indigo', size = 'md', className = '' }: BadgeProps) {
  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    slate: 'bg-white/5 text-slate-300 border-white/10',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-mono',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-lg border font-mono tracking-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
