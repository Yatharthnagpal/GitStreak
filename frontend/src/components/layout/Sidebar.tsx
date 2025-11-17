'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  CalendarRange, 
  TrendingUp, 
  Settings, 
  Flame,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await axios.post('/api/auth/signout');
    } catch (err) {}
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Schedule', path: '/schedule', icon: CalendarRange },
    { name: 'Insights', path: '/insights', icon: TrendingUp },
  ];

  return (
    <aside
      className={clsx(
        'glass-panel relative z-20 flex flex-col justify-between transition-all duration-300 border-r border-white/10 min-h-screen',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <img 
              src="/gitpulse_logo.png" 
              alt="GitStreak Logo" 
              className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-cyan-500/20 shrink-0 border border-cyan-500/30" 
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-wide text-white">GitStreak</span>
                <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Contribution Engine</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'accent-bg-active accent-border-active border'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={clsx('w-5 h-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-cyan-400' : 'text-gray-400')} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Sign Out */}
      <div className="p-2 border-t border-white/10 mb-4 space-y-1">
        <Link
          href="/settings"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
            pathname === '/settings'
              ? 'accent-bg-active accent-border-active border'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5 shrink-0 text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all group"
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 text-rose-400 group-hover:scale-110 transition-transform" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
