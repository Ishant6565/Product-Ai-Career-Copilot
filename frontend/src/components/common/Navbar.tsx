'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Terminal } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from './Button';

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-white/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo - Editorial Serif */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-black bg-black text-white flex items-center justify-center font-mono font-bold text-sm transition-colors duration-100 group-hover:bg-white group-hover:text-black">
            AC
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-black leading-none">
              AI CAREER COPILOT
            </span>
            <span className="font-mono text-2xs uppercase tracking-widest text-mono-500 mt-1">
              Vol. 01 &bull; Autonomous Suite
            </span>
          </div>
        </Link>

        {/* Center Nav Links - JetBrains Mono Upper */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-mono-600">
          <Link href="#features" className="hover:text-black transition-colors py-1 border-b border-transparent hover:border-black">
            Modules
          </Link>
          <Link href="#editorial-detail" className="hover:text-black transition-colors py-1 border-b border-transparent hover:border-black">
            Architecture
          </Link>
          <Link href="#stats" className="hover:text-black transition-colors py-1 border-b border-transparent hover:border-black">
            Metrics
          </Link>
          <Link href="#pricing" className="hover:text-black transition-colors py-1 border-b border-transparent hover:border-black">
            Editions
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="text-xs font-mono uppercase tracking-wider text-black px-3 py-2 border border-transparent hover:border-black transition-colors"
          >
            Sign In
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Launch Cockpit
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

