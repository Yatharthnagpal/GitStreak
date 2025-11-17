'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PresetSelector } from '@/components/presets/PresetSelector';

export default function PresetsPage() {
  const [selected, setSelected] = useState('consistent-daily');

  return (
    <AppShell>
      <div className="border-b border-white/10 pb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Preset Strategy Library</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">
          Automated Cadence Algorithms for GitHub Contribution Graphing
        </p>
      </div>

      <PresetSelector selectedPreset={selected} onSelectPreset={setSelected} />
    </AppShell>
  );
}
