'use client';

import { Heart, Wind, Eye, X, Coffee } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WellnessWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out' | 'idle'>('idle');
    const [, setBreathCount] = useState(0);
    const [activeMinutes, setActiveMinutes] = useState(0);
    const [showReminder, setShowReminder] = useState(false);

    // Track active minutes
    useEffect(() => {
        const saved = parseInt(localStorage.getItem('taskflow-active-mins') || '0');
        const lastReset = localStorage.getItem('taskflow-active-date');
        const today = new Date().toDateString();

        if (lastReset !== today) {
            setActiveMinutes(0);
            localStorage.setItem('taskflow-active-mins', '0');
            localStorage.setItem('taskflow-active-date', today);
        } else {
            setActiveMinutes(saved);
        }

        const timer = setInterval(() => {
            setActiveMinutes(prev => {
                const next = prev + 1;
                localStorage.setItem('taskflow-active-mins', next.toString());
                // Show break reminder every 45 minutes
                if (next > 0 && next % 45 === 0) setShowReminder(true);
                return next;
            });
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const startBreathing = () => {
        setBreathCount(0);
        const cycle = () => {
            setBreathPhase('in');
            setTimeout(() => {
                setBreathPhase('hold');
                setTimeout(() => {
                    setBreathPhase('out');
                    setTimeout(() => {
                        setBreathCount(prev => {
                            if (prev < 3) { cycle(); return prev + 1; }
                            setBreathPhase('idle');
                            return 0;
                        });
                    }, 4000);
                }, 4000);
            }, 4000);
        };
        cycle();
    };

    const phaseText = { in: 'שאף... 🌬️', hold: 'החזק... ⏸️', out: 'נשוף... 💨', idle: '' };
    const phaseScale = { in: 1.4, hold: 1.4, out: 1, idle: 1 };

    return (
        <>
            {/* Break Reminder Toast */}
            <AnimatePresence>
                {showReminder && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl p-5 flex items-center gap-4 min-w-[380px]">
                        <Coffee className="w-8 h-8 text-white" />
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-white">⏰ הגיע זמן להפסקה!</h4>
                            <p className="text-xs font-bold text-white/80">{activeMinutes} דקות פעילות רצופות. קום, שתה מים, ומתח את הגוף.</p>
                        </div>
                        <button onClick={() => setShowReminder(false)} className="p-2 hover:bg-white/20 rounded-xl"><X className="w-4 h-4 text-white" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Widget Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 md:py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-xs md:text-sm border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/20 active:scale-95"
            >
                <Heart className="w-4 h-4" />
                <span className="whitespace-nowrap">רווחה</span>
            </button>

            {/* Wellness Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Heart className="w-6 h-6 text-emerald-500" />
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white">מרחב רווחה</h3>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Active Time */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 mb-6 text-center">
                                <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">זמן פעיל היום</p>
                                <p className="text-4xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                                    {Math.floor(activeMinutes / 60)}:{(activeMinutes % 60).toString().padStart(2, '0')}
                                </p>
                                <p className="text-xs font-bold text-emerald-500 mt-1">
                                    {activeMinutes < 30 ? 'התחלה טובה! 🌱' : activeMinutes < 120 ? 'עבודה מצוינת! 💪' : activeMinutes < 240 ? 'אל תשכח הפסקות! ☕' : 'עצור לנוח! 🛑'}
                                </p>
                            </div>

                            {/* Breathing Exercise */}
                            <div className="text-center mb-6">
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">תרגיל נשימה 4-4-4</p>

                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <motion.div
                                        animate={{ scale: phaseScale[breathPhase] }}
                                        transition={{ duration: 4, ease: 'easeInOut' }}
                                        className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                                    >
                                        <Wind className="w-10 h-10 text-white" />
                                    </motion.div>
                                </div>

                                {breathPhase !== 'idle' ? (
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{phaseText[breathPhase]}</p>
                                ) : (
                                    <button onClick={startBreathing}
                                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-emerald-500/30 hover:-translate-y-1 transition-transform">
                                        התחל תרגיל נשימה
                                    </button>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">טיפים</p>
                                {['קום ומתח את הגוף כל 45 דקות', 'שתה לפחות 8 כוסות מים ביום', 'טייל 5 דקות בין כל משימה ממושכת'].map((tip, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                        <Eye className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {tip}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
