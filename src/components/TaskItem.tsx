'use client';

import { addSubtask, toggleSubtask, deleteTask, generateSubtasksWithAI, smartBreakdown } from '@/actions/taskActions';
import { Trash2, Calendar, Plus, CheckSquare, Square, GripVertical, Layers, Sparkles, Loader2, BrainCircuit, Quote } from 'lucide-react';
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
    const [isAISuggesting, startAITransition] = useTransition();
    const [isAnalyzing, startAnalysisTransition] = useTransition();
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
    };

    const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const handleAIGenerate = () => {
        startAITransition(async () => {
            try {
                await generateSubtasksWithAI(task._id, task.title);
                setShowSubtasks(true);
            } catch (err) { alert("AI failed."); }
        });
    };

    const handleAIAnalyze = () => {
        startAnalysisTransition(async () => {
            const analysis = await smartBreakdown(task._id);
            setAiAnalysis(analysis || "Analysis unavailable.");
        });
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            className={`luxury-card luxury-glass rounded-[2.5rem] p-7 mb-5 group ${isDragging ? 'opacity-40 scale-105 z-50 ring-4 ring-blue-500/20' : ''}`}
        >
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-black">
                        {task.category}
                    </span>
                    <PriorityBadge priority={task.priority} />
                </div>
                <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-blue-500 transition-colors">
                    <GripVertical className="w-5 h-5" />
                </div>
            </div>

            <div className="mb-6">
                <h4 className={`text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight ${task.status === 'Done' ? 'opacity-40 line-through' : ''}`}>
                    {task.title}
                </h4>

                {totalSubtasks > 0 && (
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className={`h-full bg-gradient-to-r ${progress === 100 ? 'from-emerald-400 to-emerald-600' : 'from-blue-500 to-indigo-600'}`}
                            />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{Math.round(progress)}%</span>
                    </div>
                )}
            </div>

            {/* AI Analysis View */}
            <AnimatePresence>
                {aiAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative"
                    >
                        <Quote className="absolute top-2 right-2 w-4 h-4 text-indigo-500/20" />
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                            {aiAnalysis}
                        </p>
                        <button onClick={() => setAiAnalysis(null)} className="mt-3 text-[9px] font-black uppercase tracking-tighter text-indigo-500 hover:underline">Dismiss</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setShowSubtasks(!showSubtasks)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showSubtasks ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        {totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks}` : 'Subtasks'}
                    </button>

                    <button
                        onClick={handleAIGenerate}
                        disabled={isAISuggesting}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        {isAISuggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>AI Suggest</span>
                    </button>

                    <button
                        onClick={handleAIAnalyze}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                        <span>Analyze</span>
                    </button>
                </div>

                <button onClick={() => startTransition(async () => await deleteTask(task._id))} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Subtasks Dropdown */}
            <AnimatePresence>
                {showSubtasks && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6 space-y-3 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                            {task.subtasks?.map((sub: any) => (
                                <div key={sub._id} className="flex items-center gap-3 group/sub">
                                    <button onClick={() => startTransition(() => toggleSubtask(task._id, sub._id, sub.isCompleted))}>
                                        {sub.isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-slate-200 dark:text-slate-700" />}
                                    </button>
                                    <span className={`text-sm font-medium ${sub.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {sub.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const colors = {
        High: 'text-rose-500 ring-rose-500/20',
        Medium: 'text-amber-500 ring-amber-500/20',
        Low: 'text-emerald-500 ring-emerald-500/20'
    }[priority] || 'text-slate-400';

    return (
        <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ring-1 ${colors}`}>
            {priority}
        </div>
    );
}
