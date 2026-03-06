'use client';

import { updateTaskStatus } from '@/actions/taskActions';
import TaskItem from './TaskItem';
import { useState, useMemo, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Zap, Command, Layers, Activity } from 'lucide-react';

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
        { id: 'Todo', title: 'Inbox', color: 'bg-indigo-500', desc: 'Awaiting Focus' },
        { id: 'InProgress', title: 'Action', color: 'bg-blue-500', desc: 'Strategic Flow' },
        { id: 'Done', title: 'Archive', color: 'bg-emerald-500', desc: 'Mission Success' },
    ];

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t._id === event.active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id as string;
        const overId = over.id as string;
        const activeTask = tasks.find(t => t._id === activeId);
        if (!activeTask) return;

        const isOverAColumn = columns.find(col => col.id === overId);
        if (isOverAColumn) {
            if (activeTask.status !== (overId as any)) {
                setTasks(prev => prev.map(t => t._id === activeId ? { ...t, status: overId as any } : t));
            }
            return;
        }

        const overTask = tasks.find(t => t._id === overId);
        if (overTask && activeTask.status !== overTask.status) {
            setTasks(prev => prev.map(t => t._id === activeId ? { ...t, status: overTask.status } : t));
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);
        if (!over) return;
        const activeId = active.id as string;
        const finalTaskState = tasks.find(t => t._id === activeId);
        if (finalTaskState) await updateTaskStatus(activeId, finalTaskState.status);
    };

    if (!isMounted) return <div className="h-96 flex items-center justify-center text-slate-800 font-black uppercase tracking-widest animate-pulse">Initializing Board...</div>;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="ether-card !rounded-[3rem] p-4 lg:p-10 mb-20 relative overflow-hidden group/board">

                {/* Board Surface Background */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
                    {columns.map((col, idx) => {
                        const colTasks = tasks.filter((t) => t.status === col.id);

                        return (
                            <div
                                key={col.id}
                                id={col.id}
                                className={`flex flex-col h-full min-h-[700px] transition-all duration-700 ${idx !== 0 ? 'md:border-l border-white/[0.03]' : ''} px-6 py-4`}
                            >
                                {/* Column Header */}
                                <div className="flex flex-col gap-1 mb-10">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${col.color} animate-pulse shadow-[0_0_10px_currentColor]`} />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white transition-opacity group-hover/board:opacity-100">{col.title}</h3>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block pl-3.5 group-hover/board:text-slate-400 transition-colors">{col.desc}</span>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <SortableContext items={colTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                                        {colTasks.map((task) => (
                                            <TaskItem key={task._id} task={task} />
                                        ))}
                                        {colTasks.length === 0 && (
                                            <div className="h-60 flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-white/[0.03] rounded-[2.5rem]">
                                                <Command className="w-6 h-6 text-slate-900" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Clear Space.</p>
                                            </div>
                                        )}
                                    </SortableContext>
                                </div>

                                {/* Column Footer: AI Workload Score */}
                                <div className="mt-8 pt-4 border-t border-white/[0.02] flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-600">
                                        <Activity className="w-3 h-3" />
                                        <span>Workload: {colTasks.length > 5 ? 'High' : 'Optimal'}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white/20">{colTasks.length}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.05' } } }) }}>
                {activeTask ? <TaskItem task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
