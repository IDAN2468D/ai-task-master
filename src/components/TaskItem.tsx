'use client';

import { addSubtask, toggleSubtask, deleteTask, generateSubtasksWithAI } from '@/actions/taskActions';
import { Trash2, Calendar, Plus, CheckSquare, Square, GripVertical, Layers, Sparkles, Loader2 } from 'lucide-react';
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
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [newSubtask, setNewSubtask] = useState('');

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
                setShowSubtasks(true); // Automatically expand to show new subtasks
            } catch (err) {
                alert("AI generation failed. Please check your API key.");
            }
        });
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative glass-panel rounded-[2rem] p-6 mb-4 group transition-shadow hover:shadow-2xl hover:shadow-blue-500/10 ${isDragging ? 'opacity-50 ring-2 ring-blue-500 scale-105' : ''}`}
        >
            {/* Category Badge & Priority */}
            <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {task.category}
                </span>
                <PriorityIndicator priority={task.priority} />
            </div>

            <div className="flex gap-4">
                {/* Drag Handle */}
                <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-blue-500 transition-colors py-1">
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className={`text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight ${task.status === 'Done' ? 'opacity-50 line-through' : ''}`}>
                        {task.title}
                    </h4>

                    {/* Progress Bar Mini */}
                    {totalSubtasks > 0 && (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                />
                            </div>
                            <span className="text-[10px] font-black text-slate-400">{Math.round(progress)}%</span>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        {task.dueDate && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{totalSubtasks} Subtasks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSubtasks(!showSubtasks)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showSubtasks ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        {showSubtasks ? 'Collapse' : 'Subtasks'}
                    </button>

                    {/* AI Sparkle Button */}
                    <button
                        onClick={handleAIGenerate}
                        disabled={isAISuggesting}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isAISuggesting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>AI Suggest</span>
                    </button>
                </div>

                <button
                    onClick={() => startTransition(async () => await deleteTask(task._id))}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:scale-110 transition-all font-bold"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Subtasks Panel */}
            <AnimatePresence>
                {showSubtasks && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 space-y-3 pt-2">
                            {task.subtasks?.map((sub: any) => (
                                <div key={sub._id} className="flex items-center gap-3">
                                    <button onClick={() => startTransition(() => toggleSubtask(task._id, sub._id, sub.isCompleted))}>
                                        {sub.isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-slate-300" />}
                                    </button>
                                    <span className={`text-sm ${sub.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {sub.title}
                                    </span>
                                </div>
                            ))}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!newSubtask.trim()) return;
                                startTransition(async () => {
                                    await addSubtask(task._id, newSubtask);
                                    setNewSubtask('');
                                });
                            }} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add subtask manually..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
                                />
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function PriorityIndicator({ priority }: { priority: string }) {
    const colors = {
        High: 'text-rose-500 bg-rose-500/10',
        Medium: 'text-amber-500 bg-amber-500/10',
        Low: 'text-emerald-500 bg-emerald-500/10'
    }[priority] || 'text-slate-400';

    return (
        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] ${colors}`}>
            {priority}
        </div>
    );
}
