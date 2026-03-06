'use client';

import { useFormStatus } from 'react-dom';
import { createTask } from '@/actions/taskActions';
import { useRef } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

function SubmitButton() {
    // useFormStatus gives us the pending state of the closest parent form
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 min-w-[140px] rounded-xl font-semibold text-white shadow-md transition-all duration-200 
        ${pending
                    ? 'bg-blue-400 cursor-not-allowed transform-none'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                </>
            ) : (
                <>
                    <PlusCircle className="w-5 h-5" />
                    Add Task
                </>
            )}
        </button>
    );
}

export default function AddTaskForm() {
    const formRef = useRef<HTMLFormElement>(null);

    // Wrapper wrapper to safely reset the client form exclusively after the server action completes.
    const clientAction = async (formData: FormData) => {
        await createTask(formData);
        formRef.current?.reset();
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100/60 mb-10 transition-shadow hover:shadow-2xl">
            <form ref={formRef} action={clientAction} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <label htmlFor="title" className="sr-only">Task Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        required
                        placeholder="What needs to be done? e.g. Buy groceries"
                        className="w-full pl-6 pr-5 py-3.5 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400 block sm:text-lg"
                    />
                </div>
                <SubmitButton />
            </form>
        </div>
    );
}
