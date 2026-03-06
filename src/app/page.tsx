import { getTasks } from '@/actions/taskActions';
import { getCurrentUser } from '@/actions/authActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import DashboardStats from '@/components/DashboardStats';
import { Lightbulb } from 'lucide-react';
import { redirect } from 'next/navigation';

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
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white pb-40">

            <div className="max-w-[1400px] mx-auto px-6 pt-36">

                {/* Colorful Hero Greeting */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-2">
                            {greeting}, <label className="text-gradient-primary">{user.name}!</label>
                        </h2>
                        <p className="text-slate-500 font-medium">Here is what's happening with your tasks today.</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#4318FF]/10 text-[#4318FF] rounded-xl font-bold text-sm">
                        <Lightbulb className="w-4 h-4" />
                        AI is active and monitoring
                    </div>
                </div>

                <DashboardStats tasks={tasks} />

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-9 space-y-6">

                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Active Board</h3>
                            <SearchFilterBar />
                        </div>

                        {/* Vibrant Board */}
                        <KanbanBoard tasks={tasks} />
                    </div>

                    <div className="lg:col-span-3 sticky top-28">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Create New</h3>
                        <AddTaskForm />
                    </div>
                </div>
            </div>

        </main>
    );
}
