'use client';

import { Target, Plus, X, Trophy, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string;
    type: 'tasks_completed' | 'streak_days' | 'custom';
}

export default function GoalsTracker({ completedCount }: { completedCount: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newTarget, setNewTarget] = useState(10);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('taskflow-goals') || '[]');
        // Auto-update task-based goals
        const updated = saved.map((g: Goal) => {
            if (g.type === 'tasks_completed') return { ...g, current: completedCount };
            return g;
        });
        setGoals(updated);
        localStorage.setItem('taskflow-goals', JSON.stringify(updated));
    }, [completedCount]);

    const addGoal = () => {
        if (!newTitle.trim()) return;
        const goal: Goal = {
            id: Date.now().toString(),
            title: newTitle.trim(),
            target: newTarget,
            current: 0,
            deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            type: 'custom',
        };
        const next = [...goals, goal];
        setGoals(next);
        localStorage.setItem('taskflow-goals', JSON.stringify(next));
        setNewTitle('');
        setShowAdd(false);
    };

    const addPresetGoal = (title: string, target: number, type: Goal['type']) => {
        const goal: Goal = {
            id: Date.now().toString(), title, target,
            current: type === 'tasks_completed' ? completedCount : 0,
            deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            type,
        };
        const next = [...goals, goal];
        setGoals(next);
        localStorage.setItem('taskflow-goals', JSON.stringify(next));
    };

    const removeGoal = (id: string) => {
        const next = goals.filter(g => g.id !== id);
        setGoals(next);
        localStorage.setItem('taskflow-goals', JSON.stringify(next));
    };

    const achievedCount = goals.filter(g => g.current >= g.target).length;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 md:py-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl font-black text-xs md:text-sm border border-purple-500/10 dark:border-purple-500/20 shadow-sm transition-all hover:bg-purple-500/20 active:scale-95"
            >
                <Target className="w-4 h-4" />
                <span className="whitespace-nowrap">יעדים {goals.length > 0 && `(${achievedCount}/${goals.length})`}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white">🎯 יעדים</h3>
                                    <p className="text-xs font-bold text-slate-500">{achievedCount} מתוך {goals.length} הושגו</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setShowAdd(!showAdd)} className="p-2 bg-[#4318FF] text-white rounded-xl hover:bg-[#3614CC]">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Add Goal Form */}
                            <AnimatePresence>
                                {showAdd && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="mb-6 overflow-hidden">
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 space-y-4">
                                            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="שם היעד..."
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]" />
                                            <div className="flex items-center gap-3">
                                                <label className="text-xs font-bold text-slate-500">יעד:</label>
                                                <input type="number" value={newTarget} onChange={e => setNewTarget(parseInt(e.target.value) || 1)} min="1"
                                                    className="w-20 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-center text-slate-800 dark:text-white focus:outline-none" />
                                                <button onClick={addGoal} className="flex-1 py-2 bg-[#4318FF] text-white rounded-xl text-xs font-black hover:bg-[#3614CC]">הוסף יעד</button>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                                                <p className="text-[10px] font-bold text-slate-400 w-full">יעדים מוכנים:</p>
                                                <button onClick={() => addPresetGoal('השלם 10 משימות', 10, 'tasks_completed')} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg text-[10px] font-black">10 משימות</button>
                                                <button onClick={() => addPresetGoal('השלם 25 משימות', 25, 'tasks_completed')} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg text-[10px] font-black">25 משימות</button>
                                                <button onClick={() => addPresetGoal('שבוע רצף', 7, 'streak_days')} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg text-[10px] font-black">7 ימי רצף</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Goals List */}
                            {goals.length === 0 ? (
                                <div className="text-center py-12">
                                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-bold text-slate-400">אין יעדים עדיין</p>
                                    <p className="text-xs text-slate-400">לחץ על + כדי להוסיף יעד</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {goals.map(goal => {
                                        const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
                                        const achieved = goal.current >= goal.target;
                                        return (
                                            <div key={goal.id} className={`p-4 rounded-2xl border transition-all ${achieved ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {achieved ? <Trophy className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-[#4318FF]" />}
                                                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{goal.title}</h4>
                                                    </div>
                                                    <button onClick={() => removeGoal(goal.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg">
                                                        <X className="w-3 h-3 text-slate-400" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                                            className={`h-full rounded-full ${achieved ? 'bg-emerald-500' : 'bg-gradient-stat-1'}`} />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums">{goal.current}/{goal.target}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
