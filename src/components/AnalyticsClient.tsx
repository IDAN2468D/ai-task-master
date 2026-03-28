'use client';

import { Activity, Zap, TrendingUp, AlertTriangle, PieChart as PieChartIcon, Lightbulb, Flame, Target, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { generateWeeklyInsight } from '@/actions/taskActions';

// Mock Data for the 2026 SaaS Dashboard
const weeklyVelocity = [
    { day: 'ראשון', completed: 4, added: 5 },
    { day: 'שני', completed: 7, added: 2 },
    { day: 'שלישי', completed: 5, added: 6 },
    { day: 'רביעי', completed: 10, added: 1 },
    { day: 'חמישי', completed: 12, added: 4 },
    { day: 'שישי', completed: 2, added: 1 },
    { day: 'שבת', completed: 0, added: 0 },
];

const productivityTrend = [
    { week: 'שבוע 1', score: 65 },
    { week: 'שבוע 2', score: 72 },
    { week: 'שבוע 3', score: 85 },
    { week: 'שבוע 4', score: 91 },
];

// Heatmap data - 7 days x 24 hours
const generateHeatmapData = () => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const data: { day: string; hour: number; value: number }[] = [];
    days.forEach(day => {
        for (let h = 6; h < 24; h++) {
            const isWeekday = !['שישי', 'שבת'].includes(day);
            const isWorkHours = h >= 9 && h <= 17;
            const isPeak = h >= 10 && h <= 13;
            let base = Math.random() * 2;
            if (isWeekday && isWorkHours) base += 3;
            if (isWeekday && isPeak) base += 4;
            data.push({ day, hour: h, value: Math.min(10, Math.round(base)) });
        }
    });
    return data;
};

export default function AnalyticsClient() {
    const [isMounted, setIsMounted] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [heatmapData] = useState(generateHeatmapData);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleAIInsight = async () => {
        setLoadingInsight(true);
        try {
            const insight = await generateWeeklyInsight();
            setAiInsight(insight);
        } catch (error) {
            setAiInsight('לא ניתן לייצר תובנה כרגע. נסה שוב מאוחר יותר.');
        } finally {
            setLoadingInsight(false);
        }
    };

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-[#060914]"></div>;

    // Calculate velocity score
    const totalCompleted = weeklyVelocity.reduce((sum, d) => sum + d.completed, 0);
    const velocityScore = Math.min(100, Math.round((totalCompleted / 50) * 100));

    return (
        <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-40 relative z-10">
            {/* Background Details */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Performance Analytics</label>
                    <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-[-0.05em] leading-[0.9]">
                        דוח <span className="text-gradient-elite">אנליטיקה</span>
                    </h2>
                    <p className="text-slate-500 font-bold max-w-md">מנתח את הדאטה שלך בזמן אמת כדי למקסם את פוטנציאל העבודה העמוקה.</p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 p-4 glass-panel rounded-[24px]"
                >
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-black text-[10px] uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        AI Core Active
                    </div>
                    <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Sync</div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">v4.2.0 Elite</div>
                    </div>
                </motion.div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <MetricCard title="ציון פרודוקטיביות" value="94" trend="+12%" icon={Activity} color="text-indigo-500" />
                <MetricCard title="מהירות שבועית" value="40" trend="+5%" icon={Zap} color="text-purple-500" />
                <MetricCard title="שעות עבודה עמוקה" value="32ש" trend="-2ש" icon={PieChartIcon} color="text-cyan-500" />
                <MetricCard title="סיכון שחיקה" value="נמוך" trend="יציב" icon={AlertTriangle} color="text-pink-500" />
            </div>

            <div className="grid lg:grid-cols-12 gap-10 mb-16">
                {/* Main Chart: Velocity */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="lg:col-span-8 elite-card p-10 md:p-12"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">מהירות השלמת משימות</h3>
                            <p className="text-sm font-bold text-slate-400">השוואה בין ביצועים בפועל ליעדים שנקבעו</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
                            <button className="px-6 py-2 bg-white dark:bg-white/10 shadow-sm rounded-xl text-xs font-black uppercase tracking-widest text-primary">שבועי</button>
                            <button className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-400">חודשי</button>
                        </div>
                    </div>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyVelocity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4318FF" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#7048FF" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00E5FF" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                                    dy={20}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(67, 24, 255, 0.03)' }}
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        background: 'rgba(255,255,255,0.9)', 
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(0,0,0,0.05)', 
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        padding: '16px' 
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                                />
                                <Legend 
                                    verticalAlign="top" 
                                    align="right" 
                                    iconType="circle" 
                                    wrapperStyle={{ paddingBottom: '40px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }} 
                                />
                                <Bar dataKey="completed" name="הושלמו" fill="url(#barGradient1)" radius={[10, 10, 10, 10]} barSize={16} />
                                <Bar dataKey="added" name="חדשות" fill="url(#barGradient2)" radius={[10, 10, 10, 10]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* AI Agent Report */}
                <div className="lg:col-span-4 flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="elite-card p-10 flex-1 flex flex-col overflow-visible bg-gradient-to-br from-primary/[0.03] to-purple-500/[0.03]"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Lightbulb className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">דוח אסטרטגי</h3>
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Intelligence</div>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            {aiInsight ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-[32px] glass-panel border-primary/20 relative"
                                >
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">{aiInsight}</p>
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                        <Brain className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                            אתה משלים משימות <span className="text-primary">24% מהר יותר</span> השבוע. זמן העבודה העמוקה האופטימלי שלך הוא בין 10:00 ל-13:00.
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-3 h-3" /> Predictive Load
                                        </h4>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                            צברת 12 משימות בעדיפות גבוהה. ה-AI מציע לדחות 4 מהן לשבוע הבא כדי למנוע צוואר בקבוק.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleAIInsight}
                            disabled={loadingInsight}
                            className="elite-button elite-button-primary mt-12 w-full group overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {loadingInsight ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>AI מנתח...</span>
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        <span>ייצר תובנה חכמה</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Productivity Heatmap */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="elite-card p-10 md:p-12 mb-16"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-4 uppercase tracking-tight">
                            <div className="w-10 h-10 rounded-2xl bg-[#FF7D00]/10 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-[#FF7D00]" />
                            </div>
                            מפת חום - פעילות
                        </h3>
                        <p className="text-sm font-bold text-slate-400 mt-2">פיזור פרודוקטיביות לפי שעות היממה</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Low Intensity</span>
                        <div className="flex gap-1.5 focus:scale-110 transition-transform">
                            {[0, 2, 4, 6, 8, 10].map(level => (
                                <div
                                    key={level}
                                    className="w-5 h-5 rounded-md shadow-sm border border-black/5 dark:border-white/5"
                                    style={{
                                        backgroundColor: level === 0
                                            ? 'rgba(226, 232, 240, 0.5)'
                                            : `rgba(67, 24, 255, ${0.1 + (level / 10) * 0.9})`
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Peak Elite</span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[900px] pb-6">
                        {/* Hours header */}
                        <div className="flex items-center gap-1.5 mb-6 ml-24">
                            {Array.from({ length: 18 }, (_, i) => i + 6).map(h => (
                                <div key={h} className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {h}:00
                                </div>
                            ))}
                        </div>

                        {/* Heatmap rows */}
                        {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
                            <div key={day} className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-20 text-[11px] font-black text-slate-500 uppercase tracking-wider">{day}</div>
                                {heatmapData
                                    .filter(d => d.day === day)
                                    .map((cell, idx) => (
                                        <motion.div
                                            whileHover={{ scale: 1.1, zIndex: 10 }}
                                            key={idx}
                                            className="flex-1 h-10 rounded-lg cursor-pointer relative group transition-all duration-300 border border-black/[0.03] dark:border-white/[0.03]"
                                            style={{
                                                backgroundColor: cell.value === 0
                                                    ? 'rgba(226, 232, 240, 0.2)'
                                                    : `rgba(67, 24, 255, ${0.1 + (cell.value / 10) * 0.9})`
                                            }}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none z-50 shadow-xl border border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-3 h-3 text-cyan-400" />
                                                    <span>{cell.value} משימות הושלמו</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* AI Velocity Score + Trend */}
            <div className="grid lg:grid-cols-12 gap-10">
                {/* AI Velocity Score */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="lg:col-span-4 elite-card p-12 text-center group"
                >
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <Target className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">ציון מהירות AI</h3>
                    </div>
                    <div className="relative w-56 h-56 mx-auto mb-10 translate-z-0">
                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_20px_rgba(67,24,255,0.2)]" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(67, 24, 255, 0.05)" strokeWidth="8" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 339.3" }}
                                animate={{ strokeDasharray: `${(velocityScore / 100) * 339.3} 339.3` }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGradientElite)" strokeWidth="10"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="scoreGradientElite" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4318FF" />
                                    <stop offset="100%" stopColor="#00E5FF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-black text-slate-800 dark:text-white tracking-tighter counter">{velocityScore}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Efficiency</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 p-4 glass-panel rounded-2xl group-hover:shadow-indigo-500/10 transition-all">
                        <Brain className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">המהירות שלך עקבית ויציבה לאורך זמן</span>
                    </div>
                </motion.div>

                {/* Overall Output Trend */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="lg:col-span-8 elite-card p-10 md:p-12"
                >
                    <div className="mb-12">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">מגמת תפוקה כללית</h3>
                        <p className="text-sm font-bold text-slate-400 mt-2">מסלול ציון הביצועים שלך כפי שחושב על ידי AI.</p>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={productivityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScoreElite" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                <XAxis 
                                    dataKey="week" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                                    dy={20}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        background: 'rgba(255,255,255,0.9)', 
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(0,0,0,0.05)', 
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        padding: '16px' 
                                    }} 
                                />
                                <Area type="monotone" dataKey="score" stroke="#4318FF" strokeWidth={5} fillOpacity={1} fill="url(#colorScoreElite)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, color }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="elite-card p-10 flex flex-col justify-between"
        >
            <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl glass-panel flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 
                    trend.includes('-') ? 'bg-rose-500/10 text-rose-500' : 
                    'bg-slate-500/10 text-slate-500'
                }`}>
                    {trend.includes('+') && <TrendingUp className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <h4 className="text-5xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter mb-2">{value}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            </div>
            
            {/* Neural line detail */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}

