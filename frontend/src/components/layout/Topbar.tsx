'use client';

import React, { useEffect, useState } from 'react';
import { useTheme, ThemeAccent } from '@/context/ThemeContext';
import { Search, Github, LogOut } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

interface TopbarProps {
  onOpenCommandPalette: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenCommandPalette }) => {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then((res) => {
        if (res.data && res.data.authenticated) {
          setUser(res.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post('/api/auth/signout');
    } catch (err) {}
    window.location.href = '/login';
  };

  const themes: { id: ThemeAccent; label: string; bg: string }[] = [
    { id: 'cyan', label: 'Electric Cyan', bg: 'bg-cyan-400' },
    { id: 'emerald', label: 'Matrix Emerald', bg: 'bg-emerald-400' },
    { id: 'purple', label: 'Cyber Purple', bg: 'bg-purple-400' },
    { id: 'amber', label: 'Solar Gold', bg: 'bg-amber-400' },
  ];

  return (
    <header className="sticky top-0 z-10 glass-panel border-b border-white/10 px-6 py-3 flex items-center justify-between backdrop-blur-md">
      {/* Left: Command Search */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 text-gray-400 text-sm transition-all group w-64"
      >
        <Search className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
        <span className="flex-1 text-left text-xs font-mono text-gray-400">Search GitStreak...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white/10 rounded border border-white/10">⌘K</kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Accent Switcher */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/10" title="Switch Theme Accent">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${t.bg} ${
                theme === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              title={t.label}
            />
          ))}
        </div>

        {/* User Status & Sign Out */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <Link href="/settings" className="flex items-center gap-2 hover:opacity-90 transition">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.login} className="w-7 h-7 rounded-full border border-white/20" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  {user.login ? user.login[0].toUpperCase() : 'U'}
                </div>
              )}
              <span className="text-xs font-mono font-medium text-gray-200">@{user.login}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition ml-1"
              title="Sign Out of GitHub"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl accent-glow-button text-xs font-bold transition-all shadow-md"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Connect GitHub</span>
          </Link>
        )}
      </div>
    </header>
  );
};
