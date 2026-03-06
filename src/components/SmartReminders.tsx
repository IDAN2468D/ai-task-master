'use client';

import { Bell, Clock, AlertTriangle, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
}

export default function SmartReminders({ tasks }: { tasks: Task[] }) {
    const [reminders, setReminders] = useState<{ task: Task; type: 'overdue' | 'today' | 'tomorrow' | 'this_week' }[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('taskflow-dismissed-reminders') || '[]');
        setDismissed(saved);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);

        const newReminders: typeof reminders = [];

        tasks.filter(t => t.status !== 'Done' && t.dueDate).forEach(task => {
            const due = new Date(task.dueDate!);
            const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

            if (dueDay < today) {
                newReminders.push({ task, type: 'overdue' });
            } else if (dueDay.getTime() === today.getTime()) {
                newReminders.push({ task, type: 'today' });
            } else if (dueDay.getTime() === tomorrow.getTime()) {
                newReminders.push({ task, type: 'tomorrow' });
            } else if (dueDay <= weekEnd) {
                newReminders.push({ task, type: 'this_week' });
            }
        });

        // Sort: overdue first, then today, tomorrow, this_week
        const order = { overdue: 0, today: 1, tomorrow: 2, this_week: 3 };
        newReminders.sort((a, b) => order[a.type] - order[b.type]);

        setReminders(newReminders);
    }, [tasks]);

    const dismiss = (id: string) => {
        const next = [...dismissed, id];
        setDismissed(next);
        localStorage.setItem('taskflow-dismissed-reminders', JSON.stringify(next));
    };

    const active = reminders.filter(r => !dismissed.includes(r.task._id));
    if (active.length === 0) return null;

    const typeConfig = {
        overdue: { label: 'באיחור!', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
        today: { label: 'היום', icon: Clock, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
        tomorrow: { label: 'מחר', icon: Bell, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
        this_week: { label: 'השבוע', icon: Sparkles, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    };

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="vibrant-card p-5 mb-6 border-r-4 border-r-amber-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">תזכורות חכמות</h4>
                    <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">{active.length}</span>
                </div>
            </div>
            <div className="space-y-2">
                {active.slice(0, 5).map(({ task, type }) => {
                    const config = typeConfig[type];
                    const Icon = config.icon;
                    return (
                        <div key={task._id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${config.color}`}>
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">{task.title}</span>
                                <span className="text-[10px] font-bold opacity-70">{config.label} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : ''}</span>
                            </div>
                            <button onClick={() => dismiss(task._id)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg flex-shrink-0">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
