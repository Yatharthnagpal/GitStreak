'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthHero } from '@/components/auth/AuthHero';
import { Flame } from 'lucide-react';

export default function HomeLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then((res) => {
        if (res.data && res.data.authenticated) {
          setAuthenticated(true);
          router.push('/dashboard');
        } else {
          setAuthenticated(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
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
      {/* Ambient Background Glow Orbs */}
      <div className="glow-orb orb-primary" />
      <div className="glow-orb orb-secondary" />

      {/* Top Bar Branding */}
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
      </header>

      {/* Dedicated Step 1 Login Landing Hero */}
      <main className="max-w-6xl w-full mx-auto z-10 my-8">
        <AuthHero />
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center z-10 py-4 border-t border-white/10 text-xs font-mono text-gray-500">
        GitStreak Precision GitHub Contribution Engine · Created by Yatharth Nagpal
      </footer>
    </div>
  );
}
