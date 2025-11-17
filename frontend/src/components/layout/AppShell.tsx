'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { TermsModal } from '../legal/TermsModal';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-[#07090C] text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambient Orbs */}
      <div className="glow-orb orb-primary" />
      <div className="glow-orb orb-secondary" />

      {/* Sidebar Navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Topbar onOpenCommandPalette={() => setCmdOpen(true)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/10 py-6 px-8 max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a
              href="https://github.com/Yatharthnagpal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 hover:underline transition"
            >
              <span>Yatharth Nagpal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-gray-300 flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Terms & Conditions</span>
            </button>
            <span>·</span>
            <span>GitStreak v2.0</span>
          </div>
        </footer>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />

      {/* Terms & Conditions Modal */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};
