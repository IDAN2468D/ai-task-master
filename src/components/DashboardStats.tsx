import { LayoutDashboard, CheckCircle2, Flame, Brain, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';


// Lazy load Recharts - it's a heavy library (~200KB)
const LazyPieChart = dynamic(
    () => import('recharts').then(mod => {
        const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } = mod;
        return {
            default: ({ chartData }: { chartData: { name: string; value: number; color: string }[] }) => (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#000', fontWeight: 'bold' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )
        };
    }),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />,
    }
);

interface Task {
    status: 'Todo' | 'InProgress' | 'Done';
    priority: string;
}

export default function DashboardStats({ tasks }: { tasks: Task[] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stats = {
        Todo: tasks.filter(t => t.status === 'Todo').length,
        InProgress: tasks.filter(t => t.status === 'InProgress').length,
        Done: tasks.filter(t => t.status === 'Done').length,
    };

    // Calculate Cognitive Metrics
    const activeTasks = tasks.filter(t => t.status !== 'Done');
    const totalEstimatedHours = activeTasks.reduce((acc, t: any) => acc + (t.estimatedHours || 0), 0);
    const totalEnergy = activeTasks.reduce((acc, t: any) => acc + (t.energyLevel || 1), 0);
    const highPriorityCount = activeTasks.filter(t => t.priority === 'High').length;

    const mentalLoad = Math.min(100, (totalEnergy * 2) + (totalEstimatedHours));
    const burnoutRisk = Math.min(100, Math.floor((highPriorityCount * 15) + (totalEstimatedHours * 5)));

    const chartData = [
        { name: 'לביצוע', value: stats.Todo, color: '#4318FF' },
        { name: 'בתהליך', value: stats.InProgress, color: '#00E5FF' },
        { name: 'הושלם', value: stats.Done, color: '#FF7D00' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mb-12">
            
            {/* AI Flow Predictor Banner */}
            <div className="md:col-span-12 relative overflow-hidden vibrant-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#4318FF] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-[#4318FF]/30">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-indigo-900 dark:text-indigo-100 flex items-center gap-2 uppercase tracking-tight">
                            ניתוח קוגניטיבי <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] rounded-full uppercase tracking-widest">AI Brain</span>
                        </h3>
                        <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300/80 mt-1" dir="rtl">
                            ה-AI מזהה עומס משימות של {totalEstimatedHours} שעות. 
                            {burnoutRisk > 60 ? ' מומלץ להיכנס למצב Deep Work כדי למנוע שחיקה.' : ' קצב העבודה שלך תקין ומאוזן.'}
                        </p>
                    </div>
                </div>
                <button className="whitespace-nowrap px-6 py-3 bg-white dark:bg-[#111C44] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl hover:scale-105 transition-transform border border-indigo-100 dark:border-indigo-500/10">
                    הפעל הגנת שחיקה
                </button>
            </div>

            {/* Mini Stat Cards */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard
                    title="ממתינות"
                    value={stats.Todo}
                    icon={<LayoutDashboard className="w-6 h-6 text-white relative z-10" />}
                    bgClass="bg-gradient-stat-1"
                />
                <StatCard
                    title="עומס מנטלי"
                    value={mentalLoad}
                    icon={<Brain className="w-6 h-6 text-white relative z-10" />}
                    bgClass="bg-gradient-to-br from-indigo-500 to-purple-600"
                />
                <StatCard
                    title="סיכון שחיקה"
                    value={burnoutRisk}
                    suffix="%"
                    icon={<Activity className="w-6 h-6 text-white relative z-10" />}
                    bgClass="bg-gradient-to-br from-rose-500 to-orange-600"
                />
                <StatCard
                    title="הושלמו"
                    value={stats.Done}
                    icon={<CheckCircle2 className="w-6 h-6 text-white relative z-10" />}
                    bgClass="bg-gradient-stat-3"
                />
            </div>


            {/* Chart Card */}
            <div className="md:col-span-4 vibrant-card p-6 flex items-center justify-between">
                <div className="flex flex-col gap-4 w-1/2">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">התפלגות</h3>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">{tasks.length} <span className="text-lg text-slate-400">סה״כ</span></p>
                    <div className="flex flex-col gap-2 mt-2">
                        {chartData.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 h-32 relative">
                    {isMounted ? (
                        <LazyPieChart chartData={chartData} />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bgClass, suffix = "" }: { title: string, value: number, icon: any, bgClass: string, suffix?: string }) {
    return (
        <div className="vibrant-card p-6 flex items-center gap-5 group/card transition-all hover:-translate-y-1">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden ${bgClass} shadow-lg transition-transform group-hover/card:scale-110`}>
                {icon}
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full blur-md" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest leading-none">{title}</p>
                <h4 className="text-4xl font-black text-slate-800 dark:text-white tabular-nums leading-none mt-2">
                    {value}<span className="text-lg ml-0.5 opacity-50">{suffix}</span>
                </h4>
            </div>
        </div>
    );
}

