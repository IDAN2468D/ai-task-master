'use client';

import { Palette, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
    { id: 'purple', name: 'סגול קלאסי', primary: '#4318FF', secondary: '#00E5FF', accent: '#FF00E5', bg: 'linear-gradient(135deg, #4318FF 0%, #7C3AED 100%)' },
    { id: 'ocean', name: 'אוקיינוס', primary: '#0369A1', secondary: '#06B6D4', accent: '#2563EB', bg: 'linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)' },
    { id: 'sunset', name: 'שקיעה', primary: '#DC2626', secondary: '#F59E0B', accent: '#EA580C', bg: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)' },
    { id: 'forest', name: 'יער', primary: '#059669', secondary: '#84CC16', accent: '#10B981', bg: 'linear-gradient(135deg, #059669 0%, #84CC16 100%)' },
    { id: 'midnight', name: 'חצות', primary: '#7C3AED', secondary: '#EC4899', accent: '#8B5CF6', bg: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' },
    { id: 'gold', name: 'זהב', primary: '#B45309', secondary: '#D97706', accent: '#F59E0B', bg: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)' },
];

export default function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('purple');

    useEffect(() => {
        const saved = localStorage.getItem('taskflow-theme') || 'purple';
        setCurrentTheme(saved);
        applyTheme(saved);
    }, []);

    const applyTheme = (themeId: string) => {
        const theme = THEMES.find(t => t.id === themeId);
        if (!theme) return;
        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
        document.documentElement.style.setProperty('--theme-accent', theme.accent);
    };

    const selectTheme = (themeId: string) => {
        setCurrentTheme(themeId);
        localStorage.setItem('taskflow-theme', themeId);
        applyTheme(themeId);
    };

    const current = THEMES.find(t => t.id === currentTheme);

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
                title="ערכות נושא">
                <Palette className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white">🎨 ערכות נושא</h3>
                                    <p className="text-xs font-bold text-slate-500">בחר צבעים שמתאימים לך</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {THEMES.map(theme => (
                                    <button key={theme.id} onClick={() => selectTheme(theme.id)}
                                        className={`relative p-4 rounded-2xl border-2 transition-all text-right ${currentTheme === theme.id ? 'border-slate-800 dark:border-white shadow-lg scale-[1.02]' : 'border-slate-200 dark:border-white/10 hover:border-slate-300'}`}>
                                        {currentTheme === theme.id && (
                                            <div className="absolute top-2 left-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <div className="w-full h-8 rounded-lg mb-3" style={{ background: theme.bg }} />
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white">{theme.name}</h4>
                                        <div className="flex gap-1.5 mt-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }} />
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
