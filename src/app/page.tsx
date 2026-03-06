import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import DashboardStats from '@/components/DashboardStats';
import { Target, Github, Zap, Ship, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;
    const tasks = await getTasks(q, priority);

    return (
        <main className="min-h-screen relative pt-32 pb-40">

            {/* Ultra Premium Animated Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[#fdfdfd] dark:bg-[#020617]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_-100px,#3b82f615,transparent)]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Navigation Bar */}
            <nav className="fixed top-8 inset-x-0 mx-auto max-w-7xl px-8 z-[1000]">
                <div className="luxury-glass h-20 rounded-[2.5rem] flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-950 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl group transition-transform hover:rotate-12">
                            <Ship className="w-6 h-6 text-white dark:text-slate-950" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black tracking-[0.4em] uppercase dark:text-white leading-none mb-1">AI Master</h1>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Edition</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Board</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Analytics</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">History</a>
                        </div>
                        <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                        <div className="p-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Premium
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-8">

                {/* Hero Header */}
                <div className="text-center mb-24 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/5 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/10">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        Next-Gen Intelligence Enabled
                    </div>
                    <h2 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[0.8]">
                        Design. Focus.<br />
                        <span className="animate-gradient text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600">Pure Progress.</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        A workspace tailored for those who demand excellence. Orchestrated by AI, rendered in pure precision.
                    </p>
                </div>

                <div className="mb-24">
                    <DashboardStats tasks={tasks} />
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="luxury-glass p-3 rounded-[2.5rem]">
                            <SearchFilterBar />
                        </div>
                        <KanbanBoard tasks={tasks} />
                    </div>

                    <div className="lg:col-span-4 sticky top-36">
                        <AddTaskForm />
                    </div>
                </div>
            </div>

            <footer className="mt-40 text-center">
                <div className="flex justify-center gap-10 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <Github className="w-6 h-6" />
                    <Ship className="w-6 h-6" />
                    <Target className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700">Copyright © 2026 AI Task Master Global Inc.</p>
            </footer>

        </main>
    );
}
