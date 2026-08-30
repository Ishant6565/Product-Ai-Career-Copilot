'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/common/Button';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.register({
        email,
        password,
        full_name: fullName,
        target_role: targetRole,
      });
      login(res.access_token, res.user);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
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
          INITIALIZE &bull; DOSSIER
        </h2>
        <p className="font-mono text-2xs uppercase tracking-widest text-mono-500">
          Create candidate profile for deterministic career matching
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-2 border-black bg-white p-8 space-y-6">
          {error && (
            <div className="p-3 border border-black bg-black text-white font-mono text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <div className="space-y-2">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.chen@example.com"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Target Engineering Specialization</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
              >
                <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer (React / Next.js)</option>
                <option value="Backend AI Systems Engineer">Backend AI Systems Engineer (Python / FastAPI)</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="Graduate Software Engineer">Graduate / Junior Software Engineer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-4 text-xs" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Proceed to Calibration &rarr;
            </Button>
          </form>

          <div className="pt-2 text-center font-mono text-2xs uppercase tracking-wider text-mono-500 border-t border-mono-200">
            Existing candidate dossier?{' '}
            <Link href="/login" className="font-bold text-black underline">
              Authenticate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

