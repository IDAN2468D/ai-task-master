'use client';

import { toggleTaskStatus, deleteTask } from '@/actions/taskActions';
import { Check, Trash2, Clock } from 'lucide-react';
import { useTransition } from 'react';

interface TaskProps {
    task: {
        _id: string;
        title: string;
        description?: string;
        isCompleted: boolean;
        createdAt: string;
    };
}

export default function TaskItem({ task }: TaskProps) {
    // useTransition gives us beautiful instant UI feedback while server tasks handle updates
    const [isPendingToggle, startToggleTransition] = useTransition();
    const [isPendingDelete, startDeleteTransition] = useTransition();

    const createdDate = new Date(task.createdAt);

    // Consider an optimistic approach, but strict adherence relies fully on server sync
    const isCompleted = task.isCompleted;

    const handleToggle = () => {
        startToggleTransition(async () => {
            await toggleTaskStatus(task._id, isCompleted);
        });
    };

    const handleDelete = () => {
        startDeleteTransition(async () => {
            await deleteTask(task._id);
        });
    };

    // Determine classes for states gracefully
    const isBusy = isPendingToggle || isPendingDelete;

    return (
        <div className={`group flex items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border transition-all duration-300 ${isCompleted
                ? 'opacity-60 border-transparent bg-gray-50/50 shadow-sm hover:opacity-100'
                : 'border-gray-100 shadow-md hover:shadow-xl hover:border-blue-100'
            } ${isBusy ? 'opacity-50 pointer-events-none scale-[0.98]' : ''}`}>

            {/* Checkbox */}
            <button
                onClick={handleToggle}
                disabled={isBusy}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted
                        ? 'bg-emerald-500 border-emerald-500 scale-95 shadow-inner'
                        : 'bg-transparent border-gray-300 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105'
                    }`}
                aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
                {isCompleted && <Check className="w-5 h-5 text-white animate-in zoom-in" strokeWidth={3} />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className={`text-lg sm:text-xl font-semibold truncate transition-colors duration-300 ${isCompleted ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'
                    }`}>
                    {task.title}
                </h3>

                {task.description && (
                    <p className={`text-sm mt-1 truncate transition-colors ${isCompleted ? 'text-gray-400' : 'text-gray-500'
                        }`}>{task.description}</p>
                )}

                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                        {createdDate.toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })} at {createdDate.toLocaleTimeString(undefined, {
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={handleDelete}
                disabled={isBusy}
                className="flex-shrink-0 p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl xl:opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm hover:shadow"
                aria-label="Delete task"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
