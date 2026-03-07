'use client';

import { Sparkles, Activity, AlertTriangle, Layers, BrainCircuit, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { autoClusterTasks, getEnergyInsights, getBottleneckAlerts } from '@/actions/taskActions';

export default function SmartAIPanel({ tasks }: { tasks: any[] }) {
    const [energyInsight, setEnergyInsight] = useState<string | null>(null);
    const [bottleneckAlert, setBottleneckAlert] = useState<string | null>(null);
    const [isClustering, setIsClustering] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        async function loadInsights() {
            const energy = await getEnergyInsights();
            const alert = await getBottleneckAlerts();
            setEnergyInsight(energy);
            setBottleneckAlert(alert);
        }
        loadInsights();
    }, [tasks]);

    const handleCluster = async () => {
        setIsClustering(true);
        await autoClusterTasks();
        setIsClustering(false);
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative"
        >
            {/* Energy Insight Card */}
            <div className="vibrant-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">רמת אנרגיה</h4>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                    {energyInsight || "מחשב מסלול מחדש..."}
                </p>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            </div>

            {/* Bottleneck Alert Card */}
            <div className={`vibrant-card p-6 border-amber-500/20 relative group overflow-hidden ${bottleneckAlert ? 'bg-gradient-to-br from-amber-500/10 to-red-500/10' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                {bottleneckAlert && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-red-500" />}
                <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className={`w-5 h-5 ${bottleneckAlert ? 'text-amber-500' : 'text-slate-400'}`} />
                    <h4 className={`text-sm font-black uppercase tracking-widest ${bottleneckAlert ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400'}`}>התראות עומס</h4>
                </div>
                <p className={`text-xs font-bold leading-relaxed ${bottleneckAlert ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                    {bottleneckAlert || "אין עיכובים משמעותיים. המשך כך!"}
                </p>
            </div>

            {/* Auto-Clustering Card */}
            <div className="vibrant-card p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 relative group overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-emerald-500" />
                        <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">AI Clustering</h4>
                    </div>
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-4">
                    קבץ משימות קשורות לפרויקטים באופן אוטומטי לניהול קל יותר.
                </p>
                <button
                    onClick={handleCluster}
                    disabled={isClustering}
                    className="w-full py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                    {isClustering ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                    {isClustering ? "מעבד..." : "קבץ משימות עכשיו"}
                </button>
            </div>
        </motion.div>
    );
}
