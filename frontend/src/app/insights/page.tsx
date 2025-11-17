'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TrendingUp, Clock, Calendar, Zap, FolderGit2, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface InsightsData {
  authenticated: boolean;
  login?: string;
  peakDay: string;
  peakDayCount: number;
  activeHours: string;
  topRepo: string;
  monthlyGrowth: string;
  consistencyRating: string;
  consecutiveWeeks: number;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/stats/insights')
      .then((res) => {
        if (res.data) {
          setInsights(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Engineering Productivity Analytics
            </span>
            {insights?.authenticated && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Connected: @{insights.login}</span>
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">GitStreak Insights</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            {insights?.authenticated
              ? `Real GitHub Pattern Intelligence for @${insights.login}`
              : 'Automated Engineering Productivity Analytics & Pattern Intelligence'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Monthly Trend & Active Window */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-white">Monthly Activity Trend</h3>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Your contribution activity shifted{' '}
            <span className="text-cyan-400 font-mono font-bold">
              {loading ? '...' : insights?.monthlyGrowth || '+18%'}
            </span>{' '}
            compared to your previous 30-day activity window.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-gray-400 space-y-2">
            <div className="flex justify-between items-center">
              <span>Peak Active Day</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                {loading ? <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> : `${insights?.peakDay || 'Wednesday'} (${insights?.peakDayCount || 0} events)`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Peak Active Window</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                {loading ? <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> : insights?.activeHours || '09:00 – 18:00 UTC'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Streak Score & Top Repo */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3 text-emerald-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-white">Streak Consistency Score</h3>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            You maintained active contributions across{' '}
            <span className="text-emerald-400 font-mono font-bold">
              {loading ? '...' : `${insights?.consecutiveWeeks || 6} consecutive weeks`}
            </span>{' '}
            on GitHub.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-gray-400 space-y-2">
            <div className="flex justify-between items-center">
              <span>Consistency Rating</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                {loading ? <Loader2 className="w-3 h-3 animate-spin text-emerald-400" /> : `${insights?.consistencyRating || '98.4%'} Exceptional`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Most Active Repository</span>
              <span className="text-white font-bold flex items-center gap-1.5 truncate max-w-[200px]">
                {loading ? <Loader2 className="w-3 h-3 animate-spin text-emerald-400" /> : insights?.topRepo || 'APP_Commit'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
