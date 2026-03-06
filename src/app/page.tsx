import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import DashboardStats from '@/components/DashboardStats';
import { LayoutGrid, Terminal, Shield, Zap, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;
    const tasks = await getTasks(q, priority);

    return (
        <main className="min-h-screen bg-black transition-colors duration-1000 pb-40">

            {/* Header: Obsidian Minimal */}
            <div className="border-b border-slate-900 bg-black/80 backdrop-blur-3xl sticky top-0 z-[1000]">
                <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            <Terminal className="w-4 h-4 text-black" />
                        </div>
                        <h1 className="text-xs font-black tracking-[0.4em] uppercase text-white">AI MASTER <span className="text-slate-600">v3.1</span></h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden sm:flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
                            <a href="#" className="hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="hover:text-white transition-colors">API Keys</a>
                        </div>
                        <div className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-[10px] font-bold tracking-tight hover:border-slate-700 transition-colors cursor-pointer">
                            Support
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-10 py-20">

                {/* Hero / Stats */}
                <div className="mb-24 flex flex-col items-center">
                    <DashboardStats tasks={tasks} />
                </div>

                {/* Main Content: Split Focus */}
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8 space-y-16">

                        {/* Integrated Search Filter Bar */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <Search className="w-4 h-4 text-blue-500" />
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Search Logic</h2>
                            </div>
                            <div className="bg-slate-950/50 p-2 rounded-[2rem] border border-white/5">
                                <SearchFilterBar />
                            </div>
                        </div>

                        {/* Board */}
                        <KanbanBoard tasks={tasks} />
                    </div>

                    <div className="lg:col-span-4 sticky top-28">
                        <AddTaskForm />
                    </div>
                </div>
            </div>

            <footer className="mt-40 border-t border-slate-900 pt-16 flex flex-col items-center gap-6">
                <div className="w-12 h-px bg-slate-800" />
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-800">Precision Engineering. No Placeholders.</p>
            </footer>

        </main>
    );
}
