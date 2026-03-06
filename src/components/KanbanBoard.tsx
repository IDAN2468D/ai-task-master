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
        { id: 'Todo', title: 'לביצוע', icon: Inbox, color: 'text-[#4318FF]', bg: 'bg-[#4318FF]/5 dark:bg-[#4318FF]/10', border: 'border-[#4318FF]/20' },
        { id: 'InProgress', title: 'בתהליך', icon: Workflow, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/5 dark:bg-[#00E5FF]/10', border: 'border-[#00E5FF]/20' },
        { id: 'Done', title: 'הושלם', icon: Archive, color: 'text-[#FF7D00]', bg: 'bg-[#FF7D00]/5 dark:bg-[#FF7D00]/10', border: 'border-[#FF7D00]/20' },
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
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleMagicSort}
                    disabled={isSorting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-stat-2 text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                    {isSorting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    {isSorting ? "AI ממיין..." : "מיון חכם AI"}
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {columns.map((col) => {
                        const colTasks = tasks.filter((t) => t.status === col.id);
                        return <KanbanColumn key={col.id} col={col} tasks={colTasks} />;
                    })}
                </div>

                <DragOverlay>
                    {activeTask ? <div className="opacity-90 shadow-[0_30px_60px_rgba(67,24,255,0.3)]"><TaskItem task={activeTask} /></div> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

function KanbanColumn({ col, tasks }: { col: any, tasks: Task[] }) {
    const { setNodeRef } = useDroppable({ id: col.id });

    return (
        <div ref={setNodeRef} className={`flex flex-col h-full min-h-[600px] rounded-3xl p-4 md:p-6 transition-all border ${col.bg} ${col.border}`}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white dark:bg-[#111C44] shadow-sm ${col.color}`}>
                        <col.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{col.title}</h3>
                </div>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner bg-white dark:bg-[#0B1437] ${col.color}`}>
                    {tasks.length}
                </span>
            </div>

            <div className="flex-1 space-y-4">
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => <TaskItem key={task._id} task={task} />)}
                    {tasks.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center gap-2 text-center border-2 border-dashed border-[#4318FF]/20 rounded-2xl bg-white/50 dark:bg-black/20">
                            <p className="text-xs font-bold text-slate-400">רשימה ריקה</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
