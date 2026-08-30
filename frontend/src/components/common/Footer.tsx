import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05070B] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-bold text-sm text-white">AI Career Copilot</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            The all-in-one AI career intelligence platform helping software engineers and students land top tech roles with precision matching and ATS optimization.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <div className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px] font-mono">Platform Modules</div>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Career Dashboard</Link></li>
            <li><Link href="/jobs" className="hover:text-cyan-400 transition-colors">Semantic Job Discovery</Link></li>
            <li><Link href="/resumes" className="hover:text-cyan-400 transition-colors">Multi-Version ATS Hub</Link></li>
            <li><Link href="/tracker" className="hover:text-cyan-400 transition-colors">Kanban Application Tracker</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <div className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px] font-mono">AI Intelligence</div>
          <ul className="space-y-2">
            <li><Link href="/ai-tools" className="hover:text-cyan-400 transition-colors">Resume Optimization Studio</Link></li>
            <li><Link href="/ai-tools" className="hover:text-cyan-400 transition-colors">Cover Letter Architect</Link></li>
            <li><Link href="/ai-tools" className="hover:text-cyan-400 transition-colors">STAR Interview Coach</Link></li>
            <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Pipeline Conversion Funnel</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <div className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px] font-mono">Enterprise Ready</div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Services Online
            </div>
            <p className="text-[11px] text-slate-500">
              PostgreSQL + pgvector enabled. Zero hallucination guarantee.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} AI Career Copilot SaaS. Built for ambitious engineers.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link href="/security" className="hover:text-slate-400 transition-colors">Security</Link>
        </div>
      </div>
    </footer>
  );
}
