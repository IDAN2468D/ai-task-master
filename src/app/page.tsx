import { getTasks } from '@/actions/taskActions';
import { getCurrentUser } from '@/actions/authActions';
import { Lightbulb } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import DashboardStats from '@/components/DashboardStats';
import AddTaskForm from '@/components/AddTaskForm';
import SearchFilterBar from '@/components/SearchFilterBar';
import { LazyFocusMode, LazyTaskExport, LazyStreakTracker, LazyAchievementBadges, LazyGoalsTracker, LazyWellnessWidget, LazySmartReminders } from '@/components/LazyClientWrappers';

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

            <div className="max-w-[1400px] mx-auto px-6 pt-36">

                {/* Colorful Hero Greeting */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-2">
                            {greeting}, <label className="text-gradient-primary">{user.name}!</label>
                        </h2>
                        <p className="text-slate-500 font-medium">הנה מה שקורה עם המשימות שלך היום.</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-3">
                        <LazyFocusMode tasks={tasks} />
                        <LazyTaskExport tasks={tasks} />
                        <LazyAchievementBadges tasks={tasks} />
                        <LazyGoalsTracker completedCount={completedCount} />
                        <LazyWellnessWidget />
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#4318FF]/10 text-[#4318FF] rounded-xl font-bold text-sm">
                            <Lightbulb className="w-4 h-4" />
                            AI פעיל ומנטר
                        </div>
                    </div>
                </div>

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
                    <DashboardStats tasks={tasks} />
                </Suspense>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-9 space-y-6">

                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">לוח פעיל</h3>
                            <SearchFilterBar />
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
                            <KanbanBoard tasks={tasks} />
                        </Suspense>
                    </div>

                    <div className="lg:col-span-3 sticky top-28 space-y-6">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">יצירה חדשה</h3>
                        <AddTaskForm />
                        <LazyStreakTracker />
                    </div>
                </div>
            </div>

        </main>
    );
}
