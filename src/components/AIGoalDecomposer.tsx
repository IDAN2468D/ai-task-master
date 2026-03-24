'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, Loader2, Plus, X } from 'lucide-react';
import { decomposeGoal } from '@/actions/taskActions';

export default function AIGoalDecomposer({ onGoalDecomposed }: { onGoalDecomposed: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [isDecomposing, setIsDecomposing] = useState(false);

  const handleDecompose = async () => {
    if (!goalText.trim()) return;
    setIsDecomposing(true);
    try {
      await decomposeGoal(goalText);
      setGoalText('');
      setIsOpen(false);
      onGoalDecomposed();
    } catch (error) {
      console.error('Failed to decompose goal:', error);
    } finally {
      setIsDecomposing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/20 transition-all"
        dir="rtl"
      >
        <Sparkles size={18} />
        <span className="font-medium text-sm">מפרק מטרות AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <Target size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">מפרק מטרות חכם</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  יש לך מטרה גדולה? תאר אותה כאן, וה-AI יפרק אותה אוטומטית למשימות קטנות, ברורות, עם תאריכי יעד וסדרי עדיפויות מומלצים.
                </p>
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="לדוגמה: אני רוצה לבנות אפליקציה לניהול משימות עד סוף החודש..."
                  className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleDecompose}
                    disabled={isDecomposing || !goalText.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    {isDecomposing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>מנתח ומייצר משימות...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>פרק למשימות קטנות</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
