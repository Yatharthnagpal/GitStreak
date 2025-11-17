'use client';

import React from 'react';
import { CalendarCheck, Briefcase, Zap, Sparkles, Feather, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface PresetOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ruleDetail: string;
  patternSummary: string;
  icon: any;
  visualBars: number[];
}

interface PresetSelectorProps {
  selectedPreset: string;
  onSelectPreset: (id: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ selectedPreset, onSelectPreset }) => {
  const { theme } = useTheme();

  const themeStyles = {
    cyan: {
      text: 'text-cyan-400',
      textSubtle: 'text-cyan-300',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      bar: 'bg-cyan-400/80',
      icon: 'text-cyan-400',
      borderActive: 'border-cyan-400 bg-cyan-950/20',
    },
    emerald: {
      text: 'text-emerald-400',
      textSubtle: 'text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      bar: 'bg-emerald-400/80',
      icon: 'text-emerald-400',
      borderActive: 'border-emerald-400 bg-emerald-950/20',
    },
    purple: {
      text: 'text-purple-400',
      textSubtle: 'text-purple-300',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      bar: 'bg-purple-400/80',
      icon: 'text-purple-400',
      borderActive: 'border-purple-400 bg-purple-950/20',
    },
    amber: {
      text: 'text-amber-400',
      textSubtle: 'text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      bar: 'bg-amber-400/80',
      icon: 'text-amber-400',
      borderActive: 'border-amber-400 bg-amber-950/20',
    },
  };

  const accent = themeStyles[theme] || themeStyles.cyan;

  const presets: PresetOption[] = [
    {
      id: 'consistent-daily',
      name: 'Consistent Daily',
      tagline: 'Balanced activity distribution',
      description: 'Maintain steady, predictable contribution activity every single day of the week.',
      ruleDetail: 'Same commit count for all days between schedule dates.',
      patternSummary: 'Fixed Daily Count · All Days',
      icon: CalendarCheck,
      visualBars: [4, 4, 4, 4, 4, 4, 4],
    },
    {
      id: 'weekday-shift',
      name: 'Weekday Shift',
      tagline: 'Standard Monday-Friday workflow',
      description: 'Concentrate engineering activity during business days with restful weekends.',
      ruleDetail: 'Random commits (min to max) from Mon–Fri, 0 on weekends.',
      patternSummary: 'Mon–Fri Focus · Zero Weekends',
      icon: Briefcase,
      visualBars: [5, 5, 5, 5, 5, 0, 0],
    },
    {
      id: 'weekend-warrior',
      name: 'Weekend Warrior',
      tagline: 'Weekend coding sprint',
      description: 'Heavy activity bursts on Saturdays and Sundays for side-project builders.',
      ruleDetail: 'Random commits (min to max) on Sat & Sun, 0 on weekdays.',
      patternSummary: 'Sat–Sun Heavy · Zero Weekdays',
      icon: Zap,
      visualBars: [0, 0, 0, 0, 0, 6, 6],
    },
    {
      id: 'random-burst',
      name: 'Random Burst',
      tagline: 'Organic variable frequency',
      description: 'Simulate high-realism open-source activity with unpredictable peak days.',
      ruleDetail: 'Random commits (min to max) whole week for all days.',
      patternSummary: 'Dynamic · Whole Week',
      icon: Sparkles,
      visualBars: [2, 6, 1, 4, 3, 5, 2],
    },
    {
      id: 'light-touch',
      name: 'Light Touch',
      tagline: 'Minimal steady presence',
      description: 'Low-volume touchpoints designed for steady maintenance streaks.',
      ruleDetail: 'Random 1, 2, or 3 commits whole week for all days.',
      patternSummary: 'Minimal 1–3 Commits · All Days',
      icon: Feather,
      visualBars: [1, 2, 3, 1, 2, 1, 3],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-white">Preset Strategy Cards</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">1-Click Automated Cadence Algorithms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedPreset === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`glass-panel rounded-xl p-5 cursor-pointer relative flex flex-col justify-between space-y-4 transition-all duration-300 ${
                isSelected
                  ? `${accent.borderActive} border-2 shadow-2xl scale-[1.02] ring-1 ring-offset-0`
                  : 'glass-panel-hover opacity-60 hover:opacity-90 hover:border-white/20'
              }`}
              style={isSelected ? {
                boxShadow: `0 0 28px -4px var(--accent-glow), 0 4px 20px rgba(0,0,0,0.4)`,
              } : undefined}
            >
              {/* Active glow overlay */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, var(--accent-glow) 0%, transparent 60%)`,
                    opacity: 0.07,
                  }}
                />
              )}

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? `bg-white/10 border-2 ${accent.icon}`
                      : `bg-white/5 border border-white/10 ${accent.icon}`
                    }`}
                    style={isSelected ? { borderColor: 'var(--accent-border)' } : undefined}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${accent.badge} animate-pulse`}
                      style={{ animationDuration: '3s' }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className={`font-display font-bold text-base ${isSelected ? 'text-white' : 'text-gray-300'}`}>{preset.name}</h4>
                  <p className={`text-xs font-mono mt-0.5 ${isSelected ? accent.text : 'text-gray-500'}`}>{preset.tagline}</p>
                </div>

                <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>{preset.description}</p>

                {/* Rule Execution Notice */}
                <div className={`p-2.5 rounded-lg text-[11px] font-mono ${
                  isSelected
                    ? 'bg-white/[0.06] border border-white/15 text-gray-200'
                    : 'bg-white/[0.03] border border-white/10 text-gray-400'
                }`}>
                  <span className={`${accent.text} font-semibold block uppercase text-[9px] tracking-wider mb-0.5`}>Commit Execution Rule</span>
                  {preset.ruleDetail}
                </div>
              </div>

              {/* Visual Pattern Bar Graph */}
              <div className="pt-3 border-t border-white/10 space-y-2 relative z-10">
                <div className="flex items-end justify-between gap-1.5 h-8 px-2 py-1 bg-black/40 rounded-lg border border-white/5">
                  {preset.visualBars.map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-xs transition-all duration-300 ${
                        isSelected
                          ? (val > 0 ? accent.bar : 'bg-gray-800/40')
                          : (val > 0 ? 'bg-gray-600/40' : 'bg-gray-800/30')
                      }`}
                      style={{ height: val > 0 ? `${(val / 6) * 100}%` : '15%' }}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-mono block text-center uppercase tracking-wider ${
                  isSelected ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {preset.patternSummary}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
