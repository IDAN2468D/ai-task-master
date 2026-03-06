'use client';

import { useFormStatus } from 'react-dom';
import { createSmartTask } from '@/actions/taskActions';
import { useRef, useState } from 'react';
import { PlusCircle, Loader2, Calendar, Tag, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

function SubmitButton({ useAI }: { useAI: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`group relative flex items-center justify-center gap-3 w-full py-4 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] text-white overflow-hidden transition-all duration-700
        ${pending
                    ? 'bg-slate-900 cursor-not-allowed'
                    : 'bg-slate-950 dark:bg-white dark:text-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-2xl'
                }`}
        >
            <div className={`absolute inset-0 bg-blue-500 transition-opacity duration-700 ${pending ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}`} />
            <div className="relative flex items-center gap-2">
                {pending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    useAI ? <Wand2 className="w-4 h-4 text-blue-500 animate-pulse" /> : <PlusCircle className="w-4 h-4" />
                )}
                <span>{pending ? 'Processing...' : (useAI ? 'AI Smart Sequence' : 'Standard Add')}</span>
            </div>
        </button>
    );
}

export default function AddTaskForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [useAI, setUseAI] = useState(true);

    const clientAction = async (formData: FormData) => {
        try {
            formData.append('useAI', useAI.toString());
            await createSmartTask(formData);
            formRef.current?.reset();
        } catch (err) { alert('Failed to add task.'); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bento-item bg-slate-900/40 p-10 !rounded-[2.5rem] relative overflow-hidden group shadow-2xl"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[80px] -z-10 group-hover:bg-blue-500/10 transition-colors duration-1000" />

            <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">New Operation</span>
                    <h3 className="text-xl font-black text-white tracking-tighter">Draft Mission.</h3>
                </div>

                <button
                    type="button"
                    onClick={() => setUseAI(!useAI)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 border ${useAI ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-slate-100 border-transparent text-slate-400'}`}
                >
                    <Sparkles className={`w-3.5 h-3.5 ${useAI ? 'animate-pulse' : ''}`} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{useAI ? 'AI On' : 'AI Off'}</span>
                </button>
            </div>

            <form ref={formRef} action={clientAction} className="space-y-8">

                <div className="relative">
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Define your next step..."
                        className="w-full px-0 py-3 bg-transparent border-b border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-700 transition-all font-bold text-xl focus:outline-none"
                    />
                </div>

                {!useAI && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="grid grid-cols-2 gap-6 overflow-hidden">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">Category</label>
                            <select
                                name="category"
                                className="w-full bg-transparent text-slate-400 border-none p-0 text-sm font-bold focus:ring-0 cursor-pointer"
                            >
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Health">Health</option>
                                <option value="Finance">Finance</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">Priority</label>
                            <select
                                name="priority"
                                className="w-full bg-transparent text-slate-400 border-none p-0 text-sm font-bold focus:ring-0 cursor-pointer"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">Deadline</label>
                    <div className="relative">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                            type="date"
                            name="dueDate"
                            className="w-full pl-8 bg-transparent border-none text-slate-400 text-sm font-bold focus:ring-0 [color-scheme:dark]"
                        />
                    </div>
                </div>

                <SubmitButton useAI={useAI} />
            </form>
        </motion.div>
    );
}
