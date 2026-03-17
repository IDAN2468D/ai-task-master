'use client';

import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { motion } from 'framer-motion';
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
    
    // We'll store the assigned quadrant for each task ID: { taskId: 'Q1' | 'Q2' | 'Q3' | 'Q4' }
    const [matrixData, setMatrixData] = useState<Record<string, string>>({});

    useEffect(() => { setIsMounted(true); }, []);

    // Initial naive distribution (fallback)
    useEffect(() => {
        if (Object.keys(matrixData).length === 0 && initialTasks.length > 0) {
            const initial: Record<string, string> = {};
            initialTasks.forEach(t => {
                if (t.priority === 'High' && t.dueDate) initial[t._id] = 'Q1'; // Urgent & Important
                else if (t.priority === 'High') initial[t._id] = 'Q2'; // Important, Not Urgent
                else if (t.dueDate) initial[t._id] = 'Q3'; // Urgent, Not Important
                else initial[t._id] = 'Q4'; // Not Urgent, Not Important
            });
            setMatrixData(initial);
        }
    }, [initialTasks, matrixData]);

    const handleAIAssign = async () => {
        setIsAnalyzing(true);
        // Map tasks to simple objects for AI
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

    if (!isMounted) return <div className="h-96 flex items-center justify-center font-bold text-blue-500 animate-pulse">טוען מטריצה...</div>;

    const quadrants = [
        { id: 'Q1', title: 'דחוף וחשוב', subtitle: 'תעשה עכשיו!', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10 dark:bg-red-500/10', border: 'border-red-500/20 shadow-red-500/10' },
        { id: 'Q2', title: 'חשוב, לא דחוף', subtitle: 'תכנן למתישהו', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10 dark:bg-blue-500/10', border: 'border-blue-500/20 shadow-blue-500/10' },
        { id: 'Q3', title: 'דחוף, לא חשוב', subtitle: 'תאציל (Delegate)', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 dark:bg-amber-500/10', border: 'border-amber-500/20 shadow-amber-500/10' },
        { id: 'Q4', title: 'לא דחוף, לא חשוב', subtitle: 'אולי כדאי למחוק?', icon: CupSoda, color: 'text-slate-500', bg: 'bg-slate-500/10 dark:bg-slate-500/10', border: 'border-slate-500/20 shadow-slate-500/10' },
    ];

    const activeTasks = initialTasks.filter(t => t.status !== 'Done');

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">מטריצת אייזנהוור</h3>
                    <p className="text-xs font-bold text-slate-500 ml-2">קבל החלטות טובות יותר לגבי ניהול הזמן שלך.</p>
                </div>
                <button
                    onClick={handleAIAssign}
                    disabled={isAnalyzing}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-stat-2 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:shadow-xl hover:shadow-[#00E5FF]/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                    {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    )}
                    {isAnalyzing ? "AI מנתח..." : "סדר עם AI"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-white/5 rounded-full z-0 hidden md:block -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-white/5 rounded-full z-0 hidden md:block -translate-x-1/2" />

                {quadrants.map((quad) => {
                    const quadTasks = activeTasks.filter(t => matrixData[t._id] === quad.id);
                    return (
                        <div key={quad.id} className={`relative z-10 flex flex-col min-h-[400px] rounded-[32px] p-6 transition-all border backdrop-blur-sm ${quad.bg} ${quad.border} shadow-xl`}>
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className={`p-2.5 rounded-2xl bg-white dark:bg-[#111C44] shadow-sm ${quad.color}`}>
                                    <quad.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">{quad.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{quad.subtitle}</p>
                                </div>
                                <div className={`mr-auto flex items-center justify-center min-w-[28px] h-7 px-2 rounded-xl text-[11px] font-black shadow-inner bg-white/50 dark:bg-[#0B1437]/50 ${quad.color} border border-white/50 dark:border-white/5`}>
                                    {quadTasks.length}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
                                {quadTasks.map((task, i) => (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <TaskItem task={task} compact={true} />
                                    </motion.div>
                                ))}
                                {quadTasks.length === 0 && (
                                    <div className="h-20 flex flex-col items-center justify-center text-center opacity-50">
                                        <p className="text-[10px] font-bold text-slate-400">אין משימות כאן</p>
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
