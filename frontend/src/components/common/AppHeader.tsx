'use client';

import React from 'react';
import { Wand2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function AppHeader({ title, subtitle, actionButton }: AppHeaderProps) {
  const { profile } = useAuth();
  const completion = profile?.profile_completion || 92;

  return (
    <header className="h-20 border-b border-black bg-white px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-black flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="font-serif text-xs text-mono-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Center Search / Status Pill */}
      <div className="hidden md:flex items-center gap-4">
        {/* Profile Strength Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-black bg-mono-50 font-mono text-2xs uppercase tracking-wider">
          <span className="text-mono-600 font-medium">Profile Integrity:</span>
          <span className="font-bold text-black flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-black inline-block" />
            {completion}%
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/ai-tools"
          className="flex items-center gap-1.5 font-mono text-2xs uppercase tracking-widest px-4 py-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-100 font-bold"
        >
          <Wand2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>AI Studio</span>
        </Link>

        {actionButton}
      </div>
    </header>
  );
}

