import { getTasks } from '@/actions/taskActions';
import { getCurrentUser } from '@/actions/authActions';
import { Lightbulb, Zap, ShoppingBag, Target, Sparkles, Brain, Cpu, Waves } from 'lucide-react';
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
    LazyFocusAmbience,
    LazyDailyAIBriefing,
    LazyTaskViewContainer,
    LazyZenMode,
    LazySmartPriorityButton,
    LazyAIGoalDecomposer,
    LazyVoiceEODJournal,
    LazyWorkspaceChat,
    LazyMeetingToTask,
    LazyAIProjectCharter,
    LazyOmniChannelSync,
    LazyVoiceExecution,
    LazyAnimatedBeam,
    LazyShimmerWrapper,
    LazyBentoContainer,
    LazyBentoItem,
    LazyMotionDiv,
    LazyMotionSection
} from '@/components/LazyClientWrappers';

import AvatarDisplay from '@/components/AvatarDisplay';
import { getAIProgressReport } from '@/actions/aiManagerActions';

import { getFullUser } from '@/actions/authActions';
import AdaptiveLayout from '@/components/AdaptiveLayout';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const user = await getFullUser();

    if (!user) {
        redirect('/login');
    }

    const userName = user.name;
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
        <main className="min-h-screen text-slate-800 dark:text-white pb-32 overflow-hidden selection:bg-indigo-500 selection:text-white">
            <AdaptiveLayout>
                <div className="max-w-[1700px] mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10 space-y-12">
                    
                    {/* Elite Command Dashboard (Bento Style) */}
                    <LazyBentoContainer className="!gap-8">
                        
                        {/* 1. Hero / Profile Hub (Lg-8) */}
                        <LazyBentoItem colSpan={8} priority={10} className="elite-card p-10 md:p-14 overflow-visible relative group/hero">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover/hero:opacity-20 transition-opacity">
                                <Cpu size={80} className="text-indigo-500" />
                            </div>
                            
                            <div className="flex flex-col lg:flex-row items-center gap-14 md:gap-20">
                                <div className="space-y-10 flex-1">
                                    <LazyMotionDiv 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="inline-flex items-center gap-4 px-6 py-2.5 glass-panel rounded-full border-slate-200/50 dark:border-white/5 shadow-inner"
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                                            Neural Core: Optimized v6.0.4
                                        </span>
                                    </LazyMotionDiv>

                                    <div className="space-y-6">
                                        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[0.9] text-slate-950 dark:text-white">
                                            <span className="block opacity-20 dark:opacity-10">{greeting},</span>
                                            <span className="text-gradient-elite block py-2">{userName.split(' ')[0]}</span>
                                        </h1>
                                        <p className="text-xl md:text-2xl font-medium text-slate-400 dark:text-slate-500 max-w-xl leading-relaxed">
                                            סביבת העבודה שלך ממוטבת. זיהינו <span className="text-indigo-500 dark:text-indigo-400 font-bold">{tasks.length} משימות</span> קריטיות להיום.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group/avatar">
                                    <div className="relative z-10 ring-[16px] ring-slate-100/50 dark:ring-white/5 rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-1000 group-hover/avatar:scale-110 group-hover/avatar:rotate-2">
                                        <AvatarDisplay level={userLevel} avatar={userAvatar} size={180} />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-[12px] font-black border-4 border-white dark:border-[#020205] shadow-2xl z-20">
                                        LVL {userLevel}
                                    </div>
                                    <div className="absolute -inset-8 border border-indigo-500/15 rounded-full animate-spin-slow opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </LazyBentoItem>

                        {/* 2. Today's Summary / Quick Info (Lg-4) */}
                        <LazyBentoItem colSpan={4} priority={20} className="space-y-8">
                            <div className="elite-card p-10 flex flex-col justify-between min-h-[220px] transition-all hover:bg-indigo-500/5 group">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                        <Target size={28} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency</div>
                                        <div className="text-2xl font-black text-indigo-500">94.2%</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-5xl font-black tabular-nums tracking-tighter">{completedCount} / {tasks.length}</div>
                                    <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Nodes Resolved Today</div>
                                </div>
                                <div className="absolute inset-0 shimmer-elite opacity-5" />
                            </div>

                            <div className="elite-card p-8 group">
                                <LazyDailyAIBriefing />
                            </div>
                        </LazyBentoItem>

                        {/* 3. Neural Workspace Dock (Lg-12 - Sticky Toolbar) */}
                        <LazyBentoItem colSpan={12} priority={30} className="sticky top-32 z-[50]">
                            <div className="elite-card p-6 flex flex-col xl:flex-row items-center gap-10 hover-glow group/dock">
                                <div className="flex-shrink-0 flex items-center gap-6 px-10 py-5 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[3rem] border border-indigo-500/15 group/intel hover:bg-indigo-500/10 transition-all">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xl rotate-3 group-hover/intel:rotate-0 transition-transform">
                                        <Sparkles size={24} />
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">Command Console</h3>
                                        <div className="w-full h-1 bg-white/10 mt-1.5 rounded-full overflow-hidden">
                                            <div className="w-2/3 h-full bg-indigo-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden xl:block" />

                                <div className="flex-1 flex items-center gap-6 overflow-x-auto no-scrollbar py-3 px-2">
                                    <LazyFocusMode tasks={tasks} />
                                    <LazyZenMode tasks={tasks} />
                                    <LazyAchievementBadges tasks={tasks} />
                                    <LazyGoalsTracker completedCount={completedCount} />
                                    <LazyWellnessWidget />
                                    <LazyCollaborativeHub />
                                    <LazyAIGoalDecomposer />
                                    <LazyVoiceExecution />
                                    <LazyMeetingToTask />
                                    <LazyAIProjectCharter />
                                    <LazyOmniChannelSync />
                                    <LazyVoiceEODJournal />
                                </div>

                                <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden xl:block" />

                                <div className="flex items-center gap-6">
                                    <Link href="/store" className="flex items-center gap-4 px-10 py-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20 font-black text-[12px] uppercase tracking-[0.4em] transition-all hover:bg-amber-500/20 hover:scale-105 active:scale-95">
                                        <ShoppingBag size={20} />
                                        <span>Boutique</span>
                                    </Link>
                                    <LazyTaskExport tasks={tasks} />
                                </div>
                            </div>
                        </LazyBentoItem>

                        {/* 4. Active Tasks & Board Area (Lg-8) */}
                        <LazyBentoItem colSpan={8} priority={40} className="space-y-12">
                            <div className="space-y-8">
                                <LazySmartAIPanel tasks={tasks} />
                                <LazySmartReminders tasks={tasks} />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pt-10 border-t border-slate-200 dark:border-white/5">
                                <div className="space-y-4" dir="rtl">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-1.5 bg-indigo-500 rounded-full" />
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Workstream Alpha</span>
                                    </div>
                                    <h3 className="text-5xl font-black tracking-[-0.05em] uppercase">Control <span className="text-indigo-500/30">Matrix</span></h3>
                                </div>
                                <div className="w-full md:w-[450px]">
                                    <LazySearchFilterBar />
                                </div>
                            </div>

                            <Suspense fallback={<ShimmerDashboard />}>
                                <div className="relative group/matrix">
                                    <div className="absolute -inset-6 bg-indigo-500/5 rounded-[5rem] blur-3xl opacity-0 group-hover/matrix:opacity-100 transition-all duration-1000" />
                                    <LazyTaskViewContainer tasks={tasks} />
                                </div>
                            </Suspense>
                        </LazyBentoItem>

                        {/* 5. Analysis Sidebar (Lg-4) */}
                        <LazyBentoItem colSpan={4} priority={50} className="space-y-12 h-full">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between" dir="rtl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2.5 h-10 bg-linear-to-b from-indigo-500 to-indigo-700 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                                        <h3 className="text-[14px] font-black uppercase tracking-[0.3em]">Command Input</h3>
                                    </div>
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-xl opacity-0 group-hover/input:opacity-100 transition-opacity" />
                                    <LazyAddTaskForm />
                                </div>
                            </div>

                            <div className="space-y-10">
                                <LazyDashboardStats tasks={tasks} />
                                
                                <div className="relative group/report">
                                    <div className="absolute -inset-1 bg-linear-to-br from-indigo-500/10 to-transparent rounded-[3rem] blur-lg" />
                                    <LazyAIManagerReport report={aiReport} />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <LazyStreakTracker />
                                    <div className="elite-card p-10 flex flex-col items-center justify-center text-center gap-6 group/stat overflow-hidden relative">
                                        <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center group-hover/stat:bg-emerald-500 group-hover/stat:text-white transition-all duration-700">
                                            <Waves size={32} className="text-emerald-500 group-hover/stat:text-white transition-colors animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-5xl font-black tabular-nums tracking-tighter">100%</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flow State</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LazyBentoItem>

                    </LazyBentoContainer>
                </div>
            </AdaptiveLayout>
            <LazyWorkspaceChat />
        </main>
    );
}

function ShimmerDashboard() {
    return (
        <div className="h-96 flex flex-col items-center justify-center elite-card gap-8">
            <div className="relative">
                <div className="w-24 h-24 border-[8px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(99,102,241,1)]" />
                </div>
            </div>
            <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.6em] animate-pulse">Neural Syncing...</span>
        </div>
    );
}
