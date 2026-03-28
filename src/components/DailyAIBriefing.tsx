'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X, Sparkles, Sun, Volume2, VolumeX, Brain, Zap } from 'lucide-react';
import { getEnergyInsights } from '@/actions/taskActions';

export default function DailyAIBriefing() {
    const [isVisible, setIsVisible] = useState(false);
    const [insight, setInsight] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

    useEffect(() => {
        const checkBriefing = async () => {
            const today = new Date().toDateString();
            const lastShown = localStorage.getItem('lastMorningBriefing');

            if (lastShown !== today) {
                const message = await getEnergyInsights();
                setInsight(message);
                setIsVisible(true);
                localStorage.setItem('lastMorningBriefing', today);
            }
        };

        // Delay to allow the page to mount and feel natural
        setTimeout(checkBriefing, 2000);

        return () => {
            if (synth) synth.cancel();
        };
    }, []);

    const toggleSpeech = () => {
        if (!synth) return;
        if (isPlaying) {
            synth.cancel();
            setIsPlaying(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(insight);
            utterance.lang = 'he-IL';
            // Find Hebrew voice if available
            const voices = synth.getVoices();
            const heVoice = voices.find(v => v.lang.includes('he') || v.lang.includes('he-IL'));
            if (heVoice) utterance.voice = heVoice;
            
            utterance.onend = () => setIsPlaying(false);
            synth.speak(utterance);
            setIsPlaying(true);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="relative w-full max-w-lg glass-panel border-white/20 dark:border-white/10 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] p-0 overflow-hidden"
                    >
                        {/* Interactive Background Orbs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }} />

                        <div className="relative z-10 p-10 flex flex-col items-center text-center">
                            {/* Header Status */}
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-500/50" />
                                <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em]">
                                    Autonomous Intelligence Mode
                                </div>
                                <span className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500/50" />
                            </div>

                            <div className="relative group mb-8">
                                <div className="absolute -inset-4 bg-gradient-mesh rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-mesh flex items-center justify-center text-white shadow-2xl relative transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                                    <Brain className="w-12 h-12" />
                                    <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 rounded-xl p-2 shadow-xl border border-white/20">
                                        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight tracking-tighter">
                                <span className="text-slate-800 dark:text-white">תדרוך בוקר </span>
                                <span className="text-gradient-primary">חכם.</span>
                            </h2>
                            
                            <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-8" />

                            <div className="relative mb-10 group">
                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic px-4">
                                    &quot;{insight}&quot;
                                </p>
                            </div>

                            <div className="flex flex-col w-full gap-4">
                                <div className="flex items-center gap-3 w-full">
                                    <button 
                                        onClick={toggleSpeech} 
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95 group"
                                    >
                                        {isPlaying ? (
                                            <VolumeX className="w-6 h-6 text-rose-500" />
                                        ) : (
                                            <Volume2 className="w-6 h-6 text-indigo-500 animate-pulse" />
                                        )}
                                        <span className="text-xs font-black uppercase tracking-widest">{isPlaying ? 'השתק קול' : 'השמע תדרוך'}</span>
                                    </button>

                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-500 transition-all active:scale-95"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => { setIsVisible(false); if(synth) synth.cancel(); }}
                                    className="w-full group relative py-5 px-8 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-mesh transition-transform group-hover:scale-105 duration-500" />
                                    <div className="relative flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-[0.3em]">
                                        <span>שגר את היום שלי</span>
                                        <Zap className="w-4 h-4 fill-current group-hover:animate-bounce" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Bottom Status bar */}
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Neural Link Active</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

