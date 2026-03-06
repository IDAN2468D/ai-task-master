import { getCurrentUser } from '@/actions/authActions';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0B1437] text-slate-800 dark:text-white pb-40 transition-colors">
            <ProfileClient user={user} />
        </main>
    );
}
