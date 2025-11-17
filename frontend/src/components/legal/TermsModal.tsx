'use client';

import React from 'react';
import { X, ShieldCheck, ExternalLink, FileText, Lock, Heart } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 border border-white/15 shadow-2xl relative overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Terms & Conditions</h2>
              <span className="text-[11px] font-mono text-gray-400">GitStreak Contribution Engine</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto space-y-5 text-xs text-gray-300 pr-2 leading-relaxed font-mono">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Official Usage Agreement & Privacy Safeguard</span>
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
              GitStreak authenticates directly with GitHub via official OAuth 2.0 or Personal Access Token (PAT) handshakes. Your GitHub account passwords are never requested, stored, or transmitted to intermediate servers. Access tokens are kept in encrypted HTTP-only session storage.
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

          <section className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              Creator & Portfolio Attribution
            </h3>
            <p className="text-gray-300">
              GitStreak is designed and engineered with care by <strong className="text-white">Yatharth Nagpal</strong>.
            </p>
            <a
              href="https://github.com/Yatharthnagpal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold underline transition text-xs"
            >
              <span>View Portfolio & GitHub Profile (@Yatharthnagpal)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-gray-500">GitStreak Engine v2.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl accent-glow-button text-xs font-bold"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
