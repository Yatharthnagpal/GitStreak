'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useTheme, ThemeAccent } from '@/context/ThemeContext';
import { Github, KeyRound, ShieldCheck, Palette, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [patToken, setPatToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data && res.data.authenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePatLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patToken.trim()) return;
    setLoading(true);
    setMsg(null);

    try {
      const res = await axios.post('/api/auth/pat', { token: patToken.trim() });
      setLoading(false);
      if (res.data && res.data.status === 'ok') {
        setMsg({ type: 'success', text: `Authenticated successfully as @${res.data.user.login}!` });
        setUser(res.data.user);
        setPatToken('');
      }
    } catch (err: any) {
      setLoading(false);
      const text = err.response?.data?.detail || 'Failed to authenticate PAT token.';
      setMsg({ type: 'error', text });
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post('/api/auth/signout');
    } catch (err) {}
    setUser(null);
    window.location.href = '/login';
  };

  const themeList: { id: ThemeAccent; name: string; bg: string }[] = [
    { id: 'cyan', name: 'Electric Cyan', bg: 'bg-cyan-400' },
    { id: 'emerald', name: 'Matrix Emerald', bg: 'bg-emerald-400' },
    { id: 'purple', name: 'Cyber Purple', bg: 'bg-purple-400' },
    { id: 'amber', name: 'Solar Gold', bg: 'bg-amber-400' },
  ];

  return (
    <AppShell>
      <div className="border-b border-white/10 pb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Settings & Account</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">
          GitHub Authentication & UI Theme Configuration
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-mono border ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-6">
        {/* GitHub Auth Section */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-base text-white">GitHub Connection State</h3>
          </div>

          {user ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Connected as @{user.login}</h4>
                  <p className="text-xs text-gray-400 font-mono">
                    ID Email: {user.email || `${user.id}+${user.login}@users.noreply.github.com`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of GitHub</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-display font-bold text-sm text-white">Not Connected</h4>
                <p className="text-xs text-gray-400">Sign in via GitHub OAuth 2.0 or Personal Access Token below.</p>
              </div>
            </div>
          )}

          {/* Connect Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <a
              href="/api/auth/github"
              className="py-3 px-4 rounded-xl accent-glow-button text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Github className="w-4 h-4" />
              <span>Connect via GitHub OAuth</span>
            </a>

            <form onSubmit={handlePatLogin} className="flex gap-2">
              <input
                type="password"
                value={patToken}
                onChange={(e) => setPatToken(e.target.value)}
                placeholder="Personal Access Token (ghp_...)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-mono font-bold border border-purple-500/30 transition shrink-0"
              >
                {loading ? 'Validating...' : 'Submit PAT'}
              </button>
            </form>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-bold text-base text-white">Accent Theme Customization</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themeList.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border flex items-center gap-3 transition ${
                  theme === t.id
                    ? 'accent-bg-active accent-border-active border-2 font-bold'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${t.bg}`} />
                <span className="text-xs font-mono text-white">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
