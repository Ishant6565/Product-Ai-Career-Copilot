'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Wand2, FileText, Sparkles, Copy, Check, 
  Send, RefreshCw, ArrowRight
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
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
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="AI Synthesis & Calibration Workbench"
          subtitle="Non-hallucinatory bullet optimization, editorial cover letters, and STAR interview evaluation"
        />

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Selector: Target Job Selection & Tool Switcher */}
          <div className="p-6 border-2 border-black bg-mono-50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Tool Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('optimize')}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap border transition-colors duration-100 ${
                  activeTab === 'optimize' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-mono-100'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Resume Optimizer</span>
              </button>

              <button
                onClick={() => setActiveTab('cover-letter')}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap border transition-colors duration-100 ${
                  activeTab === 'cover-letter' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-mono-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Cover Letter Architect</span>
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap border transition-colors duration-100 ${
                  activeTab === 'interview' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-mono-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>STAR Interview Coach</span>
              </button>
            </div>

            {/* Target Job Selector */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="uppercase tracking-wider font-bold text-mono-600 whitespace-nowrap">Target Role:</span>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="p-2 border border-black bg-white text-black focus:outline-none max-w-[260px] truncate"
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
            <div className="space-y-8">
              {/* Trigger Card */}
              <div className="p-8 border-2 border-black bg-mono-50 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-black flex items-center gap-2">
                      <Wand2 className="w-5 h-5" strokeWidth={1.5} />
                      Job-Specific Surgical Bullet Optimization
                    </h2>
                    <p className="font-serif text-xs text-mono-600 max-w-xl">
                      Calibrates your achievements to maximize action verbs and keyword density matching the selected job dossier without fabricating experience.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleRunOptimization}
                    isLoading={isOptimizing}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Execute Calibration
                  </Button>
                </div>
              </div>

              {optimizeResult && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Score Impact Projection */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 border-2 border-black bg-white">
                      <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">ATS Match Prior</div>
                      <div className="font-serif text-4xl font-bold text-mono-500 mt-2">
                        {optimizeResult.ats_score_before}%
                      </div>
                    </div>
                    <div className="p-6 border-2 border-black bg-black text-white">
                      <div className="font-mono text-2xs uppercase tracking-widest text-mono-400">Projected ATS Fit After</div>
                      <div className="font-serif text-4xl font-bold text-white mt-2">
                        {optimizeResult.ats_score_projected}% (+{optimizeResult.ats_score_projected - optimizeResult.ats_score_before}%)
                      </div>
                    </div>
                    <div className="p-6 border-2 border-black bg-white">
                      <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Keywords Injected</div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {optimizeResult.matching_keywords.map((k) => (
                          <span key={k} className="px-2 py-0.5 bg-mono-100 border border-mono-300 font-mono text-2xs text-black">✓ {k}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tailored Executive Summary */}
                  <div className="p-6 border-2 border-black bg-white space-y-2">
                    <div className="font-mono text-2xs uppercase tracking-widest font-bold text-black border-b border-black pb-2">
                      Calibrated Executive Summary
                    </div>
                    <p className="font-serif text-xs text-black leading-relaxed p-4 bg-mono-50 border border-mono-200">
                      {optimizeResult.optimized_summary}
                    </p>
                  </div>

                  {/* Side-by-Side Bullet Comparisons */}
                  <div className="p-8 border-2 border-black bg-white space-y-6">
                    <div className="flex items-center justify-between border-b border-black pb-3">
                      <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                        Bullet Point Side-By-Side Comparison
                      </h3>
                      <Badge variant="solid" size="sm">Zero Hallucinations</Badge>
                    </div>

                    <div className="space-y-6">
                      {optimizeResult.bullet_improvements.map((item, idx) => (
                        <div key={idx} className="p-6 border border-black bg-mono-50 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                            {/* Before */}
                            <div className="p-4 border border-mono-300 bg-white text-mono-700 space-y-1">
                              <span className="text-2xs uppercase tracking-wider block font-bold text-mono-500">
                                Original Generic Bullet:
                              </span>
                              <p className="font-body text-xs">{item.original}</p>
                            </div>

                            {/* After */}
                            <div className="p-4 border-2 border-black bg-black text-white space-y-1">
                              <span className="text-2xs uppercase tracking-wider block font-bold text-mono-300">
                                AI Enhanced (Impact + Metrics):
                              </span>
                              <p className="font-body text-xs text-white">{item.optimized}</p>
                            </div>
                          </div>

                          <div className="font-mono text-2xs text-mono-600 flex flex-wrap items-center justify-between pt-2 border-t border-mono-200">
                            <span><strong className="text-black uppercase">Rationale:</strong> {item.impact_explanation}</span>
                            <div className="flex gap-1 mt-1 sm:mt-0">
                              {item.added_keywords.map((k) => (
                                <span key={k} className="px-2 py-0.5 bg-black text-white border border-black text-2xs">+{k}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 2: COVER LETTER GENERATOR */}
          {/* ========================================================================= */}
          {activeTab === 'cover-letter' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form & Tone Settings (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                <div className="p-8 border-2 border-black bg-white space-y-6">
                  <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black border-b border-black pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Cover Letter Architect
                  </h3>

                  <div className="space-y-5 font-mono text-xs">
                    <div className="space-y-1.5">
                      <label className="block uppercase tracking-wider font-bold text-mono-700">Writing Tone</label>
                      <select
                        value={coverTone}
                        onChange={(e) => setCoverTone(e.target.value)}
                        className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
                      >
                        <option value="Confident & Impact-Driven">Confident & Impact-Driven</option>
                        <option value="Technical & Precise">Technical & Architectural</option>
                        <option value="Professional & Executive">Professional & Executive</option>
                        <option value="Startup Culture Fit">Startup & High Velocity</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block uppercase tracking-wider font-bold text-mono-700">
                        Specific Projects / Technical Angles (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={coverNotes}
                        onChange={(e) => setCoverNotes(e.target.value)}
                        placeholder="e.g. Highlight distributed systems experience, open-source work..."
                        className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                      />
                    </div>

                    <Button
                      variant="primary"
                      className="w-full py-4"
                      onClick={handleRunCoverLetter}
                      isLoading={isGeneratingCover}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Draft Editorial Letter
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Generated Letter Preview (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {coverResult ? (
                  <div className="p-8 border-2 border-black bg-white space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-black">
                      <div>
                        <div className="font-serif font-bold text-base text-black">{coverResult.subject_line}</div>
                        <div className="font-mono text-2xs uppercase tracking-wider text-mono-500 mt-0.5">Prepared for {coverResult.recipient}</div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(coverResult.full_markdown)}
                        leftIcon={isCopiedCover ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      >
                        {isCopiedCover ? 'Copied' : 'Copy'}
                      </Button>
                    </div>

                    {/* Formatted Markdown Body */}
                    <div className="space-y-4 font-serif text-sm text-black leading-relaxed whitespace-pre-line p-6 border border-mono-300 bg-mono-50">
                      {coverResult.full_markdown}
                    </div>
                  </div>
                ) : (
                  <div className="p-16 border-2 border-black bg-mono-50 text-center space-y-3">
                    <FileText className="w-8 h-8 text-black mx-auto" strokeWidth={1.5} />
                    <h3 className="font-serif text-lg font-bold uppercase text-black">No Letter Generated Yet</h3>
                    <p className="font-serif text-xs text-mono-600 max-w-sm mx-auto">
                      Select target role and tone preferences on the left, then click &quot;Draft Editorial Letter&quot;.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 3: STAR MOCK INTERVIEW COACH */}
          {/* ========================================================================= */}
          {activeTab === 'interview' && (
            <div className="space-y-8">
              {!interviewPrep ? (
                <div className="p-12 border-2 border-black bg-mono-50 text-center space-y-4">
                  <Sparkles className="w-8 h-8 text-black mx-auto" strokeWidth={1.5} />
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-black">
                      AI Mock Interview Simulation Studio
                    </h3>
                    <p className="font-serif text-xs text-mono-600 max-w-md mx-auto">
                      Synthesize 5 tailored architectural, behavioral, and situational prompts matching your target role with real-time STAR evaluation.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleLoadInterviewQuestions}
                    isLoading={isGeneratingQuestions}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start 5-Prompt Simulation
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Question Navigator */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-4">
                    <div className="flex items-center gap-2">
                      {interviewPrep.questions.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            setActiveQuestionIdx(idx);
                            setEvalResult(null);
                            setUserAnswer('');
                          }}
                          className={`w-9 h-9 border text-xs font-mono font-bold transition-colors duration-100 ${
                            idx === activeQuestionIdx
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-black hover:bg-mono-100'
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
                      New Set
                    </Button>
                  </div>

                  {/* Active Question Box */}
                  {interviewPrep.questions[activeQuestionIdx] && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Question & STAR Guidelines (6 cols) */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="p-8 border-2 border-black bg-white space-y-5">
                          <div className="flex items-center justify-between">
                            <Badge variant="solid" size="sm">
                              Prompt {activeQuestionIdx + 1} of 5 • {interviewPrep.questions[activeQuestionIdx].type.toUpperCase()}
                            </Badge>
                          </div>

                          <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-black leading-snug">
                            {interviewPrep.questions[activeQuestionIdx].question}
                          </h2>

                          <p className="font-serif text-xs text-mono-700">
                            <strong className="font-mono text-2xs uppercase tracking-widest text-black mr-1">Interviewer Context:</strong>
                            {interviewPrep.questions[activeQuestionIdx].context_rationale}
                          </p>

                          {/* STAR Guide Checklist */}
                          <div className="p-5 border border-black bg-mono-50 space-y-3 font-mono text-xs">
                            <div className="uppercase tracking-wider font-bold text-2xs text-black border-b border-black pb-1">
                              STAR Structural Blueprint:
                            </div>
                            <div className="space-y-2 text-mono-800">
                              <div><strong className="uppercase">Situation:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Situation}</div>
                              <div><strong className="uppercase">Task:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Task}</div>
                              <div><strong className="uppercase">Action:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Action}</div>
                              <div><strong className="uppercase">Result:</strong> {interviewPrep.questions[activeQuestionIdx].star_guide.Result}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Candidate Answer & Evaluation Box (6 cols) */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="p-8 border-2 border-black bg-white space-y-5 font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-black pb-2">
                            <span className="font-bold uppercase tracking-wider text-black">Candidate Articulation</span>
                            <span className="text-2xs text-mono-500 uppercase">Apply STAR format</span>
                          </div>

                          <textarea
                            rows={6}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Detail your situation, technical tasks owned, architectural actions, and quantifiable outcome metrics..."
                            className="w-full p-3.5 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                          />

                          <Button
                            variant="primary"
                            className="w-full py-4"
                            onClick={handleEvaluateAnswer}
                            isLoading={isEvaluating}
                            disabled={!userAnswer.trim()}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                          >
                            Submit for AI Assessment
                          </Button>
                        </div>

                        {/* Evaluation Scorecard */}
                        {evalResult && (
                          <div className="p-6 border-2 border-black bg-mono-50 space-y-4 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between pb-3 border-b border-black">
                              <div>
                                <span className="font-mono text-2xs uppercase tracking-widest text-mono-500">Evaluation Score</span>
                                <div className="font-serif text-3xl font-bold text-black">{evalResult.score} / 100</div>
                              </div>
                              <Badge variant="solid" size="md">
                                {evalResult.score >= 80 ? 'Strong Candidate' : 'Needs Metrics'}
                              </Badge>
                            </div>

                            <div className="p-4 border border-black bg-white font-serif text-xs text-black">
                              <strong className="font-mono text-2xs uppercase tracking-widest block mb-1">Coach Feedback:</strong>
                              {evalResult.coach_tip}
                            </div>

                            <div className="space-y-1.5 font-mono text-xs">
                              <div className="font-bold uppercase text-2xs text-black">Calibrated Articulation:</div>
                              <p className="p-4 border border-black bg-black text-white font-body text-xs italic">
                                &quot;{evalResult.suggested_rewrite}&quot;
                              </p>
                            </div>
                          </div>
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
    <Suspense fallback={<div className="min-h-screen bg-white text-black p-8 font-mono text-xs">Loading Workbench...</div>}>
      <AIToolsContent />
    </Suspense>
  );
}

