'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BatteryCharging, X, CheckCircle, Leaf } from 'lucide-react';
import { updateTaskStatus } from '@/actions/taskActions';

export default function ZenMode({ tasks }: { tasks: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    // Find the single easiest task
    const easyTask = useMemo(() => {
        const remaining = tasks.filter(t => t.status !== 'Done');
        return remaining.sort((a, b) => {
            const eRank = (e: string) => e === 'Low' ? 1 : e === 'Medium' ? 2 : 3;
            return eRank(a.energyLevel) - eRank(b.energyLevel);
        })[0];
    }, [tasks]);

    const handleComplete = async () => {
        if (!easyTask) return;
        await updateTaskStatus(easyTask._id, 'Done');
        setTimeout(() => setIsOpen(false), 1500);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-[10px] md:text-xs border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/20 active:scale-95 uppercase tracking-widest"
                title="מצב חסכון באנרגיה - משימה אחת בלבד"
            >
                <BatteryCharging className="w-5 h-5 animate-pulse" />
                <span>Zen Mode</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-3xl overflow-hidden"
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="max-w-xl w-full text-center flex flex-col items-center">
                            <Leaf className="w-16 h-16 text-emerald-400 mb-8 opacity-80" />
                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">מצב חיסכון קוגניטיבי</h2>
                            <p className="text-white/60 mb-16 text-lg">בלי הסחות דעת, בלי עומס. הנה הדבר היחיד והקל ביותר שצריך לעשות עכשיו:</p>

                            {easyTask ? (
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                                    className="w-full bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group"
                                >
                                    <h3 className="text-3xl font-bold text-white mb-8">{easyTask.title}</h3>
                                    
                                    <button
                                        onClick={handleComplete}
                                        className="w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <CheckCircle className="w-8 h-8" />
                                        סיימתי, אפשר לנוח.
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="text-white/50 text-xl font-medium">אין יותר משימות לעכשיו. אפשר לישון צהריים 😴</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
