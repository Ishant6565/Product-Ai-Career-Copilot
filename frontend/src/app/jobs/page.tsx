'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, Bookmark, 
  ArrowRight, MapPin, Wand2, Plus, FileText
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
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
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Job Discovery & Vector Calibration"
          subtitle="Real-time cosine compatibility index calculated against your active candidate dossier"
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

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Search & Filter Toolbar */}
          <div className="p-6 border-2 border-black bg-mono-50 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-mono-400 absolute left-4 top-3.5" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title, company name, or tech stack (e.g. Next.js, Go, Stripe)..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>

              {/* Saved Jobs Toggle */}
              <button
                onClick={() => setOnlySaved(!onlySaved)}
                className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider font-bold border-2 transition-colors duration-100 ${
                  onlySaved
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-mono-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Saved Dossiers</span>
              </button>
            </div>

            {/* Facet Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="px-4 py-2 border border-black bg-white text-black focus:outline-none"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-black bg-white text-black focus:outline-none"
              >
                <option value="All">All Seniorities</option>
                <option value="Entry-level">Entry-level / Graduate</option>
                <option value="Mid-level">Mid-level (2-4 yrs)</option>
                <option value="Mid-Senior">Mid-Senior (4+ yrs)</option>
                <option value="Senior">Senior</option>
              </select>

              <button
                onClick={() => setOnlyRemote(!onlyRemote)}
                className={`px-4 py-2 border font-mono uppercase tracking-wider transition-colors duration-100 ${
                  onlyRemote
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-black border-black hover:bg-mono-100'
                }`}
              >
                Remote Only
              </button>
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-wider text-mono-500 border-b border-black pb-2">
              <span>Catalog Index: {jobs.length} Matching Positions</span>
              <span>Ranked by Vector Fit Index</span>
            </div>

            {jobs.length === 0 && !isLoading && (
              <div className="p-16 border-2 border-black bg-mono-50 text-center space-y-3">
                <Briefcase className="w-8 h-8 text-black mx-auto" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-bold text-black uppercase">No Roles Match Filter Criteria</h3>
                <p className="font-serif text-xs text-mono-600">Try adjusting your query string or clearing filters.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => {
                const matchScore = job.match_score || 85;

                return (
                  <div key={job.id} className="p-6 border border-black bg-white space-y-4 flex flex-col justify-between hover:border-2 transition-all">
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Link href={`/jobs/${job.id}`} className="font-serif text-lg font-bold text-black hover:underline">
                              {job.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-xs text-mono-600">
                            <span className="font-bold text-black">{job.company}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            className={`p-2 border transition-colors ${
                              job.is_saved
                                ? 'bg-black text-white border-black'
                                : 'bg-white border-black text-black hover:bg-mono-100'
                            }`}
                            title={job.is_saved ? 'Unsave job' : 'Save job'}
                          >
                            <Bookmark className="w-4 h-4" strokeWidth={1.5} />
                          </button>

                          <Badge variant="solid" size="md">
                            {matchScore}% Match
                          </Badge>
                        </div>
                      </div>

                      {/* Salary & Type Pills */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-2xs uppercase">
                        <span className="px-2.5 py-1 bg-mono-100 border border-mono-300 font-bold text-black">
                          {job.salary_range}
                        </span>
                        <span className="px-2.5 py-1 bg-white border border-mono-300 text-mono-600">
                          {job.job_type}
                        </span>
                        <span className="px-2.5 py-1 bg-white border border-mono-300 text-mono-600">
                          {job.experience_level}
                        </span>
                      </div>

                      {/* Snippet */}
                      <p className="font-serif text-xs text-mono-700 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Matching Skills vs Missing */}
                      <div className="space-y-1.5 pt-2 border-t border-mono-100">
                        <div className="font-mono text-2xs uppercase tracking-widest text-mono-400">
                          Key Vector Alignment:
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-mono text-2xs">
                          {job.required_skills?.slice(0, 4).map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-mono-50 border border-mono-300 text-black">
                              ✓ {s}
                            </span>
                          ))}
                          {job.missing_skills?.slice(0, 2).map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-black text-white border border-black">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-mono-200">
                      <Link href={`/ai-tools?tab=optimize&job_id=${job.id}`}>
                        <Button size="sm" variant="ghost">
                          <Wand2 className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />
                          Calibrate
                        </Button>
                      </Link>

                      <Link href={`/jobs/${job.id}`}>
                        <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Inspect Dossier
                        </Button>
                      </Link>
                    </div>
                  </div>
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
        title="Job Description Vector Scanner"
        subtitle="Paste arbitrary JD text from LinkedIn, Indeed, or career boards for immediate vector alignment analysis"
        maxWidth="2xl"
      >
        {!customAnalysisResult ? (
          <form onSubmit={handleAnalyzeCustomJD} className="space-y-5 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider font-bold text-mono-700">Target Role Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider font-bold text-mono-700">Company Name</label>
                <input
                  type="text"
                  required
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Paste Full Job Description</label>
              <textarea
                rows={7}
                required
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Paste the technical requirements, milestones, and stack specifications here..."
                className="w-full p-3.5 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-mono-200">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsScannerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isAnalyzing} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Calculate Vector Compatibility
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 border-2 border-black bg-black text-white">
              <div>
                <div className="font-mono text-2xs uppercase tracking-widest text-mono-400">{customTitle} • {customCompany}</div>
                <div className="font-serif text-3xl font-bold mt-1 text-white">
                  {customAnalysisResult.overall_match}% Overall Compatibility
                </div>
              </div>
              <span className="font-mono text-2xs uppercase tracking-wider px-3 py-1.5 bg-white text-black font-bold">
                {customAnalysisResult.matching_skills.length} Direct Matches
              </span>
            </div>

            <div className="p-4 border border-black bg-mono-50 font-serif text-xs leading-relaxed text-black">
              <strong className="font-mono text-2xs uppercase tracking-widest mr-2 font-bold">Evaluation Rationale:</strong>
              {customAnalysisResult.why_it_matches}
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 border border-black bg-white space-y-2">
                <div className="font-bold text-black uppercase tracking-wider text-2xs border-b border-black pb-1">Verified Skills:</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customAnalysisResult.matching_skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-mono-100 border border-mono-300 text-black text-2xs">✓ {s}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-black bg-white space-y-2">
                <div className="font-bold text-black uppercase tracking-wider text-2xs border-b border-black pb-1">Target Keyword Gaps:</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customAnalysisResult.missing_skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-black text-white border border-black text-2xs">+ {s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-mono-200">
              <Button type="button" variant="secondary" size="sm" onClick={() => setCustomAnalysisResult(null)}>
                Scan Another JD
              </Button>
              <Link href={`/ai-tools?tab=optimize&job_description=${encodeURIComponent(customDescription)}`}>
                <Button size="sm" variant="primary" leftIcon={<Wand2 className="w-3.5 h-3.5" />}>
                  Calibrate Resume for this JD
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

