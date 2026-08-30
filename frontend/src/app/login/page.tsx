'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/common/Button';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoPersona } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      login(res.access_token, res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoPersona = async (persona: string) => {
    setIsLoading(true);
    try {
      await switchDemoPersona(persona);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Could not initialize demo profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl text-white">AI Career Copilot</span>
        </Link>

        <h2 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to your career copilot cockpit</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* 1-Click Demo Personas Selector */}
        <div className="mb-6 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
            <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Instant Demo Login
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            No signup needed. Instantly explore seeded resumes, active job applications, and AI tools:
          </p>

          <button
            type="button"
            onClick={() => handleDemoPersona('fullstack')}
            disabled={isLoading}
            className="w-full text-left p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between transition-all group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Alex Chen (Full-Stack Engineer)
              </div>
              <div className="text-[10px] text-slate-400">
                3 yrs exp &bull; 92% profile health &bull; 5 active applications
              </div>
            </div>
            <UserCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/90 backdrop-blur-md p-6 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <a href="#" className="text-[11px] text-indigo-400 hover:text-indigo-300">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
