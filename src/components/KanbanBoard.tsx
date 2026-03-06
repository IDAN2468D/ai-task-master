'use client';

import { updateTaskStatus, deleteTask } from '@/actions/taskActions';
import { ArrowRight, ArrowLeft, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useTransition } from 'react';

interface Task {
    _id: string;
    title: string;
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    category: string;
    dueDate?: string;
    createdAt: string;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
        High: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    }[priority] || 'bg-slate-100 text-slate-700';

    return (
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${colors}`}>
            {priority}
        </span>
    );
};

const TaskCard = ({ task }: { task: Task }) => {
    const [isPending, startTransition] = useTransition();

    const handleMove = (newStatus: string) => {
        startTransition(async () => {
            await updateTaskStatus(task._id, newStatus);
        });
    };

    const handleDelete = () => {
        if (confirm('Delete this task?')) {
            startTransition(async () => {
                await deleteTask(task._id);
            });
        }
    };

    return (
        <div className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-start mb-3">
                <PriorityBadge priority={task.priority} />
                <button onClick={handleDelete} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <h4 className="text-slate-800 dark:text-slate-100 font-bold mb-2 leading-tight">{task.title}</h4>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-4">
                <LayoutIcon category={task.category} />
                <span>{task.category}</span>
                {task.dueDate && (
                    <div className="flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                {task.status !== 'Todo' ? (
                    <button
                        onClick={() => handleMove(task.status === 'Done' ? 'InProgress' : 'Todo')}
                        className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                ) : <div />}

                {task.status !== 'Done' ? (
                    <button
                        onClick={() => handleMove(task.status === 'Todo' ? 'InProgress' : 'Done')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                        <span>Move</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                ) : <div className="text-emerald-500 flex items-center gap-1 text-[11px] font-bold uppercase"><AlertCircle className="w-3.5 h-3.5" /> Completed</div>}
            </div>
        </div>
    );
};

const LayoutIcon = ({ category }: { category: string }) => {
    // Simple icon picker
    return <Clock className="w-3 h-3" />;
};

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
    const columns = [
        { id: 'Todo', title: 'To Do', color: 'bg-indigo-500' },
        { id: 'InProgress', title: 'In Progress', color: 'bg-blue-500' },
        { id: 'Done', title: 'Done', color: 'bg-emerald-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);

                return (
                    <div key={col.id} className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">{col.title}</h3>
                            <span className="ml-auto bg-slate-200 dark:bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                                {columnTasks.length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-4 bg-slate-100/50 dark:bg-slate-900/20 p-4 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 min-h-[300px]">
                            {columnTasks.length > 0 ? (
                                columnTasks.map((task) => <TaskCard key={task._id} task={task} />)
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 italic text-sm py-10">
                                    Empty column
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
