'use client';

import { updateTaskStatus } from '@/actions/taskActions';
import TaskItem from './TaskItem';
import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Layers, Activity, Inbox, Workflow, Archive } from 'lucide-react';

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

    useEffect(() => { setTasks(initialTasks); }, [initialTasks]);
    useEffect(() => { setIsMounted(true); }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = [
        { id: 'Todo', title: 'To Do', icon: Inbox, color: 'text-[#4318FF]', bg: 'bg-[#4318FF]/5 dark:bg-[#4318FF]/10', border: 'border-[#4318FF]/20' },
        { id: 'InProgress', title: 'In Progress', icon: Workflow, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/5 dark:bg-[#00E5FF]/10', border: 'border-[#00E5FF]/20' },
        { id: 'Done', title: 'Completed', icon: Archive, color: 'text-[#FF7D00]', bg: 'bg-[#FF7D00]/5 dark:bg-[#FF7D00]/10', border: 'border-[#FF7D00]/20' },
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

    if (!isMounted) return <div className="h-96 flex items-center justify-center font-bold text-blue-500 animate-pulse">Loading Board...</div>;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {columns.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.id);

                    return (
                        <div key={col.id} id={col.id} className={`flex flex-col h-full min-h-[600px] rounded-3xl p-4 md:p-6 transition-all border ${col.bg} ${col.border}`}>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl bg-white dark:bg-[#111C44] shadow-sm ${col.color}`}>
                                        <col.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{col.title}</h3>
                                </div>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner bg-white dark:bg-[#0B1437] ${col.color}`}>
                                    {colTasks.length}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4">
                                <SortableContext items={colTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                                    {colTasks.map((task) => <TaskItem key={task._id} task={task} />)}
                                    {colTasks.length === 0 && (
                                        <div className="h-40 flex flex-col items-center justify-center gap-2 text-center border-2 border-dashed border-[#4318FF]/20 rounded-2xl bg-white/50 dark:bg-black/20">
                                            <p className="text-xs font-bold text-slate-400">Empty List</p>
                                        </div>
                                    )}
                                </SortableContext>
                            </div>

                        </div>
                    );
                })}
            </div>

            <DragOverlay>
                {activeTask ? <div className="opacity-90 shadow-[0_30px_60px_rgba(67,24,255,0.3)]"><TaskItem task={activeTask} /></div> : null}
            </DragOverlay>
        </DndContext>
    );
}
