'use client';

import React from 'react';
import { X, GitCommit, GitPullRequest, Code2, FolderGit2 } from 'lucide-react';

interface SelectedDayData {
  date: string;
  count: number;
  commits?: number;
  prs?: number;
  reviews?: number;
}

interface HeatmapInspectorProps {
  selectedDay: SelectedDayData | null;
  onClose: () => void;
}

export const HeatmapInspector: React.FC<HeatmapInspectorProps> = ({ selectedDay, onClose }) => {
  if (!selectedDay) return null;

  const formattedDate = new Date(selectedDay.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const commitsCount = selectedDay.commits ?? Math.round(selectedDay.count * 0.7);
  const prsCount = selectedDay.prs ?? Math.round(selectedDay.count * 0.2);
  const reviewsCount = selectedDay.reviews ?? Math.max(0, selectedDay.count - commitsCount - prsCount);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Day Activity Inspection</h3>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">{formattedDate}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metric Overview */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Contribution Volume</span>
              <div className="text-3xl font-mono font-bold text-white mt-1">{selectedDay.count}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg font-mono">
              ⚡
            </div>
          </div>

          {/* Activity Breakdown List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider">Activity Breakdown</h4>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <GitCommit className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-200">Commits</span>
              </div>
              <span className="font-mono text-sm font-bold text-white">{commitsCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-gray-200">Pull Requests</span>
              </div>
              <span className="font-mono text-sm font-bold text-white">{prsCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-200">Code Reviews</span>
              </div>
              <span className="font-mono text-sm font-bold text-white">{reviewsCount}</span>
            </div>
          </div>

          {/* Target Repositories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider">Target Repository</h4>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <FolderGit2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-gray-300">APP_Commit / main</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-semibold text-white transition border border-white/10"
          >
            Close Inspection Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
