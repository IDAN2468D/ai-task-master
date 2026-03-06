'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { LayoutGrid, CheckCircle2, Timer, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Task {
    status: 'Todo' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
}

export default function DashboardStats({ tasks }: { tasks: Task[] }) {
    const stats = {
        Todo: tasks.filter(t => t.status === 'Todo').length,
        InProgress: tasks.filter(t => t.status === 'InProgress').length,
        Done: tasks.filter(t => t.status === 'Done').length,
    };

    const chartData = [
        { name: 'To Do', value: stats.Todo, color: '#818cf8' },
        { name: 'In Progress', value: stats.InProgress, color: '#60a5fa' },
        { name: 'Done', value: stats.Done, color: '#34d399' },
    ];

    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((stats.Done / total) * 100) : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 px-2">

            {/* Metrics Section */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tasks', value: total, icon: LayoutGrid, color: 'indigo' },
                    { label: 'In Progress', value: stats.InProgress, icon: Timer, color: 'blue' },
                    { label: 'Completed', value: stats.Done, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Efficiency', value: `${completionRate}%`, icon: Zap, color: 'amber' }
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center group hover:scale-105 transition-transform duration-500"
                    >
                        <div className={`p-3 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 mb-4 group-hover:rotate-12 transition-transform`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">{item.label}</p>
                        <p className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">{item.value}</p>
                    </motion.div>
                ))}

                {/* Bar Chart Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-full glass-panel p-8 rounded-[2.5rem] h-64 overflow-hidden"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <defs>
                                {chartData.map((entry, index) => (
                                    <linearGradient key={`grad-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={entry.color} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={entry.color} stopOpacity={0.1} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#color-${index})`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Distribution Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-4 glass-panel p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10 rounded-full" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Workload Distribution</h4>
                <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={70}
                                outerRadius={95}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full mt-6">
                    {chartData.map(item => (
                        <div key={item.name} className="flex flex-col items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full mb-1" style={{ backgroundColor: item.color }} />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.name}</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.value}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
