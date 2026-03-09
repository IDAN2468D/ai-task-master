import { getTasks } from '@/actions/taskActions';
import { getCurrentUser } from '@/actions/authActions';
import { Lightbulb, Zap, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
    LazyFocusMode,
    LazyTaskExport,
    LazyStreakTracker,
    LazyAchievementBadges,
    LazyGoalsTracker,
    LazyWellnessWidget,
    LazySmartReminders,
    LazySmartAIPanel,
    LazyCollaborativeHub,
    LazyKanbanBoard,
    LazyDashboardStats,
    LazySearchFilterBar,
    LazyAddTaskForm,
    LazyAIManagerReport,
    LazyFocusAmbience
} from '@/components/LazyClientWrappers';
import AvatarDisplay from '@/components/AvatarDisplay';
import { getAIProgressReport } from '@/actions/aiManagerActions';

import { getFullUser } from '@/actions/authActions';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const user = await getFullUser();

    const userName = user?.name || 'אורח';
    const userLevel = user?.level || 1;
    const userAvatar = user?.avatar;

    const aiReport = await getAIProgressReport();

    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;
    const tasks = await getTasks(q, priority);

    // Determine greeting based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';
    const completedCount = tasks.filter((t: any) => t.status === 'Done').length;

    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white pb-40">

            <div className="max-w-[1400px] mx-auto px-6 pt-32 md:pt-40">

                {/* Hero Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
                            </span>
                            Workspace Active
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight">
                            {greeting}, <label className="text-gradient-primary">{userName.split(' ')[0]}!</label>
                        </h2>
                        <p className="text-slate-500 font-bold text-lg">מוכן לכבוש את היעדים שלך היום?</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <AvatarDisplay level={userLevel} avatar={userAvatar} size={100} />
                        <div className="hidden lg:flex flex-col items-end text-left">
                            <div className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">
                                {new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Current Session
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stunning Command Hub - The Central Action Bar */}
                <div className="mb-16">
                    <div className="vibrant-card p-4 md:p-6 flex flex-col lg:flex-row lg:items-center gap-6 shadow-2xl shadow-[var(--primary)]/10 border-t-2 border-t-[var(--primary)] relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-stat-1 opacity-[0.03] blur-3xl pointer-events-none translate-x-32 -translate-y-32 group-hover:opacity-[0.06] transition-opacity" />

                        <div className="flex-shrink-0 flex items-center gap-4 relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-stat-1 flex items-center justify-center text-white shadow-xl shadow-[var(--primary)]/30 transform transition-transform group-hover:scale-105">
                                <Zap className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">Command Hub</h3>
                                <p className="text-[11px] font-bold text-slate-500 mt-2">כל מה שאתה צריך במקום אחד</p>
                            </div>
                        </div>

                        <div className="h-12 w-[1px] bg-slate-200 dark:bg-white/10 mx-2 hidden lg:block" />

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 flex-1 relative min-w-0">
                            <LazyFocusMode tasks={tasks} />
                            <LazyAchievementBadges tasks={tasks} />
                            <LazyGoalsTracker completedCount={completedCount} />
                            <LazyWellnessWidget />
                            <LazyCollaborativeHub />
                            <Link href="/store" className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl font-black text-[10px] md:text-xs border border-amber-500/10 dark:border-amber-500/20 shadow-sm transition-all hover:bg-amber-500/20 active:scale-95 uppercase tracking-widest">
                                <ShoppingBag className="w-5 h-5" />
                                <span>חנות</span>
                            </Link>
                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden xl:block" />
                            <LazyTaskExport tasks={tasks} />
                        </div>

                        <div className="lg:mr-auto flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                                <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">AI Monitor Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart AI Intelligence Panel */}
                <LazySmartAIPanel tasks={tasks} />

                {/* Smart Reminders */}
                <LazySmartReminders tasks={tasks} />

                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mb-12">
                        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="vibrant-card p-6 h-28 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
                        </div>
                        <div className="md:col-span-4 vibrant-card p-6 h-28 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                    </div>
                }>
                    <LazyDashboardStats tasks={tasks} />
                </Suspense>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-3 lg:order-last lg:sticky lg:top-32 space-y-6">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-12 lg:mt-0">יצירה חדשה</h3>
                        <LazyAddTaskForm />
                        <LazyStreakTracker />
                    </div>

                    <div className="lg:col-span-9 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-12 lg:mt-0">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">לוח פעיל</h3>
                            <div className="w-full md:w-auto">
                                <LazySearchFilterBar />
                            </div>
                        </div>

                        {/* Focus Ambience & AI Report */}
                        <div className="grid md:grid-cols-2 gap-6 mt-12 mb-12">
                            <LazyFocusAmbience />
                            <LazyAIManagerReport report={aiReport} />
                        </div>

                        {/* Vibrant Board */}
                        <Suspense fallback={
                            <div className="h-64 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/30">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-3 border-[#4318FF]/30 border-t-[#4318FF] rounded-full animate-spin" />
                                    <span className="text-xs font-bold text-slate-400">טוען לוח משימות...</span>
                                </div>
                            </div>
                        }>
                            <LazyKanbanBoard tasks={tasks} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
