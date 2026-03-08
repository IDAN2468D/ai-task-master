'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Zap, Target, Crown, Sparkles, Star } from 'lucide-react';

interface AvatarDisplayProps {
    avatar?: {
        type: string;
        skin: string;
        clothing: string;
        accessory: string;
    };
    level: number;
    size?: number;
}

export default function AvatarDisplay({ avatar, level, size = 120 }: AvatarDisplayProps) {
    const isHighLevel = level >= 10;
    const isMaster = level >= 50;

    // Default styles for the avatar base
    const baseColor = avatar?.skin === 'neon' ? 'from-cyan-400 to-blue-500' : 'from-indigo-500 to-purple-600';

    return (
        <div className="relative group/avatar" style={{ width: size, height: size }}>
            {/* Ambient Aura */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 360]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 rounded-full blur-2xl -z-10 bg-gradient-to-tr ${baseColor}`}
            />

            {/* Main Avatar Container */}
            <div className={`w-full h-full rounded-[38%] bg-gradient-to-br ${baseColor} flex items-center justify-center relative overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-md`}>

                {/* Internal HUD Elements */}
                <div className="absolute inset-x-0 bottom-0 py-1 bg-black/30 backdrop-blur-sm text-[8px] font-black text-white/50 text-center uppercase tracking-tighter">
                    Level {level} Unit
                </div>

                {/* The Character Body/Icon */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative"
                >
                    <User className="w-16 h-14 text-white drop-shadow-lg" />

                    {/* Clothing / Shield Overlay */}
                    {avatar?.clothing === 'armor' && (
                        <Shield className="absolute -bottom-1 -right-1 w-6 h-6 text-cyan-300 drop-shadow-sm" />
                    )}
                </motion.div>

                {/* Glow Effects */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-white/10" />
            </div>

            {/* Accessory Overlays */}
            <AnimatePresence>
                {avatar?.accessory === 'crown' || isMaster && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                    >
                        <Crown className="w-8 h-8 text-amber-400 fill-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    </motion.div>
                )}

                {(avatar?.accessory === 'wings' || isHighLevel) && (
                    <div className="absolute inset-0 -z-10">
                        <motion.div
                            animate={{ x: [-5, 5, -5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -left-6 top-1/4"
                        >
                            <Zap className="w-8 h-8 text-cyan-400/30 blur-sm" />
                        </motion.div>
                        <motion.div
                            animate={{ x: [5, -5, 5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -right-6 top-1/4"
                        >
                            <Zap className="w-8 h-8 text-cyan-400/30 blur-sm" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Particle Star */}
            <motion.div
                animate={{
                    y: [-4, 4, -4],
                    rotate: 360
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg flex items-center justify-center border border-slate-100 dark:border-white/10"
            >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </motion.div>

            {/* Level Badge Overlay */}
            <div className="absolute -top-1 -left-1 px-2 py-0.5 bg-slate-900 text-white rounded-lg text-[10px] font-black border border-white/20 shadow-md">
                Lvl {level}
            </div>
        </div>
    );
}
