'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, UserCheck, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-white text-black flex flex-col justify-center py-16 px-6 sm:px-8 lg:px-12 font-body selection:bg-black selection:text-white relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-8 h-8 border border-black bg-black text-white flex items-center justify-center font-mono font-bold text-sm transition-colors duration-100 group-hover:bg-white group-hover:text-black">
            AC
          </div>
          <span className="font-serif font-bold text-xl uppercase tracking-tight text-black">
            AI CAREER COPILOT
          </span>
        </Link>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-black">
          SIGN IN &bull; DOSSIER
        </h2>
        <p className="font-mono text-2xs uppercase tracking-widest text-mono-500">
          Access your autonomous engineering telemetry
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* 1-Click Demo Personas Selector */}
        <div className="border-2 border-black p-6 bg-mono-50 space-y-3">
          <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-widest font-bold text-black border-b border-black pb-2">
            <span>Instant Demo Access</span>
            <span className="bg-black text-white px-2 py-0.5">1-Click</span>
          </div>
          <p className="font-serif text-xs text-mono-600">
            Instantly load seeded technical resumes, 5 active applications, and calibrated AI tools:
          </p>

          <button
            type="button"
            onClick={() => handleDemoPersona('fullstack')}
            disabled={isLoading}
            className="w-full text-left p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors duration-100 flex items-center justify-between group"
          >
            <div>
              <div className="font-serif font-bold text-sm">
                Alex Chen &bull; Full-Stack Engineer
              </div>
              <div className="font-mono text-2xs text-mono-500 group-hover:text-mono-400 mt-0.5">
                3 yrs exp &bull; 95 ATS Score &bull; 5 Pipeline Apps
              </div>
            </div>
            <UserCheck className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          </button>
        </div>

        {/* Standard Form */}
        <div className="border-2 border-black bg-white p-8 space-y-6">
          {error && (
            <div className="p-3 border border-black bg-black text-white font-mono text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <div className="space-y-2">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block uppercase tracking-wider font-bold text-mono-700">Password</label>
                <a href="#" className="text-2xs uppercase text-mono-500 hover:text-black underline">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-4 text-xs" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Authenticate &rarr;
            </Button>
          </form>

          <div className="pt-2 text-center font-mono text-2xs uppercase tracking-wider text-mono-500 border-t border-mono-200">
            Unregistered candidate?{' '}
            <Link href="/register" className="font-bold text-black underline">
              Create Dossier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

