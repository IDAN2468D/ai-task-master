'use client';

import { Heart, Wind, Eye, X, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function WellnessWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out' | 'idle'>('idle');
    const [, setBreathCount] = useState(0);
    const [activeMinutes, setActiveMinutes] = useState(0);
    const [showReminder, setShowReminder] = useState(false);
    const [habits, setHabits] = useState([
        { id: 'water', label: 'שתי כוסות מים', completed: false },
        { id: 'stretch', label: 'מתיחות גב וצוואר', completed: false },
        { id: 'eyes', label: 'חוק ה-20/20 (מנוחה לעיניים)', completed: false },
    ]);

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

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const renderOverlays = () => {
        if (!mounted || typeof document === 'undefined') return null;
        return createPortal(
            <>
                {/* Break Reminder Toast */}
                <AnimatePresence>
                    {showReminder && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="fixed bottom-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:right-auto z-[10000] bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] p-6 flex items-center gap-5 border border-white/20 backdrop-blur-xl md:min-w-[420px]">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                <Coffee className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-black text-white flex items-center gap-2">
                                    <span className="animate-bounce">⏰</span>
                                    הגיע זמן להפסקה!
                                </h4>
                                <p className="text-xs font-bold text-emerald-50 mt-1 leading-relaxed">
                                    {activeMinutes} דקות של מיקוד עברו. קום, שתה מים ומתח מעט את הגוף.
                                </p>
                            </div>
                            <button onClick={() => setShowReminder(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-colors shrink-0">
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wellness Panel Modal */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-white dark:bg-[#111C44] rounded-[32px] shadow-2xl w-full max-w-md p-10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">Wellness Hub</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">מרחב רווחה אישי</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="w-10 h-10 border border-slate-100 dark:border-white/5 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Active Time */}
                                <div className="vibrant-card border-none bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-8 mb-8 text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Today&apos;s Focus Time</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <p className="text-5xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                                            {Math.floor(activeMinutes / 60)}:{(activeMinutes % 60).toString().padStart(2, '0')}
                                        </p>
                                    </div>
                                    <div className="mt-4 px-4 py-1.5 bg-white dark:bg-emerald-500/20 inline-flex rounded-full shadow-sm">
                                        <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                            {activeMinutes < 30 ? 'התחלה טובה! 🌱' : activeMinutes < 120 ? 'עבודה מצוינת! 💪' : activeMinutes < 240 ? 'אל תשכח הפסקות! ☕' : 'עצור לנוח! 🛑'}
                                        </p>
                                    </div>
                                </div>

                                {/* Breathing Exercise */}
                                <div className="text-center mb-10">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6">תרגיל נשימה 4-4-4</p>

                                    <div className="relative w-40 h-40 mx-auto mb-6">
                                        <motion.div
                                            animate={{ scale: phaseScale[breathPhase] }}
                                            transition={{ duration: 4, ease: 'easeInOut' }}
                                            className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative"
                                        >
                                            <Wind className="w-12 h-12 text-white" />
                                            {breathPhase !== 'idle' && (
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                                    className="absolute inset-0 border-2 border-white/20 border-dashed rounded-full" />
                                            )}
                                        </motion.div>
                                    </div>

                                    <div className="h-8">
                                        <AnimatePresence mode="wait">
                                            {breathPhase !== 'idle' ? (
                                                <motion.p key={breathPhase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                                    className="text-xl font-black text-emerald-600 dark:text-emerald-400">{phaseText[breathPhase]}</motion.p>
                                            ) : (
                                                <button onClick={startBreathing}
                                                    className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                                    התחל תרגיל נשימה
                                                </button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Micro-Habits Tracker */}
                                <div className="mb-10 pt-8 border-t border-slate-100 dark:border-white/5">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6 text-center">מעקב מיקרו-הרגלים 🌱</p>
                                    <div className="space-y-3">
                                        {habits.map((habit, idx) => (
                                            <div 
                                                key={habit.id} 
                                                onClick={() => {
                                                    const newHabits = [...habits];
                                                    newHabits[idx].completed = !newHabits[idx].completed;
                                                    setHabits(newHabits);
                                                }}
                                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${habit.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-emerald-500/30'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${habit.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                                    {habit.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className={`text-sm font-bold transition-all ${habit.completed ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {habit.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wellness Tips</p>
                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['קום ומתח את הגוף כל 45 דקות', 'שתה לפחות 8 כוסות מים ביום', 'טייל 5 דקות בין כל משימה ממושכת'].map((tip, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-emerald-500/5 transition-colors">
                                                <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>,
            document.body
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-[10px] md:text-xs border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/20 active:scale-95 uppercase tracking-widest"
            >
                <Heart className="w-5 h-5" />
                <span>רווחה</span>
            </button>
            {renderOverlays()}
        </>
    );
}
