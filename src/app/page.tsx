import { getTasks } from '@/actions/taskActions';
import { getCurrentUser } from '@/actions/authActions';
import { Lightbulb } from 'lucide-react';
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
    LazyKanbanBoard,
    LazyDashboardStats,
    LazySearchFilterBar,
    LazyAddTaskForm
} from '@/components/LazyClientWrappers';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

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

                {/* Colorful Hero Greeting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex-shrink-0">
                        <h2 className="text-4xl md:text-5xl font-black mb-2 leading-tight">
                            {greeting}, <label className="text-gradient-primary">{user.name}!</label>
                        </h2>
                        <p className="text-slate-500 font-medium">הנה מה שקורה עם המשימות שלך היום.</p>
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto md:overflow-visible pb-6 md:pb-0 px-1 -mx-1 md:mx-0 md:px-0 no-scrollbar w-full md:w-auto mask-fade-right md:mask-none md:flex-wrap md:justify-end">
                        <LazyFocusMode tasks={tasks} />
                        <LazyTaskExport tasks={tasks} />
                        <LazyAchievementBadges tasks={tasks} />
                        <LazyGoalsTracker completedCount={completedCount} />
                        <LazyWellnessWidget />
                        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 md:py-2.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl font-black text-xs md:text-sm border border-[var(--primary)]/10 dark:border-[var(--primary)]/20 shadow-sm transition-transform active:scale-95">
                            <Lightbulb className="w-4 h-4" />
                            <span className="whitespace-nowrap">AI פעיל ומנטר</span>
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
