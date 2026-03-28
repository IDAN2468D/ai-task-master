'use client';

import { Trophy, Star, Coins, Zap, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserStatsProps {
    xp: number;
    level: number;
    currency: number;
}

export default function UserStats({ xp, level, currency }: UserStatsProps) {
    const xpInCurrentLevel = xp % 1000;
    const progress = (xpInCurrentLevel / 1000) * 100;

    return (
        <div className="flex items-center gap-8 bg-white/5 dark:bg-black/40 backdrop-blur-3xl px-8 py-3 rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group/stats relative overflow-hidden h-[72px]">
            {/* Elite Background Layers */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover/stats:translate-x-full transition-transform duration-1500 ease-in-out" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent" />
            
            {/* 3D Level Orb - The "Elite" Sphere */}
            <div className="relative group/level shrink-0 flex items-center justify-center">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 bg-linear-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover/level:opacity-100 transition duration-700" 
                />
                
                <div className="relative w-12 h-12 rounded-full p-[2px] bg-linear-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    <div className="w-full h-full rounded-full bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner">
                        {/* Internal Orb Glow */}
                        <div className="absolute inset-0 bg-linear-to-tr from-indigo-600/40 to-transparent opacity-50" />
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-1 left-1 w-4 h-4 bg-white/20 rounded-full blur-sm" 
                        />
                        
                        <span className="relative z-10 text-lg font-black italic text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {level}
                        </span>
                        
                        {/* Elite Scanline on Orb */}
                        <motion.div 
                            animate={{ y: ['-100%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-full h-[1px] bg-white/20 blur-[1px] z-20" 
                        />
                    </div>
                </div>

                {/* Ranking Sparkle */}
                <div className="absolute -top-1 -right-1 z-20 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                    <Star size={12} className="text-amber-400 fill-amber-400 animate-pulse" />
                </div>
            </div>

            {/* Neural Progression Track */}
            <div className="flex flex-col gap-2 min-w-[160px]">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Sparkles size={8} className="text-indigo-400 animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">Neural XP</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase tracking-widest">
                        {xpInCurrentLevel} <span className="opacity-30">/</span> 1000
                    </span>
                </div>
                
                <div className="h-2.5 w-full bg-black/20 dark:bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5 shadow-inner">
                    <div className="h-full rounded-full overflow-hidden relative bg-slate-800/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full relative"
                        >
                            {/* Neural Flow Animation */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                            />
                            
                            {/* Lead Particle Glow */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md opacity-50" />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="h-10 w-[1px] bg-linear-to-b from-transparent via-white/10 to-transparent" />

            {/* Currency HUD - Digital Asset Style */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 group/currency cursor-pointer"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-xl opacity-0 group-hover/currency:opacity-100 transition-opacity duration-500" />
                    <motion.div 
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400/10 to-orange-500/5 flex items-center justify-center border border-amber-500/30 relative overflow-hidden group-hover/currency:border-amber-500/60 transition-colors"
                    >
                        <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover/currency:translate-y-0 transition-transform duration-500" />
                        <Coins size={18} className="text-amber-500 relative z-10" />
                    </motion.div>
                </div>
                
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-xl font-black text-amber-500 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                            {currency.toLocaleString()}
                        </span>
                        <Zap size={10} className="text-amber-400 fill-current animate-bounce" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-amber-500/50 tracking-[0.2em] mt-1 flex items-center gap-1">
                        <Shield size={7} /> Core Reserve
                    </span>
                </div>
            </motion.div>
        </div>
    );
}


