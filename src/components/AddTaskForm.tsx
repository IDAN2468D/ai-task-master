'use client';

import { useFormStatus } from 'react-dom';
import { createSmartTask } from '@/actions/taskActions';
import { useRef, useState } from 'react';
import { PlusCircle, Loader2, Sparkles, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function SubmitButton({ useAI }: { useAI: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`group relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white overflow-hidden transition-all duration-300 shadow-xl
        ${pending ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-gradient-stat-1 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(67,24,255,0.3)]'}`}
        >
            {pending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                useAI ? <Sparkles className="w-5 h-5 animate-pulse" /> : <PlusCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{pending ? 'יוצר...' : (useAI ? 'יצירה חכמה AI' : 'הוסף משימה')}</span>
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
        } catch (err) { alert('נכשל ביצירת המשימה.'); }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="vibrant-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#4318FF]/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#4318FF]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">הוספה מהירה</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">משימה חדשה</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setUseAI(!useAI)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold text-xs ${useAI ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
                >
                    <Sparkles className="w-4 h-4" />
                    <span>{useAI ? 'AI פעיל' : 'ידני'}</span>
                </button>
            </div>

            <form ref={formRef} action={clientAction} className="space-y-6">

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-1">כותרת המשימה <span className="text-[#FF2A2A]">*</span></label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder={useAI ? "לדוגמה: להכין מצגת רבעון 3" : "הכנס שם משימה"}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors shadow-inner"
                    />
                </div>

                {!useAI && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="grid grid-cols-2 gap-4 overflow-hidden">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 mr-1">קטגוריה</label>
                            <select name="category" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-700 dark:text-white focus:outline-none">
                                <option value="עבודה">עבודה</option>
                                <option value="אישי">אישי</option>
                                <option value="דחוף">דחוף</option>
                                <option value="פיננסים">פיננסים</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 mr-1">עדיפות</label>
                            <select name="priority" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm text-slate-700 dark:text-white focus:outline-none">
                                <option value="Low">נמוכה</option>
                                <option value="Medium">בינונית</option>
                                <option value="High">גבוהה</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-1">תאריך יעד</label>
                    <div className="relative border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="date"
                            name="dueDate"
                            className="w-full pr-12 pl-5 py-4 bg-transparent text-slate-700 dark:text-white font-bold text-sm focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                        />
                    </div>
                </div>

                <SubmitButton useAI={useAI} />
            </form>
        </motion.div>
    );
}
