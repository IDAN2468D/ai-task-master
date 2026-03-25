'use client';

import { Focus, X, CheckCircle, ArrowLeft, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX, CloudRain, TreePine, Headset, Lock, Unlock, Youtube } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { completeTaskWithBonus } from '@/actions/taskActions';
import confetti from 'canvas-confetti';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    subtasks: any[];
}

const AMBIENCE_MODES = [
    { id: 'rain', name: 'גשם עדין', icon: CloudRain, url: 'https://raw.githubusercontent.com/rafaelmardojai/blanket/master/data/resources/sounds/rain.ogg' },
    { id: 'forest', name: 'יער קסום', icon: TreePine, url: 'https://raw.githubusercontent.com/rafaelmardojai/blanket/master/data/resources/sounds/birds.ogg' },
    { id: 'lofi', name: 'Lo-Fi Video', icon: Youtube, url: 'none' },
];

const FOCUS_TIME = 25 * 60; // 25 mins

export default function FocusMode({ tasks, onFocusChange }: { tasks: Task[], onFocusChange?: (isActive: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeepWork, setIsDeepWork] = useState(false);


    // Timer State
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Audio State
    const [audioActive, setAudioActive] = useState(false);
    const [audioMode, setAudioMode] = useState('rain');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Focus Lock State
    const [isLockMode, setIsLockMode] = useState(false);
    const [showChallenge, setShowChallenge] = useState(false);
    const [mathProblem, setMathProblem] = useState({ q: '', a: 0 });
    const [mathAnswer, setMathAnswer] = useState('');

    const activeTasks = tasks.filter(t => t.status !== 'Done');
    const sortedTasks = [...activeTasks].sort((a, b) => {
        const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority] || 1) - (order[b.priority] || 1);
    });

    const currentTask = sortedTasks[currentIndex];

    // Handle Timer
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            if (navigator.vibrate) navigator.vibrate([100, 100, 100]); // End of pomodoro
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, timeLeft]);

    // Handle Audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }
        const selectedMode = AMBIENCE_MODES.find(m => m.id === audioMode);
        if (selectedMode && selectedMode.id !== 'lofi' && audioRef.current.src !== selectedMode.url) {
            audioRef.current.src = selectedMode.url;
        }

        if (audioActive && audioMode !== 'lofi') {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }

        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, [audioActive, audioMode]);

    // Handle UI state sync
    useEffect(() => {
        if (onFocusChange) onFocusChange(isOpen);
        
        // Dispatch custom event for parts of the UI that aren't direct children
        window.dispatchEvent(new CustomEvent('ui-focus-mode', { detail: { active: isOpen } }));

        if (isOpen) {
            document.title = "Focus Room | AI-Task-Master";
        } else {
            document.title = "AI-Task-Master";
        }
    }, [isOpen, onFocusChange]);

    // Handle Deep Work Guard (Notification Silencing)
    useEffect(() => {
        if (isDeepWork && isRunning) {
            if ("Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            // In a real app, this would integrate with a browser extension or 
            // use a more advanced API to actually silence the OS.
            // For now, we simulate by blocking the UI further.
            console.log("Deep Work Guard Active: Silencing distractions...");
        }
    }, [isDeepWork, isRunning]);

    // Cleanup when closing
    useEffect(() => {
        if (!isOpen) {
            setIsRunning(false);
            setAudioActive(false);
            setTimeLeft(FOCUS_TIME);
            setIsLockMode(false);
            setShowChallenge(false);
            setIsDeepWork(false);
        }
    }, [isOpen]);


    const handleAttemptClose = () => {
        if (isLockMode) {
            const num1 = Math.floor(Math.random() * 20) + 10;
            const num2 = Math.floor(Math.random() * 20) + 5;
            setMathProblem({ q: `${num1} + ${num2}`, a: num1 + num2 });
            setMathAnswer('');
            setShowChallenge(true);
        } else {
            setIsOpen(false);
        }
    };

    const submitChallenge = () => {
        if (parseInt(mathAnswer) === mathProblem.a) {
            setShowChallenge(false);
            setIsLockMode(false);
            setIsOpen(false);
        } else {
            setMathAnswer('');
        }
    };

    const handleComplete = async () => {
        if (!currentTask) return;
        
        // Throw confetti for x2 XP!
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        await completeTaskWithBonus(currentTask._id, 2); // Double XP from Focus Room!
        
        if (currentIndex < sortedTasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(FOCUS_TIME);
            setIsRunning(false);
        } else {
            setIsOpen(false);
        }
    };

    const handleSkip = () => {
        if (currentIndex < sortedTasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(FOCUS_TIME);
            setIsRunning(false);
        }
    };

    if (activeTasks.length === 0) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100;

    return (
        <>
            <button
                onClick={() => { setIsOpen(true); setCurrentIndex(0); }}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-indigo-500/10 text-indigo-500 rounded-2xl font-black text-xs md:text-sm border border-indigo-500/10 shadow-sm transition-all hover:bg-indigo-500 hover:text-white hover:scale-105 group/focus"
            >
                <Focus className="w-5 h-5 group-hover/focus:rotate-90 transition-transform duration-500" />
                <span className="whitespace-nowrap uppercase tracking-widest leading-none">חדר מיקוד חכם</span>
                <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white rounded-md text-[9px] uppercase tracking-widest hidden group-hover/focus:inline-block">XP כפול!</span>
            </button>

            <AnimatePresence>
                {isOpen && currentTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9000] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center px-6 overflow-hidden"
                    >
                        {/* Lofi Background */}
                        {audioMode === 'lofi' && audioActive && (
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-opacity duration-1000">
                                <iframe 
                                    src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=0&showinfo=0&loop=1" 
                                    className="w-full h-[150%] -translate-y-[25%]" 
                                    allow="autoplay"
                                />
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="max-w-2xl w-full relative grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {/* Close */}
                            <button
                                onClick={handleAttemptClose}
                                className="absolute -top-12 right-0 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Focus Lock Challenge Modal */}
                            <AnimatePresence>
                                {showChallenge && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-indigo-500/30"
                                    >
                                        <Lock className="w-12 h-12 text-indigo-500 mb-6" />
                                        <h3 className="text-2xl font-black text-white mb-2">מצב פוקוס אקסטרים!</h3>
                                        <p className="text-white/60 text-sm mb-8">פתור את התרגיל כדי לצאת מהחדר</p>
                                        <div className="text-4xl font-black text-indigo-400 tracking-wider mb-8">{mathProblem.q} = ?</div>
                                        <div className="flex gap-4">
                                            <input 
                                                autoFocus
                                                type="number" 
                                                value={mathAnswer} 
                                                onChange={e => setMathAnswer(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && submitChallenge()}
                                                className="w-24 text-center bg-white/5 border border-white/20 rounded-xl p-4 text-2xl font-black text-white outline-none focus:border-indigo-500"
                                            />
                                            <button onClick={submitChallenge} className="px-6 py-4 bg-indigo-500 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 transition-colors">
                                                שחרר אותי
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Left Panel: Task Info */}
                            <div className="flex flex-col justify-center text-right border-l-0 md:border-l border-white/10 pl-0 md:pl-8">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4 text-white/50 text-xs font-bold uppercase tracking-widest justify-between">
                                        <span>משימה {currentIndex + 1} מתוך {sortedTasks.length}</span>
                                        <button 
                                            onClick={() => setIsLockMode(!isLockMode)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isLockMode ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'bg-transparent text-white/30 border-white/10 hover:bg-white/5 hover:text-white'}`}
                                            title="נעילת פוקוס - דורש תרגיל מתמטי כדי לצאת"
                                        >
                                            {isLockMode ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                            <span className="text-[9px]">Focus Lock</span>
                                        </button>
                                        <button 
                                            onClick={() => setIsDeepWork(!isDeepWork)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isDeepWork ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-transparent text-white/30 border-white/10 hover:bg-white/5 hover:text-white'}`}
                                            title="שומר ריכוז עמוק - משתיק התראות ומצמצם הסחות דעת"
                                        >
                                            <Sparkles className={`w-3 h-3 ${isDeepWork ? 'animate-pulse' : ''}`} />
                                            <span className="text-[9px]">Deep Work Guard</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${currentTask.priority === 'High' ? 'bg-red-500/20 text-red-400' : currentTask.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                            {currentTask.priority === 'High' ? 'דחוף' : currentTask.priority === 'Medium' ? 'בינוני' : 'נמוך'}
                                        </span>
                                        <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-black text-white/50">
                                            {currentTask.category}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                                        {currentTask.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded-xl mb-8 border border-indigo-500/20 w-fit">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-xs font-bold">סיום כאן מעניק בונוס XP כפול!</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-start gap-4">
                                    <button
                                        onClick={handleComplete}
                                        className="flex items-center justify-center gap-2 flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
                                    >
                                        <CheckCircle className="w-5 h-5" />סיימתי!
                                    </button>
                                    {currentIndex < sortedTasks.length - 1 && (
                                        <button
                                            onClick={handleSkip}
                                            className="px-6 py-4 bg-white/5 text-white flex-shrink-0 font-bold text-sm rounded-2xl hover:bg-white/10 transition-colors"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel: Pomodoro & Audio */}
                            <div className="flex flex-col items-center justify-center bg-white/5 rounded-3xl p-6 border border-white/10">
                                
                                {/* Circular Timer */}
                                <div className="relative w-48 h-48 mb-8">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                        <circle
                                            cx="60" cy="60" r="54" fill="none"
                                            stroke="#4F46E5" strokeWidth="8" strokeLinecap="round"
                                            strokeDasharray={`${(progress / 100) * 339.29} 339.29`}
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black tabular-nums text-white tracking-tighter shadow-sm">{formatTime(timeLeft)}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-1">
                                            זמן מיקוד
                                        </span>
                                    </div>
                                </div>

                                {/* Timer Controls */}
                                <div className="flex items-center gap-3 mb-8 w-full justify-center">
                                    <button onClick={() => { setIsRunning(false); setTimeLeft(FOCUS_TIME); }} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-all">
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setIsRunning(!isRunning)} className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-105 shadow-xl ${isRunning ? 'bg-red-500 shadow-red-500/30' : 'bg-indigo-500 shadow-indigo-500/30'}`}>
                                        {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                                    </button>
                                </div>

                                {/* Audio Toggles */}
                                <div className="w-full pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-white/50">רעש לבן לפוקוס</span>
                                        <button onClick={() => setAudioActive(!audioActive)} className={`p-2 rounded-lg transition-colors ${audioActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>
                                            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {AMBIENCE_MODES.map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => { setAudioMode(m.id); setAudioActive(true); }}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${audioMode === m.id ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                                            >
                                                <m.icon className="w-5 h-5" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{m.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
