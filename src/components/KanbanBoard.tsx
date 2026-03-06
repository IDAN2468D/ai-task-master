'use client';

import { updateTaskStatus } from '@/actions/taskActions';
import TaskItem from './TaskItem';
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
import { useState, useMemo } from 'react';

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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const columns = [
        { id: 'Todo', title: 'To Do', color: 'bg-indigo-500' },
        { id: 'InProgress', title: 'In Progress', color: 'bg-blue-500' },
        { id: 'Done', title: 'Done', color: 'bg-emerald-500' },
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

        // Check if dropping over a column or another task
        const isOverAColumn = columns.find(col => col.id === overId);

        if (isOverAColumn) {
            if (activeTask.status !== overId) {
                setTasks(prev => prev.map(t =>
                    t._id === activeId ? { ...t, status: overId as any } : t
                ));
            }
            return;
        }

        const overTask = tasks.find(t => t._id === overId);
        if (overTask && activeTask.status !== overTask.status) {
            setTasks(prev => prev.map(t =>
                t._id === activeId ? { ...t, status: overTask.status } : t
            ));
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const finalTaskState = tasks.find(t => t._id === activeId);
        if (finalTaskState) {
            // Sync with server
            await updateTaskStatus(activeId, finalTaskState.status);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {columns.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.id);

                    return (
                        <div key={col.id} id={col.id} className="flex flex-col h-full min-h-[500px]">
                            <div className="flex items-center gap-3 mb-6 px-4 py-2">
                                <div className={`w-3 h-3 rounded-full ${col.color} shadow-lg shadow-${col.color}/30`} />
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{col.title}</h3>
                                <span className="ml-auto bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-xl text-xs font-black">
                                    {colTasks.length}
                                </span>
                            </div>

                            <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-colors">
                                <SortableContext items={colTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4">
                                        {colTasks.map((task) => (
                                            <TaskItem key={task._id} task={task} />
                                        ))}
                                        {colTasks.length === 0 && (
                                            <div className="py-20 text-center text-slate-300 dark:text-slate-700 italic text-sm">
                                                Drop tasks here
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </div>
                        </div>
                    );
                })}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.5',
                        },
                    },
                }),
            }}>
                {activeTask ? <TaskItem task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
