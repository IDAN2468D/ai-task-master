import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import KanbanBoard from '@/components/KanbanBoard';
import SearchFilterBar from '@/components/SearchFilterBar';
import { LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; priority?: string }> }) {
    // Await searchParams in Next.js 15
    const resolvedParams = await searchParams;
    const q = resolvedParams.q;
    const priority = resolvedParams.priority;

    // Fetch filtered tasks
    const tasks = await getTasks(q, priority);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 selection:bg-blue-200 pb-20">

            {/* Header / Top Bar */}
            <div className="border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight dark:text-white">AI Task<span className="text-blue-600">Master</span></h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-10 px-6">

                {/* Hero / Action Section */}
                <div className="flex flex-col lg:flex-row gap-10 mb-16 items-start">
                    <div className="flex-1 w-full">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                            Your Workspace<br />
                            <span className="text-slate-400">Streamlined.</span>
                        </h2>
                        <SearchFilterBar />
                    </div>
                    <div className="w-full lg:w-[450px]">
                        <AddTaskForm />
                    </div>
                </div>

                {/* Main Kanban Content */}
                <section className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <KanbanBoard tasks={tasks} />
                </section>
            </div>

        </main>
    );
}
