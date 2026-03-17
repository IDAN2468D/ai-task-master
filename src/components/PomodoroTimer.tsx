'use client';

import { Timer, Play, Pause, RotateCcw, X, Coffee, Brain } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TimerMode = 'focus' | 'break';

export default function PomodoroTimer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [sessionsCompleted, setSessions] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const FOCUS_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer completed
            if (mode === 'focus') {
                setSessions(prev => prev + 1);
                setMode('break');
                setTimeLeft(BREAK_TIME);
                // Play notification sound effect
                try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==').play(); } catch { }
            } else {
                setMode('focus');
                setTimeLeft(FOCUS_TIME);
            }
            setIsRunning(false);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft, mode]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = mode === 'focus'
        ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100
        : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

    return (
        <>
            {/* Compact Timer Badge (when running) */}
            {isRunning && !isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed top-24 left-6 z-[900] global-floating-btn transition-all duration-300 flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111C44] rounded-full shadow-xl border border-slate-200 dark:border-white/10 hover:scale-105"
                >
                    <div className={`w-2 h-2 rounded-full ${mode === 'focus' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                    <span className="text-sm font-black tabular-nums text-slate-800 dark:text-white">{formatTime(timeLeft)}</span>
                </motion.button>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-24 z-[3000] global-floating-btn w-12 h-12 bg-white dark:bg-[#111C44] border-2 border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
                title="טיימר פומודורו"
            >
                <Timer className={`w-6 h-6 ${isRunning ? (mode === 'focus' ? 'text-red-500' : 'text-emerald-500') : 'text-slate-600 dark:text-white'}`} />
            </button>

            {/* Timer Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 left-20 z-[4000] w-[300px] bg-white/95 dark:bg-[#111C44]/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className={`p-5 ${mode === 'focus' ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10' : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {mode === 'focus' ? (
                                        <Brain className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <Coffee className="w-5 h-5 text-emerald-500" />
                                    )}
                                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                                        {mode === 'focus' ? 'זמן מיקוד' : 'זמן הפסקה'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Timer Display */}
                        <div className="p-8 text-center">
                            {/* Circular Progress */}
                            <div className="relative w-36 h-36 mx-auto mb-6">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(200,200,200,0.2)" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="52" fill="none"
                                        stroke={mode === 'focus' ? '#EF4444' : '#10B981'}
                                        strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={`${(progress / 100) * 326.7} 326.7`}
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black tabular-nums text-slate-800 dark:text-white">{formatTime(timeLeft)}</span>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        {mode === 'focus' ? 'מיקוד' : 'הפסקה'}
                                    </span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={resetTimer}
                                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <RotateCcw className="w-5 h-5 text-slate-500" />
                                </button>
                                <button
                                    onClick={toggleTimer}
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-105 ${isRunning
                                            ? 'bg-slate-800 dark:bg-slate-600'
                                            : mode === 'focus'
                                                ? 'bg-red-500 shadow-red-500/30'
                                                : 'bg-emerald-500 shadow-emerald-500/30'
                                        }`}
                                >
                                    {isRunning ? (
                                        <Pause className="w-7 h-7 text-white" />
                                    ) : (
                                        <Play className="w-7 h-7 text-white mr-[-2px]" />
                                    )}
                                </button>
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-[#4318FF]">{sessionsCompleted}</span>
                                    <span className="text-[8px] font-bold text-slate-400">סבבים</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
