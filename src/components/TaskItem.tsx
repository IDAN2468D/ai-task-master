'use client';

import { addSubtask, toggleSubtask, deleteTask, generateSubtasksWithAI, smartBreakdown, optimizeTaskTitle } from '@/actions/taskActions';
import { Trash2, Calendar, Plus, CheckSquare, Square, GripVertical, Layers, Sparkles, Loader2, BrainCircuit, Quote, Pencil, FastForward } from 'lucide-react';
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
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 200 : 'auto',
    };

    const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const handleOptimize = () => {
        startOptimizeTransition(async () => {
            try { await optimizeTaskTitle(task._id, task.title); } catch (e) { alert("AI Fail"); }
        });
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            className={`group bento-item bg-slate-900/40 p-6 mb-4 !rounded-[1.5rem] border border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/60 transition-all ${isDragging ? 'opacity-30' : ''}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
                        {task.category}
                    </span>
                    <h4 className={`text-lg font-bold text-white tracking-tight ${task.status === 'Done' ? 'opacity-40 line-through' : ''}`}>
                        {task.title}
                    </h4>
                </div>
                <div className="flex items-center gap-3">
                    <PriorityBar priority={task.priority} />
                    <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-slate-500 transition-colors">
                        <GripVertical className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {totalSubtasks > 0 && (
                <div className="mb-6">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </div>
            )}

            <AnimatePresence>
                {aiAnalysis && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-blue-500/5 rounded-xl text-[11px] text-slate-400 italic">
                        "{aiAnalysis}"
                        <button onClick={() => setAiAnalysis(null)} className="ml-2 text-blue-500 not-italic font-black">X</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-1">
                    <ActionButton icon={<Layers className="w-3.5 h-3.5" />} label={totalSubtasks.toString()} onClick={() => setShowSubtasks(!showSubtasks)} />
                    <ActionButton
                        icon={isAIOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FastForward className="w-3.5 h-3.5" />}
                        label="Optimize"
                        onClick={handleOptimize}
                        color="text-emerald-500 bg-emerald-500/5"
                    />
                    <ActionButton
                        icon={isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        label="Advice"
                        onClick={async () => {
                            startAnalysisTransition(async () => {
                                const advice = await smartBreakdown(task._id);
                                setAiAnalysis(advice || "AI is thinking...");
                            });
                        }}
                        color="text-indigo-500 bg-indigo-500/5"
                    />
                </div>
                <button onClick={() => startTransition(async () => await deleteTask(task._id))} className="p-2 text-slate-700 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {showSubtasks && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
                    {task.subtasks.map((s: any) => (
                        <div key={s._id} className="flex items-center gap-2">
                            <button onClick={() => startTransition(() => toggleSubtask(task._id, s._id, s.isCompleted))}>
                                {s.isCompleted ? <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Square className="w-3.5 h-3.5 text-slate-700" />}
                            </button>
                            <span className={`text-xs ${s.isCompleted ? 'text-slate-600 line-through' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

function ActionButton({ icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color?: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 ${color || 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function PriorityBar({ priority }: { priority: string }) {
    const bars = { High: 3, Medium: 2, Low: 1 }[priority] || 1;
    const color = { High: 'bg-rose-500', Medium: 'bg-amber-500', Low: 'bg-emerald-500' }[priority] || 'bg-slate-500';

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3].map(i => (
                <div key={i} className={`w-1 h-3 rounded-full ${i <= bars ? color : 'bg-slate-900'}`} />
            ))}
        </div>
    );
}
