'use client';

import { Users, Globe, Copy, Check, ShieldCheck, Share2, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollaborativeHub() {
    const [isOpen, setIsOpen] = useState(false);
    const [workspaceCode, setWorkspaceCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isShared, setIsShared] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('taskflow-workspace');
        if (saved) {
            setWorkspaceCode(saved);
        } else {
            const newCode = 'WF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            setWorkspaceCode(newCode);
            localStorage.setItem('taskflow-workspace', newCode);
        }
    }, []);

    const copyCode = () => {
        if (!workspaceCode) return;
        navigator.clipboard.writeText(workspaceCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-[10px] md:text-xs border border-blue-500/10 dark:border-blue-500/20 shadow-sm transition-all hover:bg-blue-500/20 active:scale-95 uppercase tracking-widest"
                title="Workspace"
            >
                <Users className="w-5 h-5" />
                <span>Spaces</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsOpen(false)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-lg p-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">Workspace <span className="text-blue-500">Collaborator</span></h3>
                                    <p className="text-xs font-bold text-slate-500">עבודת צוות שמעצימה את המשימות שלך</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="vibrant-card p-6 bg-gradient-to-br from-blue-500 to-indigo-600 border-none text-white mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black mb-1">מרחב עבודה פעיל</h4>
                                        <p className="text-xs font-bold opacity-80 leading-relaxed mb-4">
                                            הזמן אחרים לעבוד איתך על המשימות שלך על ידי שיתוף קוד מרחב העבודה הייחודי שלך.
                                        </p>
                                        <div className="flex items-center gap-2 p-3 bg-black/20 rounded-2xl border border-white/10">
                                            <span className="text-xl font-black tracking-widest flex-1">{workspaceCode}</span>
                                            <button onClick={copyCode} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">שותפים רשומים</h4>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">YU</div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-white">You (Admin)</p>
                                                <p className="text-[10px] font-bold text-slate-500">Active Now</p>
                                            </div>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>

                                    {/* Placeholder for other collaborators */}
                                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300/30 dark:border-white/5 rounded-3xl group cursor-pointer hover:border-blue-500/50 transition-colors">
                                        <div className="text-center">
                                            <Plus className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors mx-auto mb-2" />
                                            <p className="text-[11px] font-black text-slate-400">הוסף משתמש נוסף</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full animate-ping ${isShared ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Workspace Status</span>
                                </div>
                                <button
                                    onClick={() => setIsShared(!isShared)}
                                    className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isShared ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                                >
                                    {isShared ? 'Shared Live' : 'Go Public'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
