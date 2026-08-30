'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, Briefcase, FileText, Kanban, 
  Wand2, BarChart3, Plus, TrendingUp, CheckCircle2, 
  Clock, AlertCircle, Bookmark, Compass, ExternalLink
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
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader 
          title="Career Command Center" 
          subtitle={`Welcome back, ${user?.full_name || 'Alex'} • High-fit roles and application velocity`}
          actionButton={
            <Link href="/jobs">
              <Button size="sm" variant="primary" leftIcon={<Briefcase className="w-3.5 h-3.5" />}>
                Discover Jobs
              </Button>
            </Link>
          }
        />

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Applications */}
            <Card className="p-4 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Applications</span>
                <Kanban className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {applications.length || 5}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +2 this week
              </div>
            </Card>

            {/* Interviews Scheduled */}
            <Card className="p-4 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Interviews</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-2">
                {applications.filter(a => a.status === 'interview' || a.status === 'offer').length || 2}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Stripe &bull; Linear
              </div>
            </Card>

            {/* Offers Received */}
            <Card className="p-4 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Offers</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                {applications.filter(a => a.status === 'offer').length || 1}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                Perplexity AI ($160k)
              </div>
            </Card>

            {/* Average Job Match */}
            <Card className="p-4 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Avg Match Index</span>
                <BarChart3 className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-violet-300 mt-2">
                {analytics?.average_match_score || 91}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Top 8% candidate fit
              </div>
            </Card>

            {/* Resume ATS Score */}
            <Card className="p-4 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Resume ATS Score</span>
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-2">
                {resumeScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ATS Pass Grade A+
              </div>
            </Card>
          </div>

          {/* Quick Actions Launchpad */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#090D18] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Quick Actions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/ai-tools?tab=optimize">
                <Button size="sm" variant="secondary" leftIcon={<Wand2 className="w-3.5 h-3.5 text-indigo-400" />}>
                  Optimize Resume for JD
                </Button>
              </Link>
              <Link href="/ai-tools?tab=cover-letter">
                <Button size="sm" variant="secondary" leftIcon={<FileText className="w-3.5 h-3.5 text-cyan-400" />}>
                  Generate Cover Letter
                </Button>
              </Link>
              <Link href="/ai-tools?tab=interview">
                <Button size="sm" variant="secondary" leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}>
                  Start STAR Mock Interview
                </Button>
              </Link>
              <Link href="/resumes">
                <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Upload Resume
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Grid: Recommended Jobs & Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Top Recommended Jobs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    Recommended Roles For You
                  </h2>
                  <p className="text-xs text-slate-400">Ranked by semantic match against your skills</p>
                </div>
                <Link href="/jobs" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                  View all ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <Card key={job.id} interactive className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/jobs/${job.id}`} className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                            {job.title}
                          </Link>
                          {job.is_featured && <Badge variant="indigo" size="sm">Featured</Badge>}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {job.company} &bull; {job.location} &bull; <span className="text-slate-300 font-mono">{job.salary_range}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <Badge variant={(job.match_score || 85) >= 90 ? 'emerald' : 'indigo'} size="sm">
                          {job.match_score || 85}% Match
                        </Badge>
                      </div>
                    </div>

                    {/* Matching vs Missing Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.required_skills?.slice(0, 4).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                          ✓ {s}
                        </span>
                      ))}
                      {job.missing_skills?.slice(0, 2).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          + {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-[11px] text-slate-500">Posted recently</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/ai-tools?tab=optimize&job_id=${job.id}`}>
                          <Button size="sm" variant="ghost" className="text-[11px] h-7 px-2">
                            Optimize Resume
                          </Button>
                        </Link>
                        <Link href={`/jobs/${job.id}`}>
                          <Button size="sm" variant="secondary" className="text-[11px] h-7 px-2.5">
                            View Role
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: Active Applications Pipeline & Skill Gaps (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Active Pipeline Box */}
              <Card className="p-5 space-y-4">
                <CardHeader className="pb-2">
                  <CardTitle>
                    <Kanban className="w-4 h-4 text-cyan-400" />
                    Active Applications Pipeline
                  </CardTitle>
                  <Link href="/tracker" className="text-xs text-indigo-400 hover:text-indigo-300">
                    Open Kanban &rarr;
                  </Link>
                </CardHeader>

                <div className="space-y-2.5">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{app.company_name}</div>
                        <div className="text-[10px] text-slate-400">{app.job_title}</div>
                      </div>
                      <Badge 
                        variant={
                          app.status === 'offer' ? 'emerald' :
                          app.status === 'interview' ? 'indigo' :
                          app.status === 'screening' ? 'cyan' : 'slate'
                        }
                        size="sm"
                      >
                        {app.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* High-Impact Skill Gaps */}
              <Card className="p-5 space-y-3 border-amber-500/20 bg-amber-950/10">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-amber-400" /> High-Impact Skill Gaps
                  </div>
                  <Badge variant="amber" size="sm">3 Identified</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Adding these skills would unlock <strong>+14% higher average job matches</strong> across your target companies:
                </p>

                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">Kubernetes / K8s</span>
                      <span className="text-[10px] text-slate-400 ml-2">Appears in 4 saved roles</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">~12h learning</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">Apache Kafka Streams</span>
                      <span className="text-[10px] text-slate-400 ml-2">Appears in 3 saved roles</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">~8h learning</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
