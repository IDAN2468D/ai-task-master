'use client';

import { Mic, MicOff, Check, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceActionOrb() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    // Typing effect for transcript
    useEffect(() => {
        if (!isListening) return;
        const interval = setInterval(() => {
            setTranscript(prev => prev + (Math.random() > 0.8 ? '... listening' : ''));
        }, 1000);
        return () => clearInterval(interval);
    }, [isListening]);

    const handleListen = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTranscript('Processing AI Intent...');
        } else {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
                setTranscript('');
            }, 1500);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[3000]">
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-[280px] bg-white/90 dark:bg-[#111C44]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Audio Waveform Animation */}
                        <div className="flex items-center gap-1.5 h-6 mb-4 justify-center">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [8, 24, 8] }}
                                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                                    className="w-1.5 bg-gradient-stat-2 rounded-full"
                                />
                            ))}
                        </div>

                        <div className="text-center space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#4318FF] dark:text-[#00E5FF]">Voice Assistant</h4>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">"{transcript}"</p>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-tr from-[#4318FF]/5 to-[#FF00E5]/5 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={handleListen}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isListening
                        ? 'bg-red-500 shadow-red-500/40 rotate-90'
                        : success
                            ? 'bg-emerald-500 shadow-emerald-500/40'
                            : 'bg-white dark:bg-[#111C44] border-2 border-slate-200 dark:border-white/10'
                    }`}
            >
                <div className="relative">
                    {processing ? (
                        <Sparkles className="w-7 h-7 text-white animate-spin" />
                    ) : success ? (
                        <Check className="w-7 h-7 text-white" />
                    ) : isListening ? (
                        <X className="w-7 h-7 text-white" />
                    ) : (
                        <Mic className="w-7 h-7 text-slate-800 dark:text-white" />
                    )}

                    {isListening && (
                        <div className="absolute -inset-4 bg-red-500 rounded-full animate-ping opacity-20 pointer-events-none" />
                    )}
                </div>
            </button>
        </div>
    );
}
