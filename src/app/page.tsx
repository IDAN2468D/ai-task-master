import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import DashboardStats from '@/components/DashboardStats';
import { Target, Github, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;
    const tasks = await getTasks(q, priority);

    return (
        <main className="min-h-screen relative overflow-x-hidden pt-24 pb-32">

            {/* Surreal Background Objects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[160px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[160px]" />
            </div>

            {/* Premium Sticky Navigation */}
            <nav className="fixed top-6 inset-x-0 mx-auto max-w-7xl px-6 z-[1000]">
                <div className="glass-panel h-16 rounded-3xl flex items-center justify-between px-8 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl shadow-lg shadow-blue-500/20">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-black tracking-[0.3em] uppercase dark:text-white hidden sm:block">AI Task<span className="text-blue-500">Master</span></span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://github.com/IDAN2468D/ai-task-master" target="_blank" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <div className="w-px h-6 bg-slate-100 dark:bg-slate-800" />
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform active:scale-95">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Upgrade
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6">

                {/* Hero / Dashboard Entry */}
                <div className="mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="text-center mb-16">
                        <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-[0.85]">
                            Manage with<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600">Pure Precision.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                            The space where clarity meets productivity. Streamline your workflow with AI-driven task orchestration.
                        </p>
                    </div>

                    {/* Stats Widget */}
                    <DashboardStats tasks={tasks} />
                </div>

                {/* Main Action Hub */}
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        {/* Controls */}
                        <div className="glass-panel p-2 rounded-[2rem]">
                            <SearchFilterBar />
                        </div>
                        {/* Board */}
                        <KanbanBoard tasks={tasks} />
                    </div>

                    <div className="lg:col-span-4 sticky top-28">
                        <div className="glass-panel p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                                <span className="w-4 h-px bg-blue-500" /> New Operation
                            </h3>
                            <AddTaskForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Footer */}
            <footer className="mt-40 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700">Designed & Engineered by AI Task Master™</p>
            </footer>

        </main>
    );
}
