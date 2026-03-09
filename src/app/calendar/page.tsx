import { getTasks } from '@/actions/taskActions';
import { getCurrentUser } from '@/actions/authActions';
import { redirect } from 'next/navigation';
import CalendarView from '@/components/CalendarView';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
    const user = await getCurrentUser();

    const tasks = await getTasks();

    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white pb-40">
            <div className="max-w-[1400px] mx-auto px-6 pt-36">
                <div className="mb-8">
                    <h2 className="text-4xl font-black mb-2">
                        לוח שנה <label className="text-gradient-primary">חכם</label>
                    </h2>
                    <p className="text-slate-500 font-medium">תצוגה חודשית של כל המשימות לפי תאריך יעד.</p>
                </div>
                <CalendarView tasks={tasks} />
            </div>
        </main>
    );
}
