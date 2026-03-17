'use client';

import { Mic, MicOff, Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleVoiceCommand } from '@/actions/taskActions';

export default function VoiceActionOrb() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError(true);
            setTimeout(() => setError(false), 3000);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'he-IL';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += t;
                } else {
                    interimTranscript += t;
                }
            }
            setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onend = async () => {
            setIsListening(false);
            if (transcript.trim() && transcript !== 'מקשיב...') {
                setProcessing(true);
                try {
                    const result = await handleVoiceCommand(transcript);
                    if (result.success) {
                        const actionMap: any = { CREATE: 'נוצרה משימה:', MOVE: 'הועברה משימה:', DELETE: 'נמחקה משימה:' };
                        setResponseMsg(`${actionMap[result.action || ''] || ''} ${result.title || ''}`);
                        setSuccess(true);
                        setTimeout(() => {
                            setSuccess(false);
                            setResponseMsg(null);
                            setTranscript('');
                        }, 4000);
                    } else {
                        setResponseMsg(result.message || 'לא הבנתי...');
                        setError(true);
                        setTimeout(() => {
                            setError(false);
                            setResponseMsg(null);
                        }, 4000);
                    }
                } catch (err) {
                    setError(true);
                    setTimeout(() => setError(false), 3000);
                } finally {
                    setProcessing(false);
                }
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            setError(true);
            setTimeout(() => setError(false), 3000);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        setTranscript('מקשיב...');
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[3000] global-floating-btn transition-all duration-300">
            <AnimatePresence>
                {(isListening || processing || success || error) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 left-0 w-[280px] bg-white/90 dark:bg-[#111C44]/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Audio Waveform Animation */}
                        {isListening && (
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
                        )}

                        <div className="text-center space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#4318FF] dark:text-[#00E5FF]">
                                {processing ? 'AI מעבד...' : success ? 'הצלחתי! ✨' : error ? 'משהו קרה' : 'עוזר קולי'}
                            </h4>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">
                                {success || error ? responseMsg : `"${transcript}"`}
                            </p>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-tr from-[#4318FF]/5 to-[#FF00E5]/5 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={handleClick}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isListening
                    ? 'bg-red-500 shadow-red-500/40 rotate-90'
                    : success
                        ? 'bg-emerald-500 shadow-emerald-500/40'
                        : error
                            ? 'bg-amber-500 shadow-amber-500/40'
                            : 'bg-white dark:bg-[#111C44] border-2 border-slate-200 dark:border-white/10'
                    }`}
            >
                <div className="relative">
                    {processing ? (
                        <Sparkles className="w-7 h-7 text-white animate-spin" />
                    ) : success ? (
                        <Check className="w-7 h-7 text-white" />
                    ) : error ? (
                        <AlertCircle className="w-7 h-7 text-white" />
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
