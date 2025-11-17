'use client';

import React, { useEffect, useState } from 'react';
import { AuthHero } from '@/components/auth/AuthHero';
import { TermsModal } from '@/components/legal/TermsModal';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Flame, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then((res) => {
        if (res.data && res.data.authenticated) {
          router.push('/dashboard');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        setChecking(false);
      });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#07090C] flex items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="flex items-center gap-3 p-4 rounded-xl glass-panel border border-white/10">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying GitHub Auth Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090C] text-gray-100 flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb orb-primary" />
      <div className="glow-orb orb-secondary" />

      {/* Top Header Logo */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-4">
        <div className="flex items-center gap-3">
          <img 
            src="/gitpulse_logo.png" 
            alt="GitStreak Logo" 
            className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-cyan-500/20 shrink-0 border border-cyan-500/30" 
          />
          <div>
            <span className="font-display font-bold text-lg text-white block">GitStreak</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Contribution Engine</span>
          </div>
        </div>

        <button
          onClick={() => setTermsOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 border border-white/10 flex items-center gap-1.5 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terms & Conditions</span>
        </button>
      </header>

      {/* Main Login Content */}
      <main className="max-w-6xl w-full mx-auto z-10 my-8">
        <AuthHero />
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-3 z-10 py-4 border-t border-white/10 text-xs font-mono text-gray-500">
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
            className="hover:text-gray-300 transition"
          >
            Terms & Conditions
          </button>
          <span>·</span>
          <span>GitStreak Engine v2.0</span>
        </div>
      </footer>

      {/* Terms Modal */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
