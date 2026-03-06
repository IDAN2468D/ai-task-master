'use client';

import { Search, Command, X, Sparkles, Zap, Brain, LayoutGrid, BarChart3, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CommandCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const suggestions = [
        { icon: Sparkles, label: "הצג משימות בעדיפות גבוהה", action: () => { router.push('/?priority=High'); setIsOpen(false); } },
        { icon: Zap, label: "הצג משימות בתהליך", action: () => { router.push('/?priority=Medium'); setIsOpen(false); } },
        { icon: Brain, label: "נתח את הפרודוקטיביות שלי", action: () => { router.push('/analytics'); setIsOpen(false); } },
        { icon: LayoutGrid, label: "פתח את הדשבורד", action: () => { router.push('/'); setIsOpen(false); } },
    ];

    const quickNav = [
        { icon: BarChart3, label: "אנליטיקס", action: () => { router.push('/analytics'); setIsOpen(false); } },
        { icon: CheckCircle, label: "הפרופיל שלי", action: () => { router.push('/profile'); setIsOpen(false); } },
    ];

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[5000] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#0B1437] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="relative flex items-center">
                                <Search className="absolute right-4 w-6 h-6 text-[#4318FF]" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="חפש משימות או השתמש בפקודות AI..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pr-14 pl-12 py-5 bg-slate-50 dark:bg-black/20 rounded-2xl border-none focus:ring-2 ring-[#4318FF] text-lg font-bold outline-none transition-all placeholder:text-slate-400"
                                />
                                <div className="absolute left-4 flex items-center gap-2 px-2 py-1 bg-slate-200 dark:bg-white/10 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Command className="w-3 h-3" /> K
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[#4318FF] mb-4 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> פעולות חכמות AI
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {suggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={item.action}
                                                className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#111C44] rounded-2xl border border-slate-100 dark:border-white/5 hover:border-[#4318FF] hover:bg-[#4318FF]/5 transition-all text-right group"
                                            >
                                                <div className="p-2 bg-white dark:bg-white/5 rounded-xl text-slate-400 group-hover:text-[#4318FF] transition-colors">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> ניווט מהיר
                                    </h4>
                                    <div className="space-y-2">
                                        {quickNav.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={item.action}
                                                className="flex w-full items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-medium">{item.label}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400">Enter ↵</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-black/40 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 bg-white dark:bg-white/10 rounded border border-slate-200 dark:border-white/10 shadow-sm">Enter</span> לחיפוש
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 bg-white dark:bg-white/10 rounded border border-slate-200 dark:border-white/10 shadow-sm">Esc</span> לסגירה
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-[#4318FF]">
                                חיפוש_נוירלי_פעיל
                                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-[#4318FF] rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
