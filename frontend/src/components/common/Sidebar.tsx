'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, FileText, Kanban, 
  Wand2, BarChart3, User, Settings,
  LogOut, UserCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile, logout, switchDemoPersona } = useAuth();

  const navItems = [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Discovery', href: '/jobs', icon: Briefcase, badge: 'Curated' },
    { name: 'Resume Registry', href: '/resumes', icon: FileText, badge: 'ATS 95' },
    { name: 'Application Kanban', href: '/tracker', icon: Kanban, badge: '5 Active' },
    { name: 'AI Career Studio', href: '/ai-tools', icon: Wand2, highlight: true },
    { name: 'Conversion Funnel', href: '/analytics', icon: BarChart3 },
    { name: 'Candidate Dossier', href: '/profile', icon: User },
    { name: 'System Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-black bg-white flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 font-mono">
      {/* Brand Header */}
      <div className="p-6 border-b border-black flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-black bg-black text-white flex items-center justify-center font-bold text-sm transition-colors duration-100 group-hover:bg-white group-hover:text-black">
            AC
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-tight text-black leading-none">
              AI CAREER COPILOT
            </div>
            <div className="text-2xs text-mono-500 uppercase tracking-widest mt-1">Autonomous Cockpit</div>
          </div>
        </Link>
      </div>

      {/* Demo Switcher Quick Pill */}
      <div className="p-4 border-b border-mono-200 bg-mono-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black inline-block" />
            <span className="text-2xs uppercase tracking-wider text-mono-600 font-bold">Persona:</span>
          </div>
          <button
            onClick={() => switchDemoPersona()}
            className="text-2xs uppercase font-bold text-black hover:underline flex items-center gap-1 border-b border-black pb-0.5"
          >
            Alex Chen <UserCheck className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-2xs font-bold uppercase tracking-widest text-mono-400 px-3 py-2">
          Navigation Index
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors duration-100 group ${
                isActive
                  ? 'bg-black text-white font-bold border border-black'
                  : 'text-mono-700 hover:bg-mono-100 hover:text-black border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-2xs px-1.5 py-0.5 border font-mono ${
                  isActive 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-mono-600 border-mono-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-black bg-mono-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 border border-black shrink-0 bg-white overflow-hidden">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-black truncate">{user?.full_name || 'Alex Chen'}</div>
              <div className="text-2xs text-mono-500 truncate font-mono">{profile?.target_role || 'Full-Stack Engineer'}</div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-mono-600 hover:text-black hover:bg-mono-200 border border-transparent hover:border-black transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}

