'use client';

import { addSubtask, toggleSubtask, deleteTask, generateSubtasksWithAI, smartBreakdown, optimizeTaskTitle } from '@/actions/taskActions';
import { Trash2, GripHorizontal, CheckCircle2, Circle, Sparkles, BrainCircuit, FastForward, Info, Loader2, Plus, ChevronRight } from 'lucide-react';
import { useTransition, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    _id: string;
    title: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    dueDate?: string;
    subtasks: any[];
    createdAt: string;
}

export default function TaskItem({ task }: { task: Task }) {
    const [isPending, startTransition] = useTransition();
    const [isAIOptimizing, startOptimizeTransition] = useTransition();
    const [isAnalyzing, startAnalysisTransition] = useTransition();
    const [isAIGenerating, startAIGenTransition] = useTransition();
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 500 : 'auto',
    };

    const completedSub = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const totalSub = task.subtasks?.length || 0;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            className={`ether-card rounded-3xl mb-4 group/item overflow-hidden ${isDragging ? 'opacity-20 scale-95' : 'hover:scale-[1.01] hover:z-10'} ${task.status === 'Done' ? 'opacity-50' : ''}`}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/80">
                                {task.category}
                            </span>
                            <PriorityDot priority={task.priority} />
                        </div>
                        <h4 className={`text-lg font-bold text-white tracking-tight transition-all duration-500 ${task.status === 'Done' ? 'line-through text-slate-500' : ''}`}>
                            {task.title}
                        </h4>
                    </div>
                    <div {...listeners} {...attributes} className="p-2 cursor-grab active:cursor-grabbing text-slate-800 group-hover/item:text-slate-400 transition-colors">
                        <GripHorizontal className="w-4 h-4" />
                    </div>
                </div>

                {/* Subtask Preview / Quick Stats */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-slate-500">
                        <Info className="w-3.5 h-3.5" />
                        {totalSub > 0 ? `${completedSub}/${totalSub} Steps` : 'No Roadmap'}
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-amber-500/80">
                            <ClockIcon className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* AI Holographic Context */}
                <AnimatePresence>
                    {aiAdvice && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-5 p-4 bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl relative hologram"
                        >
                            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-blue-500/40" />
                            <p className="text-[11px] font-medium leading-relaxed text-slate-300 pr-5 italic">
                                "{aiAdvice}"
                            </p>
                            <button onClick={() => setAiAdvice(null)} className="mt-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:underline">Dismiss</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Interface (Smart Menu) */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/[0.03]">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowSubtasks(!showSubtasks)}
                            className={`p-2 rounded-xl transition-all ${showSubtasks ? 'bg-white text-black' : 'hover:bg-white/5 text-slate-400'}`}
                        >
                            <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${showSubtasks ? 'rotate-90' : ''}`} />
                        </button>

                        <SmartAction
                            icon={<FastForward className="w-3.5 h-3.5" />}
                            label="Opt"
                            isLoading={isAIOptimizing}
                            onClick={() => startOptimizeTransition(async () => await optimizeTaskTitle(task._id, task.title))}
                        />

                        <SmartAction
                            icon={<Plus className="w-3.5 h-3.5" />}
                            label="Gen"
                            isLoading={isAIGenerating}
                            onClick={() => startAIGenTransition(async () => {
                                await generateSubtasksWithAI(task._id, task.title);
                                setShowSubtasks(true);
                            })}
                        />

                        <SmartAction
                            icon={<BrainCircuit className="w-3.5 h-3.5" />}
                            label="Mind"
                            isLoading={isAnalyzing}
                            onClick={() => startAnalysisTransition(async () => {
                                const advice = await smartBreakdown(task._id);
                                setAiAdvice(advice || "AI thinking...");
                            })}
                        />
                    </div>

                    <button
                        onClick={() => startTransition(async () => await deleteTask(task._id))}
                        className="p-2.5 text-slate-800 hover:text-rose-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Subtask Explorer */}
                <AnimatePresence>
                    {showSubtasks && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 space-y-2.5 pb-2">
                                {task.subtasks?.map((sub: any) => (
                                    <div key={sub._id} className="flex items-center gap-3 pl-2 group/sub">
                                        <button
                                            onClick={() => startTransition(() => toggleSubtask(task._id, sub._id, sub.isCompleted))}
                                            className="transition-transform active:scale-90"
                                        >
                                            {sub.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> : <Circle className="w-3.5 h-3.5 text-slate-800 group-hover/sub:text-slate-600" />}
                                        </button>
                                        <span className={`text-xs font-medium transition-all duration-500 ${sub.isCompleted ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                                            {sub.title}
                                        </span>
                                    </div>
                                ))}
                                {totalSub === 0 && (
                                    <p className="text-[10px] italic text-slate-600 pl-2">Use 'Gen' to initiate subtasks.</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Micro-indicator */}
            {totalSub > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.02]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedSub / totalSub) * 100}%` }}
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                </div>
            )}
        </motion.div>
    );
}

function SmartAction({ icon, label, isLoading, onClick }: { icon: any, label: string, isLoading: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all hover:bg-white/10 ${isLoading ? 'opacity-50' : 'hover:scale-105 active:scale-95 text-slate-400 hover:text-white'}`}
        >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function PriorityDot({ priority }: { priority: string }) {
    const color = { High: 'bg-rose-500 shadow-rose-500/40', Medium: 'bg-amber-500 shadow-amber-500/40', Low: 'bg-blue-500 shadow-blue-500/40' }[priority] || 'bg-slate-500';
    return <div className={`w-1 h-1 rounded-full ${color} shadow-lg`} />;
}

function ClockIcon(props: any) {
    return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
