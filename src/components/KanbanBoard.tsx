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
        { id: 'Todo', title: 'To Do', color: 'bg-indigo-500' },
        { id: 'InProgress', title: 'InProgress', color: 'bg-blue-500' },
        { id: 'Done', title: 'Completed', color: 'bg-emerald-500' },
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
            if (activeTask.status !== overId) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {columns.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.id);

                    return (
                        <div key={col.id} id={col.id} className="flex flex-col h-full min-h-[600px]">
                            <div className="flex items-center gap-3 mb-8 px-6">
                                <div className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{col.id === 'InProgress' ? 'In Progress' : col.title}</h3>
                                <span className="text-[10px] font-black tabular-nums text-slate-700 ml-auto bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">{colTasks.length}</span>
                            </div>

                            <div className="flex-1 space-y-4">
                                <SortableContext items={colTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                                    {colTasks.map((task) => (
                                        <TaskItem key={task._id} task={task} />
                                    ))}
                                    {colTasks.length === 0 && (
                                        <div className="p-10 text-center text-slate-900 font-bold border-2 border-dashed border-slate-900 rounded-[2.5rem]">
                                            Nothing Active.
                                        </div>
                                    )}
                                </SortableContext>
                            </div>
                        </div>
                    );
                })}
            </div>

            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.1' } } }) }}>
                {activeTask ? <TaskItem task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
