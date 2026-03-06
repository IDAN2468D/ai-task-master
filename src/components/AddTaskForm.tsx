'use client';

import { useFormStatus } from 'react-dom';
import { createTask } from '@/actions/taskActions';
import { useRef } from 'react';
import { PlusCircle, Loader2, Calendar, Tag } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 
        ${pending
                    ? 'bg-blue-400 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-200/50 hover:-translate-y-1 active:scale-95'
                }`}
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                </>
            ) : (
                <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Task</span>
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
            alert('Failed to add task. Please try again.');
        }
    };

    return (
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-slate-800/60 mb-12 group transition-all duration-500 hover:shadow-blue-500/5">
            <form ref={formRef} action={clientAction} className="space-y-6">

                {/* Main Input Field */}
                <div className="relative group">
                    <label htmlFor="title" className="sr-only">Task Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        required
                        placeholder="What's on your mind today?"
                        className="w-full pl-6 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 text-xl font-medium"
                    />
                </div>

                {/* Meta Inputs Row */}
                <div className="flex flex-col md:flex-row gap-5">

                    {/* Category Select */}
                    <div className="flex-1 relative">
                        <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <select
                            name="category"
                            defaultValue="Personal"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer font-semibold"
                        >
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Health">Health</option>
                            <option value="Finance">Finance</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="flex-1 relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="date"
                            name="dueDate"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer font-semibold [color-scheme:light] dark:[color-scheme:dark]"
                        />
                    </div>

                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
