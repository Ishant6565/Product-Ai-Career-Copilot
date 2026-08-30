'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Briefcase, FileText, Kanban, 
  Wand2, BarChart3, Plus, TrendingUp,
  Clock, AlertCircle, Bookmark, Compass
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Job, Application, Resume, AnalyticsOverview } from '@/types';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsData, appsData, resumesData, analyticsData] = await Promise.all([
          api.listJobs({ min_match: 75 }),
          api.listApplications(),
          api.listResumes(),
          api.getAnalytics(),
        ]);
        setJobs(jobsData);
        setApplications(appsData);
        setResumes(resumesData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const primaryResume = resumes.find(r => r.is_primary) || resumes[0];
  const resumeScore = primaryResume?.overall_score || 91;
  const profileCompletion = profile?.profile_completion || 92;

  return (
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader 
          title="Command Center" 
          subtitle={`Candidate: ${user?.full_name || 'Alex Chen'} • Dossier Status: Active • Target: ${profile?.target_role || 'Full-Stack Engineer'}`}
          actionButton={
            <Link href="/jobs">
              <Button size="sm" variant="primary" leftIcon={<Briefcase className="w-3.5 h-3.5" />}>
                Discover Roles
              </Button>
            </Link>
          }
        />

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Metric Cards - Sharp Monochrome Architectural Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Applications */}
            <div className="p-5 border border-black bg-white space-y-2">
              <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-widest text-mono-500">
                <span>Active Pipeline</span>
                <Kanban className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
              <div className="font-serif text-3xl font-bold text-black">
                {applications.length || 5}
              </div>
              <div className="font-mono text-2xs uppercase text-mono-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +2 this week
              </div>
            </div>

            {/* Interviews Scheduled */}
            <div className="p-5 border border-black bg-white space-y-2">
              <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-widest text-mono-500">
                <span>Interviews</span>
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
              <div className="font-serif text-3xl font-bold text-black">
                {applications.filter(a => a.status === 'interview' || a.status === 'offer').length || 2}
              </div>
              <div className="font-mono text-2xs uppercase text-mono-600">
                Stripe &bull; Linear
              </div>
            </div>

            {/* Offers Received */}
            <div className="p-5 border-2 border-black bg-black text-white space-y-2">
              <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-widest text-mono-400">
                <span>Offers</span>
                <span className="font-mono font-bold text-white text-xs">&bull;</span>
              </div>
              <div className="font-serif text-3xl font-bold text-white">
                {applications.filter(a => a.status === 'offer').length || 1}
              </div>
              <div className="font-mono text-2xs uppercase text-mono-300">
                Perplexity AI ($210k)
              </div>
            </div>

            {/* Average Job Match */}
            <div className="p-5 border border-black bg-white space-y-2">
              <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-widest text-mono-500">
                <span>Avg Match Index</span>
                <BarChart3 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
              <div className="font-serif text-3xl font-bold text-black">
                {analytics?.average_match_score || 91}%
              </div>
              <div className="font-mono text-2xs uppercase text-mono-600">
                Top 8% Candidate Fit
              </div>
            </div>

            {/* Resume ATS Score */}
            <div className="p-5 border border-black bg-white space-y-2">
              <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-widest text-mono-500">
                <span>ATS Pass Score</span>
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
              </div>
              <div className="font-serif text-3xl font-bold text-black">
                {resumeScore} <span className="font-mono text-xs text-mono-400 font-normal">/ 100</span>
              </div>
              <div className="font-mono text-2xs uppercase text-mono-600">
                Grade: Alpha ISO
              </div>
            </div>
          </div>

          {/* Quick Actions Launchpad */}
          <div className="p-6 border-2 border-black bg-mono-50 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-xs uppercase tracking-widest font-bold text-black flex items-center gap-2">
              <span className="w-2 h-2 bg-black inline-block" />
              <span>Surgical Workflows:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/ai-tools?tab=optimize">
                <Button size="sm" variant="secondary" leftIcon={<Wand2 className="w-3.5 h-3.5" />}>
                  Optimize Resume for JD
                </Button>
              </Link>
              <Link href="/ai-tools?tab=cover-letter">
                <Button size="sm" variant="secondary" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                  Synthesize Cover Letter
                </Button>
              </Link>
              <Link href="/ai-tools?tab=interview">
                <Button size="sm" variant="secondary" leftIcon={<Compass className="w-3.5 h-3.5" />}>
                  STAR Mock Interview
                </Button>
              </Link>
              <Link href="/resumes">
                <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Upload Resume Variant
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Grid: Recommended Jobs & Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Top Recommended Jobs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-black uppercase tracking-tight flex items-center gap-2">
                    Curated Opportunities
                  </h2>
                  <p className="font-serif text-xs text-mono-500">Vector-ranked cosine compatibility against your verified dossier</p>
                </div>
                <Link href="/jobs" className="font-mono text-xs uppercase font-bold text-black hover:underline flex items-center gap-1">
                  View All ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-6 border border-black bg-white space-y-4 hover:border-2 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <Link href={`/jobs/${job.id}`} className="font-serif text-lg font-bold text-black hover:underline">
                            {job.title}
                          </Link>
                          {job.is_featured && <Badge variant="solid" size="sm">Featured</Badge>}
                        </div>
                        <div className="font-mono text-xs text-mono-600 mt-1">
                          {job.company} • {job.location} • <span className="font-bold text-black">{job.salary_range}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <Badge variant="solid" size="md">
                          {job.match_score || 85}% Match
                        </Badge>
                      </div>
                    </div>

                    {/* Matching vs Missing Skills */}
                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-2xs">
                      {job.required_skills?.slice(0, 4).map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-mono-100 border border-mono-300 text-black">
                          ✓ {s}
                        </span>
                      ))}
                      {job.missing_skills?.slice(0, 2).map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-black text-white border border-black">
                          + {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-mono-200 text-xs">
                      <span className="font-mono text-2xs text-mono-400 uppercase">Telemetry: Active Listing</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/ai-tools?tab=optimize&job_id=${job.id}`}>
                          <Button size="sm" variant="ghost">
                            Calibrate Resume
                          </Button>
                        </Link>
                        <Link href={`/jobs/${job.id}`}>
                          <Button size="sm" variant="secondary">
                            View Dossier &rarr;
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Active Applications Pipeline & Skill Gaps (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Active Pipeline Box */}
              <div className="border border-black p-6 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-black pb-3">
                  <h3 className="font-serif text-lg font-bold text-black uppercase tracking-tight flex items-center gap-2">
                    <Kanban className="w-4 h-4" strokeWidth={1.5} />
                    Active Applications Pipeline
                  </h3>
                  <Link href="/tracker" className="font-mono text-2xs uppercase font-bold text-black hover:underline">
                    Kanban Board &rarr;
                  </Link>
                </div>

                <div className="space-y-3 font-mono">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-3.5 border border-mono-300 bg-mono-50 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-black">{app.company_name}</div>
                        <div className="text-2xs text-mono-500">{app.job_title}</div>
                      </div>
                      <Badge 
                        variant={app.status === 'offer' || app.status === 'interview' ? 'solid' : 'default'}
                        size="sm"
                      >
                        {app.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Impact Skill Gaps */}
              <div className="border-2 border-black p-6 bg-mono-50 space-y-4">
                <div className="flex items-center justify-between border-b border-black pb-3">
                  <div className="font-mono text-xs font-bold text-black flex items-center gap-2 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" strokeWidth={1.5} /> High-Impact Skill Gaps
                  </div>
                  <Badge variant="solid" size="sm">3 Gaps</Badge>
                </div>
                <p className="font-serif text-xs text-mono-700 leading-relaxed">
                  Calibrating for these missing capabilities unlocks an estimated <strong>+14% higher vector compatibility</strong> across saved tech portfolios:
                </p>

                <div className="space-y-2.5 pt-1 font-mono">
                  <div className="p-3 border border-black bg-white flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-black">Kubernetes / K8s</span>
                      <span className="text-2xs text-mono-500 ml-2">(4 Saved JDs)</span>
                    </div>
                    <span className="text-2xs uppercase bg-black text-white px-2 py-0.5 font-bold">~12h</span>
                  </div>

                  <div className="p-3 border border-black bg-white flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-black">Apache Kafka Streams</span>
                      <span className="text-2xs text-mono-500 ml-2">(3 Saved JDs)</span>
                    </div>
                    <span className="text-2xs uppercase bg-black text-white px-2 py-0.5 font-bold">~8h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

