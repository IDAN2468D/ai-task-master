'use client';

import { updateTaskStatus } from '@/actions/taskActions';
import TaskItem from './TaskItem';
import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
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
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = [
        { id: 'Todo', title: 'לביצוע', icon: Inbox, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10', border: 'border-[var(--primary)]/20 shadow-[var(--primary-glow)]' },
        { id: 'InProgress', title: 'בתהליך', icon: Workflow, color: 'text-[var(--accent-1)]', bg: 'bg-[var(--accent-1)]/5 dark:bg-[var(--accent-1)]/10', border: 'border-[var(--accent-1)]/20 shadow-[var(--primary-glow)]' },
        { id: 'Done', title: 'הושלם', icon: Archive, color: 'text-[var(--accent-2)]', bg: 'bg-[var(--accent-2)]/5 dark:bg-[var(--accent-2)]/10', border: 'border-[var(--accent-2)]/20 shadow-[var(--primary-glow)]' },
    ];

    const handleDragStart = (e: DragStartEvent) => {
        const t = tasks.find(x => x._id === e.active.id);
        if (t) setActiveTask(t);
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
        setActiveTask(null);
        if (!e.over) return;
        const fin = tasks.find(t => t._id === e.active.id);
        if (fin) await updateTaskStatus(e.active.id as string, fin.status);
    };

    if (!isMounted) return <div className="h-96 flex items-center justify-center font-bold text-blue-500 animate-pulse">טוען לוח...</div>;

    return (
        <div className="relative">
            {/* AI Magic Sort Header */}
            <div className="flex justify-center md:justify-end mb-8">
                <button
                    onClick={handleMagicSort}
                    disabled={isSorting}
                    className="group flex items-center gap-3 px-6 py-3 bg-gradient-stat-1 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:shadow-xl hover:shadow-[var(--primary-glow)] hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                    {isSorting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    )}
                    {isSorting ? "AI ממיין..." : "מיון חכם AI"}
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {columns.map((col) => {
                        const colTasks = tasks.filter((t) => t.status === col.id);
                        return <KanbanColumn key={col.id} col={col} tasks={colTasks} />;
                    })}
                </div>

                <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                    {activeTask ? (
                        <div className="opacity-95 shadow-2xl scale-105 rotate-1">
                            <TaskItem task={activeTask} />
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
        <div ref={setNodeRef} className={`flex flex-col h-full min-h-[650px] rounded-[32px] p-6 transition-all border shadow-sm ${col.bg} ${col.border}`}>
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl bg-white dark:bg-[#111C44] shadow-sm ${col.color}`}>
                        <col.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[15px] font-black text-slate-800 dark:text-white uppercase tracking-widest">{col.title}</h3>
                </div>
                <div className={`flex items-center justify-center min-w-[28px] h-7 px-2 rounded-xl text-[11px] font-black shadow-inner bg-white/50 dark:bg-[#0B1437]/50 ${col.color} border border-white/50 dark:border-white/5`}>
                    {tasks.length}
                </div>
            </div>

            <div className="flex-1 space-y-5">
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => <TaskItem key={task._id} task={task} />)}
                    {tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-40 flex flex-col items-center justify-center gap-2 text-center border-2 border-dashed border-slate-300/30 dark:border-white/5 rounded-3xl bg-white/20 dark:bg-black/5"
                        >
                            <p className="text-[11px] font-bold text-slate-400">הרשימה ריקה</p>
                        </motion.div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
