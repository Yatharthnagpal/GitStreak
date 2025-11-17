'use client';

import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useTheme, ThemeAccent } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  Activity,
  CalendarRange,
  TrendingUp,
  Settings,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  if (!open) return null;

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const changeTheme = (theme: ThemeAccent) => {
    setTheme(theme);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl glass-panel rounded-xl shadow-2xl border border-white/15 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="GitStreak Command Palette" className="w-full">
          <div className="flex items-center px-4 border-b border-white/10">
            <Command.Input
              autoFocus
              placeholder="Type a command or search..."
              className="w-full py-3.5 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none font-mono"
            />
            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">ESC</span>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-xs text-gray-400 font-mono">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[11px] font-mono uppercase text-gray-500 px-2 py-1">
              <Command.Item
                onSelect={() => navigate('/dashboard')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Overview Dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate('/activity')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Activity Timeline</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate('/schedule')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <CalendarRange className="w-4 h-4 text-purple-400" />
                <span>Schedule Configurator</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate('/insights')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Analytics Insights</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate('/settings')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Account & Settings</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Theme Accent Switcher" className="text-[11px] font-mono uppercase text-gray-500 px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => changeTheme('cyan')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <span>Electric Cyan Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => changeTheme('emerald')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span>Matrix Emerald Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => changeTheme('purple')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span>Cyber Purple Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => changeTheme('amber')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
              >
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Solar Gold Theme</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
