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

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1437]"></div>;

    // Calculate velocity score
    const totalCompleted = weeklyVelocity.reduce((sum, d) => sum + d.completed, 0);
    const velocityScore = Math.min(100, Math.round((totalCompleted / 50) * 100));

    return (
        <div className="max-w-[1400px] mx-auto px-6 pt-36 pb-40">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-4xl font-black mb-2">
                        אנליטיקס <label className="text-gradient-primary">חכם</label>
                    </h2>
                    <p className="text-slate-500 font-medium">תובנות עמוקות לתוך מהירות הפרודוקטיביות שלך.</p>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#FF00E5]/10 text-[#FF00E5] rounded-xl font-bold text-sm">
                    <Activity className="w-4 h-4" />
                    מודל עיבוד חי פעיל
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard title="ציון פרודוקטיביות" value="94" trend="+12%" icon={Activity} color="text-[#00E5FF]" bg="bg-[#00E5FF]/10" />
                <MetricCard title="מהירות שבועית" value="40" trend="+5%" icon={Zap} color="text-[#4318FF]" bg="bg-[#4318FF]/10" />
                <MetricCard title="שעות עבודה עמוקה" value="32ש" trend="-2ש" icon={PieChartIcon} color="text-[#FF7D00]" bg="bg-[#FF7D00]/10" />
                <MetricCard title="סיכון שחיקה" value="נמוך" trend="יציב" icon={AlertTriangle} color="text-[#10B981]" bg="bg-[#10B981]/10" />
            </div>

            <div className="grid lg:grid-cols-12 gap-8 mb-8">
                {/* Main Chart: Velocity */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 vibrant-card p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">מהירות השלמת משימות</h3>
                        <select className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none">
                            <option>שבוע נוכחי</option>
                            <option>שבוע קודם</option>
                        </select>
                    </div>
                    <div className="h-80 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(67, 24, 255, 0.05)' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                                <Bar dataKey="completed" name="הושלמו" fill="#4318FF" radius={[6, 6, 6, 6]} barSize={20} />
                                <Bar dataKey="added" name="משימות חדשות" fill="#00E5FF" radius={[6, 6, 6, 6]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* AI Agent Report */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="vibrant-card p-6 relative overflow-hidden h-full">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF00E5]/10 blur-[50px] pointer-events-none rounded-full" />
                        <div className="flex items-center gap-3 mb-6">
                            <Lightbulb className="w-5 h-5 text-[#FF00E5]" />
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">דוח אסטרטגי AI</h3>
                        </div>
                        <div className="space-y-4">
                            {aiInsight ? (
                                <div className="bg-gradient-to-r from-[#4318FF]/5 to-[#FF00E5]/5 p-4 rounded-2xl border border-[#4318FF]/20">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{aiInsight}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                            אתה משלים משימות <span className="text-[#4318FF] dark:text-[#00E5FF]">24% מהר יותר</span> השבוע. זמן העבודה העמוקה האופטימלי שלך הוא בין 10:00 ל-13:00.
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> סכנה חזויה
                                        </h4>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                            צברת 12 משימות בעדיפות גבוהה. ה-AI מציע לדחות 4 מהן לשבוע הבא כדי למנוע צוואר בקבוק.
                                        </p>
                                    </div>
                                </>
                            )}
                            <button
                                onClick={handleAIInsight}
                                disabled={loadingInsight}
                                className="w-full py-3 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:shadow-[0_10px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50"
                            >
                                {loadingInsight ? 'AI מנתח...' : 'ייצר תובנה חכמה'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productivity Heatmap */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vibrant-card p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <Flame className="w-5 h-5 text-[#FF7D00]" />
                            מפת חום - פעילות
                        </h3>
                        <p className="text-xs font-bold text-slate-500">מתי אתה הכי פרודוקטיבי במהלך השבוע</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400">פחות</span>
                        {[0, 2, 4, 6, 8, 10].map(level => (
                            <div
                                key={level}
                                className="w-4 h-4 rounded"
                                style={{
                                    backgroundColor: level === 0
                                        ? '#e2e8f0'
                                        : `rgba(67, 24, 255, ${level / 10})`
                                }}
                            />
                        ))}
                        <span className="text-[9px] font-bold text-slate-400">יותר</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        {/* Hours header */}
                        <div className="flex items-center gap-1 mb-2 mr-20">
                            {Array.from({ length: 18 }, (_, i) => i + 6).map(h => (
                                <div key={h} className="flex-1 text-center text-[9px] font-bold text-slate-400">
                                    {h}:00
                                </div>
                            ))}
                        </div>

                        {/* Heatmap rows */}
                        {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
                            <div key={day} className="flex items-center gap-1 mb-1">
                                <div className="w-16 text-[10px] font-black text-slate-500 text-left">{day}</div>
                                {heatmapData
                                    .filter(d => d.day === day)
                                    .map((cell, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-1 h-6 heatmap-cell cursor-pointer relative group"
                                            style={{
                                                backgroundColor: cell.value === 0
                                                    ? 'rgba(226, 232, 240, 0.5)'
                                                    : `rgba(67, 24, 255, ${cell.value / 10})`
                                            }}
                                            title={`${day} ${cell.hour}:00 - ${cell.value} משימות`}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0B1437] text-white text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                {cell.value} משימות
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* AI Velocity Score + Trend */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* AI Velocity Score */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-4 vibrant-card p-6 md:p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-[#4318FF]" />
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">ציון מהירות AI</h3>
                    </div>
                    <div className="relative w-40 h-40 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(67, 24, 255, 0.1)" strokeWidth="12" />
                            <circle
                                cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGradient)" strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${(velocityScore / 100) * 339.3} 339.3`}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#4318FF" />
                                    <stop offset="100%" stopColor="#00E5FF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-slate-800 dark:text-white">{velocityScore}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">מתוך 100</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Brain className="w-4 h-4 text-[#00E5FF]" />
                        <span className="text-xs font-bold text-slate-500">המהירות שלך עקבית ויציבה</span>
                    </div>
                </motion.div>

                {/* Overall Output Trend */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-8 vibrant-card p-6 md:p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">מגמת תפוקה כללית</h3>
                        <p className="text-xs font-bold text-slate-500">מסלול ציון הביצועים שלך כפי שחושב על ידי AI.</p>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={productivityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: '#000', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="score" stroke="#00E5FF" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, color, bg }: any) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="vibrant-card p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${trend.includes('+') ? 'text-emerald-500' : (trend.includes('-') ? 'text-rose-500' : 'text-slate-400')}`}>
                    {trend}
                </span>
            </div>
            <div>
                <h4 className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">{value}</h4>
                <p className="text-xs font-bold text-slate-500">{title}</p>
            </div>
        </motion.div>
    );
}
