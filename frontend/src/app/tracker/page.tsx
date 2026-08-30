'use client';

import React, { useState, useEffect } from 'react';
import { 
  Kanban, Table, Plus, Search, Filter, Calendar, 
  DollarSign, Mail, User, Clock, Trash2, Edit3, 
  CheckCircle2, AlertCircle, ArrowRight, Sparkles, ChevronRight, X
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Application, ApplicationStage } from '@/types';

const STAGES: { id: ApplicationStage; label: string; color: string; badgeVariant: 'slate' | 'indigo' | 'cyan' | 'violet' | 'emerald' | 'rose' }[] = [
  { id: 'saved', label: 'Saved', color: 'border-slate-500/30 bg-slate-500/10', badgeVariant: 'slate' },
  { id: 'applied', label: 'Applied', color: 'border-indigo-500/30 bg-indigo-500/10', badgeVariant: 'indigo' },
  { id: 'screening', label: 'Screening', color: 'border-cyan-500/30 bg-cyan-500/10', badgeVariant: 'cyan' },
  { id: 'interview', label: 'Interview', color: 'border-violet-500/30 bg-violet-500/10', badgeVariant: 'violet' },
  { id: 'offer', label: 'Offer', color: 'border-emerald-500/30 bg-emerald-500/10', badgeVariant: 'emerald' },
  { id: 'rejected', label: 'Rejected', color: 'border-rose-500/30 bg-rose-500/10', badgeVariant: 'rose' },
];

export default function TrackerPage() {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Create Application Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [status, setStatus] = useState<ApplicationStage>('applied');
  const [salaryOffered, setSalaryOffered] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await api.listApplications();
      setApplications(data);
    } catch (err) {
      console.warn('Tracker fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openCreateModal = () => {
    setEditingApp(null);
    setCompanyName('');
    setJobTitle('');
    setLocation('Remote');
    setStatus('applied');
    setSalaryOffered('');
    setRecruiterName('');
    setRecruiterEmail('');
    setInterviewDate('');
    setFollowUpDate('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (app: Application) => {
    setEditingApp(app);
    setCompanyName(app.company_name);
    setJobTitle(app.job_title);
    setLocation(app.location);
    setStatus(app.status);
    setSalaryOffered(app.salary_offered || '');
    setRecruiterName(app.recruiter_name || '');
    setRecruiterEmail(app.recruiter_email || '');
    setInterviewDate(app.interview_date ? app.interview_date.split('T')[0] : '');
    setFollowUpDate(app.follow_up_date ? app.follow_up_date.split('T')[0] : '');
    setNotes(app.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingApp) {
        await api.updateApplication(editingApp.id, {
          company_name: companyName,
          job_title: jobTitle,
          location,
          status,
          salary_offered: salaryOffered || undefined,
          recruiter_name: recruiterName || undefined,
          recruiter_email: recruiterEmail || undefined,
          interview_date: interviewDate ? new Date(interviewDate).toISOString() as any : undefined,
          follow_up_date: followUpDate ? new Date(followUpDate).toISOString() as any : undefined,
          notes: notes || undefined,
        });
      } else {
        await api.createApplication({
          company_name: companyName,
          job_title: jobTitle,
          location,
          status,
          salary_offered: salaryOffered || undefined,
          recruiter_name: recruiterName || undefined,
          recruiter_email: recruiterEmail || undefined,
          interview_date: interviewDate ? new Date(interviewDate).toISOString() as any : undefined,
          follow_up_date: followUpDate ? new Date(followUpDate).toISOString() as any : undefined,
          notes: notes || undefined,
          match_score: 88,
        });
      }
      await fetchApplications();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveStatus = async (appId: string, newStatus: ApplicationStage) => {
    try {
      await api.updateApplication(appId, { status: newStatus });
      setApplications(applications.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Status move error:', err);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await api.deleteApplication(appId);
      setApplications(applications.filter(a => a.id !== appId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredApps = applications.filter(a => 
    a.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Application Pipeline Tracker"
          subtitle={`${applications.length} active opportunities tracked across the hiring funnel`}
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={openCreateModal}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Application
            </Button>
          }
        />

        <div className="p-6 space-y-6 max-w-[1500px] w-full mx-auto">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#0A0F1B]">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by company or role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'table' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
              </div>
            </div>
          </div>

          {/* KANBAN BOARD VIEW */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
              {STAGES.map((stage) => {
                const stageApps = filteredApps.filter(a => a.status === stage.id);

                return (
                  <div key={stage.id} className="rounded-2xl border border-white/[0.06] bg-[#090D18]/90 p-3.5 space-y-3 min-w-[210px]">
                    {/* Stage Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${stage.color.split(' ')[1]}`} />
                        {stage.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-400">
                        {stageApps.length}
                      </span>
                    </div>

                    {/* Applications Cards */}
                    <div className="space-y-2.5">
                      {stageApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => openEditModal(app)}
                          className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0D1220] hover:border-indigo-500/40 hover:scale-[1.01] transition-all cursor-pointer space-y-2.5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="text-xs font-bold text-white hover:text-cyan-300 transition-colors">
                                {app.company_name}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {app.job_title}
                              </div>
                            </div>

                            <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                              {app.match_score}%
                            </span>
                          </div>

                          {/* Details Snippet */}
                          {app.salary_offered && (
                            <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> {app.salary_offered}
                            </div>
                          )}

                          {app.interview_date && (
                            <div className="text-[10px] text-violet-300 bg-violet-500/10 p-1.5 rounded-lg border border-violet-500/20 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(app.interview_date).toLocaleDateString()}</span>
                            </div>
                          )}

                          {/* 1-Click Move dropdown / selector */}
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={app.status}
                              onChange={(e) => handleMoveStatus(app.id, e.target.value as ApplicationStage)}
                              className="text-[10px] py-0.5 px-1.5 rounded bg-white/[0.04] border border-white/10 text-slate-400 focus:outline-none"
                            >
                              {STAGES.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleDelete(app.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Delete application"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {stageApps.length === 0 && (
                        <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-[11px] text-slate-600">
                          Empty stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE LIST VIEW */}
          {viewMode === 'table' && (
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Company</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status Stage</th>
                    <th className="p-4">Offered / Target</th>
                    <th className="p-4">Interview Schedule</th>
                    <th className="p-4">Recruiter</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => openEditModal(app)}>
                      <td className="p-4 font-bold text-white">{app.company_name}</td>
                      <td className="p-4 text-slate-300">{app.job_title}</td>
                      <td className="p-4">
                        <Badge 
                          variant={
                            app.status === 'offer' ? 'emerald' :
                            app.status === 'interview' ? 'violet' :
                            app.status === 'screening' ? 'cyan' :
                            app.status === 'applied' ? 'indigo' : 'slate'
                          }
                          size="sm"
                        >
                          {app.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-cyan-300">{app.salary_offered || '—'}</td>
                      <td className="p-4 text-slate-300">
                        {app.interview_date ? new Date(app.interview_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-slate-400">{app.recruiter_name || '—'}</td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(app)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </main>

      {/* Edit / Create Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? `Edit Application • ${editingApp.company_name}` : 'Track New Opportunity'}
        subtitle="Log recruiter contacts, compensation notes, and interview milestones"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveApplication} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Linear"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Full-Stack Engineer"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStage)}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Offered / Target Salary</label>
              <input
                type="text"
                value={salaryOffered}
                onChange={(e) => setSalaryOffered(e.target.value)}
                placeholder="$165,000 + Equity"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recruiter Name</label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recruiter Email</label>
              <input
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Next Interview Date</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Follow-Up Reminder Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes & Next Steps</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key talking points, interview round expectations, recruiter feedback..."
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            {editingApp ? (
              <Button type="button" variant="danger" size="sm" onClick={() => handleDelete(editingApp.id)}>
                Delete
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                {editingApp ? 'Update Application' : 'Create Application'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
