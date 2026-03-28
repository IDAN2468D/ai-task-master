'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ChevronRight, Sparkles, Mail, Loader2, Brain, Activity, CheckCircle2 } from 'lucide-react';
import { sendAIManagerReportEmail } from '@/actions/aiManagerActions';
import { toast } from 'react-hot-toast';

interface AIManagerReportProps {
    report: any;
}

export default function AIManagerReport({ report }: AIManagerReportProps) {
    const [isEmailing, setIsEmailing] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);

    const data = typeof report === 'string' 
        ? { insight: report, mentalLoad: 0, burnoutRisk: 0 } 
        : report;

    const handleEmailReport = async () => {
        setIsEmailing(true);
        const res = await sendAIManagerReportEmail(data.insight);
        if (res?.success) {
            setEmailSuccess(true);
            setTimeout(() => setEmailSuccess(false), 3000);
            toast.success('הדו"ח נשלח בהצלחה!');
        } else {
            toast.error('שגיאה בשליחת האימייל: ' + (res?.error || 'Unknown error'));
        }
        setIsEmailing(false);
    };

    return (
        <div id="ai-report" className="glass-panel p-6 rounded-[32px] border-indigo-500/20 shadow-2xl relative overflow-hidden flex flex-col h-full group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
            
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-mesh rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">AI Report</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Analysis</p>
                        </div>
                    </div>
                </div>
                <div className="p-2 glass-panel rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div className="relative p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 italic">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed pr-2">
                        &quot;{data.insight}&quot;
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 glass-panel rounded-2xl border-white/50 dark:border-white/5 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Brain className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mental</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{data.mentalLoad}</p>
                    </div>
                    <div className="p-4 glass-panel rounded-2xl border-white/50 dark:border-white/5 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Burnout</span>
                        </div>
                        <p className="text-2xl font-black text-rose-500 tabular-nums">{data.burnoutRisk}%</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <button 
                        onClick={handleEmailReport}
                        disabled={isEmailing || emailSuccess}
                        className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black text-indigo-500 px-4 py-3 bg-indigo-500/10 rounded-xl hover:bg-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                        {isEmailing ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                         emailSuccess ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 
                         <Mail className="w-3.5 h-3.5" />}
                        {emailSuccess ? 'SENT' : 'SEND REPORT'}
                    </button>
                    <button className="p-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-90">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-[0.2em] opacity-50">
                    Next update in <span className="text-indigo-500">2h 45m</span>
                </p>
            </div>
        </div>
    );
}
