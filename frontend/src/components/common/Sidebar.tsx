'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, FileText, Kanban, 
  Wand2, BarChart3, User, Settings, Sparkles, 
  LogOut, Shield, ChevronRight, UserCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile, logout, switchDemoPersona } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Discovery', href: '/jobs', icon: Briefcase, badge: 'Curated' },
    { name: 'Resume Hub', href: '/resumes', icon: FileText, badge: 'ATS 95' },
    { name: 'Application Tracker', href: '/tracker', icon: Kanban, badge: '5 Active' },
    { name: 'AI Career Studio', href: '/ai-tools', icon: Wand2, highlight: true },
    { name: 'Analytics & Funnel', href: '/analytics', icon: BarChart3 },
    { name: 'Career Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#080C14] flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
              AI Career <span className="text-cyan-400 font-semibold">Copilot</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">SaaS Command Center</div>
          </div>
        </Link>
      </div>

      {/* Demo Switcher Quick Pill */}
      <div className="px-4 pt-3 pb-1">
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-300">Demo Persona:</span>
          </div>
          <button
            onClick={() => switchDemoPersona()}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            Alex Chen <UserCheck className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-500 px-3 py-1">
          Career Workflow
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 via-indigo-600/10 to-transparent text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive 
                    ? 'text-cyan-400' 
                    : item.highlight 
                      ? 'text-indigo-400 group-hover:text-indigo-300' 
                      : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/5 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.highlight && !item.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-white/5 bg-[#06090F]">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B0F19]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.full_name || 'Alex Chen'}</div>
              <div className="text-[10px] text-slate-400 truncate">{profile?.target_role || 'Full-Stack Engineer'}</div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
