'use client';

import { useFormStatus } from 'react-dom';
import { createTask } from '@/actions/taskActions';
import { useRef } from 'react';
import { PlusCircle, Loader2, Calendar, Tag, ShieldCheck } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 
        ${pending
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1'
                }`}
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                </>
            ) : (
                <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Add to Board</span>
                </>
            )}
        </button>
    );
}

export default function AddTaskForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const clientAction = async (formData: FormData) => {
        try {
            await createTask(formData);
            formRef.current?.reset();
        } catch (err) {
            alert('Failed to add task.');
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Quick Add
            </h3>
            <form ref={formRef} action={clientAction} className="space-y-4">

                <input
                    type="text"
                    name="title"
                    required
                    placeholder="Task name"
                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            name="category"
                            defaultValue="Personal"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none font-semibold text-xs"
                        >
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            name="priority"
                            defaultValue="Medium"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none font-semibold text-xs"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="date"
                        name="dueDate"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-xs [color-scheme:light] dark:[color-scheme:dark]"
                    />
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}
