'use client';

import {
    Trash2, GripHorizontal, CheckSquare, Square, Sparkles, BrainCircuit,
    FastForward, Clock, Eye, Calendar, ChevronDown, ChevronUp, Layers,
    Zap, Star, ExternalLink, Link as LinkIcon, ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTaskFlow } from '@/hooks/useTaskFlow';

const TaskDetailModal = dynamic(() => import('./TaskDetailModal'), { ssr: false });

interface Task {
    _id: string;
    title: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    dueDate?: string;
    subtasks: any[];
    tags?: { name: string; color: string }[];
    links?: { url: string; summary?: string }[];
    description?: string;
    createdAt: string;
    energyLevel?: string;
    projectId?: string;
}

export default function TaskItem({ task }: { task: Task }) {
    const { isPending, removeTask, optimizeTitle, generateSubtasks, toggleSub, getAnalysis, syncToCalendar } = useTaskFlow();
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto' };
    const comps = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const total = task.subtasks?.length || 0;
    const prog = total > 0 ? (comps / total) * 100 : 0;

    const handleOptimize = async () => {
        await optimizeTitle(task._id, task.title);
    };

    const handleGenSubtasks = async () => {
        await generateSubtasks(task._id, task.title);
        setShowSubtasks(true);
    };

    const handleAnalysis = async () => {
        const advice = await getAnalysis(task._id);
        setAiAdvice(advice);
    };

    const isDone = task.status === 'Done';

    return (
        <>
            <motion.div
                ref={setNodeRef}
                style={style}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDone ? 0.7 : 1, y: 0 }}
                className={`group/task relative p-5 bg-white dark:bg-[#111C44]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all duration-300 ${isDragging ? 'z-50 rotate-1 scale-105 shadow-2xl' : ''}`}
            >
                {/* Drag Handle Overlay (Visible on Hover) */}
                <div {...listeners} {...attributes} className="absolute top-4 left-4 p-1.5 opacity-0 group-hover/task:opacity-100 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-grab transition-opacity active:cursor-grabbing z-10">
                    <GripHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                {/* Priority & Category Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <PriorityIcon priority={task.priority} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/5 px-2 py-0.5 rounded-md">
                            {task.category}
                        </span>
                        {task.energyLevel && (
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase flex items-center gap-1 ${task.energyLevel === 'High' ? 'bg-orange-100/50 text-orange-600' :
                                task.energyLevel === 'Medium' ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-100/50 text-slate-600'
                                }`}>
                                <Zap className="w-2.5 h-2.5" /> {task.energyLevel}
                            </span>
                        )}
                    </div>
                </div>

                {/* Task Title */}
                <div className="flex gap-3 mb-4">
                    <h4 className={`text-base font-black leading-tight flex-1 ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                        {task.title}
                    </h4>
                    <button onClick={() => setShowDetail(true)} className="p-2 h-fit bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all text-slate-400 shadow-sm" title="פרטים מלאים">
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                {/* Metadata Row (Date, Links, Subtasks Count) */}
                <div className="flex items-center gap-4 mb-5 text-[10px] font-bold text-slate-500">
                    {task.dueDate && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-lg">
                            <Clock className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                        </div>
                    )}

                    {total > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg">
                            <Layers className="w-3 h-3" />
                            {comps}/{total} צעדים
                        </div>
                    )}

                    {(task.links?.length || 0) > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 rounded-lg">
                            <LinkIcon className="w-3 h-3" />
                            {task.links?.length} קישורים
                        </div>
                    )}
                </div>

                {/* Progress Bar (Compact) */}
                {total > 0 && (
                    <div className="mb-5 px-1">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prog}%` }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-1)]"
                            />
                        </div>
                    </div>
                )}

                {/* AI Advice Callout */}
                <AnimatePresence>
                    {aiAdvice && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent-1)]/10 border border-[var(--primary)]/10 relative overflow-hidden group/advice"
                        >
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 blur-xl rounded-full" />
                            <div className="flex items-start gap-2 relative z-10">
                                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                                <p className="text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-200 pr-5">
                                    {aiAdvice}
                                </p>
                            </div>
                            <button
                                onClick={() => setAiAdvice(null)}
                                className="absolute top-2 left-2 p-1 bg-white dark:bg-white/5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-3 h-3 text-slate-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Optimized Quick Actions Footer */}
                <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <QuickAction
                            icon={Sparkles}
                            color="text-amber-500"
                            onClick={handleGenSubtasks}
                            disabled={isPending}
                            title="פירוק חכם לצעדים (AI)"
                        />
                        <QuickAction
                            icon={BrainCircuit}
                            color="text-[var(--primary)]"
                            onClick={handleAnalysis}
                            disabled={isPending}
                            title="ניתוח משימה (AI)"
                        />
                        <QuickAction
                            icon={FastForward}
                            color="text-blue-500"
                            onClick={handleOptimize}
                            disabled={isPending}
                            title="שיפור כותרת (AI)"
                        />
                        {task.dueDate && (
                            <QuickAction
                                icon={Calendar}
                                color="text-emerald-500"
                                onClick={() => syncToCalendar(task._id, task.title)}
                                disabled={isPending}
                                title="סנכרון ל-Google Calendar"
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowSubtasks(!showSubtasks)}
                            className={`p-2 rounded-xl transition-all ${showSubtasks ? 'bg-[var(--primary)] text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                            title={showSubtasks ? 'הסתר צעדים' : 'הצג צעדים'}
                        >
                            {showSubtasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => removeTask(task._id)}
                            disabled={isPending}
                            className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all ml-1 shadow-sm"
                            title="מחיקה מהירה"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Subtasks List */}
                <AnimatePresence>
                    {showSubtasks && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2"
                        >
                            {task.subtasks.map((s: any) => (
                                <button
                                    key={s._id}
                                    onClick={() => toggleSub(task._id, s._id, s.isCompleted)}
                                    className="w-full flex items-center gap-3 p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all text-right group/sub"
                                >
                                    <div className={`p-1 rounded-md transition-colors ${s.isCompleted ? 'bg-[var(--accent-1)]/10 text-[var(--accent-1)]' : 'bg-white dark:bg-white/5 text-slate-300 group-hover/sub:text-slate-400'}`}>
                                        {s.isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-[13px] transition-all font-medium ${s.isCompleted ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {s.title}
                                    </span>
                                </button>
                            ))}
                            {task.subtasks.length === 0 && (
                                <p className="text-[11px] text-slate-400 font-bold p-2 italic">אין עדיין צעדים. לחץ על הניצוץ כדי ליצור!</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Task Detail Modal */}
            {showDetail && <TaskDetailModal task={task} isOpen={showDetail} onClose={() => setShowDetail(false)} />}
        </>
    );
}

function PriorityIcon({ priority }: { priority: string }) {
    const icons: Record<string, any> = { High: Zap, Medium: Star, Low: ArrowLeft };
    const Icon = icons[priority] || Star;
    const colors: Record<string, string> = {
        High: 'bg-red-500/10 text-red-500',
        Medium: 'bg-amber-500/10 text-amber-500',
        Low: 'bg-emerald-500/10 text-emerald-500'
    };
    return (
        <div className={`p-1.5 rounded-lg ${colors[priority]}`}>
            <Icon className="w-3 h-3" strokeWidth={3} />
        </div>
    );
}

function QuickAction({ icon: Icon, color, onClick, disabled, title }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 bg-slate-50 dark:bg-white/5 ${color} rounded-xl hover:scale-110 active:scale-95 transition-all shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-white/10`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}

function X({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
}
