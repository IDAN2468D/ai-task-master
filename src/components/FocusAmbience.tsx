'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, CloudRain, TreePine, Headset, Zap, Sparkles } from 'lucide-react';

const AMBIENCE_MODES = [
    {
        id: 'rain',
        name: 'גשם עדין',
        icon: CloudRain,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        url: 'https://raw.githubusercontent.com/rafaelmardojai/blanket/master/data/resources/sounds/rain.ogg'
    },
    {
        id: 'forest',
        name: 'יער קסום',
        icon: TreePine,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        url: 'https://raw.githubusercontent.com/rafaelmardojai/blanket/master/data/resources/sounds/birds.ogg'
    },
    {
        id: 'lofi',
        name: 'Lo-Fi פוקוס',
        icon: Headset,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    },
];


export default function FocusAmbience() {
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('rain');
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleAmbience = () => {
        setIsActive(!isActive);
        if (navigator.vibrate) navigator.vibrate(20);
    };

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }

        const selectedMode = AMBIENCE_MODES.find(m => m.id === mode);
        if (selectedMode && audioRef.current.src !== selectedMode.url) {
            audioRef.current.src = selectedMode.url;
            if (isActive) audioRef.current.play().catch(e => console.error("Audio error", e));
        }

        if (isActive) {
            audioRef.current.play().catch(e => console.error("Audio error", e));
        } else {
            audioRef.current.pause();
        }

        audioRef.current.volume = volume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [isActive, mode, volume]);


    return (
        <div className="flex flex-col gap-6 p-8 bg-white dark:bg-[#111C44] rounded-[32px] border border-slate-200/50 dark:border-white/5 shadow-2xl overflow-hidden relative">
            {/* Background Grain Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-[18px] flex items-center justify-center">
                        <Zap className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white leading-none">Focus Environment</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">סאונד ואווירה חושית</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAmbience}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                >
                    {isActive ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {AMBIENCE_MODES.map((m) => (
                    <motion.button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-[24px] border transition-all flex flex-col items-center gap-4 ${mode === m.id ? 'bg-white dark:bg-white/10 border-indigo-500/50 shadow-xl' : 'bg-transparent border-slate-100 dark:border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                        <div className={`w-14 h-14 ${m.bg} rounded-2xl flex items-center justify-center`}>
                            <m.icon className={`w-7 h-7 ${m.color}`} />
                        </div>
                        <span className="text-xs font-black text-slate-600 dark:text-slate-300">{m.name}</span>
                    </motion.button>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Volume Intensity</span>
                    <span className="text-[10px] font-black text-indigo-500">{Math.round(volume * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10 rounded-full"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
