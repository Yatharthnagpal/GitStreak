'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ScheduleConfigurator } from '@/components/schedule/ScheduleConfigurator';

export default function SchedulePage() {
  return (
    <AppShell>
      <div className="border-b border-white/10 pb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Schedule Configurator</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">
          Precision Activity Planning & Historical Backdating Workspace
        </p>
      </div>

      <ScheduleConfigurator />
    </AppShell>
  );
}
