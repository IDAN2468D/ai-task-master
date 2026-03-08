'use client';

import { Trophy, Star, Flame, Zap, Target, Crown, Award, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    condition: (stats: Stats) => boolean;
}

interface Stats {
    totalCompleted: number;
    totalCreated: number;
    streak: number;
    aiUsed: number;
}

const BADGES: Badge[] = [
    { id: 'first_task', title: 'צעד ראשון', description: 'השלמת המשימה הראשונה!', icon: Star, color: '#FFD700', condition: s => s.totalCompleted >= 1 },
    { id: 'productive_5', title: 'פרודוקטיבי', description: 'השלמת 5 משימות', icon: Zap, color: '#00E5FF', condition: s => s.totalCompleted >= 5 },
    { id: 'task_master_10', title: 'מאסטר משימות', description: 'השלמת 10 משימות!', icon: Trophy, color: '#4318FF', condition: s => s.totalCompleted >= 10 },
    { id: 'producer_25', title: 'מפיק על', description: 'השלמת 25 משימות!', icon: Crown, color: '#FF00E5', condition: s => s.totalCompleted >= 25 },
    { id: 'unstoppable_50', title: 'בלתי ניתן לעצירה', description: 'השלמת 50 משימות!', icon: Flame, color: '#FF2A2A', condition: s => s.totalCompleted >= 50 },
    { id: 'ai_lover', title: 'חובב AI', description: 'השתמשת ב-AI 3 פעמים', icon: Sparkles, color: '#7C3AED', condition: s => s.aiUsed >= 3 },
    { id: 'streak_3', title: 'רצף שלושה', description: '3 ימים רצופים!', icon: Target, color: '#FF7D00', condition: s => s.streak >= 3 },
    { id: 'streak_7', title: 'שבוע מושלם', description: '7 ימים רצופים!', icon: Award, color: '#10B981', condition: s => s.streak >= 7 },
];

export default function AchievementBadges({ tasks }: { tasks: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [newBadge, setNewBadge] = useState<Badge | null>(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('taskflow-badges') || '[]');
        const streakData = JSON.parse(localStorage.getItem('taskflow-streak') || '{"streak":0}');
        const aiCount = parseInt(localStorage.getItem('taskflow-ai-count') || '0');

        const stats: Stats = {
            totalCompleted: tasks.filter(t => t.status === 'Done').length,
            totalCreated: tasks.length,
            streak: streakData.streak || 0,
            aiUsed: aiCount,
        };

        const newUnlocked: string[] = [];
        BADGES.forEach(badge => {
            if (badge.condition(stats) && !saved.includes(badge.id)) {
                newUnlocked.push(badge.id);
                if (!newBadge) setNewBadge(badge);
            }
        });

        if (newUnlocked.length > 0) {
            const all = [...saved, ...newUnlocked];
            localStorage.setItem('taskflow-badges', JSON.stringify(all));
            setUnlockedBadges(all);
        } else {
            setUnlockedBadges(saved);
        }
    }, [tasks]);

    const unlockedCount = unlockedBadges.length;

    return (
        <>
            {/* Badge Counter Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl font-black text-[10px] md:text-xs border border-amber-500/10 dark:border-amber-500/20 shadow-sm transition-all hover:bg-amber-500/20 active:scale-95 uppercase tracking-widest"
            >
                <Trophy className="w-5 h-5" />
                <span>{unlockedCount}/{BADGES.length} הישגים</span>
            </button>

            {/* New Badge Celebration */}
            <AnimatePresence>
                {newBadge && (
                    <motion.div initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 flex items-center gap-4 min-w-[350px]">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: newBadge.color + '20' }}>
                            <newBadge.icon className="w-7 h-7" style={{ color: newBadge.color }} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">🎉 הישג חדש!</p>
                            <h4 className="text-lg font-black text-slate-800 dark:text-white">{newBadge.title}</h4>
                            <p className="text-xs font-bold text-slate-500">{newBadge.description}</p>
                        </div>
                        <button onClick={() => setNewBadge(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Badges Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">🏆 הישגים</h3>
                                    <p className="text-sm font-bold text-slate-500">{unlockedCount} מתוך {BADGES.length} פתוחים</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {BADGES.map(badge => {
                                    const isUnlocked = unlockedBadges.includes(badge.id);
                                    return (
                                        <div key={badge.id} className={`p-4 rounded-2xl border transition-all ${isUnlocked ? 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10' : 'bg-slate-50 dark:bg-slate-900/30 border-transparent opacity-40 grayscale'}`}>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: isUnlocked ? badge.color + '20' : '#94a3b820' }}>
                                                <badge.icon className="w-5 h-5" style={{ color: isUnlocked ? badge.color : '#94a3b8' }} />
                                            </div>
                                            <h4 className="text-sm font-black text-slate-800 dark:text-white mb-0.5">{badge.title}</h4>
                                            <p className="text-[10px] font-bold text-slate-500">{badge.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
