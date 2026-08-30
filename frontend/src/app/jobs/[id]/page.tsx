'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, ArrowLeft, Bookmark, CheckCircle2, AlertCircle, 
  Wand2, FileText, Kanban, ExternalLink, MapPin, 
  DollarSign, Building2, Share2, Award, Clock
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
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
      <div className="min-h-screen bg-white text-black flex flex-row font-body">
        <Sidebar />
        <main className="flex-1 p-12 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto" />
            <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Loading vector job intelligence...</div>
          </div>
        </main>
      </div>
    );
  }

  const matchScore = matchReport?.overall_match || job.match_score || 88;

  return (
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title={job.title}
          subtitle={`${job.company} • ${job.location}`}
          actionButton={
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant={isSaved ? 'primary' : 'outline'}
                onClick={handleToggleSave}
                leftIcon={<Bookmark className="w-3.5 h-3.5" strokeWidth={1.5} />}
              >
                {isSaved ? 'Saved Role' : 'Save Dossier'}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleTrackApplication}
                isLoading={isTracking}
                leftIcon={trackedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Kanban className="w-3.5 h-3.5" />}
              >
                {trackedSuccess ? 'Added to Tracker' : 'Track in Pipeline'}
              </Button>
            </div>
          }
        />

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Back Navigation */}
          <Link href="/jobs" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mono-500 hover:text-black transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Back to Catalog
          </Link>

          {/* Top Hero Banner Card */}
          <div className="p-8 border-2 border-black bg-mono-50 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-black">
                    {job.title}
                  </h1>
                  {job.is_featured && <Badge variant="solid" size="md">Featured</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-mono-600">
                  <span className="font-bold text-black">{job.company}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-bold text-black"><DollarSign className="w-3.5 h-3.5" /> {job.salary_range}</span>
                  <span>&bull;</span>
                  <span>{job.job_type}</span>
                </div>
              </div>

              {/* Match Dial */}
              <div className="p-6 border-2 border-black bg-black text-white text-center shrink-0 min-w-[160px]">
                <div className="font-mono text-2xs text-mono-400 uppercase tracking-widest">Candidate Fit</div>
                <div className="font-serif text-4xl font-bold text-white mt-1">
                  {matchScore}%
                </div>
                <div className="font-mono text-2xs uppercase tracking-wider text-mono-300 mt-1">
                  High Probability
                </div>
              </div>
            </div>

            {/* AI Copilot Action Strip */}
            <div className="p-5 border border-black bg-white flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono text-xs text-black">
                <strong className="uppercase tracking-wider mr-2 font-bold">Autonomous Actions:</strong>
                Generate tailored calibration artifacts for this job description:
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/ai-tools?tab=optimize&job_id=${job.id}`}>
                  <Button size="sm" variant="primary" leftIcon={<Wand2 className="w-3.5 h-3.5" strokeWidth={1.5} />}>
                    Calibrate Resume
                  </Button>
                </Link>
                <Link href={`/ai-tools?tab=cover-letter&job_id=${job.id}`}>
                  <Button size="sm" variant="secondary" leftIcon={<FileText className="w-3.5 h-3.5" strokeWidth={1.5} />}>
                    Generate Letter
                  </Button>
                </Link>
                <Link href={`/ai-tools?tab=interview&job_id=${job.id}`}>
                  <Button size="sm" variant="secondary">
                    Prepare Interview &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Detailed Description vs Match Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Job Description & Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* About the Role */}
              <div className="p-6 border border-black bg-white space-y-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black border-b border-black pb-2">
                  Role Overview & Specifications
                </h3>
                <p className="font-serif text-xs text-mono-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="p-6 border border-black bg-white space-y-4">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black border-b border-black pb-2">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3 font-serif text-xs text-mono-700">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="font-mono text-black font-bold mt-0.5">&bull;</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="p-6 border border-black bg-white space-y-4">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black border-b border-black pb-2">
                    Qualifications & Technical Requirements
                  </h3>
                  <ul className="space-y-3 font-serif text-xs text-mono-700">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="font-mono text-black font-bold mt-0.5">&bull;</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: AI Match Report & Recommendations (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Semantic Analysis Breakdown Card */}
              {matchReport && (
                <div className="p-6 border-2 border-black bg-mono-50 space-y-6">
                  <div className="flex items-center justify-between border-b border-black pb-2">
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black">
                      Match Intelligence
                    </h3>
                    <Badge variant="solid" size="sm">Score: {matchReport.overall_match}%</Badge>
                  </div>

                  <div className="p-4 border border-black bg-white font-serif text-xs text-mono-800 leading-relaxed">
                    <strong className="font-mono uppercase tracking-wider block text-2xs mb-1 text-black font-bold">Compatibility Rationale:</strong>
                    {matchReport.why_it_matches}
                  </div>

                  {/* Matching Skills */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="font-bold text-black uppercase tracking-wider text-2xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matching Skills ({matchReport.matching_skills?.length || 0}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {matchReport.matching_skills?.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-mono-100 border border-mono-300 text-black text-2xs">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {matchReport.missing_skills?.length > 0 && (
                    <div className="space-y-2 font-mono text-xs">
                      <div className="font-bold text-black uppercase tracking-wider text-2xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Target Additions:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchReport.missing_skills?.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-black text-white border border-black text-2xs">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Actionable Recommendations */}
                  <div className="space-y-3 pt-3 border-t border-mono-200">
                    <div className="font-mono text-2xs font-bold uppercase tracking-widest text-black">
                      Strategic Optimization Advice:
                    </div>
                    <ul className="space-y-2 font-serif text-xs text-mono-700">
                      {matchReport.key_recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-mono text-black font-bold">&rarr;</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 border border-mono-300 bg-white font-mono text-2xs text-mono-600">
                    Calibrated Resume: <span className="text-black font-bold">{matchReport.recommended_resume_version}</span>
                  </div>
                </div>
              )}

              {/* Company Info Box */}
              <div className="p-6 border border-black bg-white space-y-3">
                <h4 className="font-serif text-sm font-bold uppercase tracking-tight text-black border-b border-mono-200 pb-2">About {job.company}</h4>
                <p className="font-serif text-xs text-mono-600 leading-relaxed">
                  Leading engineering organization. Highly rated for engineering rigor, competitive equity structures, and distributed engineering opportunities.
                </p>
                <div className="pt-2">
                  <a
                    href={job.apply_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-black underline font-bold"
                  >
                    Visit Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

