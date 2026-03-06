import { getTasks } from '@/actions/taskActions';
import AddTaskForm from '@/components/AddTaskForm';
import TaskItem from '@/components/TaskItem';
import { Target } from 'lucide-react';

// Force Next.js to dynamically render this page (no static build cache), 
// ensuring fresh db data is loaded.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
    // Server-side direct DB call!
    const tasks = await getTasks();

    // Categorize tasks nicely for UI presentation
    const activeTasks = tasks.filter((t: any) => !t.isCompleted);
    const completedTasks = tasks.filter((t: any) => t.isCompleted);

    return (
        <main className="min-h-screen bg-slate-50 relative overflow-hidden text-gray-900 selection:bg-blue-200">

            {/* Decorative Background Accents */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-100/60 via-indigo-50/20 to-transparent -z-10 pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute top-40 -left-32 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">

                {/* Dynamic Header */}
                <header className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-3 bg-white shadow-sm rounded-2xl mb-6 ring-1 ring-gray-900/5">
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 mb-5 font-sans leading-tight">
                        AI Task<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Master</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                        Organize your life, achieve your goals, and master your day. 🚀
                    </p>
                </header>

                {/* Task Entry Form */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                    <AddTaskForm />
                </section>

                {/* Task Lists Feed */}
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">

                    {tasks.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 p-16 text-center shadow-sm transition-all hover:bg-white hover:shadow-md">
                            <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🎯</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks yet</h3>
                            <p className="text-gray-500 text-lg">Capture your first brilliant idea to get started!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">

                            {/* Active Tasks First */}
                            {activeTasks.map((task: any) => (
                                <TaskItem key={task._id} task={task} />
                            ))}

                            {/* Seamless Completed Tasks Divider */}
                            {completedTasks.length > 0 && activeTasks.length > 0 && (
                                <div className="flex items-center gap-4 my-8">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-gray-200 flex-1" />
                                    <span className="text-sm font-bold text-gray-400 tracking-widest uppercase px-2">
                                        Completed ({completedTasks.length})
                                    </span>
                                    <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-gray-200 flex-1" />
                                </div>
                            )}

                            {/* Completed Tasks Last */}
                            {completedTasks.map((task: any) => (
                                <TaskItem key={task._id} task={task} />
                            ))}

                        </div>
                    )}

                </section>
            </div>
        </main>
    );
}
