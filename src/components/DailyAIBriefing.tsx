'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X, Sparkles, Sun, Volume2, VolumeX } from 'lucide-react';
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
                <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-[#111C44] rounded-[2rem] shadow-2xl p-8 overflow-hidden"
                    >
                        {/* Background Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-stat-1 rounded-full blur-3xl opacity-20" />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 left-4 p-2 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>

                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-orange-500/30 flex items-center justify-center mb-6 relative">
                                <Sun className="w-10 h-10 text-white animate-pulse" />
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                                תדרוך בוקר חכם 🌅
                            </h2>
                            <p className="text-sm font-bold text-[#4318FF] dark:text-[#00E5FF] uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/10 pb-4 inline-block">
                                המלצת AI אישית להיום
                            </p>

                            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                &quot;{insight}&quot;
                            </p>

                            <button onClick={toggleSpeech} className="mb-8 flex items-center gap-2 px-6 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
                                <span className="text-sm font-bold">{isPlaying ? 'השתק' : 'השמע הכל (Audio Briefing)'}</span>
                            </button>

                            <button
                                onClick={() => { setIsVisible(false); if(synth) synth.cancel(); }}
                                className="w-full py-4 rounded-2xl bg-gradient-stat-1 text-white text-sm font-black tracking-widest uppercase hover:shadow-[0_20px_40px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all"
                            >
                                בוא נתחיל לעבוד 🚀
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
