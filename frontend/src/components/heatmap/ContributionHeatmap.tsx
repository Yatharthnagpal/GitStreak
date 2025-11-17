'use client';

import React, { useState, useMemo } from 'react';
import { HeatmapInspector } from './HeatmapInspector';

interface HeatmapDay {
  date: string;
  count: number;
  intensity: number; // 0 to 4
  color?: string;
}

interface ContributionHeatmapProps {
  customDays?: HeatmapDay[];
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ customDays }) => {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  // Generate 52 weeks (364 days) data if customDays not provided
  const days: HeatmapDay[] = useMemo(() => {
    if (customDays && customDays.length > 0) return customDays;

    const result: HeatmapDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const count = Math.random() > 0.35 ? Math.floor(Math.random() * 12) : 0;
      let intensity = 0;
      if (count > 0) {
        if (count <= 2) intensity = 1;
        else if (count <= 5) intensity = 2;
        else if (count <= 8) intensity = 3;
        else intensity = 4;
      }

      result.push({ date: dateStr, count, intensity });
    }
    return result;
  }, [customDays]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Official GitHub Emerald Green Color Palette
  const getIntensityStyle = (intensity: number, customColor?: string) => {
    if (customColor && customColor !== '#161b22' && customColor !== '#ebedf0' && customColor !== '#9be9a8') {
      return ''; // Inline style handles exact hex color
    }
    switch (intensity) {
      case 1:
        return 'bg-[#0e4429] border-[#006d32] text-emerald-400';
      case 2:
        return 'bg-[#006d32] border-[#26a641] text-emerald-300';
      case 3:
        return 'bg-[#26a641] border-[#39d353] text-slate-950 shadow-sm shadow-emerald-500/20';
      case 4:
        return 'bg-[#39d353] border-[#56fca2] text-slate-950 font-bold shadow-md shadow-emerald-400/40';
      default:
        return 'bg-[#161b22] border-white/[0.06] hover:border-white/20';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-white">Contribution Activity</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">52-Week Official GitHub Contribution Grid</p>
        </div>

        {/* Legend matching GitHub's official green shades */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-white/[0.06]" title="0 contributions" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429] border border-[#006d32]" title="1-2 contributions" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32] border border-[#26a641]" title="3-5 contributions" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641] border border-[#39d353]" title="6-8 contributions" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353] border border-[#56fca2]" title="9+ contributions" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px]">
          {/* Month Labels */}
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-2 px-1">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* 7 rows x 52 columns grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1.5">
            {days.map((day, idx) => (
              <button
                key={day.date + idx}
                onClick={() => setSelectedDay(day)}
                style={
                  day.color && day.color !== '#161b22' && day.color !== '#ebedf0'
                    ? { backgroundColor: day.color, borderColor: day.color }
                    : {}
                }
                className={`w-3.5 h-3.5 rounded-sm border transition-all hover:scale-125 hover:z-10 focus:outline-none ${getIntensityStyle(
                  day.intensity,
                  day.color
                )}`}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slide-over Inspection Drawer */}
      <HeatmapInspector selectedDay={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  );
};
