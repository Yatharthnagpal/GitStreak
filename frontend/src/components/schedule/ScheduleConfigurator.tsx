'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Sliders, FolderGit2, GitBranch, ArrowRight, Loader2, Lock, Globe, PlusCircle } from 'lucide-react';
import { ScheduleReviewModal } from './ScheduleReviewModal';
import { PresetSelector } from '../presets/PresetSelector';
import axios from 'axios';

interface RepoOption {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  default_branch: string;
}

interface ScheduleConfiguratorProps {
  initialPresetId?: string;
}

export const ScheduleConfigurator: React.FC<ScheduleConfiguratorProps> = ({ initialPresetId = 'consistent-daily' }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultStart = new Date(Date.now() - 14 * 86400 * 1000).toISOString().split('T')[0];

  const [presetId, setPresetId] = useState(initialPresetId);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(todayStr);
  const [dailyCount, setDailyCount] = useState(5);
  const [minDaily, setMinDaily] = useState(1);
  const [maxDaily, setMaxDaily] = useState(8);
  const [timeJitterMinutes, setTimeJitterMinutes] = useState(30);
  const [filterMode, setFilterMode] = useState('all');
  const [branch, setBranch] = useState('main');
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('APP_Commit');
  const [targetFilePath, setTargetFilePath] = useState('commit-log.json');
  const [commitMessagePattern, setCommitMessagePattern] = useState('conventional');

  // Repositories State
  const [userRepos, setUserRepos] = useState<RepoOption[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [isCustomRepo, setIsCustomRepo] = useState(false);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch GitHub Repositories for Authenticated User
  useEffect(() => {
    axios.get('/api/auth/repos')
      .then((res) => {
        setLoadingRepos(false);
        if (res.data && Array.isArray(res.data.repos)) {
          const list: RepoOption[] = res.data.repos;
          setUserRepos(list);
          if (list.length > 0) {
            // Auto-select first repo
            setRepoName(list[0].name);
            setRepoOwner(list[0].owner);
            setBranch(list[0].default_branch || 'main');
          }
        }
      })
      .catch(() => {
        setLoadingRepos(false);
        setIsCustomRepo(true);
      });
  }, []);

  const handleRepoSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomRepo(true);
      setRepoName('');
    } else {
      setIsCustomRepo(false);
      const selected = userRepos.find((r) => r.name === val || r.full_name === val);
      if (selected) {
        setRepoName(selected.name);
        setRepoOwner(selected.owner);
        setBranch(selected.default_branch || 'main');
      } else {
        setRepoName(val);
      }
    }
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setReviewOpen(true);
  };

  const handleExecuteSchedule = async () => {
    setLoading(true);
    setStatusMessage(null);
    const startTime = Date.now();

    try {
      const payload = {
        presetId,
        startDate,
        endDate,
        dailyCount,
        minDaily,
        maxDaily,
        timeJitterMinutes,
        filterMode,
        branch,
        repoOwner,
        repoName,
        targetFilePath,
        commitMessagePattern,
      };

      const res = await axios.post('/api/commits/schedule', payload);
      const executionTime = ((Date.now() - startTime) / 1000).toFixed(1);
      setLoading(false);
      setReviewOpen(false);

      if (res.data && res.data.status === 'success') {
        setStatusMessage({
          type: 'success',
          text: `⚡ Execution Completed in ${executionTime}s! ${res.data.message || `Successfully committed and backdated ${res.data.totalCommits} commits!`}`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.data.detail || 'Failed to complete commit schedule.',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setReviewOpen(false);
      let msg = err.response?.data?.detail;
      if (typeof msg !== 'string') {
        msg = err.message || 'An error occurred during schedule execution.';
      }
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const calculateEstimatedSeconds = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

      let estCommits = diffDays * dailyCount;
      if (presetId === 'weekday-shift') {
        estCommits = Math.ceil(diffDays * 0.7 * ((minDaily + maxDaily) / 2));
      } else if (presetId === 'weekend-warrior') {
        estCommits = Math.ceil(diffDays * 0.3 * ((minDaily + maxDaily) / 2));
      } else if (presetId === 'random-burst') {
        estCommits = Math.ceil(diffDays * ((minDaily + maxDaily) / 2));
      } else if (presetId === 'light-touch') {
        estCommits = Math.ceil(diffDays * 2);
      }

      return Math.max(5, Math.ceil(estCommits * 0.6));
    } catch {
      return 15;
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Strategy Cards */}
      <PresetSelector selectedPreset={presetId} onSelectPreset={setPresetId} />

      {/* Main Configurator Workspace */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Schedule Parameters & Realism Workspace</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Active Strategy: <span className="text-cyan-400 font-bold uppercase">{presetId}</span>
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-mono border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleOpenReview} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Dates */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>End Date</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>

            {/* Commit Volume Controls depending on Preset */}
            {presetId === 'consistent-daily' ? (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fixed Daily Commit Count</span>
                  </span>
                  <span className="text-white font-bold font-mono">{dailyCount} / day</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={dailyCount}
                  onChange={(e) => setDailyCount(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            ) : presetId === 'light-touch' ? (
              <div className="space-y-2 p-3 rounded-lg bg-white/[0.03] border border-white/10">
                <span className="text-xs font-mono uppercase text-purple-300 block">Light Touch Mode</span>
                <p className="text-xs text-gray-300 font-mono">
                  Random commits of 1, 2, or 3 per day for all days between start and end dates.
                </p>
              </div>
            ) : (
              /* Min/Max Random Range for weekday-shift, weekend-warrior, random-burst */
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Random Commit Range</span>
                  </span>
                  <span className="text-white font-bold font-mono">{minDaily} to {maxDaily} / active day</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-gray-500 block mb-1">MIN</span>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={minDaily}
                      onChange={(e) => setMinDaily(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-gray-500 block mb-1">MAX</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={maxDaily}
                      onChange={(e) => setMaxDaily(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Time Jitter Slider */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Human Time Jitter</span>
                </span>
                <span className="text-white font-bold font-mono">±{timeJitterMinutes} min</span>
              </label>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={timeJitterMinutes}
                onChange={(e) => setTimeJitterMinutes(Number(e.target.value))}
                className="w-full accent-purple-400 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Target Repository Select Dropdown Panel */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Target Repository</span>
                </span>
                {loadingRepos && <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />}
              </label>

              {!isCustomRepo && userRepos.length > 0 ? (
                <div className="relative">
                  <select
                    value={repoName}
                    onChange={handleRepoSelectChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E131B] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400/50 appearance-none cursor-pointer"
                  >
                    {userRepos.map((repo) => (
                      <option key={repo.id} value={repo.name} className="bg-[#0E131B] text-white">
                        {repo.private ? '🔒' : '🌐'} {repo.full_name} (branch: {repo.default_branch})
                      </option>
                    ))}
                    <option value="__custom__" className="bg-[#0E131B] text-amber-300 font-bold">
                      ➕ Enter Custom Repository Name...
                    </option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. APP_Commit"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-400/50"
                    required
                  />
                  {userRepos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomRepo(false)}
                      className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      ← Back to Repository Select Panel
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Target Branch */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Branch</span>
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
                required
              />
            </div>
          </div>

          {/* Submit Step 1 -> Open Review Modal */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl accent-glow-button font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <span>Review Schedule & Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Step 2 Review Modal */}
        <ScheduleReviewModal
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          onConfirm={handleExecuteSchedule}
          loading={loading}
          estimatedSeconds={calculateEstimatedSeconds()}
          config={{
            startDate,
            endDate,
            dailyCount,
            jitterMinutes: timeJitterMinutes,
            filterMode,
            branch,
            repoOwner: repoOwner || '',
            repoName,
            targetFilePath,
            presetName: presetId,
          }}
        />
      </div>
    </div>
  );
};
