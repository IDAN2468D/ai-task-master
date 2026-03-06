'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Target, CheckCircle, Clock, Zap, Activity, Info } from 'lucide-react';
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
        { name: 'To Do', value: stats.Todo, color: '#6366f1' },
        { name: 'In Progress', value: stats.InProgress, color: '#3b82f6' },
        { name: 'Done', value: stats.Done, color: '#10b981' },
    ];

    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((stats.Done / total) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-16 max-w-7xl mx-auto px-4">

            {/* Hero Metric Bento */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="md:col-span-8 bento-item bg-slate-900/40 relative overflow-hidden flex flex-col justify-between"
            >
                <div className="absolute top-0 right-0 p-8 text-blue-500/10 pointer-events-none">
                    <Activity className="w-40 h-40 rotate-12" />
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Real-time Analytics</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">Workspace<br /><span className="text-blue-500/80">Velocity.</span></h3>
                    <p className="text-slate-500 text-sm font-medium">Your current productivity flow based on task completion.</p>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-10">
                    {[
                        { label: 'Completion', value: `${completionRate}%`, icon: Zap },
                        { label: 'Active Focus', value: stats.InProgress, icon: Clock },
                        { label: 'Finalized', value: stats.Done, icon: CheckCircle }
                    ].map(item => (
                        <div key={item.label}>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter mb-1 flex items-center gap-1.5">
                                <item.icon className="w-3 h-3" /> {item.label}
                            </p>
                            <p className="text-2xl font-black text-white tabular-nums">{item.value}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Chart Bento */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-4 bento-item bg-slate-900/40 flex flex-col items-center justify-center min-h-[300px]"
            >
                <div className="w-full h-48 opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={10}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    {chartData.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[8px] font-black text-slate-500 uppercase">{item.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
