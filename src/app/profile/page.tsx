import { getFullUser } from '@/actions/authActions';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    // Use getFullUser() to fetch complete user data from MongoDB
    // This includes the profile image which is NOT stored in the cookie
    const user = await getFullUser();

    // Provide a basic fallback to avoid crash while AutoAuth initializes
    const displayUser = user || { name: 'אורח', email: 'guest@taskmaster.ai' };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0B1437] text-slate-800 dark:text-white pb-40 transition-colors">
            <Suspense fallback={
                <div className="max-w-[1400px] mx-auto px-6 pt-16">
                    <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mb-8" />
                    <div className="h-[600px] vibrant-card animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                </div>
            }>
                <ProfileClient user={displayUser as any} />
            </Suspense>
        </main>
    );
}
