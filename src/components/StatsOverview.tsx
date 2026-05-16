/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils.ts';
import { motion } from 'motion/react';

import { useI18n } from '../lib/i18n.ts';

interface StatsOverviewProps {
  stats: {
    total: number;
    owned: number;
    missing: number;
    repeated: number;
    percentage: number;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const { t } = useI18n();
  const chartData = [
    { name: 'Possuo', value: stats.owned },
    { name: 'Faltam', value: stats.missing },
  ];

  const cards = [
    { title: t('goal'), value: `${stats.percentage}%`, icon: Trophy, color: 'text-yellow-400 bg-yellow-400/5', border: 'border-yellow-500/20' },
    { title: t('global'), value: stats.owned, icon: CheckCircle, color: 'text-blue-400 bg-blue-400/5', border: 'border-blue-500/20' },
    { title: t('needed'), value: stats.missing, icon: AlertCircle, color: 'text-red-400 bg-red-400/5', border: 'border-red-500/20' },
    { title: t('duplicates'), value: stats.repeated, icon: RefreshCcw, color: 'text-green-400 bg-green-400/5', border: 'border-green-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Stats Hero */}
      <div className="relative overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900/40 p-10 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/50 shadow-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-yellow-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="relative h-64 w-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={450}
                  cornerRadius={10}
                >
                  <Cell key="owned" fill="#EAB308" />
                  <Cell key="missing" fill="rgba(30, 41, 59, 0.1)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <motion.span 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-7xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none"
               >
                 {stats.percentage}
               </motion.span>
               <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-3">{t('pctCompleted')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 w-full">
            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900 dark:text-white italic">{stats.owned}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black">{t('collected')}</p>
            </div>
            <div className="space-y-1 border-l border-slate-200 dark:border-slate-800/80">
              <p className="text-4xl font-black text-slate-400 dark:text-white/40 italic">{stats.missing}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black">{t('missing')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + (i * 0.05) }}
            className={cn(
              "flex flex-col items-start p-6 rounded-[2.5rem] bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:scale-[1.02] shadow-sm dark:shadow-none",
              card.border
            )}
          >
            <div className={cn("mb-4 rounded-2xl p-3", card.color)}>
              <card.icon size={20} />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white italic">{card.value}</span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">{card.title}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
