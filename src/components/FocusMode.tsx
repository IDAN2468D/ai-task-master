'use client';

import { Focus, X, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTaskStatus } from '@/actions/taskActions';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    subtasks: any[];
}

export default function FocusMode({ tasks }: { tasks: Task[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter only active tasks (not done)
    const activeTasks = tasks.filter(t => t.status !== 'Done');

    // Sort by priority: High first
    const sortedTasks = [...activeTasks].sort((a, b) => {
        const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority] || 1) - (order[b.priority] || 1);
    });

    const currentTask = sortedTasks[currentIndex];

    const handleComplete = async () => {
        if (!currentTask) return;
        await updateTaskStatus(currentTask._id, 'Done');
        if (currentIndex < sortedTasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsOpen(false);
        }
    };

    const handleSkip = () => {
        if (currentIndex < sortedTasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    if (activeTasks.length === 0) return null;

    return (
        <>
            <button
                onClick={() => { setIsOpen(true); setCurrentIndex(0); }}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-[#FF00E5]/10 text-[#FF00E5] rounded-2xl font-black text-xs md:text-sm border border-[#FF00E5]/10 dark:border-[#FF00E5]/20 shadow-sm transition-all hover:bg-[#FF00E5]/20 hover:shadow-lg hover:shadow-[#FF00E5]/10 active:scale-95 group/focus"
            >
                <Focus className="w-5 h-5 group-hover/focus:rotate-90 transition-transform duration-500" />
                <span className="whitespace-nowrap uppercase tracking-widest text-[10px] md:text-sm">מצב פוקוס</span>
            </button>

            <AnimatePresence>
                {isOpen && currentTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9000] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="max-w-lg w-full text-center relative"
                        >
                            {/* Close */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-0 left-0 p-3 text-white/30 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Progress */}
                            <div className="mb-8">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Focus className="w-5 h-5 text-[#FF00E5]" />
                                    <span className="text-xs font-black uppercase tracking-widest text-[#FF00E5]">מצב פוקוס</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {sortedTasks.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 rounded-full transition-all ${i < currentIndex ? 'w-8 bg-emerald-500' :
                                                i === currentIndex ? 'w-12 bg-[#FF00E5]' :
                                                    'w-8 bg-white/10'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-white/30">
                                    {currentIndex + 1} מתוך {sortedTasks.length}
                                </span>
                            </div>

                            {/* Current Task */}
                            <div className="mb-10">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${currentTask.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                        currentTask.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-cyan-500/20 text-cyan-400'
                                        }`}>
                                        {currentTask.priority === 'High' ? 'עדיפות גבוהה' :
                                            currentTask.priority === 'Medium' ? 'עדיפות בינונית' : 'עדיפות נמוכה'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/50">
                                        {currentTask.category}
                                    </span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                    {currentTask.title}
                                </h2>

                                <div className="flex items-center justify-center gap-2 text-white/20">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-bold">התמקד רק במשימה הזו</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={handleComplete}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-2xl transition-all"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    סיימתי!
                                </button>
                                {currentIndex < sortedTasks.length - 1 && (
                                    <button
                                        onClick={handleSkip}
                                        className="flex items-center gap-2 px-6 py-4 bg-white/5 text-white/60 font-bold text-sm rounded-2xl hover:bg-white/10 transition-colors"
                                    >
                                        דלג <ArrowLeft className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
