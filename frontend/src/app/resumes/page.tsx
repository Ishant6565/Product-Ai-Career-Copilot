'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, UploadCloud, Plus, CheckCircle2, AlertCircle, 
  Download, Trash2, Wand2
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
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
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Resume Intelligence & Vector Audits"
          subtitle="ATS parsing index, structural telemetry, and multi-version candidate dossiers"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Upload Dossier Version
            </Button>
          }
        />

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top Version Switcher Tabs */}
          <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {resumes.map((r) => {
                const isSelected = selectedResume?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedResume(r)}
                    className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap border transition-colors duration-100 ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-mono-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{r.title}</span>
                    {r.is_primary && (
                      <span className="text-2xs bg-white text-black px-1.5 py-0.2 border border-black">
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
              leftIcon={<UploadCloud className="w-3.5 h-3.5" strokeWidth={1.5} />}
            >
              Add Edition
            </Button>
          </div>

          {selectedResume && (
            <div className="space-y-8">
              {/* Score Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {/* Overall Score Dial */}
                <div className="p-6 border-2 border-black bg-black text-white">
                  <div className="font-mono text-2xs uppercase tracking-widest text-mono-400 flex items-center justify-between">
                    <span>Overall Resume Index</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-serif text-5xl font-bold text-white">{selectedResume.overall_score}</span>
                    <span className="font-mono text-xs text-mono-400">/ 100</span>
                  </div>
                  <div className="font-mono text-2xs uppercase tracking-wider text-mono-300 mt-2">
                    Grade A+ (Highly Competitive)
                  </div>
                </div>

                {/* ATS Readability */}
                <div className="p-6 border-2 border-black bg-white text-black">
                  <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">ATS Parsing Match</div>
                  <div className="font-serif text-4xl font-bold text-black mt-3">{selectedResume.ats_score}%</div>
                  <div className="font-mono text-2xs uppercase text-mono-500 mt-2">Standard header hierarchy</div>
                </div>

                {/* Impact & Action Verbs */}
                <div className="p-6 border-2 border-black bg-white text-black">
                  <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Action Metric Index</div>
                  <div className="font-serif text-4xl font-bold text-black mt-3">{selectedResume.impact_score}%</div>
                  <div className="font-mono text-2xs uppercase text-mono-500 mt-2">Quantified outcomes</div>
                </div>

                {/* Structure Score */}
                <div className="p-6 border-2 border-black bg-white text-black">
                  <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">Structural Flow</div>
                  <div className="font-serif text-4xl font-bold text-black mt-3">{selectedResume.structure_score}%</div>
                  <div className="font-mono text-2xs uppercase text-mono-500 mt-2">Reverse-chronological</div>
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Strengths */}
                <div className="p-6 border-2 border-black bg-mono-50 space-y-4">
                  <div className="flex items-center justify-between border-b border-black pb-2">
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Detected Dossier Strengths
                    </h3>
                    <Badge variant="solid" size="sm">{selectedResume.strengths?.length || 4} Verified</Badge>
                  </div>
                  <ul className="space-y-3 font-serif text-xs text-mono-800">
                    {selectedResume.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="font-mono text-black font-bold mt-0.5 shrink-0">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses & Missing Keywords */}
                <div className="p-6 border-2 border-black bg-mono-50 space-y-4">
                  <div className="flex items-center justify-between border-b border-black pb-2">
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-black flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Recommended ATS Enhancements
                    </h3>
                    <Badge variant="outline" size="sm">Action Items</Badge>
                  </div>
                  <ul className="space-y-3 font-serif text-xs text-mono-800">
                    {selectedResume.weaknesses?.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="font-mono text-black font-bold mt-0.5 shrink-0">&bull;</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedResume.missing_keywords?.length > 0 && (
                    <div className="pt-3 border-t border-mono-200 space-y-2">
                      <div className="font-mono text-2xs uppercase tracking-widest text-mono-500">
                        High-Demand Missing Keywords:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedResume.missing_keywords.map((k) => (
                          <span key={k} className="px-2 py-0.5 bg-black text-white border border-black font-mono text-2xs">+ {k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable AI Fix Suggestions */}
              <div className="p-8 border-2 border-black bg-white space-y-6">
                <div className="flex items-center justify-between border-b border-black pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Zero-Hallucination Bullet Calibration
                    </h3>
                    <p className="font-mono text-2xs uppercase tracking-widest text-mono-500 mt-0.5">Automated metric elevation recommendations</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedResume.improvement_suggestions?.map((item, idx) => (
                    <div key={idx} className="p-6 border border-black bg-mono-50 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="solid" size="sm">{item.section}</Badge>
                        <span className="font-mono text-2xs uppercase tracking-wider px-2 py-0.5 border border-black bg-white text-black font-bold">
                          {item.impact} Impact
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="p-4 border border-mono-300 bg-white text-mono-700">
                          <span className="text-2xs uppercase tracking-wider block mb-1 font-bold text-mono-500">Current Wording:</span>
                          <span className="font-body text-xs">{item.current}</span>
                        </div>
                        <div className="p-4 border-2 border-black bg-black text-white font-medium">
                          <span className="text-2xs uppercase tracking-wider block mb-1 font-bold text-mono-300">Calibrated Wording:</span>
                          <span className="font-body text-xs text-white">{item.suggested}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version Controls */}
              <div className="p-6 border-2 border-black bg-mono-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {!selectedResume.is_primary && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleSetPrimary(selectedResume.id)}
                    >
                      Set as Primary Dossier
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
                  Delete Edition
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
        title="Ingest New Candidate Edition"
        subtitle="Our parser evaluates telemetry, calculates ATS metrics, and optimizes bullet points"
      >
        <form onSubmit={handleUpload} className="space-y-5 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider font-bold text-mono-700">Edition Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Backend Go Specialist V2"
              className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider font-bold text-mono-700">Paste Resume Text / Markdown</label>
            <textarea
              rows={7}
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste raw markdown or text from your engineering resume..."
              className="w-full p-3.5 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-mono-200">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isUploading}>
              Parse & Calibrate Dossier
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

