import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}

export function Card({ children, className = '', glow = false, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0A0E17]/90 backdrop-blur-md p-5 transition-all duration-200 ${
        glow ? 'shadow-lg shadow-indigo-500/10 border-indigo-500/30' : ''
      } ${
        interactive ? 'hover:border-white/20 hover:bg-[#0D1320] hover:scale-[1.008] cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between pb-3 mb-3 border-b border-white/5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-sm font-bold text-white tracking-tight flex items-center gap-2 ${className}`}>
      {children}
    </h3>
  );
}
