'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, 
  BarChart3, FileText, Kanban, Wand2, Briefcase, 
  Cpu, Zap, Award, Star, Terminal, ChevronRight, Check
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'match' | 'resume' | 'optimize' | 'tracker'>('match');

  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Glowing Mesh Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-cyan-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Next-Gen Career Intelligence Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Your AI-Powered <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200">
              Career Copilot
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
            Manage your entire job search workflow in one unified cockpit: multi-version ATS resume scoring, semantic job matching, zero-hallucination bullet optimization, and Kanban application tracking.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Interactive Demo
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}>
                Sign In with Demo Persona
              </Button>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/5 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold font-mono text-white">3.8x</div>
              <div className="text-xs text-slate-400 mt-0.5">Higher Interview Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold font-mono text-cyan-400">95%</div>
              <div className="text-xs text-slate-400 mt-0.5">Average ATS Score</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold font-mono text-emerald-400">sub-100ms</div>
              <div className="text-xs text-slate-400 mt-0.5">Semantic Match Speed</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold font-mono text-indigo-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Non-Hallucinatory AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Preview Showcase */}
      <section id="demo-preview" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <Badge variant="cyan" size="sm">Interactive SaaS Cockpit</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for High-Velocity Job Seekers
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Click through the workflow modules below to explore the AI Career Copilot architecture.
          </p>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('match')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'match'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Semantic Job Match (92%)</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'resume'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ATS Resume Audit (95/100)</span>
          </button>
          <button
            onClick={() => setActiveTab('optimize')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'optimize'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Bullet Optimizer & STAR Q&A</span>
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'tracker'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Pipeline</span>
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1B] p-6 shadow-2xl relative overflow-hidden">
          {activeTab === 'match' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">Senior Full-Stack Engineer</span>
                    <Badge variant="emerald" size="sm">92% Match</Badge>
                  </div>
                  <div className="text-xs text-slate-400">Stripe &bull; San Francisco, CA (Remote) &bull; $160k - $210k</div>
                </div>
                <Link href="/jobs/job-1">
                  <Button size="sm" variant="primary">View Live Breakdown</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matching Skills (6)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['TypeScript', 'React', 'FastAPI', 'PostgreSQL', 'Docker', 'System Design'].map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Missing / Preferred Keywords (2)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Kafka Event Streaming', 'AWS Terraform'].map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                <strong>AI Match Rationale:</strong> Candidate demonstrates 3+ years experience with Next.js micro-frontends and Python backend APIs serving 450k DAU. High compatibility with Stripe developer onboarding team standards.
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-base font-bold text-white">Full-Stack Engineer - Standard ATS V1</h3>
                  <p className="text-xs text-slate-400">Parsed 14 technical skills, 3 employment milestones, 2 open source projects</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-emerald-400">95 / 100</div>
                    <div className="text-[10px] text-slate-400">ATS Pass Score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-[11px] text-slate-400">Impact Score</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">88%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">8 Action Verbs Detected</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-[11px] text-slate-400">ATS Readability</div>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-1">96%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Standard Headers</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-[11px] text-slate-400">Structure & Quant</div>
                  <div className="text-lg font-bold font-mono text-indigo-400 mt-1">94%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">4 Metrics Included</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimize' && (
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Before & After Surgical Enhancement</div>
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                <div className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Original Bullet:</div>
                <div className="text-slate-300">Worked on database tables, caching, and CI/CD pipelines for the team.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">AI Optimized Bullet (Zero Hallucination):</div>
                <div className="text-slate-100 font-medium">
                  Architected normalized PostgreSQL schemas and engineered Redis caching layers, slashing P99 API latency by 83% across 450k DAU with automated Docker CI/CD pipelines.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Applied</span> <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">1</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="font-semibold text-white">Anthropic</div>
                  <div className="text-[10px] text-slate-400">Backend AI Engineer</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="font-semibold text-cyan-400 flex items-center justify-between">
                  <span>Screening</span> <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20">1</span>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="font-semibold text-white">Linear</div>
                  <div className="text-[10px] text-cyan-300">Frontend Engineer</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="font-semibold text-indigo-400 flex items-center justify-between">
                  <span>Interview</span> <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20">1</span>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="font-semibold text-white">Stripe</div>
                  <div className="text-[10px] text-indigo-300">Round 2 System Design</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Offer</span> <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">1</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-semibold text-white">Perplexity AI</div>
                  <div className="text-[10px] text-emerald-300">$160k + Equity</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-2">
          <Badge variant="indigo" size="sm">End-To-End Architecture</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Land Your Dream Role
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Built by engineers for engineers. No boilerplate marketing jargon—just precision tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0E17]/90 space-y-3 hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Version ATS Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload multiple resume versions tailored for different tech stacks (e.g. Backend Go vs Full-Stack Next.js). Instant ATS score breakdown with keyword gap detection.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0E17]/90 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Semantic Job Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover curated engineering roles ranked by weighted semantic compatibility. Paste any custom job description from LinkedIn/Indeed for instant match analysis.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0E17]/90 space-y-3 hover:border-violet-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Hallucination AI Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate job-specific cover letters, rewrite bullet points with quantifiable impact metrics, and prepare for interviews using real STAR framework analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <Badge variant="emerald" size="sm">Transparent SaaS Pricing</Badge>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Invest in Your Engineering Career</h2>
          <p className="text-xs text-slate-400">Start free, upgrade when you are actively interviewing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Tier */}
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0A0E17] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Student & Graduate Tier</span>
                <Badge variant="slate" size="sm">Free Forever</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-white">$0</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400">Perfect for students and recent grads starting their job search.</p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 2 Resume Versions & ATS Audits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 20 Semantic Job Matches / month</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Kanban Application Tracker</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 5 AI Cover Letters / month</li>
              </ul>
            </div>

            <Link href="/login" className="w-full block">
              <Button variant="outline" className="w-full">Get Started Free</Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-6 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-[#0F1424] to-[#0A0E17] space-y-6 flex flex-col justify-between shadow-xl shadow-indigo-500/10 relative">
            <div className="absolute -top-3 right-6">
              <Badge variant="indigo" size="sm">Most Popular</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Pro Job Seeker</span>
                <span className="text-[10px] text-cyan-400 font-mono">Full AI Power</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-mono text-white">$19</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400">For engineers actively interviewing at high-growth tech companies.</p>

              <ul className="space-y-2.5 text-xs text-slate-200 pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Unlimited Resume Versions & ATS Deep Audit</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Unlimited Semantic Job Matches & Custom JD Scans</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Unlimited Bullet Optimization (Zero Hallucinations)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> AI Mock Interview Coach with STAR Grader</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Advanced Pipeline Conversion Funnel</li>
              </ul>
            </div>

            <Link href="/dashboard" className="w-full block">
              <Button variant="primary" className="w-full">Start 14-Day Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900/40 via-[#0C1222] to-cyan-950/30 p-8 sm:p-12 text-center relative overflow-hidden space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of software engineers using AI Career Copilot to optimize resumes, identify high-fit jobs, and crush interviews.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Dashboard Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
