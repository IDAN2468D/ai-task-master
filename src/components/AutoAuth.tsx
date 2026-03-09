'use client';

import { useEffect } from 'react';
import { initializeDemoSession } from '@/actions/authActions';
import { useRouter } from 'next/navigation';

export default function AutoAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const result = await initializeDemoSession();
            if (result.success) {
                // If we were on /login or /register, go home
                if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                    router.push('/');
                }
            }
        };
        checkAuth();
    }, [router]);

    return <>{children}</>;
}
