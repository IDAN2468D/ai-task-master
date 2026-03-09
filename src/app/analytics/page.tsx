import { getCurrentUser } from '@/actions/authActions';
import { redirect } from 'next/navigation';
import AnalyticsClient from '@/components/AnalyticsClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const user = await getCurrentUser();

    return (
        <main className="min-h-screen text-slate-800 dark:text-white selection:bg-[#4318FF] selection:text-white">
            <Suspense fallback={
                <div className="max-w-[1400px] mx-auto px-6 pt-36 pb-40">
                    <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 vibrant-card animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
                    </div>
                    <div className="h-80 vibrant-card animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                </div>
            }>
                <AnalyticsClient />
            </Suspense>
        </main>
    );
}
