'use client';

import { LayoutDashboard, CheckCircle2, Flame, Brain, Activity, Target, Zap, Waves, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeSchedule } from '@/actions/scheduleActions';
import { toast } from 'react-hot-toast';

const LazyPieChart = dynamic(
    () => import('recharts').then(mod => {
        const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } = mod;
        return {
            default: ({ chartData }: { chartData: { name: string; value: number; color: string }[] }) => (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={chartData} 
                            innerRadius={45} 
                            outerRadius={65} 
                            paddingAngle={8} 
                            dataKey="value" 
                            stroke="none"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip
                            contentStyle={{ 
                                borderRadius: '24px', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
                                background: 'rgba(15, 23, 42, 0.9)', 
                                backdropFilter: 'blur(20px)',
                                padding: '12px 20px'
                            }}
                            itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )
        };
    }),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-slate-100 dark:bg-white/5 rounded-full animate-pulse blur-2xl" />,
    }
);

export default function DashboardStats({ tasks }: { tasks: any[] }) {
    const [isMounted, setIsMounted] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const handleOptimize = async () => {
        setIsOptimizing(true);
        // Simulate neural calculation
        await new Promise(resolve => setTimeout(resolve, 2000));
        const result = await optimizeSchedule(tasks);
        setIsOptimizing(false);
        if (result) {
            toast.success(`הלו״ז עבר אופטימיזציה! שעות הזהב שלך: ${result.goldenHours}`);
        }
    };

    const stats = {
        Todo: tasks.filter(t => t.status === 'Todo').length,
        InProgress: tasks.filter(t => t.status === 'InProgress').length,
        Done: tasks.filter(t => t.status === 'Done').length,
    };

    const activeTasks = tasks.filter(t => t.status !== 'Done');
    const totalEstimatedHours = activeTasks.reduce((acc, t: any) => acc + (t.estimatedHours || 0), 0);
    const totalEnergy = activeTasks.reduce((acc, t: any) => acc + (t.energyLevel || 1), 0);
    const highPriorityCount = activeTasks.filter(t => t.priority === 'High').length;

    const mentalLoad = Math.min(100, (totalEnergy * 2) + (totalEstimatedHours));
    const burnoutRisk = Math.min(100, Math.floor((highPriorityCount * 15) + (totalEstimatedHours * 5)));

    const chartData = [
        { name: 'Queue', value: stats.Todo, color: '#4318FF' },
        { name: 'Active', value: stats.InProgress, color: '#06b6d4' },
        { name: 'Resolved', value: stats.Done, color: '#10b981' },
    ];

    return (
        <div id="daily-stats" className="space-y-12 w-full h-full flex flex-col relative z-20">
            
            {/* Elite Neural Predictor Banner - V7 Platinum Edition */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden elite-card p-12 md:p-16 flex flex-col xl:flex-row items-center justify-between gap-12 rounded-[64px] group/banner border-white/20 dark:border-white/5 transition-all duration-1000 hover:shadow-[0_40px_100px_rgba(79,70,229,0.1)]"
            >
                {/* Advanced Background FX Platinum Edition */}
                <div className="absolute inset-0 elite-scanline opacity-10 group-hover/banner:opacity-20 transition-opacity duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/5 opacity-40 group-hover/banner:opacity-60 transition-opacity duration-1000" />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.15, 0.1],
                        rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-60 -right-60 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" 
                />
                
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 w-full xl:w-auto">
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-8 border border-dashed border-indigo-500/10 rounded-full" 
                        />
                        <div className="w-32 h-32 glass-panel rounded-[42px] flex items-center justify-center shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)] relative group/icon overflow-hidden border-white/20 dark:border-white/10 group-hover/banner:border-indigo-500/40 transition-all duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90" />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700" />
                            <Brain className="w-16 h-16 text-white group-hover/icon:scale-110 transition-transform relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                            
                            {/* Neural Scan Line V7 */}
                            <motion.div 
                                animate={{ y: ['-200%', '400%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-x-0 h-1 bg-white/40 blur-[4px] z-20" 
                            />
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 border-4 border-white dark:border-[#0f172a] rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)] flex items-center justify-center relative z-20 neural-pulse">
                            <Sparkles size={16} className="text-white fill-current animate-pulse [animation-duration:2s]" />
                        </div>
                    </div>
                    
                    <div className="text-center md:text-right flex-1 xl:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6 justify-center xl:justify-start">
                            <h3 className="text-5xl font-outfit font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none mb-1 group-hover/banner:platinum-glow transition-all duration-700">
                                Neural <span className="text-gradient-elite">Predictor</span>
                            </h3>
                            <div className="relative flex items-center px-6 py-2.5 rounded-full glass-panel border-indigo-500/20 bg-indigo-500/5">
                                <span className="text-indigo-500 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 font-outfit">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 relative neural-pulse" />
                                    Active Simulation
                                </span>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-outfit" dir="rtl">
                            ה-AI מנתח עומס קוגניטיבי נוכחי של <span className="text-indigo-600 dark:text-indigo-400 font-black px-4 py-1 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mx-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">{totalEstimatedHours}h</span>. 
                            {burnoutRisk > 60 ? ' זוהתה חריגה מהנורמה הקוגניטיבית. מומלצת אופטימיזציה למניעת שחיקה.' : ' רמה מיטבית לזרימה. כל מערכות ה-Deep Work בסינכרון מלא.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto mt-4 xl:mt-0 relative z-10">
                    <motion.button 
                        whileHover={{ scale: 1.05, y: -6 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="relative elite-button px-14 py-8 h-auto group/btn overflow-hidden w-full sm:w-auto rounded-[32px] bg-indigo-600 text-white shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(79,70,229,0.6)]"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)] translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                        <span className="relative z-10 flex items-center justify-center gap-5 font-outfit font-black tracking-widest text-sm italic uppercase">
                            {isOptimizing ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <Zap size={22} className="fill-current group-hover:rotate-12 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            )}
                            <span className="whitespace-nowrap">{isOptimizing ? 'Analyzing Flux...' : 'Optimize Flow'}</span>
                        </span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Stat Cards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    id="stats-queue"
                    title="Active Queue"
                    value={stats.Todo}
                    icon={<LayoutDashboard className="w-8 h-8 text-white" />}
                    bgClass="bg-indigo-600"
                    glow="#4318FF"
                    onHover={setHoveredCard}
                    isHovered={hoveredCard === 'stats-queue'}
                />
                <StatCard
                    id="stats-load"
                    title="Neural Load"
                    value={mentalLoad}
                    icon={<Waves className="w-8 h-8 text-white" />}
                    bgClass="bg-cyan-500"
                    glow="#06b6d4"
                    suffix="pts"
                    onHover={setHoveredCard}
                    isHovered={hoveredCard === 'stats-load'}
                />
                <StatCard
                    id="stats-risk"
                    title="Static Risk"
                    value={burnoutRisk}
                    suffix="%"
                    icon={<Flame className="w-8 h-8 text-white" />}
                    bgClass="bg-rose-500"
                    glow="#f43f5e"
                    onHover={setHoveredCard}
                    isHovered={hoveredCard === 'stats-risk'}
                />
                <StatCard
                    id="stats-nodes"
                    title="Sync Results"
                    value={stats.Done}
                    icon={<CheckCircle2 className="w-8 h-8 text-white" />}
                    bgClass="bg-emerald-500"
                    glow="#10b981"
                    onHover={setHoveredCard}
                    isHovered={hoveredCard === 'stats-nodes'}
                />
            </div>

            {/* System Architecture Analysis - V7 Platinum */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="elite-card p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-16 rounded-[64px] group/chart relative overflow-hidden border-white/20 dark:border-white/5"
            >
                <div className="absolute inset-0 elite-scanline opacity-5 group-hover/chart:opacity-10 transition-opacity duration-1000" />
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />
                
                <div className="flex flex-col gap-12 relative z-10 w-full md:w-auto">
                    <div>
                        <div className="flex items-center gap-4 mb-5">
                            <Sparkles size={16} className="text-indigo-500 animate-pulse" />
                            <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.5em] font-outfit">Cognitive Distribution Nexus</h3>
                        </div>
                        <h2 className="text-7xl font-outfit font-black text-slate-800 dark:text-white tabular-nums tracking-tighter mb-5 leading-none group-hover/chart:platinum-glow transition-all duration-700">
                            {tasks.length} <span className="text-xl text-slate-400 font-black ml-4 uppercase tracking-[0.3em]">Neural Nodes</span>
                        </h2>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400/80 max-w-md font-outfit" dir="rtl">מיפוי בזמן אמת של התפלגות המשימות במרחב העבודה הדיגיטלי שלך. המערכת מזהה דפוסי עבודה ולווקטורי פריון.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-8">
                        {chartData.map(item => (
                            <motion.div 
                                key={item.name} 
                                whileHover={{ y: -8, scale: 1.05 }}
                                className="flex items-center gap-6 px-10 py-6 glass-panel rounded-[36px] border border-white/20 dark:border-white/5 shadow-xl hover:shadow-indigo-500/10 group/item cursor-help transition-all duration-500"
                            >
                                <div 
                                    className="w-5 h-5 rounded-full shadow-[0_0_25px_currentColor] transition-all group-hover/item:scale-150 relative" 
                                    style={{ backgroundColor: item.color, color: item.color }}
                                >
                                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] font-outfit">{item.name}</span>
                                    <span className="text-[11px] font-bold text-slate-400/60 tabular-nums font-outfit">NODE_{item.value.toString().padStart(2, '0')}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="w-80 h-80 lg:w-[450px] lg:h-[450px] relative flex-shrink-0 group/pie scale-110 lg:scale-100">
                    <div className="absolute inset-x-0 inset-y-0 bg-indigo-500/10 rounded-full blur-[120px] opacity-0 group-hover/pie:opacity-40 transition-opacity duration-1000 scale-150" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center group-hover/pie:scale-125 transition-transform duration-1000">
                            <div className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.4em] mb-4 font-outfit">Nexus Status</div>
                            <div className="relative">
                                <Activity size={40} className="text-indigo-500 mx-auto animate-pulse" />
                                <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                    {isMounted ? (
                        <LazyPieChart chartData={chartData} />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-white/5 rounded-full animate-pulse blur-3xl opacity-20" />
                    )}
                </div>
            </motion.div>
        </div>
    );
}

interface StatCardProps {
    id: string;
    title: string;
    value: number;
    icon: any;
    bgClass: string;
    glow: string;
    suffix?: string;
    onHover: (id: string | null) => void;
    isHovered: boolean;
}

function StatCard({ id, title, value, icon, bgClass, glow, suffix = "", onHover, isHovered }: StatCardProps) {
    return (
        <motion.div 
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -16, scale: 1.02 }}
            className={`elite-card p-10 flex flex-col gap-10 rounded-[52px] border-white/30 dark:border-white/5 group/card relative overflow-hidden transition-all duration-700 ${isHovered ? 'shadow-[0_50px_100px_-20px_rgba(79,70,229,0.2)] border-indigo-500/30' : ''}`}
        >
            {/* Dynamic Interactive Glow - Platinum FX */}
            <div 
                className={`absolute top-0 right-0 w-48 h-48 opacity-0 transition-opacity duration-1000 ${isHovered ? 'opacity-30' : ''}`}
                style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 70%)` }} 
            />
            <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000`} />
            
            <div className={`w-22 h-22 rounded-[32px] flex items-center justify-center ${bgClass} shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover/card:rotate-6 group-hover/card:scale-110 relative z-10 border border-white/20`}>
                <div className="absolute inset-0 bg-white/20 blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 transform transition-transform group-hover/card:scale-125 duration-500">
                    {icon}
                </div>
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                    <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] leading-none font-outfit">{title}</p>
                    <div className={`h-[1px] flex-1 bg-linear-to-r from-slate-200 dark:from-white/10 to-transparent transition-all duration-1000 ${isHovered ? 'opacity-100 scale-x-100' : 'opacity-30 scale-x-50'} origin-left`} />
                </div>
                <div className="flex items-baseline gap-4">
                    <h4 className="text-7xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter drop-shadow-sm leading-none font-outfit group-hover/card:platinum-glow transition-all duration-700">
                        {value}
                    </h4>
                    {suffix && <span className="text-xl font-black text-slate-400/40 uppercase tracking-widest font-outfit">{suffix}</span>}
                </div>
            </div>

            {/* Micro-interface details V7 */}
            <div className="absolute top-8 right-8 flex flex-col gap-1.5 opacity-10 group-hover:opacity-40 transition-opacity duration-700">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400" />)}
            </div>
            <div className="absolute bottom-6 right-8 text-[8px] font-black text-slate-400/20 uppercase tracking-[0.5em] font-outfit group-hover/card:text-indigo-500/20 transition-colors">
                System_Node_{id.split('-')[1]}
            </div>
        </motion.div>
    );
}

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

