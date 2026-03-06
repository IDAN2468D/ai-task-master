'use client';

import { toggleTaskStatus, deleteTask } from '@/actions/taskActions';
import { Check, Trash2, Calendar, Layout, AlertCircle, Briefcase, Heart, Wallet } from 'lucide-react';
import { useTransition } from 'react';

interface TaskProps {
    task: {
        _id: string;
        title: string;
        description?: string;
        isCompleted: boolean;
        category: string;
        dueDate?: string;
        createdAt: string;
    };
}

// Helper to get category specific styles
const getCategoryConfig = (category: string) => {
    switch (category) {
        case 'Work': return { color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50', icon: Briefcase };
        case 'Urgent': return { color: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/50', icon: AlertCircle };
        case 'Health': return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50', icon: Heart };
        case 'Finance': return { color: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/50', icon: Wallet };
        default: return { color: 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50', icon: Layout };
    }
};

export default function TaskItem({ task }: TaskProps) {
    const [isPendingToggle, startToggleTransition] = useTransition();
    const [isPendingDelete, startDeleteTransition] = useTransition();

    const config = getCategoryConfig(task.category);
    const CatIcon = config.icon;

    const isCompleted = task.isCompleted;
    const isBusy = isPendingToggle || isPendingDelete;

    const handleToggle = () => {
        startToggleTransition(async () => {
            await toggleTaskStatus(task._id, isCompleted);
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            startDeleteTransition(async () => {
                await deleteTask(task._id);
            });
        }
    };

    return (
        <div className={`group relative bg-white dark:bg-slate-900 rounded-[2rem] border-2 transition-all duration-500 hover:scale-[1.01] ${isCompleted
                ? 'opacity-60 border-transparent bg-slate-50/50 dark:bg-slate-800/20'
                : 'border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-900/30'
            } ${isBusy ? 'opacity-30 scale-95' : ''}`}>

            <div className="p-6 sm:p-8 flex items-start gap-6">

                {/* Custom Checkbox */}
                <button
                    onClick={handleToggle}
                    disabled={isBusy}
                    className={`flex-shrink-0 w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 transform ${isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-transparent rotate-12'
                            : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:rotate-6'
                        }`}
                >
                    {isCompleted && <Check className="w-6 h-6 text-white" strokeWidth={3} />}
                </button>

                {/* Content Area */}
                <div className="flex-1 min-w-0">

                    {/* Top Row: Category Badge */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${config.color}`}>
                            <CatIcon className="w-3.5 h-3.5" />
                            {task.category}
                        </span>

                        {task.dueDate && (
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${new Date(task.dueDate) < new Date() && !isCompleted ? 'text-rose-500 animate-pulse' : 'text-slate-400'
                                }`}>
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl sm:text-2xl font-bold transition-all duration-500 mb-1 ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                        {task.title}
                    </h3>

                    {/* Timestamp */}
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        Created {new Date(task.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                {/* Delete Trigger */}
                <button
                    onClick={handleDelete}
                    disabled={isBusy}
                    className="flex-shrink-0 p-4 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all duration-200 group-hover:translate-x-0 sm:opacity-0 group-hover:opacity-100"
                >
                    <Trash2 className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
