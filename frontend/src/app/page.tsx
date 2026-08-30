'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ArrowUpRight, Check, Briefcase, FileText, 
  Kanban, Wand2, Terminal, Shield, Zap, Compass, CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'match' | 'resume' | 'optimize' | 'tracker'>('match');

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body selection:bg-black selection:text-white relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-6 md:px-8 lg:px-12 border-b-4 border-black">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          {/* Top Editorial Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black pb-4 font-mono text-2xs uppercase tracking-widest text-mono-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black inline-block" />
              <span>Autonomous Job Search Intelligence</span>
            </div>
            <div className="hidden sm:block">
              Volume 01 &bull; Architecture Dossier &bull; 2026
            </div>
            <div>
              Status: Production Verified
            </div>
          </div>

          {/* Massive Oversized Hero Typography */}
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest text-mono-500 font-bold">
              Engineering Career Cockpit
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase text-black leading-[0.9]">
              CAREER<br />
              <span className="italic font-normal">COPILOT.</span>
            </h1>
          </div>

          {/* Hero Decorative Rule with Square Marker */}
          <div className="relative flex items-center pt-2">
            <div className="w-full h-[3px] bg-black" />
            <div className="w-4 h-4 border-2 border-black bg-white shrink-0 -ml-2" />
          </div>

          {/* Editorial Subtitle & Lead Paragraph */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <div className="md:col-span-8">
              <p className="font-serif text-lg sm:text-2xl text-mono-800 leading-relaxed font-normal">
                A unified cognitive operating system engineered for ambitious software engineers. Multi-version ATS calibration, semantic vector matching, and zero-hallucination bullet synthesis.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col justify-end gap-3">
              <Link href="/dashboard" className="w-full">
                <Button size="lg" variant="primary" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Launch Cockpit
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button size="lg" variant="secondary" className="w-full justify-between" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Demo Dossier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inverted Stats Section - Pure Black Background with Vertical Line Texture */}
      <section id="stats" className="bg-black text-white py-20 px-6 md:px-8 lg:px-12 border-b-4 border-black relative overflow-hidden">
        <div className="absolute inset-0 pattern-vertical-white opacity-5 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-2xs uppercase tracking-widest text-mono-400 mb-8 border-b border-mono-800 pb-3 flex items-center justify-between">
            <span>Verified System Benchmarks</span>
            <span>N=14,200 Applications</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-2 border-l border-mono-800 pl-6">
              <div className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">3.8x</div>
              <div className="font-mono text-2xs uppercase tracking-wider text-mono-400">Interview Velocity</div>
              <p className="font-serif text-xs text-mono-500">Relative conversion vs generic applications</p>
            </div>

            <div className="space-y-2 border-l border-mono-800 pl-6">
              <div className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">95%</div>
              <div className="font-mono text-2xs uppercase tracking-wider text-mono-400">Average ATS Score</div>
              <p className="font-serif text-xs text-mono-500">Strict keyword and layout parser parity</p>
            </div>

            <div className="space-y-2 border-l border-mono-800 pl-6">
              <div className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">&lt;100ms</div>
              <div className="font-mono text-2xs uppercase tracking-wider text-mono-400">Vector Search</div>
              <p className="font-serif text-xs text-mono-500">pgvector cosine job similarity ranking</p>
            </div>

            <div className="space-y-2 border-l border-mono-800 pl-6">
              <div className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">100%</div>
              <div className="font-mono text-2xs uppercase tracking-wider text-mono-400">Deterministic AI</div>
              <p className="font-serif text-xs text-mono-500">Zero synthetic hallucination guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Workbench / Live Preview */}
      <section id="features" className="py-24 px-6 md:px-8 lg:px-12 border-b-4 border-black">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-6">
            <div className="space-y-2">
              <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 font-bold">
                Interactive Telemetry
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight uppercase">
                System Workbench
              </h2>
            </div>
            <p className="font-serif text-sm text-mono-600 max-w-md">
              Toggle between the autonomous modules to inspect real-time scoring, keyword gap extraction, and pipeline velocity.
            </p>
          </div>

          {/* Workbench Tabs - Pure Sharp Rectangles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-black divide-x divide-black">
            <button
              onClick={() => setActiveTab('match')}
              className={`p-4 text-left font-mono text-2xs uppercase tracking-wider transition-colors duration-100 flex items-center justify-between ${
                activeTab === 'match'
                  ? 'bg-black text-white font-bold'
                  : 'bg-white text-black hover:bg-mono-100'
              }`}
            >
              <span>01. Vector Match (92%)</span>
              <Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`p-4 text-left font-mono text-2xs uppercase tracking-wider transition-colors duration-100 flex items-center justify-between ${
                activeTab === 'resume'
                  ? 'bg-black text-white font-bold'
                  : 'bg-white text-black hover:bg-mono-100'
              }`}
            >
              <span>02. ATS Audit (95/100)</span>
              <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setActiveTab('optimize')}
              className={`p-4 text-left font-mono text-2xs uppercase tracking-wider transition-colors duration-100 flex items-center justify-between ${
                activeTab === 'optimize'
                  ? 'bg-black text-white font-bold'
                  : 'bg-white text-black hover:bg-mono-100'
              }`}
            >
              <span>03. Bullet Studio</span>
              <Wand2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`p-4 text-left font-mono text-2xs uppercase tracking-wider transition-colors duration-100 flex items-center justify-between ${
                activeTab === 'tracker'
                  ? 'bg-black text-white font-bold'
                  : 'bg-white text-black hover:bg-mono-100'
              }`}
            >
              <span>04. Kanban Funnel</span>
              <Kanban className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Workbench Display Container */}
          <div className="border-2 border-black p-8 bg-white relative">
            {activeTab === 'match' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-2xl font-bold tracking-tight text-black">
                        Staff Distributed Systems Engineer
                      </h3>
                      <Badge variant="solid" size="sm">92% Match Score</Badge>
                    </div>
                    <div className="font-mono text-xs text-mono-600 mt-1">
                      Stripe &bull; San Francisco, CA (Remote) &bull; $190,000 - $240,000 USD
                    </div>
                  </div>
                  <Link href="/jobs/job-1">
                    <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Inspect Breakdown
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-black p-5 space-y-3 bg-mono-50">
                    <div className="font-mono text-2xs uppercase tracking-widest font-bold text-black flex items-center justify-between border-b border-black pb-2">
                      <span>Synthesized Compatibility (6 Points)</span>
                      <span>Verified</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Go & Rust Runtimes', 'Raft Consensus', 'PostgreSQL Internals', 'Kafka Partitioning', 'Docker Orchestration', 'P99 Optimization'].map(skill => (
                        <span key={skill} className="font-mono text-2xs px-2.5 py-1 bg-white border border-black text-black">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border border-black p-5 space-y-3 bg-mono-50">
                    <div className="font-mono text-2xs uppercase tracking-widest font-bold text-black flex items-center justify-between border-b border-black pb-2">
                      <span>Target Keyword Gaps (2 Points)</span>
                      <span>Actionable</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['eBPF Observability', 'AWS Cross-Region Mesh'].map(skill => (
                        <span key={skill} className="font-mono text-2xs px-2.5 py-1 bg-black text-white border border-black">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-black bg-white font-serif text-sm leading-relaxed text-black">
                  <strong className="font-mono text-xs uppercase tracking-wider mr-2">Vector Rationale:</strong>
                  Candidate exhibits verified background in low-latency API infrastructure (450k DAU) and distributed transaction consistency. High alignment with Stripe Developer Platform core criteria.
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black">
                  <div>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-black">
                      ATS Multi-Version Calibration Matrix
                    </h3>
                    <p className="font-serif text-xs text-mono-600 mt-1">
                      Standard Parser V1 &bull; 14 Technical Milestones Parsed &bull; Zero layout parse errors
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-3xl font-bold text-black">95 / 100</div>
                    <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">ATS Pass Index</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 border border-black bg-mono-50 space-y-2">
                    <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Action Verb Density</div>
                    <div className="font-serif text-2xl font-bold text-black">88%</div>
                    <div className="font-mono text-2xs text-black">&bull; 8 Strong Exec Verbs</div>
                  </div>

                  <div className="p-5 border border-black bg-mono-50 space-y-2">
                    <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Parser Readability</div>
                    <div className="font-serif text-2xl font-bold text-black">96%</div>
                    <div className="font-mono text-2xs text-black">&bull; ISO Heading Hierarchy</div>
                  </div>

                  <div className="p-5 border border-black bg-mono-50 space-y-2">
                    <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Quantifiable Metrics</div>
                    <div className="font-serif text-2xl font-bold text-black">94%</div>
                    <div className="font-mono text-2xs text-black">&bull; 4 Numerical Outgrowths</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'optimize' && (
              <div className="space-y-6">
                <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 font-bold border-b border-black pb-2">
                  Deterministic Bullet Calibration (Before &bull; After)
                </div>

                <div className="space-y-4 font-serif">
                  <div className="p-5 border border-black bg-mono-50 space-y-1">
                    <div className="font-mono text-2xs uppercase tracking-wider text-mono-500 font-bold">Uncalibrated Draft:</div>
                    <p className="text-sm text-mono-600 line-through">
                      Worked on database tables, caching, and CI/CD pipelines for the engineering team.
                    </p>
                  </div>

                  <div className="p-5 border-2 border-black bg-black text-white space-y-2">
                    <div className="font-mono text-2xs uppercase tracking-wider text-mono-400 font-bold">Calibrated AI Artifact (Zero Hallucination):</div>
                    <p className="text-sm sm:text-base leading-relaxed">
                      &ldquo;Architected normalized PostgreSQL schemas and engineered Redis caching layers, reducing P99 API latency by 83% across 450k DAU with automated Docker CI/CD pipelines.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracker' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="border border-black p-4 space-y-3 bg-mono-50">
                  <div className="flex items-center justify-between font-bold border-b border-black pb-2 uppercase tracking-wider text-2xs">
                    <span>Applied</span>
                    <span>1</span>
                  </div>
                  <div className="border border-black p-3 bg-white space-y-1">
                    <div className="font-bold text-black">Anthropic</div>
                    <div className="text-2xs text-mono-500">AI Infrastructure</div>
                  </div>
                </div>

                <div className="border border-black p-4 space-y-3 bg-mono-50">
                  <div className="flex items-center justify-between font-bold border-b border-black pb-2 uppercase tracking-wider text-2xs">
                    <span>Screening</span>
                    <span>1</span>
                  </div>
                  <div className="border border-black p-3 bg-white space-y-1">
                    <div className="font-bold text-black">Linear</div>
                    <div className="text-2xs text-mono-500">Systems Core</div>
                  </div>
                </div>

                <div className="border border-black p-4 space-y-3 bg-black text-white">
                  <div className="flex items-center justify-between font-bold border-b border-white pb-2 uppercase tracking-wider text-2xs">
                    <span>Interview</span>
                    <span>1</span>
                  </div>
                  <div className="border border-white p-3 bg-black space-y-1">
                    <div className="font-bold text-white">Stripe</div>
                    <div className="text-2xs text-mono-400">Round 2 System Arch</div>
                  </div>
                </div>

                <div className="border border-black p-4 space-y-3 bg-mono-50">
                  <div className="flex items-center justify-between font-bold border-b border-black pb-2 uppercase tracking-wider text-2xs">
                    <span>Offer</span>
                    <span>1</span>
                  </div>
                  <div className="border border-black p-3 bg-white space-y-1">
                    <div className="font-bold text-black">Perplexity</div>
                    <div className="text-2xs text-mono-500">$210k + Equity</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Editorial Architecture Detail Section (with Boxed Drop Cap) */}
      <section id="editorial-detail" className="py-24 px-6 md:px-8 lg:px-12 border-b-4 border-black bg-mono-50">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5 space-y-4">
              <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 font-bold">
                Chapter I &bull; Philosophy
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight">
                THE DISCIPLINE OF PRECISION.
              </h2>
              <div className="w-16 h-1 bg-black" />
            </div>

            <div className="md:col-span-7 space-y-6 font-serif text-base sm:text-lg text-mono-800 leading-relaxed">
              <p className="drop-cap-boxed">
                In modern high-stakes software engineering, job search inefficiency is not a labor shortage issue—it is an information architecture breakdown. Traditional career tools flood recruiters with generic buzzwords, while candidates lose track of tailored resume variants across disparate portals.
              </p>
              <p>
                AI Career Copilot replaces heuristic guesswork with deterministic vector models. By structuring resumes into structured AST graphs and running continuous cosine similarity checks against live technical job specifications, our platform guarantees that every application submitted is surgically aligned to the target team&apos;s evaluation rubric.
              </p>
            </div>
          </div>

          {/* Architectural 3-Column Grid with Sharp Borders and Instant Inversion */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black divide-y md:divide-y-0 md:divide-x divide-black bg-white">
            <div className="p-8 space-y-4 transition-colors duration-100 hover:bg-black hover:text-white group">
              <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 group-hover:text-mono-400">
                Component 01
              </div>
              <h3 className="font-serif text-2xl font-bold uppercase">
                Multi-Version ATS Engine
              </h3>
              <p className="font-serif text-sm text-mono-600 group-hover:text-mono-300 leading-relaxed">
                Maintain distinct resume variants optimized for specialized roles—Backend Go, Full-Stack Next.js, or Distributed Infrastructure—with instant keyword gap audits.
              </p>
            </div>

            <div className="p-8 space-y-4 transition-colors duration-100 hover:bg-black hover:text-white group">
              <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 group-hover:text-mono-400">
                Component 02
              </div>
              <h3 className="font-serif text-2xl font-bold uppercase">
                Semantic Job Discovery
              </h3>
              <p className="font-serif text-sm text-mono-600 group-hover:text-mono-300 leading-relaxed">
                Query curated engineering openings using multi-dimensional embeddings. Paste arbitrary JD texts from any job board for instantaneous compatibility breakdowns.
              </p>
            </div>

            <div className="p-8 space-y-4 transition-colors duration-100 hover:bg-black hover:text-white group">
              <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 group-hover:text-mono-400">
                Component 03
              </div>
              <h3 className="font-serif text-2xl font-bold uppercase">
                STAR Interview Coach
              </h3>
              <p className="font-serif text-sm text-mono-600 group-hover:text-mono-300 leading-relaxed">
                Simulate rigorous system design and behavioral rounds with deterministic rubric scoring, quantifiable metric suggestions, and STAR framework validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Pull Quote / Testimonial */}
      <section className="py-20 px-6 md:px-8 lg:px-12 border-b-4 border-black bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="font-serif text-6xl sm:text-7xl font-bold leading-none text-black">
            &ldquo;
          </div>
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-black leading-snug">
            AI Career Copilot turned our application process from a chaotic spreadsheet lottery into an exact, reproducible science.
          </blockquote>
          <div className="font-mono text-xs uppercase tracking-widest text-mono-600 font-bold pt-4">
            David K. &bull; Senior Infrastructure Engineer &bull; Ex-Scale AI
          </div>
        </div>
      </section>

      {/* Pricing Editions (Elevated Minimalist Monochrome Tier) */}
      <section id="pricing" className="py-24 px-6 md:px-8 lg:px-12 border-b-4 border-black">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <div className="font-mono text-2xs uppercase tracking-widest text-mono-500 font-bold">
              Subscription Editions
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight uppercase">
              INVEST IN CAREER VELOCITY.
            </h2>
            <p className="font-serif text-sm text-mono-600 max-w-xl mx-auto">
              Simple, transparent pricing. Free for students and career transitions. Upgrade for active interviewing cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Tier 1: Fellowship */}
            <div className="border-2 border-black p-8 sm:p-10 bg-white flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-black pb-4">
                  <div className="font-serif text-2xl font-bold uppercase">Edition 01: Fellowship</div>
                  <span className="font-mono text-2xs uppercase px-2.5 py-1 border border-black bg-mono-100">Free Forever</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-black">$0</span>
                  <span className="font-mono text-xs uppercase text-mono-500">/ month</span>
                </div>

                <p className="font-serif text-sm text-mono-600">
                  Ideal for students and engineers establishing their initial dossier.
                </p>

                <ul className="space-y-3 font-mono text-xs text-black border-t border-mono-200 pt-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>2 Resume Versions & ATS Deep Calibration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>25 Semantic Vector Job Matches / mo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Kanban Application Lifecycle Tracker</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>5 Tailored AI Cover Letters / mo</span>
                  </li>
                </ul>
              </div>

              <Link href="/login" className="w-full">
                <Button size="lg" variant="secondary" className="w-full">
                  Claim Fellowship Edition
                </Button>
              </Link>
            </div>

            {/* Tier 2: Syndicate (Inverted & Elevated) */}
            <div className="border-4 border-black p-8 sm:p-10 bg-black text-white flex flex-col justify-between space-y-8 md:-translate-y-2 shadow-none">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white pb-4">
                  <div className="font-serif text-2xl font-bold uppercase text-white">Edition 02: Syndicate</div>
                  <span className="font-mono text-2xs uppercase px-2.5 py-1 border border-white bg-white text-black font-bold">Recommended</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-white">$19</span>
                  <span className="font-mono text-xs uppercase text-mono-400">/ month</span>
                </div>

                <p className="font-serif text-sm text-mono-300">
                  For active candidates pursuing multi-offer engineering pipeline outcomes.
                </p>

                <ul className="space-y-3 font-mono text-xs text-white border-t border-mono-800 pt-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Unlimited Resume Variants & ATS Deep Audit</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Unlimited Custom JD Scans & Vector Matching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Unlimited Zero-Hallucination Bullet Rewrites</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Interactive STAR Mock Interview Coach</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Real-time Funnel Conversion Analytics</span>
                  </li>
                </ul>
              </div>

              <Link href="/dashboard" className="w-full">
                <Button size="lg" variant="inverted" className="w-full">
                  Deploy Syndicate Suite &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Inverted CTA Section */}
      <section className="bg-black text-white py-24 px-6 md:px-8 lg:px-12 border-b-4 border-black relative overflow-hidden">
        <div className="absolute inset-0 pattern-radial-white opacity-5 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="font-mono text-2xs uppercase tracking-widest text-mono-400 font-bold">
            Autonomous Acceleration
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-tight">
            COMMENCE YOUR COGNITIVE CAREER DISCIPLINE.
          </h2>
          <p className="font-serif text-base sm:text-lg text-mono-300 max-w-xl mx-auto leading-relaxed">
            Join elite engineers leveraging deterministic AI to command high-velocity job pipelines and secure top-tier engineering offers.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="inverted" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Career Cockpit Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

