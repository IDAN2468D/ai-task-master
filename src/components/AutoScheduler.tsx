'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Sparkles, PlayCircle, Download } from 'lucide-react';
import { autoScheduleDay } from '@/actions/taskActions';

interface Task {
    _id: string;
    title: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    estimatedHours?: number;
    description?: string;
    dueDate?: string;
    subtasks: any[];
    createdAt: string;
}

interface Block {
    taskId: string;
    startTime: string;
    endTime: string;
}

export default function AutoScheduler({ tasks }: { tasks: Task[] }) {
    const [schedule, setSchedule] = useState<Block[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const activeTasks = tasks.filter(t => t.status !== 'Done');

    const handleMagicSchedule = async () => {
        setIsGenerating(true);
        try {
            const mapped = activeTasks.map(t => ({
                id: t._id,
                title: t.title,
                durationEstimate: t.estimatedHours || 1
            }));
            const res = await autoScheduleDay(mapped);
            if (res.success && res.schedule) {
                setSchedule(res.schedule);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const getStyles = (start: string, end: string) => {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMins = Math.max((sh - 8) * 60 + sm, 0);
        const endMins = Math.min((eh - 8) * 60 + em, 12 * 60);
        const totalMins = 12 * 60;
        const top = (startMins / totalMins) * 100;
        const height = ((endMins - startMins) / totalMins) * 100;
        return { top: `${top}%`, height: `${height}%` };
    };

    const handleExportToICS = () => {
        let icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Task Master//EN\n";
        const today = new Date();
        const yy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yy}${mm}${dd}`;

        schedule.forEach(block => {
            const task = activeTasks.find(t => t._id === block.taskId);
            if (!task) return;
            const st = block.startTime.replace(':', '') + '00';
            const et = block.endTime.replace(':', '') + '00';
            icsData += "BEGIN:VEVENT\n";
            icsData += `DTSTART;TZID=Asia/Jerusalem:${dateStr}T${st}\n`;
            icsData += `DTEND;TZID=Asia/Jerusalem:${dateStr}T${et}\n`;
            icsData += `SUMMARY:${task.title}\n`;
            if (task.description) icsData += `DESCRIPTION:${task.description.replace(/\n/g, '\\n')}\n`;
            icsData += "END:VEVENT\n";
        });
        icsData += "END:VCALENDAR";
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule-${dateStr}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mb-1">לו"ז אישי מנוהל AI</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Autonomous temporal allocation based on cognitive priority.</p>
                </div>
                <div className="flex gap-4">
                    <AnimatePresence>
                        {schedule.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleExportToICS}
                                className="flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-[20px] border border-slate-200 dark:border-white/10 hover:shadow-xl transition-all"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export to Calendar</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={handleMagicSchedule}
                        disabled={isGenerating || activeTasks.length === 0}
                        className="group relative flex items-center gap-3 px-8 py-3.5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] rounded-[22px] hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 neural-pulse"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-600 rounded-[22px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="relative z-10">{isGenerating ? "Neural Planning..." : "Initiate Magic Schedule"}</span>
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-[48px] border-white/20 dark:border-white/5 shadow-2xl p-10 min-h-[700px] flex relative overflow-hidden">
                
                <AnimatePresence>
                    {schedule.length === 0 && !isGenerating && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center z-20"
                        >
                            <div className="w-24 h-24 rounded-full bg-slate-200/20 dark:bg-white/5 flex items-center justify-center mb-8 animate-float-slow">
                                <CalendarClock className="w-10 h-10 text-slate-400" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-600 dark:text-slate-300 tracking-tight">Temporal Matrix Empty</h4>
                            <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">Engage high-precision scheduling to populate.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Timeline Axis (08:00 to 20:00) */}
                <div className="w-24 flex flex-col justify-between border-l border-slate-200/30 dark:border-white/5 pr-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    {[8, 10, 12, 14, 16, 18, 20].map((hour) => (
                        <div key={hour} className="relative h-0">
                            <span className="absolute -top-2 -right-6 bg-transparent px-1 z-10 whitespace-nowrap">{hour.toString().padStart(2, '0')}:00</span>
                            <div className="absolute top-0 right-0 w-[1200px] border-t border-dashed border-slate-300/20 dark:border-white/5 -z-10" />
                        </div>
                    ))}
                </div>

                {/* Grid Area */}
                <div className="flex-1 relative mr-8 ml-4 mt-2">
                    {/* Free Time Ghost Blocks */}
                    {(() => {
                        if (schedule.length === 0) return null;
                        const sorted = [...schedule].sort((a,b) => a.startTime.localeCompare(b.startTime));
                        const freeBlocks = [];
                        let lastEnd = "08:00";
                        for (const block of sorted) {
                            if (block.startTime > lastEnd) {
                                freeBlocks.push({ start: lastEnd, end: block.startTime });
                            }
                            if (block.endTime > lastEnd) lastEnd = block.endTime;
                        }
                        if (lastEnd < "20:00") {
                            freeBlocks.push({ start: lastEnd, end: "20:00" });
                        }
                        return freeBlocks.map((fb, idx) => {
                            const { top, height } = getStyles(fb.start, fb.end);
                            return (
                                <div
                                    key={`free-${idx}`}
                                    style={{ top, height }}
                                    className="absolute left-0 right-0 p-4 bg-slate-100/10 dark:bg-white/5 border border-dashed border-slate-300/30 dark:border-white/10 rounded-[28px] flex items-center justify-center opacity-40 group/free"
                                >
                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] text-center leading-relaxed">
                                        Passive Temporal Window<br/>({fb.start} — {fb.end})
                                    </span>
                                </div>
                            );
                        });
                    })()}

                    <AnimatePresence>
                        {schedule.map((block, i) => {
                            const task = activeTasks.find(t => t._id === block.taskId);
                            if (!task) return null;
                            const { top, height } = getStyles(block.startTime, block.endTime);
                            return (
                                <motion.div
                                    key={block.taskId}
                                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                                    style={{ top, height }}
                                    className="absolute left-0 right-0 p-5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 dark:border-indigo-400/20 rounded-[32px] shadow-2xl flex items-center justify-between gap-6 hover:shadow-indigo-500/20 transition-all group overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-linear-to-b from-indigo-500 to-purple-500 rounded-l-full" />
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className="text-base font-black text-indigo-900 dark:text-white truncate mb-1 tracking-tight">{task.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">
                                                {block.startTime} — {block.endTime}
                                            </span>
                                            {task.category && (
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{task.category}</span>
                                            )}
                                        </div>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                                    >
                                        <PlayCircle className="w-6 h-6" />
                                    </motion.button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
