'use client';

import { useEffect } from 'react';
import { initializeDemoSession } from '@/actions/authActions';
import { useRouter } from 'next/navigation';

export default function AutoAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

            // If we are on an auth page, don't automatically create a session.
            // This is crucial to allow the user to actually stay logged out.
            if (isAuthPage) {
                return;
            }

            const result = await initializeDemoSession();
            if (result.success) {
                // This part is now technically redundant because we return early on auth pages,
                // but kept for robustness if this effect runs when navigate to/from home.
                if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                    router.push('/');
                }
            }
        };
        checkAuth();
    }, [router]);

    return <>{children}</>;
}
