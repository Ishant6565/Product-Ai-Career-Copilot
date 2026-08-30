'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, Filter, Bookmark, CheckCircle2, 
  Sparkles, ArrowRight, ExternalLink, SlidersHorizontal, 
  Building2, MapPin, DollarSign, Wand2, Plus, FileText
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Job, JobMatchDetail } from '@/types';

export default function JobsPage() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Custom JD Scanner Modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('Senior Backend Engineer');
  const [customCompany, setCustomCompany] = useState('OpenAI');
  const [customDescription, setCustomDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customAnalysisResult, setCustomAnalysisResult] = useState<JobMatchDetail | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      if (onlySaved) {
        const savedList = await api.listSavedJobs();
        setJobs(savedList);
      } else {
        const list = await api.listJobs({
          search: searchTerm || undefined,
          job_type: selectedJobType !== 'All' ? selectedJobType : undefined,
          experience_level: selectedLevel !== 'All' ? selectedLevel : undefined,
          is_remote: onlyRemote ? true : undefined,
        });
        setJobs(list);
      }
    } catch (err) {
      console.warn('Jobs fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedJobType, selectedLevel, onlyRemote, onlySaved]);

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.toggleSaveJob(jobId);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, is_saved: res.saved } : j));
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  const handleAnalyzeCustomJD = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeCustomJD({
        title: customTitle,
        company: customCompany,
        description: customDescription,
      });
      setCustomAnalysisResult(res);
    } catch (err) {
      console.error('Custom JD analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Job Discovery & Semantic Matching"
          subtitle="Real-time candidate compatibility index calculated against your active skills"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsScannerOpen(true)}
              leftIcon={<Wand2 className="w-3.5 h-3.5" />}
            >
              Analyze Custom JD
            </Button>
          }
        />

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#0A0F1B] space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title, company name, or tech stack (e.g. Next.js, Stripe)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Saved Jobs Toggle */}
              <button
                onClick={() => setOnlySaved(!onlySaved)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  onlySaved
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved Roles</span>
              </button>
            </div>

            {/* Facet Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">All Seniorities</option>
                <option value="Entry-level">Entry-level / Graduate</option>
                <option value="Mid-level">Mid-level (2-4 yrs)</option>
                <option value="Mid-Senior">Mid-Senior (4+ yrs)</option>
                <option value="Senior">Senior</option>
              </select>

              <button
                onClick={() => setOnlyRemote(!onlyRemote)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  onlyRemote
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                🌐 Remote Only
              </button>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Showing {jobs.length} matching positions</span>
              <span>Sorted by Semantic Fit %</span>
            </div>

            {jobs.length === 0 && !isLoading && (
              <Card className="p-12 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No roles match the selected filters</h3>
                <p className="text-xs text-slate-400">Try adjusting your search query or reset filter options.</p>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => {
                const matchScore = job.match_score || 85;
                const isHighFit = matchScore >= 90;

                return (
                  <Card key={job.id} interactive className="p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Link href={`/jobs/${job.id}`} className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                              {job.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-semibold text-slate-300">{job.company}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            className={`p-2 rounded-lg border transition-colors ${
                              job.is_saved
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                            }`}
                            title={job.is_saved ? 'Unsave job' : 'Save job'}
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>

                          <Badge variant={isHighFit ? 'emerald' : 'indigo'} size="md">
                            {matchScore}% Match
                          </Badge>
                        </div>
                      </div>

                      {/* Salary & Type Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 font-mono">
                          {job.salary_range}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300">
                          {job.job_type}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300">
                          {job.experience_level}
                        </span>
                      </div>

                      {/* Snippet */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Matching Skills vs Missing */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          Key Skill Alignment:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
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
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <Link href={`/ai-tools?tab=optimize&job_id=${job.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs text-indigo-400 hover:text-indigo-300">
                          <Wand2 className="w-3.5 h-3.5 mr-1" />
                          Optimize Resume
                        </Button>
                      </Link>

                      <Link href={`/jobs/${job.id}`}>
                        <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          View Full Breakdown
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Custom JD Analyzer Modal */}
      <Modal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setCustomAnalysisResult(null);
        }}
        title="Custom Job Description Scanner"
        subtitle="Paste any job listing text from LinkedIn, Indeed, or company portals to get instant AI match scoring"
        maxWidth="2xl"
      >
        {!customAnalysisResult ? (
          <form onSubmit={handleAnalyzeCustomJD} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Paste Full Job Description</label>
              <textarea
                rows={7}
                required
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Paste the requirements, responsibilities, and qualifications text here..."
                className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsScannerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isAnalyzing} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Calculate Match Index
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <div>
                <div className="text-xs text-indigo-300 font-semibold">{customTitle} at {customCompany}</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {customAnalysisResult.overall_match}% Overall Fit
                </div>
              </div>
              <Badge variant="emerald" size="md">
                {customAnalysisResult.matching_skills.length} Matching Skills
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed">
              <strong>Match Explanation:</strong> {customAnalysisResult.why_it_matches}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="text-xs font-semibold text-emerald-400">Matching Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {customAnalysisResult.matching_skills.map(s => (
                    <Badge key={s} variant="emerald" size="sm">✓ {s}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <div className="text-xs font-semibold text-amber-400">Missing / Unlisted:</div>
                <div className="flex flex-wrap gap-1">
                  {customAnalysisResult.missing_skills.map(s => (
                    <Badge key={s} variant="amber" size="sm">+ {s}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <Button type="button" variant="secondary" size="sm" onClick={() => setCustomAnalysisResult(null)}>
                Scan Another JD
              </Button>
              <Link href={`/ai-tools?tab=optimize&job_description=${encodeURIComponent(customDescription)}`}>
                <Button size="sm" variant="primary" leftIcon={<Wand2 className="w-3.5 h-3.5" />}>
                  Optimize Resume for this JD
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
