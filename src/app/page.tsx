import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import DashboardStats from '@/components/DashboardStats';
import { Rocket, Lightbulb, User } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;
    const tasks = await getTasks(q, priority);

    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white pb-40">

            {/* Vibrant Header Navbar */}
            <nav className="fixed top-0 inset-x-0 z-[1000] bg-white/80 dark:bg-[#0B1437]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-stat-1 rounded-xl flex items-center justify-center shadow-lg shadow-[#4318FF]/30">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight"><span className="text-gradient-primary">Task</span>Flow</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400 mr-4">
                            <Link href="/" className="text-[#4318FF] transition-colors">Dashboard</Link>
                            <Link href="/analytics" className="hover:text-[#4318FF] transition-colors">Analytics</Link>
                            <Link href="/profile" className="hover:text-[#4318FF] transition-colors">Profile</Link>
                        </div>
                        <Link href="/profile" className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[#4318FF] dark:text-indigo-400 cursor-pointer shadow-[0_0_15px_rgba(67,24,255,0.2)]">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto px-6 pt-36">

                {/* Colorful Hero Greeting */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-2">
                            Good Morning, <label className="text-gradient-primary">Idan!</label>
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
