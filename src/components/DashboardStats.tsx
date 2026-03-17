'use client';

import { LayoutDashboard, CheckCircle2, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

    const chartData = [
        { name: 'לביצוע', value: stats.Todo, color: '#4318FF' },
        { name: 'בתהליך', value: stats.InProgress, color: '#00E5FF' },
        { name: 'הושלם', value: stats.Done, color: '#FF7D00' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mb-12">
            
            {/* AI Flow Predictor Banner */}
            <div className="md:col-span-12 relative overflow-hidden vibrant-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -z-10" />
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Flame className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            שעות הזהב שלך <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full uppercase tracking-widest">AI Prediction</span>
                        </h3>
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-300/80 mt-1">
                            ה-AI מזהה שאתה בשיא הריכוז בין השעות 10:00 ל-13:00. <br className="hidden md:block"/>
                            זה הזמן האידיאלי למשימות דינמיות או קשות!
                        </p>
                    </div>
                </div>
                <button className="whitespace-nowrap px-6 py-3 bg-white dark:bg-[#111C44] text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl hover:scale-105 transition-transform border border-amber-100 dark:border-amber-500/10">
                    נעל יומן לשעות אלו
                </button>
            </div>

            {/* Mini Stat Cards */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    title="משימות ממתינות"
                    value={stats.Todo}
                    icon={<LayoutDashboard className="w-8 h-8 text-white relative z-10" />}
                    bgClass="bg-gradient-stat-1"
                />
                <StatCard
                    title="בתנועה"
                    value={stats.InProgress}
                    icon={<Flame className="w-8 h-8 text-white relative z-10" />}
                    bgClass="bg-gradient-stat-2"
                />
                <StatCard
                    title="הושלמו"
                    value={stats.Done}
                    icon={<CheckCircle2 className="w-8 h-8 text-white relative z-10" />}
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

function StatCard({ title, value, icon, bgClass }: { title: string, value: number, icon: any, bgClass: string }) {
    return (
        <div className="vibrant-card p-6 flex items-center gap-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden ${bgClass} shadow-lg`}>
                {icon}
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full blur-md" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 mb-1">{title}</p>
                <h4 className="text-4xl font-black text-slate-800 dark:text-white tabular-nums">{value}</h4>
            </div>
        </div>
    );
}
