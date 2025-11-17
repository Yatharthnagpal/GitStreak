'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GitCommit, GitPullRequest, Code2, Filter, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface ActivityItem {
  id: number;
  time: string;
  type: string;
  repo: string;
  desc: string;
  hash: string;
}

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLogin, setUserLogin] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/stats/activity')
      .then((res) => {
        if (res.data && Array.isArray(res.data.activities)) {
          setActivities(res.data.activities);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    axios.get('/api/auth/me')
      .then((res) => {
        if (res.data && res.data.authenticated) {
          setUserLogin(res.data.user.login);
        }
      })
      .catch(() => {});
  }, []);

  const filteredActivities = activities.filter((a) => filter === 'all' || a.type === filter);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" />
              Chronological Engineering Log
            </span>
            {userLogin && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Connected: @{userLogin}</span>
              </span>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Activity Timeline</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            {userLogin ? `Real GitHub Event Activity Stream for @${userLogin}` : 'Detailed chronological engineering log'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-xl border border-white/10 text-xs font-mono self-start md:self-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
          {['all', 'commit', 'pr', 'review'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md uppercase tracking-wider transition ${
                filter === f ? 'accent-bg-active text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-cyan-400 font-mono text-xs gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Fetching Real GitHub Event Timeline...</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-mono text-xs">
            No events found for this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  {act.type === 'commit' && <GitCommit className="w-5 h-5 text-cyan-400 shrink-0" />}
                  {act.type === 'pr' && <GitPullRequest className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {act.type === 'review' && <Code2 className="w-5 h-5 text-purple-400 shrink-0" />}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white">{act.desc}</span>
                      <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {act.repo}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500 mt-0.5 block">{act.time}</span>
                  </div>
                </div>

                <span className="font-mono text-xs text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40 shrink-0">
                  {act.hash}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
