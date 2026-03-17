'use client';

import { useState, useTransition } from 'react';
import { Sparkles, Brain } from 'lucide-react';
import { autoShiftPriorities } from '@/actions/taskActions';

export default function SmartPriorityButton() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');

    const handleShift = () => {
        startTransition(async () => {
            const res = await autoShiftPriorities();
            if (res.success) {
                setMessage(res.message);
                setTimeout(() => setMessage(''), 4000);
            }
        });
    };

    return (
        <div className="relative group">
            <button
                onClick={handleShift}
                disabled={isPending}
                className="flex items-center gap-3 px-6 py-4 bg-indigo-500/10 text-[#4318FF] dark:text-[#00E5FF] rounded-2xl font-black text-[10px] md:text-xs border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm transition-all hover:bg-indigo-500/20 active:scale-95 uppercase tracking-widest disabled:opacity-50"
                title="AI Priority Shifting - רענון סדרי עדיפויות חכם"
            >
                {isPending ? <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /> : <Brain className="w-5 h-5" />}
                <span>{isPending ? 'מחשב מסלול...' : 'Auto-Prioritize'}</span>
            </button>
            {message && (
                <div className="absolute top-full lg:left-0 lg:right-auto right-0 mt-3 p-3 bg-white dark:bg-slate-900 shadow-xl border border-indigo-500/20 rounded-xl z-50 min-w-48 whitespace-nowrap animate-in fade-in zoom-in duration-300">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
}
