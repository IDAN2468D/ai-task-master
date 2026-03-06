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
            className={`group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white overflow-hidden transition-all duration-500
        ${pending
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-950 dark:bg-white dark:text-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-2xl'
                }`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-2">
                {pending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    useAI ? <Wand2 className="w-4 h-4 animate-pulse" /> : <PlusCircle className="w-4 h-4" />
                )}
                <span>{pending ? 'Processing...' : (useAI ? 'AI Smart Create' : 'Standard Create')}</span>
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
        } catch (err) {
            alert('Failed to add task.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="luxury-glass p-8 rounded-[3rem] relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors duration-700" />

            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> New Task
                </h3>

                {/* AI Toggle */}
                <button
                    type="button"
                    onClick={() => setUseAI(!useAI)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 ${useAI ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                >
                    <Sparkles className={`w-3.5 h-3.5 ${useAI ? 'animate-pulse' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{useAI ? 'Smart Mode' : 'Manual'}</span>
                </button>
            </div>

            <form ref={formRef} action={clientAction} className="space-y-6">

                <div className="relative">
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="What needs to be done?"
                        className="w-full px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border border-transparent focus:border-blue-500/30 text-slate-900 dark:text-slate-100 rounded-2xl focus:outline-none transition-all font-bold text-sm placeholder:text-slate-400 placeholder:font-medium"
                    />
                </div>

                {!useAI && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="grid grid-cols-2 gap-4 overflow-hidden"
                    >
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Category</label>
                            <select
                                name="category"
                                defaultValue="Personal"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none text-slate-600 dark:text-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 font-bold text-[10px] uppercase tracking-wider"
                            >
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Health">Health</option>
                                <option value="Finance">Finance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Priority</label>
                            <select
                                name="priority"
                                defaultValue="Medium"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none text-slate-600 dark:text-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 font-bold text-[10px] uppercase tracking-wider"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Deadline (Optional)</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            name="dueDate"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none text-slate-600 dark:text-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 font-bold text-[10px] uppercase tracking-wider [color-scheme:light] dark:[color-scheme:dark]"
                        />
                    </div>
                </div>

                <SubmitButton useAI={useAI} />
            </form>
        </motion.div>
    );
}
