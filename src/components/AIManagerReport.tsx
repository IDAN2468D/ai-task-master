'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface AIManagerReportProps {
    report: string;
}

export default function AIManagerReport({ report }: AIManagerReportProps) {
    return (
        <div className="vibrant-card p-8 bg-gradient-to-br from-[#111C44] to-[#0B1437] border-indigo-500/20 shadow-2xl relative overflow-hidden group min-h-[300px] flex flex-col">
            {/* Animated Glow Backdrop */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 blur-[100px] rounded-full -z-10"
            />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <BrainCircuit className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white leading-none">AI Intelligence Report</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-2">ניתוח שבועי מבוסס בינה מלאכותית</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Analysis
                    </span>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent rounded-full opacity-50" />
                    <p className="text-sm font-bold text-slate-300 leading-relaxed pl-2 italic">
                        &quot;{report}&quot;
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/stat">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Peak Performance</span>
                        </div>
                        <p className="text-xs font-bold text-slate-300">הבוקר שלך היה הפרודוקטיבי ביותר.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/stat">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Risk Factor</span>
                        </div>
                        <p className="text-xs font-bold text-slate-300">דחיינות קלה במשימות ניהול.</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    נקה את העומס כדי להגדיל את ה-XP
                </div>
                <button className="flex items-center gap-1 text-[10px] font-black text-white px-4 py-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform active:scale-95">
                    צפה בדו-ח המלא
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
