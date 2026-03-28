'use client';

import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Target, CupSoda, Sparkles } from 'lucide-react';
import { distributeTasksMatrix } from '@/actions/taskActions';

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    dueDate?: string;
    subtasks: any[];
    createdAt: string;
}

export default function EisenhowerMatrix({ tasks: initialTasks }: { tasks: Task[] }) {
    const [isMounted, setIsMounted] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [matrixData, setMatrixData] = useState<Record<string, string>>({});

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        if (Object.keys(matrixData).length === 0 && initialTasks.length > 0) {
            const initial: Record<string, string> = {};
            initialTasks.forEach(t => {
                if (t.priority === 'High' && t.dueDate) initial[t._id] = 'Q1';
                else if (t.priority === 'High') initial[t._id] = 'Q2';
                else if (t.dueDate) initial[t._id] = 'Q3';
                else initial[t._id] = 'Q4';
            });
            setMatrixData(initial);
        }
    }, [initialTasks, matrixData]);

    const handleAIAssign = async () => {
        setIsAnalyzing(true);
        const simpleTasks = initialTasks.filter(t => t.status !== 'Done').map(t => ({ id: t._id, title: t.title, desc: t.description || '' }));
        try {
            const result = await distributeTasksMatrix(simpleTasks);
            if (result && result.success) {
                setMatrixData(result.mapping);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isMounted) return <div className="h-96 flex items-center justify-center font-black text-blue-500 animate-pulse uppercase tracking-[0.2em]">Configuring Decision Grid...</div>;

    const quadrants = [
        { id: 'Q1', title: 'דחוף וחשוב', subtitle: 'Execute Now', icon: AlertTriangle, color: 'text-rose-500', bg: 'rgba(244, 63, 94, 0.03)', glow: 'rgba(244, 63, 94, 0.2)' },
        { id: 'Q2', title: 'חשוב, לא דחוף', subtitle: 'Strategic Planning', icon: Target, color: 'text-indigo-500', bg: 'rgba(79, 70, 229, 0.03)', glow: 'rgba(79, 70, 229, 0.2)' },
        { id: 'Q3', title: 'דחוף, לא חשוב', subtitle: 'Delegate Flow', icon: Clock, color: 'text-amber-500', bg: 'rgba(245, 158, 11, 0.03)', glow: 'rgba(245, 158, 11, 0.2)' },
        { id: 'Q4', title: 'לא דחוף, לא חשוב', subtitle: 'Analyze Value', icon: CupSoda, color: 'text-slate-400', bg: 'rgba(148, 163, 184, 0.03)', glow: 'rgba(148, 163, 184, 0.2)' },
    ];

    const activeTasks = initialTasks.filter(t => t.status !== 'Done');

    return (
        <div className="relative" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mb-1">מטריצת אייזנהוור</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimizing decision-making through cognitive mapping.</p>
                </div>
                <button
                    onClick={handleAIAssign}
                    disabled={isAnalyzing}
                    className="elite-button elite-button-primary scale-90"
                >
                    {isAnalyzing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    <span className="relative z-10">{isAnalyzing ? "Neural Mapping..." : "Analyze with AI"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full relative">
                {/* Center Axis Grid Lines - Ultra Precision */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent z-0 hidden lg:block -translate-y-1/2 opacity-20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-indigo-500/30 to-transparent z-0 hidden lg:block -translate-x-1/2 opacity-20" />

                {quadrants.map((quad) => {
                    const quadTasks = activeTasks.filter(t => matrixData[t._id] === quad.id);
                    return (
                        <div 
                            key={quad.id} 
                            className="elite-column !min-h-[500px] !p-12 hover:scale-[1.01]"
                            style={{ background: quad.bg }}
                        >
                            {/* Neural Status Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-30" style={{ color: quad.glow }} />
                            
                            <div className="flex items-center justify-between mb-10 px-2">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl glass-panel flex items-center justify-center shadow-2xl ${quad.color}`}>
                                        <quad.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none mb-2">{quad.title}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60">{quad.subtitle}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-xl text-xs font-black glass-panel border shadow-2xl ${quad.color}`}>
                                    {quadTasks.length.toString().padStart(2, '0')}
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {quadTasks.map((task, i) => (
                                        <motion.div
                                            key={task._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            <TaskItem task={task} compact={true} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {quadTasks.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-10">
                                        <div className="w-16 h-16 rounded-3xl border-2 border-dashed border-slate-400 flex items-center justify-center mb-6">
                                            <Target className="w-7 h-7 text-slate-400" />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em]">Sector Vacant</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
