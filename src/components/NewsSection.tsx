/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_NEWS } from '../constants.ts';
import { Share2, Bookmark, Flame, Calendar, User as UserIcon, ArrowRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

export const NewsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'World Cup', 'Brazil', 'Transfers', 'Panini', 'Rare', 'Market'];

  const filteredNews = MOCK_NEWS.filter(a => filter === 'All' || a.category === filter);
  const featured = filteredNews.find(a => a.featured) || filteredNews[0];
  const trending = filteredNews.filter(a => a.id !== featured?.id);

  if (MOCK_NEWS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-700 mb-4">
          <Calendar size={32} />
        </div>
        <h3 className="text-xl font-black italic uppercase text-slate-500">SEM NOTÍCIAS</h3>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">VOLTE MAIS TARDE PARA ATUALIZAÇÕES</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">MUNDIAL NEWS</h2>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 animate-pulse">
           <Flame size={16} />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              filter === cat 
                ? "bg-white text-black" 
                : "bg-slate-900 text-slate-500 border border-slate-800"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Today Summary */}
      <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">HOJE NA COPA</h3>
           <span className="text-[9px] font-bold text-slate-500 uppercase">16 MAI 2026</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-500 uppercase">JOGOS DE HOJE</span>
              <div className="flex items-center gap-2">
                 <span className="text-xl">🇧🇷</span>
                 <span className="text-[10px] font-black text-white">BRA x FRA</span>
                 <span className="text-[10px] font-bold text-blue-500">20:00</span>
              </div>
           </div>
           <div className="space-y-1 text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase">TRADING TREND</span>
              <div className="flex items-center justify-end gap-2 text-yellow-500">
                 <span className="text-[10px] font-black">NEYMAR #10</span>
                 <TrendingUp size={12} />
              </div>
           </div>
        </div>
      </div>

      {/* Featured Headline */}
      {featured && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelectedArticle(featured)}
          className="group relative h-96 w-full cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl"
        >
          <img 
            src={featured.image} 
            alt={featured.title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 space-y-3">
             <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-3 py-1 text-[8px] font-black uppercase text-black">
               {featured.category}
             </div>
             <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none text-white max-w-sm">
               {featured.title}
             </h3>
             <p className="text-xs text-slate-400 font-medium line-clamp-2 max-w-xs">
               {featured.summary}
             </p>
          </div>
        </motion.div>
      )}

      {/* Trending News */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">ÚLTIMAS NOTÍCIAS</h3>
          <button className="text-[10px] font-black text-blue-500 hover:underline">VER TODAS</button>
        </div>

        <div className="space-y-4">
          {trending.map((article, idx) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedArticle(article)}
              className="flex items-center gap-4 rounded-3xl bg-slate-900/40 border border-slate-800/50 p-4 transition-all hover:bg-slate-800 active:scale-[0.98] cursor-pointer"
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
                <img src={article.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500/80">{article.category}</span>
                <h4 className="text-sm font-black uppercase tracking-tight leading-tight text-slate-200 line-clamp-2">{article.title}</h4>
                <div className="flex items-center gap-3 text-[9px] text-slate-500 font-bold">
                   <span className="flex items-center gap-1"><Calendar size={10} /> 2h atrás</span>
                   <span className="flex items-center gap-1"><UserIcon size={10} /> {article.author}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Detail View */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#06080F]/95 backdrop-blur-xl overflow-y-auto"
          >
             <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#06080F]/80 backdrop-blur-md">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-full bg-slate-800/50 p-3 text-white transition-colors hover:bg-slate-700"
                >
                  <ArrowRight className="rotate-180" size={20} />
                </button>
                <div className="flex gap-4">
                   <button className="text-slate-400 hover:text-white"><Bookmark size={20} /></button>
                   <button className="text-slate-400 hover:text-white"><Share2 size={20} /></button>
                </div>
             </div>

             <div className="mx-auto max-w-lg px-6 pb-20 space-y-8">
                <div className="h-80 w-full overflow-hidden rounded-[2.5rem]">
                  <img src={selectedArticle.image} alt="" className="h-full w-full object-cover" />
                </div>

                <div className="space-y-4">
                  <span className="inline-block rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-black uppercase text-black">
                    {selectedArticle.category}
                  </span>
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-tight text-white">
                    {selectedArticle.title}
                  </h1>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold border-y border-slate-800 py-4">
                     <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                           <UserIcon size={14} />
                        </div>
                        <span>PORTAL COPA</span>
                     </div>
                     <span className="ml-auto">MARÇO 2026</span>
                  </div>
                </div>

                <div className="text-slate-300 font-medium leading-relaxed space-y-6">
                  {selectedArticle.content.split('\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
