'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, ArrowLeft, Bookmark, CheckCircle2, AlertCircle, 
  Sparkles, Wand2, FileText, Kanban, ExternalLink, MapPin, 
  DollarSign, Building2, Share2, Award, Clock
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Job, JobMatchDetail } from '@/types';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [matchReport, setMatchReport] = useState<JobMatchDetail | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackedSuccess, setTrackedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setIsLoading(true);
      try {
        const [jobData, reportData] = await Promise.all([
          api.getJob(id),
          api.getJobMatchReport(id),
        ]);
        setJob(jobData);
        setMatchReport(reportData);
        setIsSaved(!!jobData.is_saved);
      } catch (err) {
        console.error('Failed to load job detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobDetail();
  }, [id]);

  const handleToggleSave = async () => {
    if (!job) return;
    try {
      const res = await api.toggleSaveJob(job.id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error('Save toggle error:', err);
    }
  };

  const handleTrackApplication = async () => {
    if (!job) return;
    setIsTracking(true);
    try {
      await api.createApplication({
        job_id: job.id,
        company_name: job.company,
        job_title: job.title,
        location: job.location,
        status: 'applied',
        match_score: matchReport?.overall_match || 88,
        salary_offered: job.salary_range,
      });
      setTrackedSuccess(true);
      setTimeout(() => setTrackedSuccess(false), 3000);
    } catch (err) {
      console.error('Tracking creation error:', err);
    } finally {
      setIsTracking(false);
    }
  };

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <div className="text-xs text-slate-400">Loading semantic job analysis...</div>
          </div>
        </main>
      </div>
    );
  }

  const matchScore = matchReport?.overall_match || job.match_score || 88;

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title={job.title}
          subtitle={`${job.company} • ${job.location}`}
          actionButton={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isSaved ? 'secondary' : 'outline'}
                onClick={handleToggleSave}
                leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-400' : ''}`} />}
              >
                {isSaved ? 'Saved' : 'Save Role'}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleTrackApplication}
                isLoading={isTracking}
                leftIcon={trackedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Kanban className="w-3.5 h-3.5" />}
              >
                {trackedSuccess ? 'Added to Tracker!' : 'Track in Kanban'}
              </Button>
            </div>
          }
        />

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Back Navigation */}
          <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discovery Hub
          </Link>

          {/* Top Hero Banner Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0E1424] via-[#0A0F1B] to-[#070A0F] shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {job.title}
                  </h1>
                  {job.is_featured && <Badge variant="indigo" size="md">Featured</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200 text-sm">{job.company}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-mono text-cyan-300"><DollarSign className="w-3.5 h-3.5" /> {job.salary_range}</span>
                  <span>&bull;</span>
                  <span>{job.job_type}</span>
                </div>
              </div>

              {/* Match Dial */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center shrink-0 min-w-[140px]">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Candidate Fit</div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                  {matchScore}%
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                  High Probability Match
                </div>
              </div>
            </div>

            {/* AI Copilot Action Strip */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-indigo-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span><strong>AI Workflow Launchpad:</strong> Tailor your application assets for this exact job description:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/ai-tools?tab=optimize&job_id=${job.id}`}>
                  <Button size="sm" variant="primary" leftIcon={<Wand2 className="w-3.5 h-3.5" />}>
                    Optimize Resume
                  </Button>
                </Link>
                <Link href={`/ai-tools?tab=cover-letter&job_id=${job.id}`}>
                  <Button size="sm" variant="secondary" leftIcon={<FileText className="w-3.5 h-3.5 text-cyan-400" />}>
                    Generate Cover Letter
                  </Button>
                </Link>
                <Link href={`/ai-tools?tab=interview&job_id=${job.id}`}>
                  <Button size="sm" variant="secondary" leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}>
                    Prepare Interview
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Detailed Description vs Match Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Job Description & Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* About the Role */}
              <Card className="p-6 space-y-4">
                <CardHeader>
                  <CardTitle>Role Overview & Context</CardTitle>
                </CardHeader>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </Card>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <Card className="p-6 space-y-4">
                  <CardHeader>
                    <CardTitle>Key Responsibilities</CardTitle>
                  </CardHeader>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-indigo-400 font-bold mt-0.5">&bull;</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card className="p-6 space-y-4">
                  <CardHeader>
                    <CardTitle>Qualifications & Requirements</CardTitle>
                  </CardHeader>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Right Column: AI Match Report & Recommendations (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Semantic Analysis Breakdown Card */}
              {matchReport && (
                <Card className="p-6 space-y-5 border-indigo-500/25 bg-gradient-to-b from-[#0D1324] to-[#0A0E17]">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      AI Match Intelligence
                    </CardTitle>
                    <Badge variant="emerald" size="sm">Score: {matchReport.overall_match}%</Badge>
                  </CardHeader>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed">
                    <strong>Why this job matches you:</strong> {matchReport.why_it_matches}
                  </div>

                  {/* Matching Skills */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matching Core Skills ({matchReport.matching_skills?.length || 0}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchReport.matching_skills?.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {matchReport.missing_skills?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Recommended Skill Additions:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchReport.missing_skills?.map((s) => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Actionable Recommendations */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Strategic Application Advice:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {matchReport.key_recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">&rarr;</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400">
                    Recommended Resume Version: <span className="text-white font-semibold">{matchReport.recommended_resume_version}</span>
                  </div>
                </Card>
              )}

              {/* Company Info Box */}
              <Card className="p-5 space-y-3">
                <CardTitle className="text-sm">About {job.company}</CardTitle>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Leading technology company building infrastructure and platforms. Highly rated for engineering culture, competitive equity packages, and remote flexibility.
                </p>
                <div className="pt-2">
                  <a
                    href={job.apply_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Visit Official Careers Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
