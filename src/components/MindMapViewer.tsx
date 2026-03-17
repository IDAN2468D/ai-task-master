'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, FileCheck, Layers, Sparkles } from 'lucide-react';
import { generateMindMap } from '@/actions/taskActions';

interface Task {
    _id: string;
    title: string;
    status: 'Todo' | 'InProgress' | 'Done';
    subtasks: any[];
}

export default function MindMapViewer({ tasks }: { tasks: Task[] }) {
    const [mindMapData, setMindMapData] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const activeTasks = tasks.filter(t => t.status !== 'Done');

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await generateMindMap(activeTasks.map(t => ({ id: t._id, title: t.title, subtaskCount: t.subtasks.length })));
            if (res.success) setMindMapData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">מפת חשיבה (Mind Map)</h3>
                    <p className="text-xs font-bold text-slate-500 ml-2">קבל מבט-על על כל המשימות שלך וסדר הפעולות.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || activeTasks.length === 0}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                    {isGenerating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    )}
                    {isGenerating ? "מחולל מפה..." : "ייצר מפה"}
                </button>
            </div>

            <div className="bg-white dark:bg-[#111C44]/50 backdrop-blur-md rounded-[32px] border border-slate-200/60 dark:border-white/5 shadow-xl p-8 min-h-[600px] flex items-center justify-center overflow-x-auto overflow-y-hidden relative no-scrollbar">
                
                {!mindMapData && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-60 z-20">
                        <Network className="w-16 h-16 text-slate-400 mb-4 opacity-50" />
                        <h4 className="text-xl font-black text-slate-600 dark:text-slate-300">עדיין אין מפה</h4>
                        <p className="text-sm font-bold text-slate-400 mt-2">לחץ על 'ייצר מפה' כדי שה-AI ינתח ויחבר בין המשימות שלך.</p>
                    </div>
                )}

                {mindMapData && (
                    <div className="flex items-center gap-12 min-w-max p-12">
                        {/* Root Node */}
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl flex flex-col items-center justify-center text-white border-4 border-white dark:border-[#111C44] z-10 relative"
                            >
                                <Network className="w-8 h-8 mb-2 opacity-80" />
                                <span className="text-xs font-black uppercase tracking-widest text-center px-2">הפרויקטים שלי</span>
                            </motion.div>
                        </div>

                        {/* Connection Lines & Children */}
                        <div className="flex flex-col gap-16 relative">
                            {/* Horizontal Line from Root */}
                            <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-slate-300 dark:bg-slate-700 -translate-y-1/2 -z-10" />
                            {/* Vertical Line connecting children */}
                            {mindMapData.nodes.length > 1 && (
                                <div className="absolute -left-12 top-10 bottom-10 w-0.5 bg-slate-300 dark:bg-slate-700 -z-10" />
                            )}

                            {mindMapData.nodes.map((node: any, i: number) => (
                                <div key={node.id} className="relative flex items-center gap-12">
                                    {/* Connector to parent */}
                                    <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-slate-300 dark:bg-slate-700 -translate-y-1/2 -z-10" />

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                        className="w-48 p-4 bg-white dark:bg-[#0B1437] rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg relative z-10"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                                            <FileCheck className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug">{node.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{node.category || 'כללי'}</p>
                                    </motion.div>

                                    {/* Subtasks (Leaves) */}
                                    {node.subNodes && node.subNodes.length > 0 && (
                                        <div className="flex flex-col gap-4 relative">
                                            {/* Vertical line connecting subnodes */}
                                            {node.subNodes.length > 1 && (
                                                <div className="absolute -left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-white/5 -z-10" />
                                            )}
                                            {node.subNodes.map((sub: any, j: number) => (
                                                <div key={sub.id} className="relative">
                                                     {/* Horizontal connector */}
                                                    <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-slate-200 dark:bg-white/5 -translate-y-1/2 -z-10" />
                                                    
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 + j * 0.05 + 0.4 }}
                                                        className="w-40 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"
                                                    >
                                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                            <Layers className="w-3 h-3" />
                                                            <span className="text-xs font-bold truncate">{sub.title}</span>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
