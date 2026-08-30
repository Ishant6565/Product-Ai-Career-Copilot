import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'solid' | 'muted' | 'outline' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' | 'indigo' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  // Pure monochrome palette: map any legacy color names gracefully to sharp black/white variants
  const variantStyles: Record<string, string> = {
    default: 'bg-transparent text-black border-black',
    solid: 'bg-black text-white border-black',
    muted: 'bg-mono-100 text-mono-700 border-mono-300',
    outline: 'bg-white text-black border-black',
    // Fallback mappings for existing pages
    emerald: 'bg-mono-100 text-black border-black',
    amber: 'bg-mono-100 text-black border-black',
    rose: 'bg-black text-white border-black',
    cyan: 'bg-transparent text-black border-black',
    violet: 'bg-mono-100 text-black border-black',
    indigo: 'bg-black text-white border-black',
    slate: 'bg-transparent text-mono-600 border-mono-300',
  };

  const sizeStyles = {
    sm: 'text-2xs px-2 py-0.5 font-mono tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 font-mono tracking-wider uppercase',
  };

  const selectedVariantStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span className={`inline-flex items-center gap-1.5 border font-mono rounded-none select-none ${selectedVariantStyle} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}

