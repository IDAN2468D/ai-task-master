'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link as LinkIcon, Mail, MessageSquare, Plus, Loader2, CheckCircle2, X, Sparkles } from 'lucide-react';
import { parseOmniChannelText } from '@/actions/syncActions';
import confetti from 'canvas-confetti';

export default function OmniChannelSync() {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [result, setResult] = useState<{ success?: boolean; tasksCreated?: number; error?: string } | null>(null);

    const handleSync = async () => {
        if (!text.trim()) return;
        setIsParsing(true);
        const res = await parseOmniChannelText(text);
        setResult(res);
        setIsParsing(false);

        if (res.success && res.tasksCreated && res.tasksCreated > 0) {
            confetti({ particleCount: 100 * res.tasksCreated, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setIsOpen(false);
                setResult(null);
                setText('');
            }, 3000);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-xs md:text-sm border border-emerald-500/10 shadow-sm transition-all hover:bg-emerald-500 hover:text-white hover:scale-105 group/sync"
            >
                <Share2 className="w-5 h-5 group-hover/sync:rotate-12 transition-transform" />
                <span className="whitespace-nowrap uppercase tracking-widest leading-none">סנכרון רב-ערוצי</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 dark:border-white/10"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                                            <Share2 className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white">Omni-Channel Sync</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">TEXT-TO-TASK PARSER</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">הדבק טקסט (מיילים, צ'אטים, הערות)</label>
                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="הדבק כאן את הטקסט מהסלאק או מהמייל..."
                                            className="w-full h-40 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                                            dir="rtl"
                                        />
                                        <div className="absolute bottom-4 right-4 flex gap-2">
                                            <Mail className="w-4 h-4 text-slate-300" />
                                            <MessageSquare className="w-4 h-4 text-slate-300" />
                                            <LinkIcon className="w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>

                                    {!result ? (
                                        <button
                                            onClick={handleSync}
                                            disabled={isParsing || !text.trim()}
                                            className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                                        >
                                            {isParsing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    מנתח נתונים...
                                                </div>
                                            ) : (
                                                'סנכרן משימות'
                                            )}
                                        </button>
                                    ) : (
                                        <div className={`p-4 rounded-2xl flex items-center justify-center gap-3 ${result.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {result.success ? (
                                                <>
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    <span className="font-bold">נוצרו {result.tasksCreated} משימות חדשות בהצלחה!</span>
                                                </>
                                            ) : (
                                                <span className="font-bold">שגיאה: {result.error}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/5 p-6 border-t border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                    <Sparkles className="w-4 h-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">AI extracts priorities, categories, and estimated hours automatically.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
