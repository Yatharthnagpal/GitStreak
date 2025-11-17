'use client';

import React, { useState } from 'react';
import { Github, KeyRound, ShieldCheck, Calendar, Sparkles, ArrowRight, Lock, CheckCircle2, Cpu, GitBranch } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const AuthHero: React.FC = () => {
  const router = useRouter();
  const [showPatInput, setShowPatInput] = useState(false);
  const [patToken, setPatToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patToken.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post('/api/auth/pat', { token: patToken.trim() });
      setLoading(false);
      if (res.data && res.data.status === 'ok') {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.detail || 'Failed to authenticate Personal Access Token.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Central Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>⚡ GitStreak — Precision GitHub Contribution Engine</span>
        </div>

        <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-tight">
          Master Your GitHub Legacy & Contribution Cadence.
        </h1>

        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Connect your GitHub account to engineer high-precision contribution streaks, preview live 52-week activity heatmaps, and execute backdated commit schedules with 5 automated strategy algorithms.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="glass-panel rounded-3xl p-8 space-y-6 border border-white/15 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left Column: Primary Actions */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Connect Your GitHub Account</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Authenticate using official OAuth 2.0 to grant repository commit access. Zero passwords or sensitive credentials stored.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="/api/auth/github"
                className="w-full py-3.5 px-6 rounded-xl accent-glow-button text-sm font-bold flex items-center justify-center gap-3 shadow-xl transition group"
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub OAuth</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={() => setShowPatInput(!showPatInput)}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-gray-300 border border-white/10 flex items-center justify-center gap-2 transition"
              >
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>{showPatInput ? 'Hide Token Input' : 'Use Personal Access Token (PAT)'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: PAT Token Dropdown / Security Banner */}
          <div>
            {showPatInput ? (
              <form onSubmit={handlePatSubmit} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-semibold text-purple-300 block">Personal Access Token Sign-In</span>
                <p className="text-[11px] text-gray-400">
                  Generate a GitHub token with <code className="text-cyan-300 font-mono">repo</code> scope.
                </p>
                <input
                  type="password"
                  value={patToken}
                  onChange={(e) => setPatToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-purple-400/50"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold transition border border-purple-500/30"
                >
                  {loading ? 'Authenticating Token...' : 'Sign In with Token'}
                </button>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">OAuth 2.0 Security Protected</h4>
                    <span className="text-[11px] font-mono text-gray-400">Official Handshake & Privacy First</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Direct GitHub OAuth 2.0 Authentication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ID-based noreply email graph attribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>True historical Git tree & blob backdating</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-display font-bold text-sm text-white">Zero Password Storage</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your GitHub password is never stored or transmitted. Direct OAuth session handshake.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="font-display font-bold text-sm text-white">5 Cadence Algorithms</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Consistent Daily, Weekday Shift, Weekend Warrior, Random Burst, and Light Touch streaks.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
            <GitBranch className="w-4 h-4" />
          </div>
          <h4 className="font-display font-bold text-sm text-white">True Git API Depth</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Direct integration with GitHub REST Git Database APIs for true historical graph backdating.
          </p>
        </div>
      </div>
    </div>
  );
};
