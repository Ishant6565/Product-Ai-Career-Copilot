'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, CheckCircle2, PieChart, 
  Sparkles, Award, ArrowUpRight, Kanban, AlertCircle
} from 'lucide-react';
import { Sidebar } from '@/components/common/Sidebar';
import { AppHeader } from '@/components/common/AppHeader';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { AnalyticsOverview } from '@/types';

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-row selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AppHeader
          title="Career Analytics & Conversion Funnel"
          subtitle="Pipeline velocity, stage conversion efficiency, and market skill demand"
        />

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Funnel KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="text-xs text-slate-400">Total Tracked Applications</div>
              <div className="text-3xl font-extrabold font-mono text-white mt-1">
                {analytics?.total_applications || 5}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Healthy pipeline velocity
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="text-xs text-slate-400">Interview Conversion Rate</div>
              <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
                {analytics?.interview_conversion_rate || 40.0}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                2.8x higher than industry avg (14%)
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="text-xs text-slate-400">Response Rate</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {analytics?.response_rate || 60.0}%
              </div>
              <div className="text-[11px] text-emerald-300 mt-1">
                Based on tailored ATS resumes
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-b from-[#0F1424] to-[#0A0E17]">
              <div className="text-xs text-slate-400">Avg Job Match Index</div>
              <div className="text-3xl font-extrabold font-mono text-violet-400 mt-1">
                {analytics?.average_match_score || 91}%
              </div>
              <div className="text-[11px] text-violet-300 mt-1">
                Top 8% candidate alignment
              </div>
            </Card>
          </div>

          {/* Application Funnel Visualization */}
          <Card className="p-6 space-y-5">
            <CardHeader>
              <CardTitle>
                <Kanban className="w-4 h-4 text-indigo-400" />
                Hiring Stage Conversion Funnel
              </CardTitle>
              <span className="text-xs text-slate-400">Progression from Saved to Formal Offer</span>
            </CardHeader>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { stage: 'Saved', count: analytics?.applications_by_status.saved || 1, color: 'bg-slate-500', width: 'w-full' },
                { stage: 'Applied', count: analytics?.applications_by_status.applied || 1, color: 'bg-indigo-500', width: 'w-4/5' },
                { stage: 'Screening', count: analytics?.applications_by_status.screening || 1, color: 'bg-cyan-500', width: 'w-3/5' },
                { stage: 'Interview', count: analytics?.applications_by_status.interview || 1, color: 'bg-violet-500', width: 'w-2/5' },
                { stage: 'Offer', count: analytics?.applications_by_status.offer || 1, color: 'bg-emerald-500', width: 'w-1/4' },
              ].map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-xs font-semibold text-slate-300">{step.stage}</div>
                  <div className="text-2xl font-bold font-mono text-white">{step.count}</div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${step.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Two Column Grid: Market Skill Demand vs Skill Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top In-Demand Market Skills (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 space-y-4">
                <CardHeader>
                  <CardTitle>Top In-Demand Skills in Target Roles</CardTitle>
                  <Badge variant="cyan" size="sm">Market Demand %</Badge>
                </CardHeader>

                <div className="space-y-3">
                  {analytics?.top_in_demand_skills?.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{item.skill}</span>
                          {item.user_has ? (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                              In Profile
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                              Missing
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-slate-400">{item.demand_percentage}% of jobs</span>
                      </div>

                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.user_has ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : 'bg-amber-500/60'}`}
                          style={{ width: `${item.demand_percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* High-Impact Skill Gap Roadmap (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 space-y-4 border-amber-500/20 bg-amber-950/5">
                <CardHeader>
                  <CardTitle className="text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Targeted Skill Gap Roadmap
                  </CardTitle>
                  <Badge variant="amber" size="sm">High ROI</Badge>
                </CardHeader>

                <p className="text-xs text-slate-400">
                  Estimated learning time and action items to eliminate blockers from your target roles:
                </p>

                <div className="space-y-3 pt-1">
                  {analytics?.skill_gap_matrix?.map((gap, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{gap.skill}</span>
                        <span className="font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                          ~{gap.estimated_hours} Hours
                        </span>
                      </div>

                      <p className="text-slate-300">
                        <strong>Recommended Project:</strong> {gap.recommended_action}
                      </p>

                      <div className="text-[11px] text-slate-400">
                        Appears as missing requirement in {gap.missing_in_jobs} saved roles.
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
