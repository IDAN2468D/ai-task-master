import { getCurrentUser } from '@/actions/authActions';
import { redirect } from 'next/navigation';
import AnalyticsClient from '@/components/AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white">
            <AnalyticsClient />
        </main>
    );
}
