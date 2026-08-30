'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Key, Bell, Shield, 
  Sparkles, Save, CheckCircle2, Sliders, Lock
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'ai' | 'notifications' | 'security'>('account');
  const [isSaved, setIsSaved] = useState(false);

  // AI Preferences
  const [aiProvider, setAiProvider] = useState('auto');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [aiTone, setAiTone] = useState('Confident & Impact-Driven');

  // Notifications
  const [emailDigest, setEmailDigest] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Account & System Settings"
          subtitle="Manage your profile credentials, AI provider keys, and notification triggers"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              leftIcon={isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            >
              {isSaved ? 'Saved!' : 'Save Settings'}
            </Button>
          }
        />

        <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            {[
              { id: 'account', label: 'Account Profile', icon: User },
              { id: 'ai', label: 'AI Intelligence & Keys', icon: Sparkles },
              { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
              { id: 'security', label: 'Security & Auth', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Account */}
          {activeTab === 'account' && (
            <Card className="p-6 space-y-5">
              <CardHeader>
                <CardTitle>Account Credentials</CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.full_name || 'Alex Chen'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user?.email || 'alex.chen@example.com'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: AI Settings */}
          {activeTab === 'ai' && (
            <Card className="p-6 space-y-5">
              <CardHeader>
                <CardTitle>AI Provider & Model Configurations</CardTitle>
                <Badge variant="cyan" size="sm">Provider Agnostic</Badge>
              </CardHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Default AI Engine Mode</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="auto">Automatic (Gemini 2.5 Flash / Built-in Semantic Engine)</option>
                    <option value="gemini">Google Gemini API (Custom Key)</option>
                    <option value="openai">OpenAI GPT-4o / GPT-4o-mini (Custom Key)</option>
                    <option value="deterministic">Deterministic Offline Semantic Engine</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Google Gemini API Key (Optional)</label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">OpenAI API Key (Optional)</label>
                    <input
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                  <strong>Zero Setup Friction:</strong> If custom API keys are omitted, AI Career Copilot utilizes our high-precision deterministic semantic engine to parse resumes, match jobs, optimize bullets, and grade interview answers without failure.
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Notification & Follow-Up Reminders</CardTitle>
              </CardHeader>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-white">Upcoming Interview Reminders</div>
                    <div className="text-[10px] text-slate-400">Receive notifications 24 hours and 1 hour before scheduled rounds.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={interviewReminders}
                    onChange={(e) => setInterviewReminders(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-white/10 border-white/20"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-white">Daily High-Fit Job Alerts</div>
                    <div className="text-[10px] text-slate-400">Get notified when newly posted jobs exceed 90% semantic match.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={jobAlerts}
                    onChange={(e) => setJobAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-white/10 border-white/20"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: Security */}
          {activeTab === 'security' && (
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Security & Sessions</CardTitle>
              </CardHeader>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>JWT Authentication Active &bull; Passwords hashed with bcrypt</span>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
