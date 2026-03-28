'use client';

import { useRef, useState } from 'react';
import { PlusCircle, Loader2, Sparkles, Calendar, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskFlow } from '@/hooks/useTaskFlow';

function SubmitButton({ useAI, isPending }: { useAI: boolean, isPending: boolean }) {
    return (
        <button
            type="submit"
            disabled={isPending}
            className={`group relative flex items-center justify-center gap-3 w-full py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] text-white overflow-hidden transition-all duration-700
        ${isPending ? 'bg-slate-300 dark:bg-white/10 opacity-50 cursor-not-allowed' : 'bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-800 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:-translate-y-1 active:scale-95'}`}
        >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                useAI ? <Sparkles className="w-5 h-5 group-hover:scale-120 group-hover:rotate-12 transition-transform duration-500" /> : <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
            )}
            
            <span className="relative z-10">
                {isPending ? 'Neural Processing...' : (useAI ? 'Execute AI Strategy' : 'Initialize Task Node')}
            </span>
        </button>
    );
}

export default function AddTaskForm() {
    const { createTask, isPending } = useTaskFlow();
    const formRef = useRef<HTMLFormElement>(null);
    const [useAI, setUseAI] = useState(true);

    const clientAction = async (formData: FormData) => {
        formData.append('useAI', useAI.toString());
        await createTask(formData);
        formRef.current?.reset();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="elite-card p-10 md:p-12 relative group/form overflow-visible"
        >
            {/* Neural Connector Decoration */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-linear-to-b from-transparent via-indigo-500/20 to-indigo-500/50 hidden lg:block" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-6">
                    <div className="relative group/zap">
                        <div className="absolute -inset-4 bg-indigo-500 rounded-[2rem] blur-2xl opacity-0 group-hover/zap:opacity-20 transition-opacity" />
                        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 relative z-10 transition-all duration-700 group-hover/zap:rotate-12 group-hover/zap:scale-110 shadow-lg">
                            <Zap className="w-8 h-8 text-indigo-500 fill-indigo-500/10" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black tracking-[-0.03em] platinum-heading">Neural <span className="text-indigo-500/50">Gateway</span></h3>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] mt-1.5 font-outfit">Input Stream_086</p>
                    </div>
                </div>

                <div className="flex items-center p-1.5 bg-slate-900/5 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 backdrop-blur-xl">
                    <button
                        type="button"
                        onClick={() => setUseAI(true)}
                        className={`relative px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${useAI ? 'text-white' : 'text-slate-400 hover:text-indigo-500'}`}
                    >
                        {useAI && (
                            <motion.div layoutId="toggle-active" className="absolute inset-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20" />
                        )}
                        <Sparkles size={14} className="relative z-10" />
                        <span className="relative z-10">Neural AI</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setUseAI(false)}
                        className={`relative px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${!useAI ? 'text-white' : 'text-slate-400 hover:text-indigo-500'}`}
                    >
                        {!useAI && (
                            <motion.div layoutId="toggle-active" className="absolute inset-0 bg-slate-800 dark:bg-white/10 rounded-full shadow-lg" />
                        )}
                        <PlusCircle size={14} className="relative z-10" />
                        <span className="relative z-10">Manual</span>
                    </button>
                </div>
            </div>

            <form ref={formRef} action={clientAction} className="space-y-10 group/form">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6" dir="rtl">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500/60 dark:text-indigo-400/40">זיהוי אובייקט</label>
                        <div className="flex gap-1.5">
                            {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />)}
                        </div>
                    </div>
                    <div className="relative group/input">
                        <div className="absolute -inset-1.5 bg-linear-to-r from-indigo-500/20 to-purple-500/10 rounded-[3rem] blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700" />
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder={useAI ? "Type your command or objective..." : "Input task subject..."}
                            className="elite-input !px-10 !py-8 !text-lg !rounded-[60px]"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-indigo-500/20 group-focus-within/input:border-indigo-500 group-focus-within/input:scale-125 transition-all duration-700" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!useAI && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0, y: -20 }} 
                            animate={{ height: 'auto', opacity: 1, y: 0 }} 
                            exit={{ height: 0, opacity: 0, y: -20 }}
                            className="grid grid-cols-2 gap-8 overflow-hidden pt-2"
                        >
                            <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 px-6">Domain</label>
                                <select name="category" className="elite-input !px-8 !py-6 !rounded-[2.5rem] cursor-pointer appearance-none bg-no-repeat bg-[right_1.5rem_center] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')]">
                                    <option value="Work">Corporate_Net</option>
                                    <option value="Personal">Bio_Life</option>
                                    <option value="Urgent">Critical_IO</option>
                                    <option value="Finance">Capital_Flow</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 px-6">Overdrive Rank</label>
                                <select name="priority" className="elite-input !px-8 !py-6 !rounded-[2.5rem] cursor-pointer appearance-none bg-no-repeat bg-[right_1.5rem_center] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')]">
                                    <option value="Low">Efficiency</option>
                                    <option value="Medium">Standard</option>
                                    <option value="High">Overdrive</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 px-6">Temporal Anchor</label>
                    <div className="group/date relative">
                        <div className="absolute -inset-1.5 bg-indigo-500/5 rounded-[3rem] blur-xl opacity-0 group-hover/date:opacity-100 transition-opacity" />
                        <div className="relative border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden bg-slate-100/50 dark:bg-white/5 transition-all duration-700 group-hover/date:border-indigo-500/30 backdrop-blur-2xl">
                            <Calendar className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500 group-hover/date:scale-110 transition-transform" />
                            <input
                                type="date"
                                name="dueDate"
                                className="w-full pr-20 pl-10 py-7 bg-transparent text-slate-700 dark:text-white font-black text-sm uppercase tracking-tighter focus:outline-none [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <SubmitButton useAI={useAI} isPending={isPending} />
                </div>
            </form>
            
            {/* Shimmer Decoration */}
            <div className="absolute inset-0 shimmer-elite opacity-5 pointer-events-none rounded-[60px]" />
        </motion.div>
    );
}
