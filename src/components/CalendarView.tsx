'use client';

import { ChevronRight, ChevronLeft, Calendar as CalIcon, Plus, Info, AlertCircle, Sparkles, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { createSmartTask } from '@/actions/taskActions';

const TaskDetailModal = dynamic(() => import('./TaskDetailModal'), { ssr: false });

interface Task {
    _id: string; title: string; status: 'Todo' | 'InProgress' | 'Done'; priority: 'Low' | 'Medium' | 'High'; category: string; dueDate?: string; subtasks: any[]; tags?: { name: string; color: string }[]; description?: string; createdAt: string;
}

const DAYS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export default function CalendarView({ tasks }: { tasks: Task[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [quickAddDate, setQuickAddDate] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: { date: number; month: number; isCurrentMonth: boolean; fullDate: string }[] = [];

        // Previous month padding
        const prevMonthDate = new Date(year, month, 0);
        const prevMonthLast = prevMonthDate.getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const d = prevMonthLast - i;
            const fullDate = new Date(year, month - 1, d).toISOString().split('T')[0];
            days.push({ date: d, month: month - 1, isCurrentMonth: false, fullDate });
        }

        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            const fullDate = new Date(year, month, d).toISOString().split('T')[0];
            days.push({ date: d, month, isCurrentMonth: true, fullDate });
        }

        // Next month padding
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            const fullDate = new Date(year, month + 1, d).toISOString().split('T')[0];
            days.push({ date: d, month: month + 1, isCurrentMonth: false, fullDate });
        }

        return days;
    }, [year, month]);

    const getTasksForDay = (fullDate: string) => {
        return tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === fullDate);
    };

    const isToday = (fullDate: string) => fullDate === new Date().toISOString().split('T')[0];

    const priorityDot: Record<string, string> = { High: 'bg-[#FF2A2A]', Medium: 'bg-[#FF7D00]', Low: 'bg-[#00E5FF]' };

    const handleQuickAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);
        formData.append('dueDate', quickAddDate || '');
        formData.append('useAI', 'true');
        await createSmartTask(formData);
        setIsCreating(false);
        setQuickAddDate(null);
    };

    return (
        <div className="space-y-6">
            <div className="vibrant-card p-6 md:p-8 bg-white/80 dark:bg-[#111C44]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-stat-1 rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
                            <CalIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
                                {MONTHS_HE[month]} <span className="text-[var(--primary)]">{year}</span>
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">חכם • פרודוקטיבי • מסוגנן</span>
                                <Sparkles className="w-3 h-3 text-[var(--accent-1)] animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-slate-100/50 dark:bg-black/20 p-2 rounded-2xl border border-slate-200 dark:border-white/5 self-center sm:self-auto">
                        <button onClick={goToday} className="px-5 py-2.5 bg-white dark:bg-[#0B1437] text-slate-700 dark:text-white rounded-xl text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all">היום</button>
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1" />
                        <button onClick={prevMonth} className="p-2.5 rounded-xl text-slate-500 hover:text-[var(--primary)] hover:bg-white dark:hover:bg-[#0B1437] transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2.5 rounded-xl text-slate-500 hover:text-[var(--primary)] hover:bg-white dark:hover:bg-[#0B1437] transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                    {DAYS_HE.map(day => (
                        <div key={day} className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--primary)] py-3 bg-[var(--primary)]/5 rounded-xl">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 md:gap-3">
                    {calendarDays.map((day, i) => {
                        const dayTasks = getTasksForDay(day.fullDate);
                        const _isToday = isToday(day.fullDate);
                        const isBusy = dayTasks.length >= 4;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.005 }}
                                onClick={() => day.isCurrentMonth && setQuickAddDate(day.fullDate)}
                                className={`group min-h-[90px] md:min-h-[140px] p-2 md:p-3 rounded-2xl md:rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${!day.isCurrentMonth
                                    ? 'bg-slate-50/30 dark:bg-transparent border-transparent opacity-20 pointer-events-none'
                                    : _isToday
                                        ? 'bg-gradient-to-br from-[var(--primary)]/10 to-transparent border-[var(--primary)]/40 shadow-xl shadow-[var(--primary)]/10'
                                        : 'bg-white/50 dark:bg-[#111C44]/30 border-slate-100 dark:border-white/5 hover:border-[var(--primary)]/40 hover:bg-white dark:hover:bg-[#111C44]/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] md:text-xs font-black ${_isToday ? 'text-white bg-[var(--primary)] w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg' :
                                        'text-slate-700 dark:text-slate-300'
                                        }`}>
                                        {day.date}
                                    </span>
                                    {isBusy && day.isCurrentMonth && (
                                        <div className="hidden md:flex items-center gap-1 text-[8px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                            <AlertCircle className="w-2.5 h-2.5" />
                                            عמוס
                                        </div>
                                    )}
                                </div>

                                {/* Task Display - Dots on small, names on large */}
                                <div className="space-y-1 relative z-10">
                                    {/* Mobile/Compact View (Dots) */}
                                    <div className="flex flex-wrap gap-1 md:hidden">
                                        {dayTasks.slice(0, 4).map(task => (
                                            <div key={task._id} className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority] || 'bg-slate-400'}`} />
                                        ))}
                                    </div>

                                    {/* Desktop View (Titles) */}
                                    <div className="hidden md:block space-y-1.5">
                                        {dayTasks.slice(0, 3).map(task => (
                                            <motion.div
                                                key={task._id}
                                                layoutId={task._id}
                                                onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B1437]/50 border border-transparent hover:border-[var(--primary)]/30 transition-all group/task"
                                            >
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority] || 'bg-slate-400'} shadow-sm`} />
                                                <span className={`text-[10px] font-bold truncate ${task.status === 'Done' ? 'line-through text-slate-400 opacity-50' : 'text-slate-600 dark:text-slate-200'}`}>
                                                    {task.title}
                                                </span>
                                            </motion.div>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <div className="text-[9px] font-black text-[var(--primary)] dark:text-[var(--accent-1)] pt-1 px-1 flex items-center gap-1">
                                                <Plus className="w-3 h-3" />
                                                עוד {dayTasks.length - 3} משימות
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hover/Active Invite */}
                                {day.isCurrentMonth && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 md:h-2 bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Add Modal */}
            <AnimatePresence>
                {quickAddDate && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="vibrant-card p-8 w-full max-w-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4318FF] to-[#00E5FF]" />
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 dark:text-white">משימה מהירה</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{quickAddDate}</p>
                                </div>
                                <button onClick={() => setQuickAddDate(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleQuickAdd} className="space-y-4">
                                <input name="title" autoFocus placeholder="מה התוכנית שלך?" required className="w-full px-5 py-4 bg-slate-50 dark:bg-[#0B1437] rounded-2xl border border-slate-200 dark:border-white/5 focus:outline-none focus:border-[#4318FF] font-bold text-slate-700 dark:text-white" />
                                <div className="flex gap-2">
                                    <select name="priority" className="flex-1 bg-slate-50 dark:bg-[#0B1437] p-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold">
                                        <option value="Low">עדיפות נמוכה</option>
                                        <option value="Medium">בינונית</option>
                                        <option value="High">גבוהה 🔥</option>
                                    </select>
                                    <select name="category" className="flex-1 bg-slate-50 dark:bg-[#0B1437] p-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold">
                                        <option value="אישי">אישי</option>
                                        <option value="עבודה">עבודה</option>
                                        <option value="בריאות">בריאות</option>
                                    </select>
                                </div>
                                <button disabled={isCreating} type="submit" className="w-full py-4 bg-gradient-stat-1 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#4318FF]/30 hover:-translate-y-1 transition-all disabled:opacity-50">
                                    {isCreating ? 'מייצר משימה חכמה...' : 'צור משימה עם AI'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}

