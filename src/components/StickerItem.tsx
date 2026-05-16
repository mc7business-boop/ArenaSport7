/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sticker, StickerCategory } from '../types.ts';
import { Check, Plus, Minus, Star } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { motion } from 'motion/react';

interface StickerItemProps {
  sticker: Sticker;
  onToggle: (id: string) => void;
  onAddQuantity: (id: string, amount: number) => void;
}

export const StickerItem: React.FC<StickerItemProps> = ({ sticker, onToggle, onAddQuantity }) => {
  const isSpecial = sticker.category !== StickerCategory.NORMAL;
  const isMythical = sticker.rarity === 'Mythical';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border-2 p-3 transition-all duration-300",
        sticker.owned 
          ? isMythical
            ? "border-purple-500 bg-gradient-to-br from-slate-900 to-purple-900 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            : isSpecial 
              ? "border-yellow-500/50 bg-gradient-to-br from-slate-900 to-amber-900 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
              : "border-blue-500/50 bg-slate-900" 
          : "border-slate-800/40 bg-slate-900/40"
      )}
    >
      {/* Rarity Star */}
      {isSpecial && (
        <div className={cn("absolute left-3 top-3", isMythical ? "text-purple-400" : "text-yellow-500")}>
          <Star size={12} fill="currentColor" className="animate-pulse" />
        </div>
      )}

      {/* Badge for repeated */}
      {(sticker.quantity ?? 0) > 1 && (
        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-lg bg-white text-[9px] font-black text-black shadow-lg">
          {sticker.quantity}
        </div>
      )}

      {/* Team ID */}
      <div className="mb-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">
        {sticker.teamId}
      </div>

      {/* Number */}
      <div className={cn(
        "text-2xl font-black italic tracking-tighter leading-none mb-2",
        sticker.owned 
          ? isMythical ? "text-purple-200" : "text-white" 
          : "text-slate-800"
      )}>
        {sticker.number}
      </div>

      {/* Name */}
      <div className={cn(
        "text-[8px] font-bold uppercase tracking-tight text-center truncate w-full mb-3",
        sticker.owned ? "text-slate-400" : "text-slate-700"
      )}>
        {sticker.player}
      </div>

      {/* Actions */}
      <div className="flex w-full items-center justify-center gap-1 mt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onAddQuantity(sticker.id, -1); }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 text-slate-500 hover:text-red-500 transition-colors backdrop-blur-sm active:scale-90"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(sticker.id); }}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl transition-all shadow-xl active:scale-95",
            sticker.owned ? "bg-white text-black" : "bg-yellow-500 text-black border-2 border-yellow-400"
          )}
        >
          {sticker.owned ? <Check size={18} strokeWidth={4} /> : <Plus size={18} strokeWidth={4} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAddQuantity(sticker.id, 1); }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 text-slate-500 hover:text-blue-500 transition-colors backdrop-blur-sm active:scale-90"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
      
      {/* Glow effect for special */}
      {isSpecial && sticker.owned && (
        <div className={cn(
          "absolute inset-0 pointer-events-none opacity-20",
          isMythical ? "bg-purple-500" : "bg-yellow-500"
        )}></div>
      )}
    </motion.div>
  );
};
