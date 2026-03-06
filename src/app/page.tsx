import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import TaskItem from '@/components/TaskItem';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const tasks = await getTasks();

    const activeTasks = tasks.filter((t: any) => !t.isCompleted);
    const completedTasks = tasks.filter((t: any) => t.isCompleted);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-blue-200">

            {/* Surreal Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-6xl mx-auto py-16 md:py-28 px-6 lg:px-12">

                {/* Advanced Premium Header */}
                <header className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 ring-1 ring-blue-500/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Next Gen Task Manager
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-slate-900 dark:text-white mb-6 leading-[0.9]">
                        Master Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Productivity.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                        The ultimate hub for your daily achievements. Organize with precision, execute with focus, and track every milestone.
                    </p>
                </header>

                {/* Task Interaction Area */}
                <div className="max-w-4xl mx-auto">
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                        <AddTaskForm />
                    </section>

                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400 fill-mode-both">

                        {tasks.length === 0 ? (
                            <div className="bg-white/40 dark:bg-slate-900/20 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800 p-20 text-center transition-all hover:bg-white/60 dark:hover:bg-slate-900/40">
                                <div className="text-6xl mb-6">🌩️</div>
                                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-3">Clear Skies</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">No tasks for now. Time to dream big!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">

                                {/* Active Tasks Section */}
                                {activeTasks.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 px-4">
                                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Current Focus</h2>
                                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                                            {activeTasks.map((task: any) => (
                                                <TaskItem key={task._id} task={task} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Completed Section */}
                                {completedTasks.length > 0 && (
                                    <div className="pt-12 space-y-6">
                                        <div className="flex items-center gap-4 px-4">
                                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Completed</h2>
                                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            {completedTasks.map((task: any) => (
                                                <TaskItem key={task._id} task={task} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Minimal Footer */}
            <footer className="py-12 text-center text-slate-400 text-sm font-semibold tracking-wide">
                Built with Antigravity & AI Task Master Team
            </footer>
        </main>
    );
}
