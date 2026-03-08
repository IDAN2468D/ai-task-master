'use client';

import { Flame, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StreakTracker() {
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('taskflow-streak');
        if (saved) {
            const data = JSON.parse(saved);
            setStreak(data.streak || 0);
            setBestStreak(data.bestStreak || 0);
            setLastActiveDate(data.lastActiveDate || null);

            // Check if streak should continue or reset
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (data.lastActiveDate === today) {
                // Already active today
            } else if (data.lastActiveDate === yesterday) {
                // Continue streak - mark today
                const newStreak = data.streak + 1;
                const newBest = Math.max(newStreak, data.bestStreak || 0);
                setStreak(newStreak);
                setBestStreak(newBest);
                setLastActiveDate(today);
                localStorage.setItem('taskflow-streak', JSON.stringify({ streak: newStreak, bestStreak: newBest, lastActiveDate: today }));
            } else if (data.lastActiveDate !== today) {
                // Streak broken - reset but keep best
                setStreak(1);
                setLastActiveDate(today);
                localStorage.setItem('taskflow-streak', JSON.stringify({ streak: 1, bestStreak: data.bestStreak || 0, lastActiveDate: today }));
            }
        } else {
            // First visit
            const today = new Date().toDateString();
            setStreak(1);
            setBestStreak(1);
            setLastActiveDate(today);
            localStorage.setItem('taskflow-streak', JSON.stringify({ streak: 1, bestStreak: 1, lastActiveDate: today }));
        }
    }, []);

    // Generate week dots
    const weekDays = ['ש', 'ו', 'ה', 'ד', 'ג', 'ב', 'א'];
    const today = new Date().getDay(); // 0 = Sunday

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="vibrant-card p-6 relative overflow-hidden"
        >
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#FF7D00]/10 blur-[40px] pointer-events-none rounded-full" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#FF7D00]" />
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">רצף יומי</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-[#FF7D00]/10 rounded-lg">
                    <Trophy className="w-3 h-3 text-[#FF7D00]" />
                    <span className="text-[10px] font-black text-[#FF7D00]">שיא: {bestStreak}</span>
                </div>
            </div>

            {/* Streak Number */}
            <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl md:text-6xl font-black text-gradient-warm tabular-nums">{streak}</span>
                    <span className="text-sm md:text-lg font-black text-slate-400">ימים</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500">
                        {streak >= 7 ? 'שבוע מושלם! 🎉' : streak >= 3 ? 'המשך כך! 💪' : 'בוא נתחיל!'}
                    </span>
                </div>
            </div>

            {/* Week Dots */}
            <div className="flex items-center justify-between px-2">
                {weekDays.map((day, i) => {
                    // i=0 is Saturday (index 6 in JS), i=6 is Sunday (index 0 in JS)
                    const dayIndex = (6 - i) % 7; // Map to JS day index
                    const isToday = dayIndex === today;
                    const isPast = (streak > 0 && i >= (7 - Math.min(streak, 7)) + (6 - today));

                    return (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isToday
                                    ? 'bg-[#FF7D00] text-white shadow-lg shadow-[#FF7D00]/30 scale-110'
                                    : isPast
                                        ? 'bg-[#FF7D00]/20 text-[#FF7D00]'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}
                            >
                                {isToday ? <Flame className="w-4 h-4" /> : <Calendar className="w-3 h-3" />}
                            </div>
                            <span className={`text-[10px] font-black ${isToday ? 'text-[#FF7D00]' : 'text-slate-400'}`}>
                                {day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
