'use client';

import { ChevronRight, ChevronLeft, Calendar as CalIcon, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
}

const DAYS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export default function CalendarView({ tasks }: { tasks: Task[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay(); // 0=Sunday
        const daysInMonth = lastDay.getDate();

        const days: { date: number; month: number; isCurrentMonth: boolean }[] = [];

        // Previous month padding
        const prevMonthLast = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ date: prevMonthLast - i, month: month - 1, isCurrentMonth: false });
        }

        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            days.push({ date: d, month, isCurrentMonth: true });
        }

        // Next month padding
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            days.push({ date: d, month: month + 1, isCurrentMonth: false });
        }

        return days;
    }, [year, month]);

    const getTasksForDay = (day: number, dayMonth: number) => {
        return tasks.filter(t => {
            if (!t.dueDate) return false;
            const d = new Date(t.dueDate);
            return d.getDate() === day && d.getMonth() === dayMonth && d.getFullYear() === year;
        });
    };

    const today = new Date();
    const isToday = (day: number, dayMonth: number) =>
        day === today.getDate() && dayMonth === today.getMonth() && year === today.getFullYear();

    const priorityDot: Record<string, string> = { High: 'bg-red-500', Medium: 'bg-amber-500', Low: 'bg-cyan-500' };

    return (
        <div className="vibrant-card p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF00E5]/10 rounded-xl flex items-center justify-center">
                        <CalIcon className="w-5 h-5 text-[#FF00E5]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                            {MONTHS_HE[month]} {year}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">תצוגת לוח שנה</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={goToday} className="px-4 py-2 bg-[#4318FF]/10 text-[#4318FF] rounded-xl text-xs font-black hover:bg-[#4318FF]/20 transition-colors">היום</button>
                    <button onClick={prevMonth} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button onClick={nextMonth} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_HE.map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                    const dayTasks = getTasksForDay(day.date, day.month);
                    const _isToday = isToday(day.date, day.month);

                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className={`min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 rounded-xl border transition-all cursor-pointer ${!day.isCurrentMonth
                                    ? 'bg-slate-50/50 dark:bg-slate-900/20 border-transparent opacity-40'
                                    : _isToday
                                        ? 'bg-[#4318FF]/5 border-[#4318FF]/30 ring-2 ring-[#4318FF]/20'
                                        : 'bg-white dark:bg-[#111C44]/50 border-slate-100 dark:border-white/5 hover:border-[#4318FF]/30'
                                }`}
                        >
                            <span className={`text-xs font-black ${_isToday ? 'text-[#4318FF] bg-[#4318FF]/10 w-6 h-6 rounded-full flex items-center justify-center' :
                                    day.isCurrentMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300'
                                }`}>
                                {day.date}
                            </span>

                            <div className="mt-1 space-y-0.5">
                                {dayTasks.slice(0, 3).map(task => (
                                    <div key={task._id} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 group/task">
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[task.priority] || 'bg-slate-400'}`} />
                                        <span className={`text-[9px] font-bold truncate ${task.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <span className="text-[8px] font-black text-[#4318FF] pr-1.5">+{dayTasks.length - 3} נוספים</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
