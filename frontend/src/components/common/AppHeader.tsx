'use client';

import React from 'react';
import { Sparkles, Search, Bell, Plus, Wand2, Compass } from 'lucide-react';
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
    <header className="h-16 border-b border-white/5 bg-[#070A0F]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400 font-normal">{subtitle}</p>}
      </div>

      {/* Center Search / Status Pill */}
      <div className="hidden md:flex items-center gap-3">
        {/* Profile Strength Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs">
          <div className="text-slate-400">Profile Health:</div>
          <div className="flex items-center gap-1.5 font-mono font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {completion}%
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/ai-tools"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-300 hover:border-cyan-400/50 transition-all"
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Studio</span>
        </Link>

        {actionButton}
      </div>
    </header>
  );
}
