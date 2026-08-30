'use client';

import React, { useState, useEffect } from 'react';
import { 
  Kanban, Table, Plus, Search, Calendar, 
  DollarSign, Trash2
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Application, ApplicationStage } from '@/types';

const STAGES: { id: ApplicationStage; label: string }[] = [
  { id: 'saved', label: 'Saved' },
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
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
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Application Pipeline & Telemetry"
          subtitle={`${applications.length} active opportunities tracked across deterministic hiring milestones`}
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={openCreateModal}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Log Opportunity
            </Button>
          }
        />

        <div className="p-8 space-y-8 max-w-[1500px] w-full mx-auto">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 border-2 border-black bg-mono-50">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-mono-400 absolute left-4 top-3" strokeWidth={1.5} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by company or role..."
                className="w-full pl-11 pr-4 py-2 border-2 border-black bg-white text-black font-body text-xs focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="border border-black p-1 bg-white flex items-center gap-1 font-mono text-xs">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition-colors duration-100 ${
                    viewMode === 'kanban' ? 'bg-black text-white' : 'text-mono-600 hover:text-black'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition-colors duration-100 ${
                    viewMode === 'table' ? 'bg-black text-white' : 'text-mono-600 hover:text-black'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Table View</span>
                </button>
              </div>
            </div>
          </div>

          {/* KANBAN BOARD VIEW */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 items-start overflow-x-auto pb-6">
              {STAGES.map((stage) => {
                const stageApps = filteredApps.filter(a => a.status === stage.id);

                return (
                  <div key={stage.id} className="border-2 border-black bg-mono-50 p-4 space-y-4 min-w-[210px]">
                    {/* Stage Header */}
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black font-mono text-xs">
                      <span className="font-bold uppercase tracking-wider text-black">
                        {stage.label}
                      </span>
                      <span className="text-2xs font-bold px-1.5 py-0.5 bg-black text-white">
                        {stageApps.length}
                      </span>
                    </div>

                    {/* Applications Cards */}
                    <div className="space-y-3">
                      {stageApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => openEditModal(app)}
                          className="p-4 border border-black bg-white hover:border-2 transition-all cursor-pointer space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-serif font-bold text-sm text-black">
                                {app.company_name}
                              </div>
                              <div className="font-mono text-2xs text-mono-500 line-clamp-1 mt-0.5">
                                {app.job_title}
                              </div>
                            </div>

                            <span className="font-mono text-2xs font-bold text-black border border-black px-1.5 py-0.2 shrink-0">
                              {app.match_score}%
                            </span>
                          </div>

                          {/* Details Snippet */}
                          {app.salary_offered && (
                            <div className="font-mono text-2xs text-black font-bold flex items-center gap-1">
                              <DollarSign className="w-3 h-3" strokeWidth={1.5} /> {app.salary_offered}
                            </div>
                          )}

                          {app.interview_date && (
                            <div className="font-mono text-2xs text-black bg-mono-100 p-1.5 border border-mono-300 flex items-center gap-1">
                              <Calendar className="w-3 h-3" strokeWidth={1.5} />
                              <span>{new Date(app.interview_date).toLocaleDateString()}</span>
                            </div>
                          )}

                          {/* 1-Click Move dropdown / selector */}
                          <div className="pt-2 border-t border-mono-200 flex items-center justify-between font-mono" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={app.status}
                              onChange={(e) => handleMoveStatus(app.id, e.target.value as ApplicationStage)}
                              className="text-2xs py-1 px-1.5 border border-black bg-white text-black focus:outline-none"
                            >
                              {STAGES.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleDelete(app.id)}
                              className="text-mono-400 hover:text-black p-1"
                              title="Delete application"
                            >
                              <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {stageApps.length === 0 && (
                        <div className="p-6 border border-dashed border-mono-300 text-center font-mono text-2xs uppercase tracking-wider text-mono-400">
                          Empty
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
            <div className="border-2 border-black overflow-hidden bg-white">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b-2 border-black bg-black text-white uppercase text-2xs tracking-wider">
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
                <tbody className="divide-y border-mono-200">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-mono-50 transition-colors cursor-pointer" onClick={() => openEditModal(app)}>
                      <td className="p-4 font-serif font-bold text-sm text-black">{app.company_name}</td>
                      <td className="p-4 text-mono-700">{app.job_title}</td>
                      <td className="p-4">
                        <Badge variant="solid" size="sm">
                          {app.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-black">{app.salary_offered || '—'}</td>
                      <td className="p-4 text-mono-600">
                        {app.interview_date ? new Date(app.interview_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-mono-500">{app.recruiter_name || '—'}</td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(app)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit / Create Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? `Edit Dossier • ${editingApp.company_name}` : 'Log Opportunity Dossier'}
        subtitle="Record technical contacts, compensation metrics, and interview schedules"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveApplication} className="space-y-5 font-mono text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Linear"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Role Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Full-Stack Engineer"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStage)}
                className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Offered / Target Salary</label>
              <input
                type="text"
                value={salaryOffered}
                onChange={(e) => setSalaryOffered(e.target.value)}
                placeholder="$165,000 + Equity"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Recruiter / Lead Name</label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Recruiter Email</label>
              <input
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Interview Date</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-mono-700">Follow-Up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider font-bold text-mono-700">Notes & Milestones</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key architectural discussion points, rounds completed, expectations..."
              className="w-full p-3.5 border-2 border-black bg-white text-black font-body text-sm placeholder:italic placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-mono-200">
            {editingApp ? (
              <Button type="button" variant="danger" size="sm" onClick={() => handleDelete(editingApp.id)}>
                Delete
              </Button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                {editingApp ? 'Update Dossier' : 'Save Dossier'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
