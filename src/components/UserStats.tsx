'use client';

import { Trophy, Star, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStatsProps {
    xp: number;
    level: number;
    currency: number;
}

export default function UserStats({ xp, level, currency }: UserStatsProps) {
    const xpInCurrentLevel = xp % 1000;
    const progress = (xpInCurrentLevel / 1000) * 100;

    return (
        <div className="flex items-center gap-5 bg-white/40 dark:bg-[#111C44]/40 backdrop-blur-xl px-6 py-3 rounded-[24px] border border-slate-200/50 dark:border-white/10 shadow-xl shadow-indigo-500/10 group/stats overflow-hidden relative">
            {/* Background Ambient Glow */}
            <div className="absolute -left-10 -top-10 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full" />

            {/* Level Badge */}
            <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                <motion.div
                    animate={{ rotate: [12, -5, 12] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-tr from-[#4318FF] via-[#7C3AED] to-[#00E5FF] rounded-[14px] shadow-lg shadow-[#4318FF]/30"
                />
                <span className="relative text-xl font-black text-white leading-none drop-shadow-md">{level}</span>
                <div className="absolute -top-1.5 -right-1.5">
                    <div className="relative">
                        <Trophy className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-bounce" style={{ animationDuration: '4s' }} />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-amber-400 blur-sm rounded-full -z-10"
                        />
                    </div>
                </div>
            </div>

            {/* XP Info & Progress */}
            <div className="flex flex-col gap-2 min-w-[140px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Progression</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-[11px] font-black text-slate-800 dark:text-white tabular-nums">{xpInCurrentLevel}</span>
                        <span className="text-[9px] font-bold text-slate-400">/ 1000</span>
                        <span className="text-[8px] font-black text-[var(--primary)] ml-1 bg-[var(--primary)]/10 px-1 rounded">XP</span>
                    </div>
                </div>
                <div className="h-3 w-full bg-slate-200/40 dark:bg-white/5 rounded-full overflow-hidden p-[3px] border border-slate-200/50 dark:border-white/5">
                    <div className="h-full w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-[#4318FF] via-[#00E5FF] to-[#4318FF] bg-[length:200%_100%] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.4)] relative"
                        >
                            <motion.div
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent hidden sm:block" />

            {/* Currency Pill */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl border border-amber-200/50 dark:border-amber-500/20 shadow-inner group/coin cursor-pointer"
            >
                <div className="relative">
                    <Coins className="w-6 h-6 text-amber-500 group-hover/coin:rotate-[360deg] transition-transform duration-1000 ease-in-out" />
                    <Star className="absolute -top-1.5 -right-1.5 w-3 h-3 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-lg font-black text-amber-700 dark:text-amber-400 tabular-nums tracking-tighter">{currency}</span>
                    <span className="text-[8px] font-black uppercase text-amber-600/50 dark:text-amber-400/50 tracking-widest mt-0.5">Credits</span>
                </div>
            </motion.div>
        </div>
    );
}
