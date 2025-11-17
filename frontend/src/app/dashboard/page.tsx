'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContributionHeatmap } from '@/components/heatmap/ContributionHeatmap';
import { PresetSelector } from '@/components/presets/PresetSelector';
import { Activity, Flame, FolderGit2, Calendar, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';

interface DashboardStats {
  authenticated: boolean;
  login?: string;
  totalCommits: number;
  activeDays: number;
  currentStreak: number;
  connectedRepos: number;
  trendData: number[];
  heatmapDays: { date: string; count: number; intensity: number; color?: string }[];
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const [activePreset, setActivePreset] = useState('consistent-daily');
  const [chartRange, setChartRange] = useState('30D');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const themeStyles = {
    cyan: {
      text: 'text-cyan-400',
      textLight: 'text-cyan-300',
      bgLight: 'bg-cyan-500/20',
      borderLight: 'border-cyan-500/30',
      buttonActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      barGradient: 'from-cyan-950 via-cyan-600/70 to-cyan-400',
      barText: 'text-cyan-300',
      shadow: 'shadow-cyan-500/20',
    },
    emerald: {
      text: 'text-emerald-400',
      textLight: 'text-emerald-300',
      bgLight: 'bg-emerald-500/20',
      borderLight: 'border-emerald-500/30',
      buttonActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      barGradient: 'from-emerald-950 via-emerald-600/70 to-emerald-400',
      barText: 'text-emerald-300',
      shadow: 'shadow-emerald-500/20',
    },
    purple: {
      text: 'text-purple-400',
      textLight: 'text-purple-300',
      bgLight: 'bg-purple-500/20',
      borderLight: 'border-purple-500/30',
      buttonActive: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      barGradient: 'from-purple-950 via-purple-600/70 to-purple-400',
      barText: 'text-purple-300',
      shadow: 'shadow-purple-500/20',
    },
    amber: {
      text: 'text-amber-400',
      textLight: 'text-amber-300',
      bgLight: 'bg-amber-500/20',
      borderLight: 'border-amber-500/30',
      buttonActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      barGradient: 'from-amber-950 via-amber-600/70 to-amber-400',
      barText: 'text-amber-300',
      shadow: 'shadow-amber-500/20',
    },
  };

  const accent = themeStyles[theme] || themeStyles.cyan;

  useEffect(() => {
    axios.get('/api/stats/dashboard')
      .then((res) => {
        if (res.data) {
          setStats(res.data);
        }
        setLoadingStats(false);
      })
      .catch(() => {
        setLoadingStats(false);
      });
  }, []);

  const totalCommitsDisplay = stats?.authenticated ? stats.totalCommits.toLocaleString() : '2,729';
  const activeDaysDisplay = stats?.authenticated ? stats.activeDays.toLocaleString() : '186';
  const currentStreakDisplay = stats?.authenticated ? stats.currentStreak.toLocaleString() : '24';
  const connectedReposDisplay = stats?.authenticated ? stats.connectedRepos.toLocaleString() : '22';

  // Dynamic trend bars containing actual values and date labels
  const dynamicTrend = useMemo(() => {
    if (!stats?.heatmapDays || stats.heatmapDays.length === 0) {
      return [
        { val: 12, label: 'Mon' }, { val: 18, label: 'Tue' }, { val: 9, label: 'Wed' },
        { val: 24, label: 'Thu' }, { val: 30, label: 'Fri' }, { val: 15, label: 'Sat' },
        { val: 22, label: 'Sun' }, { val: 28, label: 'Mon' }, { val: 35, label: 'Tue' },
        { val: 19, label: 'Wed' }, { val: 42, label: 'Thu' }, { val: 38, label: 'Fri' },
        { val: 25, label: 'Sat' }, { val: 30, label: 'Sun' }
      ];
    }

    const days = stats.heatmapDays;

    const formatDate = (dateStr: string) => {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mIdx = parseInt(parts[1], 10) - 1;
        return `${monthNames[mIdx]} ${parts[2]}`;
      }
      return dateStr;
    };

    if (chartRange === '7D') {
      return days.slice(-7).map((d) => ({ val: d.count, label: formatDate(d.date) }));
    }

    if (chartRange === '30D') {
      return days.slice(-30).map((d) => ({ val: d.count, label: formatDate(d.date) }));
    }

    if (chartRange === '90D') {
      const last90 = days.slice(-90);
      const bins: { val: number; label: string }[] = [];
      for (let i = 0; i < last90.length; i += 3) {
        const chunk = last90.slice(i, i + 3);
        const sum = chunk.reduce((acc, curr) => acc + curr.count, 0);
        bins.push({ val: sum, label: formatDate(chunk[0].date) });
      }
      return bins;
    }

    if (chartRange === '1Y') {
      const bins: { val: number; label: string }[] = [];
      for (let i = 0; i < days.length; i += 7) {
        const chunk = days.slice(i, i + 7);
        const sum = chunk.reduce((acc, curr) => acc + curr.count, 0);
        bins.push({ val: sum, label: formatDate(chunk[0].date) });
      }
      return bins;
    }

    return days.slice(-30).map((d) => ({ val: d.count, label: formatDate(d.date) }));
  }, [stats, chartRange]);

  const maxTrendVal = Math.max(...dynamicTrend.map((d) => d.val), 1);

  return (
    <AppShell>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 ${accent.text}`}>
              <Sparkles className="w-3.5 h-3.5" />
              GitHub Contribution Engine
            </span>
            {stats?.authenticated && (
              <span className={`px-2 py-0.5 rounded-full ${accent.bgLight} ${accent.textLight} border ${accent.borderLight} text-[10px] font-mono flex items-center gap-1`}>
                <CheckCircle2 className={`w-3 h-3 ${accent.text}`} />
                <span>Connected: @{stats.login}</span>
              </span>
            )}
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            {stats?.authenticated ? `Welcome back, @${stats.login}.` : 'Architect your GitHub contribution legacy.'}
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
            {stats?.authenticated
              ? 'Real-time contribution statistics fetched live from your GitHub account.'
              : 'Design high-precision commit cadences, analyze 52-week activity graphs, and execute backdated schedules.'}
          </p>
        </div>

        <a
          href="/schedule"
          className="px-5 py-2.5 rounded-xl accent-glow-button text-xs font-bold flex items-center gap-2 self-start md:self-auto shrink-0 shadow-lg"
        >
          <Calendar className="w-4 h-4" />
          <span>Launch Schedule Configurator</span>
        </a>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>ACTIVITY</span>
            <Activity className={`w-4 h-4 ${accent.text}`} />
          </div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center gap-2">
            {loadingStats ? <Loader2 className={`w-6 h-6 animate-spin ${accent.text}`} /> : totalCommitsDisplay}
          </div>
          <span className="text-[11px] text-gray-400 block font-mono">
            {stats?.authenticated ? 'real GitHub contribution events' : 'commits authored'}
          </span>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>ACTIVE DAYS</span>
            <Calendar className={`w-4 h-4 ${accent.text}`} />
          </div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center gap-2">
            {loadingStats ? <Loader2 className={`w-6 h-6 animate-spin ${accent.text}`} /> : activeDaysDisplay}
          </div>
          <span className="text-[11px] text-gray-400 block font-mono">active days in past year</span>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>CURRENT STREAK</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center gap-2">
            {loadingStats ? <Loader2 className="w-6 h-6 animate-spin text-amber-400" /> : currentStreakDisplay}
          </div>
          <span className="text-[11px] text-amber-400/90 block font-mono">consecutive active days</span>
        </div>

        <div className="glass-panel rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>REPOSITORIES</span>
            <FolderGit2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center gap-2">
            {loadingStats ? <Loader2 className="w-6 h-6 animate-spin text-purple-400" /> : connectedReposDisplay}
          </div>
          <span className="text-[11px] text-gray-400 block font-mono">
            {stats?.authenticated ? 'real connected GitHub repos' : 'connected repositories'}
          </span>
        </div>
      </div>

      {/* Hero Activity Chart */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-white">Activity Overview ({chartRange})</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              {stats?.authenticated ? `Real GitHub Contribution Trend for @${stats.login}` : 'Real-time Contribution Trend'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/10 text-xs font-mono">
            {['7D', '30D', '90D', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setChartRange(range)}
                className={`px-3 py-1 rounded-md transition ${
                  chartRange === range ? `${accent.buttonActive} border font-bold shadow-sm` : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart with Dynamic Theme Accent Gradients */}
        <div className="h-52 w-full pt-6 flex items-end justify-between gap-1.5 px-2">
          {dynamicTrend.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
              <span className={`text-[10px] font-mono font-bold ${accent.barText} opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all mb-1 select-none`}>
                {item.val > 0 ? item.val : ''}
              </span>

              <div
                className={`w-full rounded-t bg-gradient-to-t ${accent.barGradient} transition-all group-hover:brightness-125 shadow-sm ${accent.shadow}`}
                style={{ height: `${Math.max(6, (item.val / maxTrendVal) * 100)}%` }}
                title={`${item.label}: ${item.val} contributions`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 52-Week Contribution Heatmap */}
      <ContributionHeatmap customDays={stats?.heatmapDays} />

      {/* Preset Strategy Cards */}
      <PresetSelector selectedPreset={activePreset} onSelectPreset={setActivePreset} />
    </AppShell>
  );
}
