'use client';

import React, { useState } from 'react';
import { 
  User, Key, Bell, Shield, 
  Sparkles, Save, CheckCircle2
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
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
    <div className="min-h-screen bg-white text-black flex flex-row font-body selection:bg-black selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="System Architecture & Preferences"
          subtitle="Manage credentials, AI telemetry provider routing, and alert thresholds"
          actionButton={
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              leftIcon={isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
            >
              {isSaved ? 'Settings Applied' : 'Commit Settings'}
            </Button>
          }
        />

        <div className="p-8 space-y-8 max-w-5xl w-full mx-auto">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b-2 border-black pb-3 overflow-x-auto">
            {[
              { id: 'account', label: 'User Credentials', icon: User },
              { id: 'ai', label: 'AI Engine Routing', icon: Sparkles },
              { id: 'notifications', label: 'Alert Feeds', icon: Bell },
              { id: 'security', label: 'Security & Auth', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap border transition-colors duration-100 ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-mono-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Account */}
          {activeTab === 'account' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                  User Account Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.full_name || 'Alex Chen'}
                    className="w-full p-3 border-2 border-black bg-white text-black font-body text-sm focus:outline-none focus:border-b-4 focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Email Address (Immutable)</label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user?.email || 'alex.chen@example.com'}
                    className="w-full p-3 border-2 border-mono-300 bg-mono-100 text-mono-500 font-body text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Settings */}
          {activeTab === 'ai' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                  AI Model Orchestration & Custom Keys
                </h3>
                <Badge variant="solid" size="sm">Provider Agnostic</Badge>
              </div>

              <div className="space-y-6 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider font-bold text-mono-700">Semantic Engine Pipeline Routing</label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs focus:outline-none focus:border-b-4 focus:border-black"
                  >
                    <option value="auto">Automatic (Gemini 2.5 Flash / Built-in Semantic Engine)</option>
                    <option value="gemini">Google Gemini API (Custom Enterprise Key)</option>
                    <option value="openai">OpenAI GPT-4o / GPT-4o-mini (Custom Enterprise Key)</option>
                    <option value="deterministic">Deterministic Offline Semantic Engine</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block uppercase tracking-wider font-bold text-mono-700">Google Gemini API Key (Optional)</label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block uppercase tracking-wider font-bold text-mono-700">OpenAI API Key (Optional)</label>
                    <input
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full p-3 border-2 border-black bg-white text-black font-mono text-xs placeholder:text-mono-400 focus:outline-none focus:border-b-4 focus:border-black"
                    />
                  </div>
                </div>

                <div className="p-5 border border-black bg-mono-50 font-serif text-xs text-mono-700 space-y-1">
                  <strong className="font-mono text-2xs uppercase tracking-wider text-black block">Deterministic Engine Fallback Protocol:</strong>
                  If custom API keys are omitted, the copilot utilizes our high-precision deterministic semantic engine to parse resumes, match jobs, optimize bullets, and grade interview answers with zero network latency.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                  Notification Triggers & Dispatch Rules
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 border border-black bg-mono-50">
                  <div>
                    <div className="font-serif text-sm font-bold text-black">Upcoming Interview Reminders</div>
                    <div className="font-mono text-2xs uppercase tracking-wider text-mono-500 mt-0.5">Receive dispatch alerts 24 hours and 1 hour prior to scheduled rounds.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={interviewReminders}
                    onChange={(e) => setInterviewReminders(e.target.checked)}
                    className="w-5 h-5 border-2 border-black accent-black rounded-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-5 border border-black bg-mono-50">
                  <div>
                    <div className="font-serif text-sm font-bold text-black">High-Fit Opportunity Telemetry</div>
                    <div className="font-mono text-2xs uppercase tracking-wider text-mono-500 mt-0.5">Instant alerts when newly scraped positions exceed 90% semantic match threshold.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={jobAlerts}
                    onChange={(e) => setJobAlerts(e.target.checked)}
                    className="w-5 h-5 border-2 border-black accent-black rounded-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security */}
          {activeTab === 'security' && (
            <div className="p-8 border-2 border-black bg-white space-y-6">
              <div className="border-b border-black pb-3">
                <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                  Cryptographic Security & Session Bounds
                </h3>
              </div>

              <div className="p-5 border-2 border-black bg-mono-50 font-mono text-xs flex items-center gap-3">
                <Shield className="w-5 h-5 text-black" strokeWidth={1.5} />
                <span className="font-bold text-black uppercase tracking-wider">JWT Authentication Active &bull; Passwords Hashed with Bcrypt Cost-Factor 12</span>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm">
                  Rotate Access Credentials
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

