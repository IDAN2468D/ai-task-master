import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import DashboardStats from '@/components/DashboardStats';
import { Terminal, Command, Zap, Ship, Sparkles, LayoutPanelTop, Fingerprint } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;
    const tasks = await getTasks(q, priority);

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white pb-60 relative overflow-hidden">

            {/* Ethereal Background Canvas */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/[0.03] rounded-full blur-[160px] animate-pulse" />
                <div className="absolute top-[30%] left-[30%] w-[1px] h-[400px] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent rotate-12" />
            </div>

            {/* Navigation: Obsidian Glass */}
            <nav className="fixed top-8 inset-x-0 mx-auto max-w-7xl px-8 z-[1000] animate-in slide-in-from-top-10 duration-1000">
                <div className="luxury-glass h-20 rounded-[2.5rem] flex items-center justify-between px-10 border-white/[0.03]">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:rotate-12 hover:scale-105">
                            <Fingerprint className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black tracking-[0.6em] uppercase text-white leading-none mb-1.5 italic">MASTER</h1>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500/80">Quantum Intelligence</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                            <a href="#" className="hover:text-white transition-all">Matrix</a>
                            <a href="#" className="hover:text-white transition-all">Vault</a>
                            <a href="#" className="hover:text-white transition-all">Labs</a>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-[1px] h-6 bg-white/5" />
                            <div className="flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all cursor-pointer shadow-lg shadow-blue-500/10">
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                Optimize
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-8 pt-44">

                {/* Hero Header: 2026 Minimalist Scale */}
                <div className="max-w-4xl mb-32">
                    <motion_header initial_y={20} initial_opacity={0} />
                    <div className="flex items-center gap-3 mb-10">
                        <div className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                            Synchronized with Gemini 2.5
                        </div>
                    </div>
                    <h2 className="text-8xl md:text-[10rem] font-black text-white tracking-tighter mb-10 leading-[0.75] uppercase italic">
                        The Future<br />
                        <span className="text-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.1)]">Flow.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed tracking-tight">
                        A workspace architected for pure velocity. Orchestrate your roadmap with holographic precision and AI-driven insights.
                    </p>
                </div>

                {/* Dashboard: Bento Matrix */}
                <div className="mb-32">
                    <DashboardStats tasks={tasks} />
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8 space-y-20">

                        {/* Unified Search Matrix */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 pl-2">
                                <Command className="w-4 h-4 text-blue-500" />
                                <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Search Interface</h2>
                            </div>
                            <div className="luxury-glass p-2 border-white/[0.03] rounded-[2rem]">
                                <SearchFilterBar />
                            </div>
                        </div>

                        {/* Integrated Board */}
                        <KanbanBoard tasks={tasks} />
                    </div>

                    <div className="lg:col-span-4 sticky top-36">
                        <div className="flex items-center gap-3 pl-2 mb-6">
                            <LayoutPanelTop className="w-4 h-4 text-indigo-500" />
                            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Mission Draft</h2>
                        </div>
                        <AddTaskForm />
                    </div>
                </div>
            </div>

            <footer className="mt-60 border-t border-white/[0.02] py-20 bg-black">
                <div className="max-w-7xl mx-auto px-10 flex flex-col items-center">
                    <Ship className="w-10 h-10 text-white/5 mb-10" />
                    <div className="flex justify-center gap-16 mb-12 text-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[1em]">Identity</span>
                        <span className="text-[10px] font-black uppercase tracking-[1em]">Security</span>
                        <span className="text-[10px] font-black uppercase tracking-[1em]">Nodes</span>
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[1em] text-white/5">Architected by Antigravity AI • 2026 Universe Edition</p>
                </div>
            </footer>

        </main>
    );
}

function motion_header({ initial_y, initial_opacity }: any) {
    return null; // This is inside a Server Component, so we use standard HTML/CSS for entrance or client components for motion.
}
