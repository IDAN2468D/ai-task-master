'use client';

import { useState, useRef } from 'react';
import { Mic, Zap, StopCircle, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateProjectFromVoice } from '@/actions/voiceActions';
import { toast } from 'react-hot-toast';

export default function VoiceExecution() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [audioLevel, setAudioLevel] = useState<number[]>(new Array(20).fill(5));

    const startRecording = () => {
        setIsRecording(true);
        setResult(null);
        // Simulate waveform
        const interval = setInterval(() => {
            setAudioLevel(prev => prev.map(() => Math.floor(Math.random() * 25) + 5));
        }, 100);
        (window as any).recordingInterval = interval;
    };

    const stopRecording = async () => {
        setIsRecording(false);
        clearInterval((window as any).recordingInterval);
        setIsProcessing(true);

        // Simulation: In a real app, send actual blob to OpenAI/Google audio API
        setTimeout(async () => {
            const data = await generateProjectFromVoice("בנה לי תוכנית עבודה לשיווק מוצר חדש בפייסבוק, כולל מודעות, קהלי יעד ותקציב");
            setResult(data);
            setIsProcessing(false);
            if (data) toast.success('הפרויקט נוצר בהצלחה מתוך הקול שלך!');
        }, 2000);
    };

    return (
        <div id="voice-exec">
            <motion.button

                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isRecording ? stopRecording() : startRecording()}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs border shadow-sm transition-all uppercase tracking-widest ${
                    isRecording 
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'
                }`}
            >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isRecording ? 'מפסיק הקלטה...' : 'פקודה קולית'}</span>
            </motion.button>

            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                    >
                        <div className="bg-white dark:bg-[#111C44] rounded-[40px] p-12 max-w-lg w-full text-center border border-white/20 shadow-2xl">
                            <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/40">
                                <Mic className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">מקשיב לך...</h2>
                            <p className="text-slate-500 font-bold mb-8 italic">"בנה לי פרויקט לשיווק מוצר חדש..."</p>
                            
                            {/* Waveform Visualizer */}
                            <div className="flex items-end justify-center gap-1.5 h-20 mb-8">
                                {audioLevel.map((level, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: `${level}%` }}
                                        className="w-2 bg-rose-500/40 rounded-full"
                                    />
                                ))}
                            </div>

                            <button onClick={stopRecording} className="px-12 py-4 bg-rose-500 text-white font-black rounded-full shadow-xl hover:scale-105 transition-transform">
                                סיים ושגר ל-AI
                            </button>
                        </div>
                    </motion.div>
                )}

                {isProcessing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <span className="font-black text-indigo-500 uppercase tracking-widest text-sm">ה-AI מנתח את הקול שלך...</span>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

