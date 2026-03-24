'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Loader2, X, CheckCircle2 } from 'lucide-react';
import { extractTasksFromMeeting } from '@/actions/taskActions';

export default function MeetingToTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{count: number} | null>(null);

  const handleExtract = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const res = await extractTasksFromMeeting(transcript);
      setResult({ count: res.count });
    } catch (error) {
      console.error('Failed to extract tasks:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
        dir="rtl"
      >
        <FileText size={18} className="text-violet-400" />
        <span className="font-medium text-sm">סיכום לפגישה → משימות</span>
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
                <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">סיכום אוטומטי ממפגש</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {!result ? (
                    <>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                        הדבק את סיכום הפגישה, קובץ יומן, או רשימת הערות. ה-AI יסרוק את הטקסט, יזהה משימות (Action Items), וייצור אותן במערכת אוטומטית.
                        </p>
                        <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="לדוגמה: יעל תשלח את המצגת עד מחר. הוחלט שדני יערוך את הקוד לגרסה 2.1..."
                        className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none text-slate-800 dark:text-white transition-all placeholder:text-slate-400"
                        />

                        <div className="flex justify-end pt-2">
                        <button
                            onClick={handleExtract}
                            disabled={isProcessing || !transcript.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-lg shadow-violet-500/20"
                        >
                            {isProcessing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>מנתח טקסט...</span>
                            </>
                            ) : (
                            <>
                                <Sparkles size={18} />
                                <span>חלץ משימות והוסף</span>
                            </>
                            )}
                        </button>
                        </div>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center py-6 space-y-4"
                    >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">בדיוק מעולה!</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        המערכת זיהתה וייצרה <strong className="text-violet-600">{result.count}</strong> משימות חדשות מתוך הטקסט שלך.
                    </p>
                    <button
                        onClick={() => {
                            setResult(null);
                            setTranscript('');
                            setIsOpen(false);
                        }}
                        className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-medium transition-colors"
                    >
                        סיום וחזרה ללוח
                    </button>
                    </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
