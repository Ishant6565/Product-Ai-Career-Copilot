'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, UploadCloud, Plus, CheckCircle2, AlertCircle, 
  Sparkles, Star, Download, Trash2, ArrowUpRight, Wand2, RefreshCw
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Resume } from '@/types';

export default function ResumesPage() {
  const { profile } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Full-Stack Software Engineer V2');
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const list = await api.listResumes();
      setResumes(list);
      if (list.length > 0) {
        setSelectedResume(list.find(r => r.is_primary) || list[0]);
      }
    } catch (err) {
      console.warn('Could not fetch resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('raw_text', resumeText);
      await api.uploadResume(formData);
      await fetchResumes();
      setIsUploadModalOpen(false);
      setResumeText('');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const updated = await api.setPrimaryResume(id);
      await fetchResumes();
      setSelectedResume(updated);
    } catch (err) {
      console.error('Could not set primary:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (resumes.length <= 1) {
      alert('You must keep at least one active resume version.');
      return;
    }
    try {
      await api.deleteResume(id);
      await fetchResumes();
    } catch (err) {
      console.error('Could not delete resume:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Multi-Version Resume Hub"
          subtitle="ATS scoring, structural audits, and version tracking"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Upload New Version
            </Button>
          }
        />

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Version Switcher Tabs */}
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {resumes.map((r) => {
                const isSelected = selectedResume?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedResume(r)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{r.title}</span>
                    {r.is_primary && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                        PRIMARY
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
            >
              New Version
            </Button>
          </div>

          {selectedResume && (
            <div className="space-y-6">
              {/* Score Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Overall Score Dial */}
                <Card className="p-5 bg-gradient-to-b from-[#0F1528] to-[#0A0E17] border-indigo-500/30">
                  <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
                    <span>Overall Resume Score</span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{selectedResume.overall_score}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                    Grade A+ (Highly Competitive)
                  </div>
                </Card>

                {/* ATS Readability */}
                <Card className="p-5">
                  <div className="text-xs text-slate-400">ATS Parsing Compatibility</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-2">{selectedResume.ats_score}%</div>
                  <div className="text-[10px] text-slate-400 mt-1">Standard header hierarchy</div>
                </Card>

                {/* Impact & Action Verbs */}
                <Card className="p-5">
                  <div className="text-xs text-slate-400">Impact & Action Verbs</div>
                  <div className="text-2xl font-bold font-mono text-emerald-300 mt-2">{selectedResume.impact_score}%</div>
                  <div className="text-[10px] text-slate-400 mt-1">Quantified business metrics</div>
                </Card>

                {/* Structure Score */}
                <Card className="p-5">
                  <div className="text-xs text-slate-400">Structural Flow</div>
                  <div className="text-2xl font-bold font-mono text-violet-300 mt-2">{selectedResume.structure_score}%</div>
                  <div className="text-[10px] text-slate-400 mt-1">Clean reverse-chronology</div>
                </Card>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card className="p-5 space-y-3 border-emerald-500/20 bg-emerald-950/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Detected Resume Strengths
                    </CardTitle>
                    <Badge variant="emerald" size="sm">{selectedResume.strengths?.length || 4} Verified</Badge>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {selectedResume.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Weaknesses & Missing Keywords */}
                <Card className="p-5 space-y-3 border-amber-500/20 bg-amber-950/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-400">
                      <AlertCircle className="w-4 h-4" /> Recommended ATS Enhancements
                    </CardTitle>
                    <Badge variant="amber" size="sm">Action Items</Badge>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {selectedResume.weaknesses?.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5 shrink-0">&bull;</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedResume.missing_keywords?.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        High-Demand Missing Keywords:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedResume.missing_keywords.map((k) => (
                          <Badge key={k} variant="amber" size="sm">+ {k}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Actionable AI Fix Suggestions */}
              <Card className="p-6 space-y-4">
                <CardHeader>
                  <CardTitle>
                    <Wand2 className="w-4 h-4 text-cyan-400" />
                    AI Bullet Point Improvement Suggestions
                  </CardTitle>
                  <span className="text-xs text-slate-400">Zero-hallucination metric rewrites</span>
                </CardHeader>

                <div className="space-y-4">
                  {selectedResume.improvement_suggestions?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="indigo" size="sm">{item.section}</Badge>
                        <Badge variant={item.impact === 'High' ? 'rose' : 'amber'} size="sm">
                          {item.impact} Impact
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-slate-300">
                          <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1 font-bold">Current Wording:</span>
                          {item.current}
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-slate-100 font-medium">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1 font-bold">AI Optimized Wording:</span>
                          {item.suggested}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Version Controls */}
              <div className="p-4 rounded-2xl border border-white/5 bg-[#090D18] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!selectedResume.is_primary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetPrimary(selectedResume.id)}
                    >
                      Set as Primary Active Resume
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const blob = new Blob([selectedResume.raw_text || 'Resume content'], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedResume.title.replace(/\s+/g, '_')}.txt`;
                      a.click();
                    }}
                  >
                    Export TXT / Markdown
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(selectedResume.id)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete Version
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload & Parse New Resume Version"
        subtitle="Our AI parser extracts skills, computes ATS scores, and audits bullet impact"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Version Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Backend Go Specialist V2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Paste Resume Content (or Summary)</label>
            <textarea
              rows={6}
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste text from your PDF/DOCX resume..."
              className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isUploading}>
              Parse & Audit Resume
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
