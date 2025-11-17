'use client';

import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, GitBranch, FolderGit2, AlertCircle, Loader2, Timer } from 'lucide-react';

interface ScheduleReviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  estimatedSeconds?: number;
  config: {
    startDate: string;
    endDate: string;
    dailyCount: number;
    jitterMinutes: number;
    filterMode: string;
    branch: string;
    repoOwner: string;
    repoName: string;
    targetFilePath: string;
    presetName: string;
  };
}

export const ScheduleReviewModal: React.FC<ScheduleReviewModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
  estimatedSeconds = 15,
  config,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(estimatedSeconds);

  useEffect(() => {
    let timer: any = null;
    if (loading) {
      setRemainingSeconds(estimatedSeconds);
      timer = setInterval(() => {
        setRemainingSeconds((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
    } else {
      setRemainingSeconds(estimatedSeconds);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, estimatedSeconds]);

  if (!open) return null;

  const progressPercent = Math.min(
    98,
    Math.max(5, Math.round(((estimatedSeconds - remainingSeconds) / estimatedSeconds) * 100))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel rounded-2xl p-6 border border-white/15 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Review Schedule Before Execution</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Step 2 of 3: Timeline & Cadence Verification</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Summary Table */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-gray-400 uppercase text-[10px] block">Date Window</span>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{config.startDate} → {config.endDate}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-gray-400 uppercase text-[10px] block">Target Repository</span>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{config.repoOwner}/{config.repoName}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-gray-400 uppercase text-[10px] block">Daily Count & Jitter</span>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>{config.dailyCount} commits/day (±{config.jitterMinutes}m jitter)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-gray-400 uppercase text-[10px] block">Branch & Log File</span>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.branch} ({config.targetFilePath})</span>
            </div>
          </div>
        </div>

        {/* Live Reverse Countdown Execution Progress Banner */}
        {loading ? (
          <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 space-y-2.5 font-mono text-xs animate-pulse">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Authoring Historical Git Database Commits...</span>
              </span>
              <span className="text-cyan-300 font-bold bg-cyan-900/90 px-2.5 py-1 rounded border border-cyan-400/50 flex items-center gap-1.5 shadow-sm">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span>⏳ {remainingSeconds}s remaining</span>
              </span>
            </div>
            <div className="w-full bg-cyan-950 rounded-full h-2.5 overflow-hidden border border-cyan-500/30">
              <div
                className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 h-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-cyan-400/80">
              <span>Target: {config.repoOwner}/{config.repoName}</span>
              <span>Estimated Completion in ~{remainingSeconds}s</span>
            </div>
          </div>
        ) : (
          /* Timeline Preview */
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-gray-400 tracking-wider">Sample Backdated Timestamp Cadence</span>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-gray-300 space-y-1.5 max-h-36 overflow-y-auto">
              <div className="flex items-center justify-between text-cyan-300">
                <span>09:14 UTC</span>
                <span>feat(core): update module structure (#1)</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300/90">
                <span>11:32 UTC</span>
                <span>fix(api): resolve edge case in data parser (#2)</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300/80">
                <span>14:05 UTC</span>
                <span>docs(readme): expand setup instructions (#3)</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300/70">
                <span>16:48 UTC</span>
                <span>refactor(store): optimize state updates (#4)</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300/60">
                <span>19:15 UTC</span>
                <span>chore(deps): bump internal packages (#5)</span>
              </div>
            </div>
          </div>
        )}

        {/* Notice Safety Banner */}
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3 text-xs text-cyan-200">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Commits will be authored directly using GitHub REST Git Database API with exact historical ISO timestamps. Your contribution graph will update automatically.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition border border-white/10 disabled:opacity-50"
          >
            Edit Parameters
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg accent-glow-button text-xs font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Git Backdate... (⏳ {remainingSeconds}s left)</span>
              </>
            ) : (
              <span>Confirm & Execute Schedule</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
