'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Wand2, FileText, Sparkles, Copy, Check, 
  Send, RefreshCw, AlertCircle, CheckCircle2, 
  Award, Shield, HelpCircle, MessageSquare, ArrowRight
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { 
  ResumeOptimizeResponse, CoverLetterResponse, 
  InterviewPrepResponse, InterviewAnswerEvaluation, Job 
} from '@/types';

function AIToolsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'optimize';
  const queryJobId = searchParams.get('job_id') || undefined;

  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'optimize' | 'cover-letter' | 'interview'>(
    (initialTab as any) || 'optimize'
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(queryJobId || 'job-1');

  // Tool 1: Resume Optimizer State
  const [optimizeResult, setOptimizeResult] = useState<ResumeOptimizeResponse | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Tool 2: Cover Letter Generator State
  const [coverTone, setCoverTone] = useState('Confident & Impact-Driven');
  const [coverNotes, setCoverNotes] = useState('');
  const [coverResult, setCoverResult] = useState<CoverLetterResponse | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isCopiedCover, setIsCopiedCover] = useState(false);

  // Tool 3: Mock Interview Prep State
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrepResponse | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evalResult, setEvalResult] = useState<InterviewAnswerEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const list = await api.listJobs();
        setJobs(list);
      } catch (err) {
        console.warn('Jobs load error in AI tools:', err);
      }
    };
    loadJobs();
  }, []);

  // Handler: Run Resume Optimization
  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await api.optimizeResume({
        job_id: selectedJobId,
      });
      setOptimizeResult(res);
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Handler: Run Cover Letter Generator
  const handleRunCoverLetter = async () => {
    setIsGeneratingCover(true);
    try {
      const selJob = jobs.find(j => j.id === selectedJobId);
      const res = await api.generateCoverLetter({
        job_id: selectedJobId,
        job_title: selJob?.title || 'Full-Stack Software Engineer',
        company_name: selJob?.company || 'Innovative Tech Co',
        tone: coverTone,
        extra_notes: coverNotes,
      });
      setCoverResult(res);
    } catch (err) {
      console.error('Cover letter generation error:', err);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Handler: Load Interview Questions
  const handleLoadInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const selJob = jobs.find(j => j.id === selectedJobId);
      const res = await api.getInterviewPrep({
        job_id: selectedJobId,
        job_title: selJob?.title || 'Full-Stack Software Engineer',
        company_name: selJob?.company || 'Stripe',
        question_count: 5,
      });
      setInterviewPrep(res);
      setActiveQuestionIdx(0);
      setEvalResult(null);
      setUserAnswer('');
    } catch (err) {
      console.error('Interview prep generation error:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Handler: Evaluate Interview Answer
  const handleEvaluateAnswer = async () => {
    if (!interviewPrep || !userAnswer.trim()) return;
    const currentQ = interviewPrep.questions[activeQuestionIdx];
    setIsEvaluating(true);
    try {
      const res = await api.evaluateInterviewAnswer({
        question: currentQ.question,
        question_type: currentQ.type,
        user_answer: userAnswer,
      });
      setEvalResult(res);
    } catch (err) {
      console.error('Answer evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedCover(true);
    setTimeout(() => setIsCopiedCover(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="AI Career Studio"
          subtitle="Non-hallucinatory resume tailoring, tailored cover letters, and STAR interview evaluation"
        />

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Selector: Target Job Selection & Tool Switcher */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#0A0F1B] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Tool Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('optimize')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'optimize' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Resume Optimizer</span>
              </button>

              <button
                onClick={() => setActiveTab('cover-letter')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'cover-letter' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cover Letter Architect</span>
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'interview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>STAR Mock Interview Coach</span>
              </button>
            </div>

            {/* Target Job Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium whitespace-nowrap">Target Role:</span>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 max-w-[240px] truncate"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title} ({j.company})</option>
                ))}
              </select>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TOOL 1: RESUME OPTIMIZER */}
          {/* ========================================================================= */}
          {activeTab === 'optimize' && (
            <div className="space-y-6">
              {/* Trigger Card */}
              <Card className="p-6 space-y-4 border-indigo-500/20 bg-gradient-to-r from-[#0F1424] via-[#0A0E17] to-[#070A0F]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-cyan-400" />
                      Job-Specific Surgical Bullet Optimization
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Rewrites your achievements to maximize action verbs and ATS keywords matching the target role without inventing fabricated experiences.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleRunOptimization}
                    isLoading={isOptimizing}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Run ATS Optimization
                  </Button>
                </div>
              </Card>

              {optimizeResult && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Score Impact Projection */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-xs text-slate-400">ATS Match Before</div>
                      <div className="text-2xl font-bold font-mono text-slate-300 mt-1">
                        {optimizeResult.ats_score_before}%
                      </div>
                    </Card>
                    <Card className="p-4 bg-emerald-950/10 border-emerald-500/30">
                      <div className="text-xs text-emerald-400 font-semibold">Projected ATS Match After</div>
                      <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                        {optimizeResult.ats_score_projected}% (+{optimizeResult.ats_score_projected - optimizeResult.ats_score_before}%)
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-xs text-slate-400">Keywords Injected</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {optimizeResult.matching_keywords.map((k) => (
                          <Badge key={k} variant="cyan" size="sm">✓ {k}</Badge>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Tailored Executive Summary */}
                  <Card className="p-5 space-y-2">
                    <CardTitle className="text-xs font-mono uppercase text-cyan-300">
                      Tailored Executive Summary
                    </CardTitle>
                    <p className="text-xs text-slate-200 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5 font-medium">
                      {optimizeResult.optimized_summary}
                    </p>
                  </Card>

                  {/* Side-by-Side Bullet Comparisons */}
                  <Card className="p-6 space-y-4">
                    <CardHeader>
                      <CardTitle>Bullet Point Side-By-Side Comparison</CardTitle>
                      <Badge variant="emerald" size="sm">Zero Hallucinations</Badge>
                    </CardHeader>

                    <div className="space-y-4">
                      {optimizeResult.bullet_improvements.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* Before */}
                            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-slate-300 space-y-1">
                              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                                Original Generic Bullet:
                              </span>
                              <p>{item.original}</p>
                            </div>

                            {/* After */}
                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-white space-y-1">
                              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                                AI Enhanced (Impact + Metrics):
                              </span>
                              <p className="font-medium">{item.optimized}</p>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                            <span><strong>Rationale:</strong> {item.impact_explanation}</span>
                            <div className="flex gap-1">
                              {item.added_keywords.map((k) => (
                                <Badge key={k} variant="indigo" size="sm">+{k}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 2: COVER LETTER GENERATOR */}
          {/* ========================================================================= */}
          {activeTab === 'cover-letter' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form & Tone Settings (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 space-y-4">
                  <CardHeader>
                    <CardTitle>
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Cover Letter Generator
                    </CardTitle>
                  </CardHeader>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Writing Tone</label>
                      <select
                        value={coverTone}
                        onChange={(e) => setCoverTone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Confident & Impact-Driven">Confident & Impact-Driven</option>
                        <option value="Technical & Precise">Technical & Architectural</option>
                        <option value="Professional & Executive">Professional & Executive</option>
                        <option value="Startup Culture Fit">Startup & High Velocity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Specific Projects or Reasons to Highlight (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={coverNotes}
                        onChange={(e) => setCoverNotes(e.target.value)}
                        placeholder="e.g. Highlight my open-source HyperGraph project and interest in their merchant APIs..."
                        className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleRunCoverLetter}
                      isLoading={isGeneratingCover}
                      leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                    >
                      Generate Tailored Letter
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Column: Generated Letter Preview (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {coverResult ? (
                  <Card className="p-6 space-y-5 bg-[#0B0F19]">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white">{coverResult.subject_line}</div>
                        <div className="text-[10px] text-slate-400">Generated for {coverResult.recipient}</div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(coverResult.full_markdown)}
                        leftIcon={isCopiedCover ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      >
                        {isCopiedCover ? 'Copied!' : 'Copy Letter'}
                      </Button>
                    </div>

                    {/* Formatted Markdown Body */}
                    <div className="space-y-3.5 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line p-4 rounded-xl bg-white/[0.01] border border-white/5">
                      {coverResult.full_markdown}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-12 text-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-sm font-bold text-white">No Cover Letter Generated Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Select your target company and tone settings on the left, then click &quot;Generate Tailored Letter&quot;.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 3: STAR MOCK INTERVIEW COACH */}
          {/* ========================================================================= */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              {!interviewPrep ? (
                <Card className="p-8 text-center space-y-4 border-indigo-500/20 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
                  <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      AI Mock Interview Simulation Studio
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Generate 5 targeted technical, behavioral, and situational questions tailored for your chosen company with real-time STAR evaluation.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleLoadInterviewQuestions}
                    isLoading={isGeneratingQuestions}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start 5-Question Mock Interview
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Question Navigator */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      {interviewPrep.questions.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            setActiveQuestionIdx(idx);
                            setEvalResult(null);
                            setUserAnswer('');
                          }}
                          className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${
                            idx === activeQuestionIdx
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                              : 'bg-white/[0.04] text-slate-400 hover:text-white'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleLoadInterviewQuestions}
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      New Question Set
                    </Button>
                  </div>

                  {/* Active Question Box */}
                  {interviewPrep.questions[activeQuestionIdx] && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Question & STAR Guidelines (6 cols) */}
                      <div className="lg:col-span-6 space-y-4">
                        <Card className="p-6 space-y-4 border-indigo-500/25">
                          <div className="flex items-center justify-between">
                            <Badge variant="violet" size="sm">
                              Question {activeQuestionIdx + 1} of 5 &bull; {interviewPrep.questions[activeQuestionIdx].type.toUpperCase()}
                            </Badge>
                          </div>

                          <h2 className="text-sm font-bold text-white leading-snug">
                            {interviewPrep.questions[activeQuestionIdx].question}
                          </h2>

                          <p className="text-xs text-slate-400">
                            <strong>Why recruiters ask this:</strong> {interviewPrep.questions[activeQuestionIdx].context_rationale}
                          </p>

                          {/* STAR Guide Checklist */}
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                            <div className="font-mono text-cyan-300 uppercase tracking-wider font-semibold text-[10px]">
                              Recommended STAR Response Blueprint:
                            </div>
                            <div className="space-y-1.5 text-slate-300">
                              <div><strong className="text-indigo-400">Situation:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Situation}</div>
                              <div><strong className="text-indigo-400">Task:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Task}</div>
                              <div><strong className="text-indigo-400">Action:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Action}</div>
                              <div><strong className="text-indigo-400">Result:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Result}</div>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Right: Candidate Answer & Evaluation Box (6 cols) */}
                      <div className="lg:col-span-6 space-y-4">
                        <Card className="p-6 space-y-4">
                          <CardHeader>
                            <CardTitle>Your Candidate Response</CardTitle>
                            <span className="text-xs text-slate-400">Type your answer using the STAR method</span>
                          </CardHeader>

                          <textarea
                            rows={6}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Describe your situation, the task you owned, the specific actions you took, and the quantifiable result..."
                            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                          />

                          <Button
                            variant="primary"
                            className="w-full"
                            onClick={handleEvaluateAnswer}
                            isLoading={isEvaluating}
                            disabled={!userAnswer.trim()}
                            leftIcon={<Send className="w-3.5 h-3.5" />}
                          >
                            Submit Answer for AI Grading
                          </Button>
                        </Card>

                        {/* Evaluation Scorecard */}
                        {evalResult && (
                          <Card className="p-5 space-y-4 border-emerald-500/25 bg-gradient-to-b from-[#0F1824] to-[#0A0E17] animate-in fade-in duration-200">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                              <div>
                                <span className="text-xs text-slate-400">Interview Response Score:</span>
                                <div className="text-2xl font-bold font-mono text-emerald-400">{evalResult.score} / 100</div>
                              </div>
                              <Badge variant={evalResult.score >= 80 ? 'emerald' : 'amber'} size="md">
                                {evalResult.score >= 80 ? 'Strong Answer' : 'Needs Quantifiable Metrics'}
                              </Badge>
                            </div>

                            <div className="p-3 rounded-xl bg-indigo-500/10 text-xs text-indigo-200">
                              <strong>Coach Tip:</strong> {evalResult.coach_tip}
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-300">
                              <div className="font-semibold text-slate-200">Suggested Polished Rewrite:</div>
                              <p className="p-3 rounded-xl bg-white/[0.02] border border-white/5 italic">
                                &quot;{evalResult.suggested_rewrite}&quot;
                              </p>
                            </div>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070A0F] text-white p-8">Loading AI Tools...</div>}>
      <AIToolsContent />
    </Suspense>
  );
}
