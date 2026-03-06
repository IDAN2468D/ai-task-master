'use client';

import { addSubtask, toggleSubtask, deleteTask, generateSubtasksWithAI, smartBreakdown, optimizeTaskTitle } from '@/actions/taskActions';
import { Trash2, GripHorizontal, CheckSquare, Square, Sparkles, BrainCircuit, FastForward, Clock } from 'lucide-react';
import { useTransition, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    _id: string; title: string; status: 'Todo' | 'InProgress' | 'Done'; priority: 'Low' | 'Medium' | 'High'; category: string; dueDate?: string; subtasks: any[];
}

export default function TaskItem({ task }: { task: Task }) {
    const [isAIOptimizing, startOptimize] = useTransition();
    const [isAnalyzing, startAnalysis] = useTransition();
    const [isAIGenerating, startGen] = useTransition();
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto' };
    const comps = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const total = task.subtasks?.length || 0;
    const prog = total > 0 ? (comps / total) * 100 : 0;

    return (
        <motion.div ref={setNodeRef} style={style} layout className={`vibrant-card p-5 group/item ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''} ${task.status === 'Done' ? 'opacity-60 saturate-50' : ''}`}>
            {/* Header Tags */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-[#4318FF] dark:text-indigo-300 rounded-lg text-[9px] font-black uppercase tracking-wider">
                        {task.category}
                    </span>
                    <PriorityPill priority={task.priority} />
                </div>
                <div {...listeners} {...attributes} className="cursor-grab text-slate-300 hover:text-[#4318FF] transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <GripHorizontal className="w-4 h-4" />
                </div>
            </div>

            {/* Title */}
            <h4 className={`text-base font-bold text-slate-800 dark:text-white mb-4 ${task.status === 'Done' ? 'line-through text-slate-400' : ''}`}>
                {task.title}
            </h4>

            {/* Progress */}
            {total > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(prog)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${prog}%` }} className="h-full bg-gradient-stat-2" />
                    </div>
                </div>
            )}

            {/* AI Callout */}
            <AnimatePresence>
                {aiAdvice && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-4 bg-gradient-to-r from-[#00E5FF]/10 to-[#4318FF]/10 border border-[#4318FF]/20 p-3 rounded-xl relative">
                        <Sparkles className="w-3 h-3 text-[#4318FF] mb-1" />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{aiAdvice}</p>
                        <button onClick={() => setAiAdvice(null)} className="absolute top-2 right-2 text-[#4318FF] text-[9px] font-bold hover:underline">CLOSE</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowSubtasks(!showSubtasks)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-[#4318FF] hover:text-white transition-colors">
                        {total} Subtasks
                    </button>

                    <button onClick={() => startOptimize(async () => await optimizeTaskTitle(task._id, task.title))} disabled={isAIOptimizing} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="Optimize Title">
                        <FastForward className="w-4 h-4" />
                    </button>
                    <button onClick={() => startGen(async () => { await generateSubtasksWithAI(task._id, task.title); setShowSubtasks(true); })} disabled={isAIGenerating} className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg" title="Generate Subtasks">
                        <Sparkles className="w-4 h-4" />
                    </button>
                    <button onClick={() => startAnalysis(async () => setAiAdvice(await smartBreakdown(task._id) || ""))} disabled={isAnalyzing} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg" title="AI Advice">
                        <BrainCircuit className="w-4 h-4" />
                    </button>
                </div>
                {task.dueDate && <div className="text-[10px] font-bold text-amber-500 flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md"><Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}</div>}
            </div>

            {/* Subtasks */}
            {showSubtasks && (
                <div className="mt-4 space-y-2">
                    {task.subtasks.map((s: any) => (
                        <div key={s._id} className="flex items-center gap-2">
                            <button onClick={() => toggleSubtask(task._id, s._id, s.isCompleted)}>
                                {s.isCompleted ? <CheckSquare className="w-4 h-4 text-[#00E5FF]" /> : <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
                            </button>
                            <span className={`text-sm ${s.isCompleted ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

function PriorityPill({ priority }: { priority: string }) {
    const c = { High: 'text-[#FF2A2A] bg-[#FF2A2A]/10', Medium: 'text-[#FF7D00] bg-[#FF7D00]/10', Low: 'text-[#00E5FF] bg-[#00E5FF]/10' }[priority] || '';
    return <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${c}`}>{priority} Prio</span>;
}
