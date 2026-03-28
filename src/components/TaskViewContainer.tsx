'use client';

import { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import EisenhowerMatrix from './EisenhowerMatrix';
import AutoScheduler from './AutoScheduler';
import MindMapViewer from './MindMapViewer';
import EnergyLevelFilter from './EnergyLevelFilter';
import { Columns, LayoutGrid, Zap, Network, CalendarClock, BrainCircuit, Activity, Settings2, Database, ShieldCheck } from 'lucide-react';
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
    const [energyFilter, setEnergyFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

    const filteredTasks = tasks.filter(t => {
        if (energyFilter === 'All') return true;
        const taskEnergy = t.energyLevel || 'Medium';
        return taskEnergy === energyFilter;
    });

    return (
        <div id="active-tasks" className="flex flex-col gap-10 w-full max-w-full overflow-hidden">
            
            {/* Neural Control Strip: Compact Command Center */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 p-8 glass-panel rounded-[4rem] border-slate-200/50 dark:border-white/5 relative group/control bg-white/40 dark:bg-black/20">
                
                <div className="absolute inset-x-0 top-0 h-px bg-indigo-500/20" />
                
                {/* View Switcher: High-Precision Controller */}
                <div className="flex items-center gap-3 p-2 bg-slate-100/30 dark:bg-white/5 rounded-full self-start xl:self-auto border border-black/5 dark:border-white/5 relative z-10 overflow-x-auto no-scrollbar">
                    <ViewButton
                        active={activeView === 'kanban'}
                        onClick={() => setActiveView('kanban')}
                        icon={Columns}
                        label="Nodes"
                    />
                    <ViewButton
                        active={activeView === 'matrix'}
                        onClick={() => setActiveView('matrix')}
                        icon={LayoutGrid}
                        label="Matrix"
                    />
                    <ViewButton
                        active={activeView === 'timeline'}
                        onClick={() => setActiveView('timeline')}
                        icon={CalendarClock}
                        label="Timeline"
                    />
                    <ViewButton
                        active={activeView === 'mindmap'}
                        onClick={() => setActiveView('mindmap')}
                        icon={Network}
                        label="Neural"
                    />
                </div>

                {/* Status & Filter Hub */}
                <div className="flex items-center gap-8 relative z-10 w-full xl:w-auto" dir="rtl">
                    <div className="hidden lg:flex flex-col items-end gap-1 text-slate-400 group/status cursor-default">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60">Neural Core v6.0</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        </div>
                        <div className="h-1 w-24 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-indigo-500" 
                                animate={{ width: ["20%", "90%", "20%"] }} 
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
                            />
                        </div>
                    </div>
                    <div className="w-full xl:w-auto">
                        <EnergyLevelFilter currentFilter={energyFilter} onFilterChange={setEnergyFilter as any} />
                    </div>
                </div>
            </div>

            {/* Neural Workspace Container */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 30, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.99 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 40,
                        mass: 0.5
                    }}
                    className="w-full min-h-[800px]"
                >
                    <div className="elite-card md:p-10 p-6 min-h-[800px] flex flex-col border-slate-200/50 dark:border-white/5 relative bg-white/40 dark:bg-black/10 backdrop-blur-2xl">
                        <div className="absolute inset-0 elite-scanline opacity-[0.02] pointer-events-none" />
                        
                        <div className="flex-1 rounded-[3rem] overflow-hidden relative z-10">
                            {activeView === 'kanban' && <KanbanBoard tasks={filteredTasks} />}
                            {activeView === 'matrix' && <EisenhowerMatrix tasks={filteredTasks} />}
                            {activeView === 'timeline' && <AutoScheduler tasks={filteredTasks} />}
                            {activeView === 'mindmap' && <MindMapViewer tasks={filteredTasks} />}
                        </div>
                        
                        {/* Elite Status Bar */}
                        <footer className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-white/5 pt-8 gap-6">
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-3">
                                    <Activity size={14} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core: Optimized</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Database size={14} className="text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync: {tasks.length} Nodes</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
                                <ShieldCheck size={12} className="text-indigo-500/50" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Protocol v6.2</span>
                            </div>
                        </footer>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function ViewButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <motion.button
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center gap-5 px-9 py-5 rounded-[32px] transition-all duration-700 whitespace-nowrap relative group/btn overflow-hidden ${
                active 
                ? 'text-white' 
                : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
        >
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="active-view-bg"
                        className="absolute inset-0 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                )}
            </AnimatePresence>
            
            <Icon className={`w-5 h-5 relative z-10 transition-transform duration-700 ${active ? 'animate-pulse scale-110' : 'group-hover/btn:rotate-12 group-hover/btn:scale-110'}`} />
            <span className="text-[12px] font-black font-outfit uppercase tracking-[0.25em] relative z-10">{label}</span>
            
            {active && (
                <motion.div 
                    className="absolute bottom-0 left-0 w-full h-1 bg-white/40"
                    layoutId="active-view-underline"
                />
            )}
            
            {/* Glossy Overlay for Active State */}
            {active && (
                <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent opacity-50 relative z-20 pointer-events-none" />
            )}
        </motion.button>
    );
}
