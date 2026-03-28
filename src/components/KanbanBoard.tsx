'use client';

import { updateTaskStatus } from '@/actions/taskActions';
import TaskItem from './TaskItem';
import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, rectIntersection, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Workflow, Archive, Sparkles } from 'lucide-react';

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

export default function KanbanBoard({ tasks: initialTasks }: { tasks: Task[] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isSorting, setIsSorting] = useState(false);

    useEffect(() => { setTasks(initialTasks); }, [initialTasks]);
    useEffect(() => { setIsMounted(true); }, []);

    const handleMagicSort = () => {
        setIsSorting(true);
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        setTimeout(() => {
            const sorted = [...tasks].sort((a, b) => {
                const priorityMap: any = { High: 0, Medium: 1, Low: 2 };
                return priorityMap[a.priority] - priorityMap[b.priority];
            });
            setTasks(sorted);
            setIsSorting(false);
        }, 1500);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = [
        { id: 'Todo', title: 'לביצוע', icon: Inbox, color: 'text-indigo-500', glow: 'var(--primary-glow)', bg: 'rgba(79, 70, 229, 0.02)', border: 'rgba(79, 70, 229, 0.1)' },
        { id: 'InProgress', title: 'בתהליך', icon: Workflow, color: 'text-cyan-500', glow: 'rgba(6, 182, 212, 0.12)', bg: 'rgba(6, 182, 212, 0.02)', border: 'rgba(6, 182, 212, 0.1)' },
        { id: 'Done', title: 'הושלם', icon: Archive, color: 'text-emerald-500', glow: 'rgba(16, 185, 129, 0.12)', bg: 'rgba(16, 185, 129, 0.02)', border: 'rgba(16, 185, 129, 0.1)' },
    ];

    const handleDragStart = (e: DragStartEvent) => {
        const t = tasks.find(x => x._id === e.active.id);
        if (t) {
            setActiveTask(t);
            if (navigator.vibrate) navigator.vibrate(10);
        }
    };

    const handleDragOver = (e: DragOverEvent) => {
        const { active, over } = e;
        if (!over) return;
        const aTask = tasks.find(t => t._id === active.id);
        if (!aTask) return;

        const isCol = columns.find(c => c.id === over.id);
        if (isCol) {
            if (aTask.status !== (over.id as any)) {
                setTasks(p => p.map(t => t._id === active.id ? { ...t, status: over.id as any } : t));
            } return;
        }

        const oTask = tasks.find(t => t._id === over.id);
        if (oTask && aTask.status !== oTask.status) {
            setTasks(p => p.map(t => t._id === active.id ? { ...t, status: oTask.status } : t));
        }
    };

    const handleDragEnd = async (e: DragEndEvent) => {
        const { active, over } = e;
        setActiveTask(null);
        if (!over) return;

        if (navigator.vibrate) navigator.vibrate(20);

        let newStatus: Task['status'] | null = null;
        const isCol = columns.find(c => c.id === over.id);
        if (isCol) {
            newStatus = over.id as any;
        } else {
            const oTask = tasks.find(t => t._id === over.id);
            if (oTask) newStatus = oTask.status;
        }

        if (newStatus) {
            await updateTaskStatus(active.id as string, newStatus);
        }
    };

    if (!isMounted) return (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <div className="font-outfit font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Neural Matrix Syncing...</div>
        </div>
    );

    return (
        <div className="relative font-outfit">
            {/* Platinum AI Magic Sort Header */}
            <div className="flex justify-center md:justify-end mb-20 px-4">
                <button
                    onClick={handleMagicSort}
                    disabled={isSorting}
                    className="group relative px-12 py-6 bg-linear-to-br from-indigo-700 via-violet-700 to-indigo-900 rounded-[50px] text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] transition-all hover:scale-110 hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden border border-white/20"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 shimmer-elite opacity-30" />
                    <div className="flex items-center gap-5 relative z-10">
                        {isSorting ? (
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5 group-hover:rotate-[30deg] transition-all duration-700 text-amber-300" />
                        )}
                        <span className="platinum-glow">{isSorting ? "Cognitive Realignment..." : "Platinum Neural Sort V7"}</span>
                    </div>
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 w-full pb-20" dir="rtl">
                    {columns.map((col) => {
                        const colTasks = tasks.filter((t) => t.status === col.id);
                        return <KanbanColumn key={col.id} col={col} tasks={colTasks} />;
                    })}
                </div>

                <DragOverlay dropAnimation={{ duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {activeTask ? (
                        <div className="opacity-80 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.6)] scale-110 -rotate-3 transition-all duration-500">
                            <TaskItem task={activeTask} compact={true} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

function KanbanColumn({ col, tasks }: { col: any, tasks: Task[] }) {
    const { setNodeRef } = useDroppable({ id: col.id });

    return (
        <div 
            ref={setNodeRef} 
            className="group/col relative flex flex-col min-h-[800px] p-10 elite-card rounded-[60px] overflow-hidden transition-all duration-1000 hover:border-indigo-500/30 shadow-2xl"
            style={{ 
                background: col.bg,
                borderColor: col.border
            }}
        >
            {/* Platinum Neural Scanner - Column Specific */}
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={`absolute top-0 left-0 w-1/2 h-[1px] ${col.color.replace('text-', 'bg-')} z-20 opacity-20 group-hover/col:opacity-60 transition-opacity`} 
            />
            
            {/* Top Gloss & Refined Depth */}
            <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-white/15 dark:from-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-white/5 to-transparent" />
            
            {/* Column Header V7 */}
            <div className="flex items-center justify-between mb-12 relative z-10 px-2">
                <div className="flex items-center gap-8">
                    <div className={`w-18 h-18 flex items-center justify-center rounded-[24px] glass-panel shadow-2xl ${col.color} border-white/30 dark:border-white/10 bg-white/70 dark:bg-black/50 group-hover/col:scale-110 transition-transform duration-700`}>
                        <col.icon className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] font-outfit platinum-heading">{col.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                             <div className={`w-2.5 h-2.5 rounded-full ${col.color.replace('text-', 'bg-')} shadow-[0_0_12px_currentColor] animate-pulse-ring relative`} />
                             <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] opacity-80">ACTIVE STREAM</span>
                        </div>
                    </div>
                </div>
                <div className={`flex items-center justify-center min-w-[50px] h-12 px-5 rounded-[20px] text-sm font-black glass-panel border shadow-2xl ${col.color} bg-white/90 dark:bg-white/5 border-white/40 dark:border-white/15`}>
                    {tasks.length}
                </div>
            </div>

            {/* Neural Track - V7 Enhanced */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] overflow-hidden opacity-40">
                <motion.div 
                    className={`h-full w-1/3 blur-md ${col.color.replace('text-', 'bg-')}`}
                    animate={{ x: ['-100%', '500%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Tasks Container V7 */}
            <div className="flex-1 space-y-10 relative z-10 custom-scrollbar overflow-y-auto overflow-x-hidden pr-4 -mr-4 pb-4">
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence mode="popLayout" initial={false}>
                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, scale: 0.85, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -30 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 35,
                                    mass: 1.2
                                }}
                            >
                                <TaskItem task={task} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="h-[400px] flex flex-col items-center justify-center gap-8 border-2 border-dashed border-slate-300/20 dark:border-white/10 rounded-[50px] bg-white/15 dark:bg-black/20 group-hover/col:bg-white/20 dark:group-hover/col:bg-black/30 transition-all duration-700 shadow-inner"
                        >
                            <div className="w-24 h-24 rounded-[32px] bg-slate-100/10 flex items-center justify-center shadow-2xl relative group/void">
                                <Archive className="w-10 h-10 text-slate-400 opacity-30 group-hover/void:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 border border-slate-400/20 rounded-[32px] animate-pulse-ring" />
                            </div>
                            <div className="space-y-4 text-center">
                                <p className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.5em] platinum-glow">Cognitive Void</p>
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-[10px] font-bold text-slate-500/70 uppercase tracking-widest leading-loose max-w-[200px]">
                                        NEURAL CHANNELS QUIESCENT
                                    </p>
                                    <div className="w-12 h-[1px] bg-linear-to-r from-transparent via-slate-400/30 to-transparent" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

