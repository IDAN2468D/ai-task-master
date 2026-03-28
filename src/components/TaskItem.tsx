'use client';

import {
    Trash2, GripHorizontal, CheckSquare, Square, Sparkles, BrainCircuit,
    FastForward, Clock, Eye, Calendar, ChevronDown, ChevronUp, Layers,
    Zap, Star, ExternalLink, Link as LinkIcon, ArrowLeft, MoreHorizontal,
    Target, X
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

export default function TaskItem({ task, compact }: { task: Task, compact?: boolean }) {
    const { isPending, removeTask, updateStatus, optimizeTitle, generateSubtasks, toggleSub, getAnalysis, syncToCalendar } = useTaskFlow();
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
        if (navigator.vibrate) navigator.vibrate(30);
        await generateSubtasks(task._id, task.title);
        setShowSubtasks(true);
    };

    const handleAnalysis = async () => {
        const advice = await getAnalysis(task._id);
        setAiAdvice(advice);
    };

    const isDone = task.status === 'Done';

    const priorityStyles: Record<string, { bg: string, text: string, glow: string }> = {
        High: { 
            bg: 'bg-rose-500/10 border-rose-500/20', 
            text: 'text-rose-500', 
            glow: 'from-rose-500/20 to-rose-900/5 shadow-rose-500/20' 
        },
        Medium: { 
            bg: 'bg-amber-500/10 border-amber-500/20', 
            text: 'text-amber-500', 
            glow: 'from-amber-500/20 to-amber-900/5 shadow-amber-500/20' 
        },
        Low: { 
            bg: 'bg-emerald-500/10 border-emerald-500/20', 
            text: 'text-emerald-500', 
            glow: 'from-emerald-500/20 to-emerald-900/5 shadow-emerald-500/20' 
        }
    };

    const currentStyle = priorityStyles[task.priority] || priorityStyles.Medium;

    return (
        <>
            <motion.div
                ref={setNodeRef}
                style={style}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02, rotate: -0.5 }}
                className={`
                    group/task relative p-10 elite-card border-white/30 dark:border-white/10 overflow-hidden transition-all duration-1000
                    ${isDragging ? 'z-50 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.7)] scale-110 rotate-2 cursor-grabbing bg-white/50 dark:bg-black/80 backdrop-blur-3xl border-indigo-500' : 'cursor-grab hover:shadow-[0_40px_100px_-20px_rgba(79,70,229,0.3)] hover:border-indigo-500/50'}
                `}
                dir="rtl"
            >
                {/* Elite Scanline & Platinum Shimmer - V7 */}
                <div className="absolute inset-0 elite-scanline opacity-0 group-hover/task:opacity-20 transition-opacity duration-1000" />
                <div className="absolute inset-0 shimmer-elite opacity-0 group-hover/task:opacity-10 transition-opacity duration-1000" />
                <div className={`absolute -right-32 -top-32 w-80 h-80 bg-gradient-to-br ${currentStyle.glow} blur-[120px] rounded-full opacity-10 group-hover/task:opacity-40 transition-all duration-1000`} />
                
                {/* Top Neural Trail */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-linear-to-r from-transparent via-white/40 to-transparent group-hover/task:via-indigo-400 transition-all duration-1000" />

                {/* Header: Interaction & Meta V7 */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div {...listeners} {...attributes} className="p-3 glass-panel rounded-2xl hover:bg-white/40 transition-all border-white/20 dark:border-white/10 group-hover/task:border-indigo-500/50 shadow-xl">
                            <GripHorizontal className="w-4 h-4 text-slate-400 group-hover/task:text-indigo-400" />
                        </div>
                        <div className={`elite-tag text-[10px] px-4 py-1.5 font-black tracking-[0.3em] uppercase ${currentStyle.bg} ${currentStyle.text} border border-current/30 rounded-full shadow-lg`}>
                            <div className="w-2 h-2 rounded-full bg-current relative neural-pulse ml-2.5 inline-block shadow-[0_0_12px_currentColor]" />
                            <span>{task.category || 'COGNITIVE'}</span>
                        </div>
                        {task.energyLevel && (
                            <div className="elite-tag text-[10px] px-4 py-1.5 bg-white/10 border border-white/20 text-slate-400 font-bold tracking-[0.2em] rounded-full">
                                <Zap size={11} className="text-amber-400 ml-2 inline-block animate-pulse" />
                                <span>{task.energyLevel.toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setShowDetail(true)} 
                        className="w-11 h-11 flex items-center justify-center glass-panel rounded-2xl hover:bg-indigo-600 hover:text-white text-slate-400 transition-all duration-700 border-white/20 group/more shadow-2xl active:scale-90"
                    >
                        <MoreHorizontal className="w-5 h-5 transition-transform group-hover/more:rotate-180 duration-700" />
                    </button>
                </div>

                {/* Content Section V7 */}
                <div className="flex items-start gap-6 mb-8 relative z-10">
                    <button 
                        onClick={() => updateStatus(task._id, isDone ? 'Todo' : 'Done')}
                        className={`mt-2 w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-1000 shrink-0 ${isDone ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.7)]' : 'bg-white/10 border-slate-300 dark:border-white/20 hover:border-indigo-500/60 hover:scale-115 group-hover/task:border-indigo-400 shadow-inner'}`}
                    >
                        {isDone && <CheckSquare className="w-5 h-5 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-2xl font-outfit font-black tracking-tight leading-tight transition-all duration-1000 ${isDone ? 'text-slate-400/40' : 'text-slate-900 dark:text-white group-hover/task:platinum-heading'}`}>
                            {task.title}
                        </h4>
                        
                        {task.description && !compact && (
                            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-white/40 leading-relaxed line-clamp-2 italic font-outfit group-hover/task:text-slate-400 transition-colors duration-700">
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status Pills V7 */}
                <div className="flex flex-wrap items-center gap-4 mb-8 relative z-10">
                    {task.dueDate && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[11px] font-black tracking-tight font-outfit shadow-sm">
                            <Clock size={14} className="opacity-80" />
                            <span>{new Date(task.dueDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    )}

                    {total > 0 && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-xl text-[11px] font-black tracking-[0.2em] font-outfit shadow-sm">
                            <Layers size={14} className="opacity-80" />
                            <span>{comps}/{total} NODES</span>
                        </div>
                    )}
                </div>

                {/* Platinum Precision Progress Bar - V7 */}
                {!compact && total > 0 && (
                    <div className="mb-10 relative z-10 px-0.5">
                        <div className="h-2.5 w-full bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden p-[1.5px] border border-white/20 shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prog}%` }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                className="h-full bg-linear-to-r from-indigo-600 via-violet-600 to-emerald-500 rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_3s_infinite] w-[200%]" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Platinum Actions Footer - Elite V7 */}
                <div className="pt-8 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <QuickAction
                            icon={Sparkles}
                            gradient="from-indigo-600 to-violet-700"
                            activeColor="text-indigo-400"
                            onClick={handleGenSubtasks}
                            disabled={isPending}
                            title="Neural Decompose"
                        />
                        <QuickAction
                            icon={BrainCircuit}
                            gradient="from-violet-600 to-fuchsia-700"
                            activeColor="text-violet-400"
                            onClick={handleAnalysis}
                            disabled={isPending}
                            title="Cognitive Analysis"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {total > 0 && (
                            <button
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-1000 font-outfit font-black text-[11px] tracking-[0.3em] ${showSubtasks ? 'bg-indigo-700 text-white shadow-[0_15px_40px_-5px_rgba(79,70,229,0.5)]' : 'glass-panel text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white border-white/20 hover:border-indigo-500 shadow-xl'}`}
                            >
                                <span className="platinum-glow">{showSubtasks ? 'QUASH NODES' : 'SCAN NODES'}</span>
                                {showSubtasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (navigator.vibrate) navigator.vibrate([20, 10, 20]);
                                removeTask(task._id);
                            }}
                            disabled={isPending}
                            className="w-12 h-12 flex items-center justify-center glass-panel text-rose-500/80 rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-1000 border-white/20 group/del shadow-2xl active:scale-90"
                        >
                            <Trash2 className="w-5 h-5 group-hover/del:scale-125 group-hover/del:rotate-12 transition-all duration-700" />
                        </button>
                    </div>
                </div>

                {/* AI Insight Panel - Platinum V7 Redesign */}
                <AnimatePresence>
                    {aiAdvice && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.9 }}
                            animate={{ height: 'auto', opacity: 1, scale: 1 }}
                            exit={{ height: 0, opacity: 0, scale: 0.9 }}
                            className="mt-8 p-6 rounded-3xl glass-panel border-indigo-500/30 relative overflow-hidden group/advice bg-indigo-600/10 backdrop-blur-3xl shadow-2xl"
                        >
                            <div className="absolute inset-0 elite-scanline opacity-20" />
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="p-4 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-400 shadow-2xl animate-pulse">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 dark:text-indigo-400 font-outfit block mb-2 platinum-glow">NEURAL SYNAPSE ACTIVE</span>
                                    <p className="text-base font-bold leading-relaxed text-slate-900 dark:text-white font-outfit">
                                        {aiAdvice}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAiAdvice(null)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-all group-hover/advice:rotate-180 duration-1000"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Task Nodes Grid - Platinum V7 */}
                <AnimatePresence>
                    {!compact && showSubtasks && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -20 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -20 }}
                            className="overflow-hidden mt-8 space-y-4 bg-slate-900/5 dark:bg-black/60 rounded-[40px] p-6 border border-white/20 dark:border-white/10 backdrop-blur-3xl shadow-inner"
                        >
                            {task.subtasks.map((s: any) => (
                                <button
                                    key={s._id}
                                    onClick={() => {
                                        if (!s.isCompleted && navigator.vibrate) navigator.vibrate(30);
                                        toggleSub(task._id, s._id, s.isCompleted);
                                    }}
                                    className={`w-full flex items-center gap-6 p-6 rounded-[28px] transition-all duration-1000 text-right group/sub relative overflow-hidden ${s.isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner' : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/30 dark:border-white/10 hover:border-indigo-500 shadow-2xl'}`}
                                >
                                    {s.isCompleted && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />}
                                    <div className={`w-7 h-7 rounded-[10px] flex items-center justify-center transition-all duration-1000 border-2 relative z-10 ${s.isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'border-slate-300 dark:border-white/20 group-hover/sub:border-indigo-500 group-hover/sub:scale-115'}`}>
                                        {s.isCompleted && <CheckSquare className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`text-base font-black font-outfit transition-all duration-1000 relative z-10 ${s.isCompleted ? 'line-through text-slate-400/60' : 'text-slate-800 dark:text-white group-hover/sub:platinum-glow'}`}>
                                        {s.title}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Task Detail Modal */}
            <AnimatePresence>
                {showDetail && (
                    <TaskDetailModal 
                        task={task} 
                        isOpen={showDetail} 
                        onClose={() => setShowDetail(false)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function QuickAction({ icon: Icon, gradient, activeColor, onClick, disabled, title }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                group/qa relative p-2.5 rounded-xl transition-all duration-300 overflow-hidden
                bg-white/5 border border-white/10 dark:border-white/5 hover:border-white/20 hover:scale-105 active:scale-95
            `}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover/qa:opacity-100 transition-opacity duration-500`} />
            <Icon className={`w-4 h-4 relative z-10 transition-colors ${activeColor} group-hover/qa:text-white`} />
        </button>
    );
}


