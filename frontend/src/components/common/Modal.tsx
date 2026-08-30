'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg' }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity duration-100"
        onClick={onClose}
      />

      {/* Modal Dialog Box - Sharp 90 deg corners, 2px border */}
      <div className={`relative w-full ${maxWidthStyles[maxWidth]} rounded-none border-2 border-black bg-white p-8 z-10 font-body text-black animate-in fade-in zoom-in-95 duration-100 shadow-none`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-black mb-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-black tracking-tight">{title}</h3>
            {subtitle && <p className="font-serif text-xs text-mono-600 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-black hover:text-white border border-black transition-colors duration-100"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

