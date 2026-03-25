'use client';

import React, { useState } from 'react';
import { Wand2, Rocket, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateProjectCharter } from '@/actions/projectActions';
import confetti from 'canvas-confetti';

export default function AIProjectCharter() {
    const [prompt, setPrompt] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setStatus(null);

        const result = await generateProjectCharter(prompt);

        setLoading(false);
        if (result.success) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4318FF', '#00D1FF', '#70E2FF']
            });
            setStatus({ 
                type: 'success', 
                message: `פרויקט "${result.projectName}" נוצר בהצלחה עם ${result.taskCount} משימות!` 
            });
            setPrompt('');
            setTimeout(() => {
                setIsOpen(false);
                setStatus(null);
            }, 3000);
        } else {
            setStatus({ type: 'error', message: 'שגיאה ביצירת הפרויקט. נסה שוב.' });
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-6 py-4 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-[10px] md:text-xs border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm transition-all hover:bg-indigo-500/20 active:scale-95 uppercase tracking-widest"
            >
                <Rocket className="w-5 h-5" />
                <span>מחולל פרויקטים</span>
            </button>

            {isOpen && (
                <div className="absolute top-20 left-0 w-[350px] md:w-[450px] z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="vibrant-card border-2 border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
                        {/* Mesh gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Wand2 className="w-4 h-4 text-indigo-500" />
                                    צור פרויקט חדש ב-AI
                                </h4>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    ✕
                                </button>
                            </div>

                            <p className="text-[11px] font-bold text-slate-500 mb-4 leading-relaxed">
                                תאר את הפרויקט שלך (למשל: "לבנות דק בגינה" או "להשיק בלוג טכנולוגי") וה-AI יבנה עבורך את כל שלבי העבודה.
                            </p>

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="מה הפרויקט הבא שלך?..."
                                dir="rtl"
                                className="w-full h-32 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none mb-4"
                            />

                            {status && (
                                <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 text-xs font-bold animate-in zoom-in-95 duration-200 ${
                                    status.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                }`}>
                                    {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {status.message}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !prompt.trim()}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>בונה תוכנית עבודה...</span>
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        <span>שגר פרויקט</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
