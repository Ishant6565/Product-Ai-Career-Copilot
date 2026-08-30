import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  inverted?: boolean;
  interactive?: boolean;
  thickBorder?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  inverted = false, 
  interactive = false, 
  thickBorder = false,
  ...props 
}: CardProps) {
  return (
    <div
      className={`rounded-none ${
        thickBorder ? 'border-2 border-black' : 'border border-black'
      } ${
        inverted 
          ? 'bg-black text-white' 
          : 'bg-white text-black'
      } ${
        interactive 
          ? 'transition-colors duration-100 hover:bg-black hover:text-white cursor-pointer group' 
          : ''
      } p-6 sm:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-current/20 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`font-serif text-lg font-bold tracking-tight flex items-center gap-2 ${className}`}>
      {children}
    </h3>
  );
}

