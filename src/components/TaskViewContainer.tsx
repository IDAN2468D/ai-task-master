'use client';

import { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import EisenhowerMatrix from './EisenhowerMatrix';
import AutoScheduler from './AutoScheduler';
import MindMapViewer from './MindMapViewer';
import { Columns, LayoutGrid, Zap, Network, CalendarClock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    energyLevel?: string;
}

export default function TaskViewContainer({ tasks }: { tasks: Task[] }) {
    const [activeView, setActiveView] = useState<'kanban' | 'matrix' | 'timeline' | 'mindmap'>('kanban');
    
    // Low, Medium, High, or 'All'
    const [energyFilter, setEnergyFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

    // Filter tasks based on energy level
    const filteredTasks = tasks.filter(t => {
        if (energyFilter === 'All') return true;
        // Assume default is Medium if not set
        const taskEnergy = t.energyLevel || 'Medium';
        return taskEnergy === energyFilter;
    });

    return (
        <div className="flex flex-col gap-6">
            {/* View Selector & Energy Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-[#111C44]/50 backdrop-blur-md rounded-[32px] border border-slate-200/60 dark:border-white/5 shadow-xl shadow-[var(--primary)]/5">
                
                {/* View Switcher */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#0B1437] rounded-3xl self-start md:self-auto">
                    <ViewButton
                        active={activeView === 'kanban'}
                        onClick={() => setActiveView('kanban')}
                        icon={Columns}
                        label="קנבן"
                    />
                    <ViewButton
                        active={activeView === 'matrix'}
                        onClick={() => setActiveView('matrix')}
                        icon={LayoutGrid}
                        label="מטריצה"
                    />
                    <ViewButton
                        active={activeView === 'timeline'}
                        onClick={() => setActiveView('timeline')}
                        icon={CalendarClock}
                        label="יומן (AI)"
                    />
                    <ViewButton
                        active={activeView === 'mindmap'}
                        onClick={() => setActiveView('mindmap')}
                        icon={Network}
                        label="מפת חשיבה"
                    />
                </div>

                {/* Energy Matcher Filter */}
                <div className="flex-1 flex items-center md:justify-end gap-3 mt-4 md:mt-0">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">רמת אנרגיה כרגע:</span>
                    <div className="flex bg-slate-100 dark:bg-[#0B1437] p-1 rounded-3xl relative">
                        {['All', 'Low', 'Medium', 'High'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setEnergyFilter(level as any)}
                                className={`relative px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors z-10 ${
                                    energyFilter === level ? 'text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                }`}
                            >
                                {energyFilter === level && (
                                    <motion.div
                                        layoutId="energyTracker"
                                        className={`absolute inset-0 rounded-2xl -z-10 ${
                                            level === 'All' ? 'bg-slate-500' :
                                            level === 'Low' ? 'bg-emerald-500' :
                                            level === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                    />
                                )}
                                {level === 'All' ? 'הכל' : level === 'Low' ? 'עייף (Low)' : level === 'Medium' ? 'רגיל (Med)' : 'בשיא (High)'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Render Active View */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[600px]"
                >
                    {activeView === 'kanban' && <KanbanBoard tasks={filteredTasks} />}
                    {activeView === 'matrix' && <EisenhowerMatrix tasks={filteredTasks} />}
                    {activeView === 'timeline' && <AutoScheduler tasks={filteredTasks} />}
                    {activeView === 'mindmap' && <MindMapViewer tasks={filteredTasks} />}
                </motion.div>
            </AnimatePresence>

        </div>
    );
}

function ViewButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
                active ? 'bg-white dark:bg-[#111C44] text-[var(--primary)] shadow-md shadow-[var(--primary)]/10 scale-100' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 scale-95'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest hidden md:block">{label}</span>
        </button>
    );
}
