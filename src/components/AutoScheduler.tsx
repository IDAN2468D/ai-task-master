'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Sparkles, PlayCircle, Lock, Download } from 'lucide-react';
import { autoScheduleDay } from '@/actions/taskActions';
import TaskItem from './TaskItem';

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

    // Helper to calc top and height from "HH:MM" for a 08:00 to 20:00 grid (12 hours)
    // 08:00 = 0px, 20:00 = 100%
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
        
        // Get today's date in YYYYMMDD format
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
            if (task.description) {
                icsData += `DESCRIPTION:${task.description.replace(/\n/g, '\\n')}\n`;
            }
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
        <div className="relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">לו"ז אישי מנוהל AI</h3>
                    <p className="text-xs font-bold text-slate-500 ml-2">הבינה המלאכותית מתכננת את לוח הזמנים שלך להיום.</p>
                </div>
                <div className="flex gap-3">
                    {schedule.length > 0 && (
                        <button
                            onClick={handleExportToICS}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#111C44] text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest text-[11px] rounded-2xl border border-slate-200 dark:border-white/10 hover:shadow-lg transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>ייצא ליומן</span>
                        </button>
                    )}
                    <button
                        onClick={handleMagicSchedule}
                        disabled={isGenerating || activeTasks.length === 0}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        )}
                        {isGenerating ? "מחכה לחלוץ הלוז..." : "Magic Schedule"}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111C44]/50 backdrop-blur-md rounded-[32px] border border-slate-200/60 dark:border-white/5 shadow-xl p-6 min-h-[600px] flex relative">
                
                {schedule.length === 0 && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-60 z-20">
                        <CalendarClock className="w-16 h-16 text-slate-400 mb-4 opacity-50" />
                        <h4 className="text-xl font-black text-slate-600 dark:text-slate-300">היומן שלך ריק</h4>
                        <p className="text-sm font-bold text-slate-400 mt-2">לחץ על Magic Schedule כדי לארגן אוטומטית.</p>
                    </div>
                )}

                {/* Timeline Axis (08:00 to 20:00) */}
                <div className="w-16 flex flex-col justify-between border-l border-slate-100 dark:border-white/5 pr-4 text-[10px] font-black tracking-widest text-slate-400">
                    {[8, 10, 12, 14, 16, 18, 20].map((hour) => (
                        <div key={hour} className="relative h-0">
                            <span className="absolute -top-2 -right-4 bg-white dark:bg-[#111C44] px-1 z-10">{hour.toString().padStart(2, '0')}:00</span>
                            <div className="absolute top-0 right-0 w-[800px] border-t border-dashed border-slate-200 dark:border-white/5 -z-10 opacity-50" />
                        </div>
                    ))}
                </div>

                {/* Grid Area */}
                <div className="flex-1 relative mr-4 ml-2 mt-2">
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
                                    className="absolute left-0 right-0 p-3 bg-slate-100/50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex items-center justify-center opacity-70"
                                >
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                                        צללית זמן פנוי<br/>({fb.start} - {fb.end})
                                    </span>
                                </div>
                            );
                        });
                    })()}

                    {schedule.map((block, i) => {
                        const task = activeTasks.find(t => t._id === block.taskId);
                        if (!task) return null;
                        const { top, height } = getStyles(block.startTime, block.endTime);
                        return (
                            <motion.div
                                key={block.taskId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{ top, height }}
                                className="absolute left-0 right-0 p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow group overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-full" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-100 truncate">{task.title}</h4>
                                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                                        {block.startTime} - {block.endTime}
                                    </div>
                                </div>
                                <button className="p-2 bg-white/50 dark:bg-black/20 rounded-xl text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-indigo-500 hover:text-indigo-900 dark:hover:text-white shadow-sm" title="התחל משימה">
                                    <PlayCircle className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
