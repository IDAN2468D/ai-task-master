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
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            {/* Level & XP */}
            <div className="flex flex-col gap-1 min-w-[100px]">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-500" /> רמה {level}</span>
                    <span>{xpInCurrentLevel}/1000 XP</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#4318FF] to-[#00E5FF] rounded-full"
                    />
                </div>
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-white/10 hidden sm:block" />

            {/* Currency */}
            <div className="flex items-center gap-2 px-2 py-1 bg-amber-100/50 dark:bg-amber-500/10 rounded-lg border border-amber-200/50 dark:border-amber-500/20">
                <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-black text-amber-700 dark:text-amber-400">{currency}</span>
            </div>
        </div>
    );
}
