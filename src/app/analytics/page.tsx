'use client';

import { Rocket, Lightbulb, User, Activity, Zap, TrendingUp, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Mock Data for the 2026 SaaS Dashboard
const weeklyVelocity = [
    { day: 'Mon', completed: 4, added: 5 },
    { day: 'Tue', completed: 7, added: 2 },
    { day: 'Wed', completed: 5, added: 6 },
    { day: 'Thu', completed: 10, added: 1 },
    { day: 'Fri', completed: 12, added: 4 },
    { day: 'Sat', completed: 2, added: 1 },
    { day: 'Sun', completed: 0, added: 0 },
];

const productivityTrend = [
    { week: 'Week 1', score: 65 },
    { week: 'Week 2', score: 72 },
    { week: 'Week 3', score: 85 },
    { week: 'Week 4', score: 91 },
];

export default function AnalyticsPage() {
    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white pb-40">


            <div className="max-w-[1400px] mx-auto px-6 pt-36">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl font-black mb-2">
                            AI Output <label className="text-gradient-primary">Analytics</label>
                        </h2>
                        <p className="text-slate-500 font-medium">Deep insights into your productivity velocity.</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#FF00E5]/10 text-[#FF00E5] rounded-xl font-bold text-sm">
                        <Activity className="w-4 h-4" />
                        Live Processing Model Active
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <MetricCard title="Productivity Score" value="94" trend="+12%" icon={Activity} color="text-[#00E5FF]" bg="bg-[#00E5FF]/10" />
                    <MetricCard title="Weekly Velocity" value="40" trend="+5%" icon={Zap} color="text-[#4318FF]" bg="bg-[#4318FF]/10" />
                    <MetricCard title="Focus Deep Work" value="32h" trend="-2h" icon={PieChartIcon} color="text-[#FF7D00]" bg="bg-[#FF7D00]/10" />
                    <MetricCard title="Burnout Risk" value="Low" trend="Stable" icon={AlertTriangle} color="text-[#10B981]" bg="bg-[#10B981]/10" />
                </div>

                <div className="grid lg:grid-cols-12 gap-8 mb-8">

                    {/* Main Chart: Velocity */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 vibrant-card p-6 md:p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">Task Completion Velocity</h3>
                            <select className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none">
                                <option>Current Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>
                        <div className="h-80 w-full">
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
                                    <Bar dataKey="completed" name="Completed" fill="#4318FF" radius={[6, 6, 6, 6]} barSize={20} />
                                    <Bar dataKey="added" name="New Tasks" fill="#00E5FF" radius={[6, 6, 6, 6]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Agent Report */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="vibrant-card p-6 relative overflow-hidden h-full">
                            {/* Decorative Blur */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF00E5]/10 blur-[50px] pointer-events-none rounded-full" />

                            <div className="flex items-center gap-3 mb-6">
                                <Lightbulb className="w-5 h-5 text-[#FF00E5]" />
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">AI Strategy Report</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                        You are completing tasks <span className="text-[#4318FF] dark:text-[#00E5FF]">24% faster</span> this week. Your optimal deep work time is between 10:00 AM and 1:00 PM.
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Predictive Danger
                                    </h4>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                        You have accumulated 12 "High Priority" tasks. AI suggests deferring 4 of them to next week to avoid bottlenecking.
                                    </p>
                                </div>

                                <button className="w-full py-3 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:shadow-[0_10px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all">
                                    Auto-Optimize Schedule
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Chart: Monthly Trend */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="vibrant-card p-6 md:p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">Overall Output Trend</h3>
                        <p className="text-xs font-bold text-slate-500">Your performance score trajectory calculated by AI.</p>
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
        </main>
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
