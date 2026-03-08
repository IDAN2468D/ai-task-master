'use client';

import { getUserStats, buyShopItem } from '@/actions/gamificationActions';
import { ShoppingBag, Star, Zap, Palette, Trophy, CheckCircle2, Coins, Sparkles, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from 'react';

const STORE_ITEMS = [
    {
        id: 'theme_neon',
        name: 'ערכת נושא ניאון',
        description: 'שנה את האתר לצבעי ניאון עתידניים שתמיד רצית.',
        cost: 50,
        icon: Palette,
        color: 'from-pink-500 to-purple-600',
    },
    {
        id: 'badge_pro',
        name: 'מדליית Master Pro',
        description: 'הראה לכולם מי פה הבוס עם מדליה ייחודית בפרופיל.',
        cost: 100,
        icon: Trophy,
        color: 'from-amber-400 to-orange-500',
    },
    {
        id: 'ai_boost',
        name: 'AI פרימיום (Boost)',
        description: 'קבל ניתוחי משימות מהירים ומעמיקים פי 2.',
        cost: 200,
        icon: BrainCircuitIcon,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'sound_pack',
        name: 'חבילת צלילים "מרוץ"',
        description: 'צלילים חדשים לסיום משימה ותזכורות.',
        cost: 75,
        icon: Zap,
        color: 'from-emerald-400 to-teal-500',
    }
];

function BrainCircuitIcon({ className }: { className?: string }) {
    return <Sparkles className={className} />;
}

export default function StorePage() {
    const [stats, setStats] = useState<{ xp: number, level: number, currency: number, unlockedItems: string[] } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const s = await getUserStats();
        setStats(s);
    };

    const handleBuy = async (item: typeof STORE_ITEMS[0]) => {
        if (!stats) return;

        if (stats.currency < item.cost) {
            setMessage({ type: 'error', text: 'אין לך מספיק מטבעות! המשך לבצע משימות.' });
            return;
        }

        startTransition(async () => {
            const res = await buyShopItem(item.id, item.cost);
            if (res.success) {
                setMessage({ type: 'success', text: `תתחדש! רכשת את ${item.name}` });
                fetchStats();
            } else {
                setMessage({ type: 'error', text: res.message || 'שגיאה ברכישה' });
            }
        });

        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <main className="min-h-screen pt-32 pb-40 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Store Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <ShoppingBag className="w-3 h-3" />
                            Premium Store
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight">
                            חייב את <span className="text-gradient-primary">השיפור הבא?</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-lg">בזבז את המטבעות שהרווחת ביושר על שיפורים עיצוביים ופונקציונליים.</p>
                    </div>

                    <div className="vibrant-card p-6 flex flex-col items-center gap-2 bg-gradient-stat-1 text-white border-none shadow-xl shadow-[var(--primary)]/20">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">המטבעות שלך</div>
                        <div className="flex items-center gap-3">
                            <Coins className="w-8 h-8 text-amber-400" />
                            <span className="text-4xl font-black tabular-nums">{stats?.currency || 0}</span>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`mb-8 p-4 rounded-2xl font-black text-center ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STORE_ITEMS.map((item) => {
                        const isUnlocked = stats?.unlockedItems.includes(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -5 }}
                                className="vibrant-card overflow-hidden flex flex-col group h-full"
                            >
                                <div className={`h-40 bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                                    <item.icon className="w-16 h-16 text-white transform group-hover:scale-110 transition-transform duration-500 z-10" />
                                    <div className="absolute inset-0 bg-black/5" />
                                    {isUnlocked && (
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                            Unlocked
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{item.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 mb-6 flex-1">{item.description}</p>

                                    <button
                                        onClick={() => handleBuy(item)}
                                        disabled={isPending || isUnlocked}
                                        className={`w-full py-4 rounded-2xl font-black text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${isUnlocked
                                                ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-default'
                                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl active:scale-95'
                                            }`}
                                    >
                                        {isUnlocked ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                נרכש
                                            </>
                                        ) : (
                                            <>
                                                <Coins className="w-4 h-4 text-amber-500" />
                                                קנה ב-{item.cost}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Level Progress */}
                <div className="mt-16 vibrant-card p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-white/5" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * ((stats?.xp || 0) % 1000) / 1000)} className="text-[var(--primary)]" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-800 dark:text-white">{stats?.level || 1}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Level</span>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">המשך לטפס למעלה!</h4>
                        <p className="text-slate-500 font-bold mb-4">אתה במרחק של {1000 - ((stats?.xp || 0) % 1000)} XP מהרמה הבאה.</p>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111C44] bg-gradient-stat-1 flex items-center justify-center text-white text-[10px] font-bold">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400 mr-2">בונוס רמה בקרוב...</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
