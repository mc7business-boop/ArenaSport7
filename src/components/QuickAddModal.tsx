/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n.ts';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: string) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [input, setInput] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input);
    setInput('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl dark:bg-slate-900"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400"
            >
              <X size={20} />
            </button>

            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase italic tracking-tight">{t('quickAddTitle')}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-500 mt-2">
                {t('quickAddDesc')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {t('quickAddExample')}
                </label>
                <textarea
                  autoFocus
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="BRA-1, BRA-2, BRA-3..."
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-lg font-medium text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-800 dark:text-blue-400"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-4 font-black uppercase text-[10px] tracking-widest text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-[0.98]"
              >
                <CheckCircle2 size={20} />
                <span>{t('addToAlbum')}</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
