/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutGrid, BookOpen, Repeat, Settings, Plus, Newspaper } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { motion } from 'motion/react';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickAdd: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab, onQuickAdd }) => {
  const tabs = [
    { id: 'news', icon: Newspaper, label: 'News' },
    { id: 'trades', icon: Repeat, label: 'Market' },
    { id: 'album', icon: BookOpen, label: 'Album' },
    { id: 'settings', icon: Settings, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around bg-[#06080F]/90 px-2 pb-2 backdrop-blur-2xl border-t border-slate-800/50">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around">
        {tabs.slice(0, 2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all active:scale-90",
              activeTab === tab.id ? "text-yellow-500" : "text-slate-600"
            )}
          >
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}

        {/* Center Scanner Trigger - Doubles as home/overview if clicked differently? 
            Let's keep it as Scan, and Overview is the default land. 
            Wait, I need an 'Overview' tab! 
        */}
        <div className="flex flex-col items-center">
            <button
            onClick={onQuickAdd}
            className="relative -top-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 text-black shadow-[0_4px_24px_rgba(245,158,11,0.4)] border-4 border-[#06080F] active:scale-90 transition-transform"
            >
            <Plus size={28} strokeWidth={3} />
            </button>
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                    "text-[8px] font-black uppercase tracking-widest leading-none",
                    activeTab === 'dashboard' ? "text-yellow-500" : "text-slate-600"
                )}
            >
                HOME
            </button>
        </div>

        {tabs.slice(2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all active:scale-90",
              activeTab === tab.id ? "text-yellow-500" : "text-slate-600"
            )}
          >
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
