'use client';

import { addSubtask, toggleSubtask, deleteTask, generateSubtasksWithAI, smartBreakdown, optimizeTaskTitle } from '@/actions/taskActions';
import { Trash2, GripHorizontal, CheckSquare, Square, Sparkles, BrainCircuit, FastForward, Clock, Eye } from 'lucide-react';
import { useTransition, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const TaskDetailModal = dynamic(() => import('./TaskDetailModal'), { ssr: false });

interface Task {
    _id: string; title: string; status: 'Todo' | 'InProgress' | 'Done'; priority: 'Low' | 'Medium' | 'High'; category: string; dueDate?: string; subtasks: any[]; tags?: { name: string; color: string }[]; description?: string; createdAt: string; energyLevel?: string; projectId?: string;
}

export default function TaskItem({ task }: { task: Task }) {
    const [isAIOptimizing, startOptimize] = useTransition();
    const [isAnalyzing, startAnalysis] = useTransition();
    const [isAIGenerating, startGen] = useTransition();
    const [isDeleting, startDelete] = useTransition();
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const getThematicStyles = () => {
        const t = (task.title || "").toLowerCase();
        const c = (task.category || "").toLowerCase();

        if (t.includes('code') || t.includes('dev') || t.includes('קוד') || c.includes('tech') || c.includes('טכנולוגיה')) return 'from-blue-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:to-indigo-400/10';
        if (t.includes('design') || t.includes('עיצוב') || c.includes('design') || c.includes('עיצוב')) return 'from-pink-600/5 to-purple-600/5 dark:from-pink-400/10 dark:to-purple-400/10';
        if (t.includes('money') || t.includes('כסף') || c.includes('finance') || c.includes('פיננסים')) return 'from-emerald-600/5 to-teal-600/5 dark:from-emerald-400/10 dark:to-teal-400/10';
        if (t.includes('meeting') || t.includes('פגישה') || c.includes('work') || c.includes('עבודה')) return 'from-amber-600/5 to-orange-600/5 dark:from-amber-400/10 dark:to-orange-400/10';
        return 'from-slate-600/5 to-slate-600/5 dark:from-slate-400/5 dark:to-slate-400/5';
    };

    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto' };
    const comps = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const total = task.subtasks?.length || 0;
    const prog = total > 0 ? (comps / total) * 100 : 0;

    return (
        <>
            <motion.div ref={setNodeRef} style={style} layout className={`vibrant-card p-5 group/item relative overflow-hidden bg-gradient-to-br ${getThematicStyles()} ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''} ${task.status === 'Done' ? 'opacity-60 saturate-50' : ''}`}>
                {/* AI Decorative Pattern */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 dark:bg-white/5 blur-3xl rounded-full -ml-16 -mt-16 pointer-events-none" />
                {/* Header Tags */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-[#4318FF] dark:text-indigo-300 rounded-lg text-[9px] font-black uppercase tracking-wider">
                            {task.category}
                        </span>
                        <PriorityPill priority={task.priority} />
                        {/* Custom Tags */}
                        {task.tags?.slice(0, 2).map(tag => (
                            <span key={tag.name} className="px-2 py-0.5 rounded-md text-[8px] font-black text-white" style={{ backgroundColor: tag.color }}>
                                {tag.name}
                            </span>
                        ))}
                        {task.projectId && (
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 rounded-lg text-[8px] font-black uppercase">
                                📁 {task.projectId}
                            </span>
                        )}
                        {task.energyLevel && (
                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${task.energyLevel === 'High' ? 'bg-orange-100 text-orange-600' :
                                    task.energyLevel === 'Medium' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                ⚡ {task.energyLevel}
                            </span>
                        )}
                        {(task.tags?.length || 0) > 2 && (
                            <span className="text-[8px] font-bold text-slate-400">+{(task.tags?.length || 0) - 2}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setShowDetail(true)} className="p-1 text-slate-400 hover:text-[#4318FF] hover:bg-[#4318FF]/10 rounded-lg transition-colors" title="פרטי משימה">
                            <Eye className="w-4 h-4" />
                        </button>
                        <div {...listeners} {...attributes} className="cursor-grab text-slate-300 hover:text-[#4318FF] transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <GripHorizontal className="w-4 h-4" />
                        </div>
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
                            <span>התקדמות</span>
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
                            <button onClick={() => setAiAdvice(null)} className="absolute top-2 left-2 text-[#4318FF] text-[9px] font-bold hover:underline">סגור</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowSubtasks(!showSubtasks)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-[#4318FF] hover:text-white transition-colors">
                            {total} תתי-משימות
                        </button>

                        <button onClick={() => startOptimize(async () => await optimizeTaskTitle(task._id, task.title))} disabled={isAIOptimizing} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="אופטימיזציית כותרת">
                            <FastForward className="w-4 h-4" />
                        </button>
                        <button onClick={() => startGen(async () => { await generateSubtasksWithAI(task._id, task.title); setShowSubtasks(true); })} disabled={isAIGenerating} className="p-1.5 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors" title="יצירת תתי-משימות">
                            <Sparkles className="w-4 h-4" />
                        </button>
                        <button onClick={() => startDelete(async () => await deleteTask(task._id))} disabled={isDeleting} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors" title="מחק משימה">
                            {isDeleting ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                        <button onClick={() => startAnalysis(async () => setAiAdvice(await smartBreakdown(task._id) || ""))} disabled={isAnalyzing} className="p-1.5 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors" title="עצת AI">
                            <BrainCircuit className="w-4 h-4" />
                        </button>
                    </div>
                    {task.dueDate && <div className="text-[10px] font-bold text-amber-500 flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md"><Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString('he-IL')}</div>}
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

            {/* Task Detail Modal */}
            {showDetail && <TaskDetailModal task={task} isOpen={showDetail} onClose={() => setShowDetail(false)} />}
        </>
    );
}

function PriorityPill({ priority }: { priority: string }) {
    const labels: Record<string, string> = { High: 'גבוהה', Medium: 'בינונית', Low: 'נמוכה' };
    const c = { High: 'text-[#FF2A2A] bg-[#FF2A2A]/10', Medium: 'text-[#FF7D00] bg-[#FF7D00]/10', Low: 'text-[#00E5FF] bg-[#00E5FF]/10' }[priority] || '';
    return <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${c}`}>{labels[priority] || priority}</span>;
}
