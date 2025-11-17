'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ShieldCheck, Lock, FileText, Heart, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              GitStreak Usage Agreement, Security Policies, and Developer Attribution
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="glass-panel rounded-3xl p-8 space-y-6 border border-white/15 shadow-2xl font-mono text-xs text-gray-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Official Usage Agreement & Safeguard</span>
            </div>
            <p className="text-[11px] text-cyan-300/80">
              By using GitStreak, you agree to these Terms and Conditions regarding GitHub API automation, commit backdating, and security.
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              1. OAuth & Credential Security
            </h3>
            <p className="text-gray-400">
              GitStreak authenticates directly with GitHub via official OAuth 2.0 or Personal Access Token (PAT) handshakes. Your GitHub account passwords are never requested, stored, or transmitted to intermediate servers. Access tokens are stored in encrypted HTTP-only session storage.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              2. Responsible Git Database Execution
            </h3>
            <p className="text-gray-400">
              GitStreak executes true Git tree, blob, and commit operations using GitHub REST Git Database APIs. Users are responsible for selecting appropriate target repositories. All backdated commits enforce human time jitter and rate-limit safety guards to prevent abuse.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              3. Author Attribution & Privacy
            </h3>
            <p className="text-gray-400">
              Commits created by GitStreak are attributed exclusively to your registered GitHub username and ID-based noreply email format (<code className="text-cyan-300">{`{id}+{login}@users.noreply.github.com`}</code>). You maintain complete ownership over all created repositories and commit history.
            </p>
          </section>

          {/* Portfolio & Creator Section */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
              <h3 className="font-display font-bold text-base text-white">
                Powered by Yatharth Nagpal
              </h3>
            </div>
            <p className="text-gray-300">
              GitStreak is designed, developed, and maintained by <strong className="text-white">Yatharth Nagpal</strong>.
            </p>
            <a
              href="https://github.com/Yatharthnagpal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition text-xs"
            >
              <span>Visit Yatharth Nagpal Portfolio & GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
