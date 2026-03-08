'use client';

import { Palette, X, Check, Lock, ShoppingCart, Sparkles, Coins } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserStats, buyShopItem } from '@/actions/gamificationActions';
import { useToast } from './ToastNotifications';

export const THEMES = [
    { id: 'purple', name: 'סגול קלאסי', primary: '#4318FF', secondary: '#00E5FF', accent: '#FF00E5', price: 0, bg: 'linear-gradient(135deg, #4318FF 0%, #7C3AED 100%)' },
    { id: 'ocean', name: 'אוקיינוס', primary: '#0369A1', secondary: '#06B6D4', accent: '#2563EB', price: 200, bg: 'linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)' },
    { id: 'sunset', name: 'שקיעה', primary: '#DC2626', secondary: '#F59E0B', accent: '#EA580C', price: 250, bg: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)' },
    { id: 'forest', name: 'יער', primary: '#059669', secondary: '#84CC16', accent: '#10B981', price: 300, bg: 'linear-gradient(135deg, #059669 0%, #84CC16 100%)' },
    { id: 'midnight', name: 'חצות', primary: '#7C3AED', secondary: '#EC4899', accent: '#8B5CF6', price: 400, bg: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' },
    { id: 'gold', name: 'זהב', primary: '#B45309', secondary: '#D97706', accent: '#F59E0B', price: 500, bg: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)' },
];

export default function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('purple');
    const [unlockedItems, setUnlockedItems] = useState<string[]>(['purple']);
    const [currency, setCurrency] = useState(0);
    const [isPending, startTransition] = useTransition();
    const { addToast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem('taskflow-theme') || 'purple';
        setCurrentTheme(saved);
        applyTheme(saved);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const stats = await getUserStats();
        if (stats) {
            setUnlockedItems(stats.unlockedItems.length > 0 ? [...stats.unlockedItems, 'purple'] : ['purple']);
            setCurrency(stats.currency);
        }
    };

    const applyTheme = (themeId: string) => {
        const theme = THEMES.find(t => t.id === themeId);
        if (!theme) return;
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--accent-1', theme.secondary);
        document.documentElement.style.setProperty('--accent-2', theme.accent);
        document.documentElement.style.setProperty('--primary-glow', `${theme.primary}33`);
    };

    const selectTheme = (themeId: string) => {
        if (!unlockedItems.includes(themeId)) return; // Prevents selecting locked themes
        setCurrentTheme(themeId);
        localStorage.setItem('taskflow-theme', themeId);
        applyTheme(themeId);
    };

    const handleBuy = async (themeId: string, price: number) => {
        if (currency < price) {
            addToast('אין לך מספיק מטבעות! 🪙', 'error');
            return;
        }

        startTransition(async () => {
            const result = await buyShopItem(themeId, price);
            if (result.success) {
                addToast('הפריט נרכש בהצלחה! 🎉', 'success');
                await fetchStats();
            } else {
                addToast(result.message || 'הרכישה נכשלה', 'error');
            }
        });
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm relative"
                title="ערכות נושא וחנות">
                <Palette className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <Sparkles className="w-2.5 h-2.5 text-amber-500 absolute top-1 right-1" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                        🎨 חנות ועיצובים
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500">השתמש במטבעות שצברת כדי לפתוח עיצובים פרימיום</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/50 dark:bg-amber-500/10 rounded-xl border border-amber-200/50">
                                        <Coins className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-black text-amber-700 dark:text-amber-400">{currency}</span>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {THEMES.map(theme => {
                                    const isUnlocked = unlockedItems.includes(theme.id);
                                    const isCurrent = currentTheme === theme.id;

                                    return (
                                        <div key={theme.id} className="flex flex-col gap-2">
                                            <button
                                                onClick={() => isUnlocked ? selectTheme(theme.id) : null}
                                                disabled={!isUnlocked}
                                                className={`relative p-4 rounded-2xl border-2 transition-all text-right group ${isCurrent ? 'border-[#4318FF] dark:border-[#00E5FF] shadow-lg scale-[1.02]' : isUnlocked ? 'border-slate-200 dark:border-white/10 hover:border-slate-300' : 'border-slate-100 dark:border-white/5 opacity-80'}`}>

                                                {!isUnlocked && (
                                                    <div className="absolute inset-0 z-10 bg-slate-900/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Lock className="w-6 h-6 text-white" />
                                                    </div>
                                                )}

                                                {isCurrent && (
                                                    <div className="absolute top-2 left-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center z-20 shadow-sm">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}

                                                <div className="w-full h-12 rounded-xl mb-3 shadow-inner" style={{ background: theme.bg }} />
                                                <h4 className="text-sm font-black text-slate-800 dark:text-white">{theme.name}</h4>

                                                <div className="flex gap-1.5 mt-2">
                                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.primary }} />
                                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.secondary }} />
                                                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.accent }} />
                                                </div>
                                            </button>

                                            {!isUnlocked && (
                                                <button
                                                    onClick={() => handleBuy(theme.id, theme.price)}
                                                    disabled={isPending || currency < theme.price}
                                                    className="w-full py-2 bg-gradient-stat-1 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                                                >
                                                    <ShoppingCart className="w-3 h-3" />
                                                    רכוש ב-{theme.price}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
