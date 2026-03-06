'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-slate-50 dark:bg-[#0B1437]">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF2A2A]/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4318FF]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center max-w-md relative z-10">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/20">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">אופס! משהו השתבש</h1>
                <p className="text-slate-500 font-medium mb-2">נתקלנו בשגיאה לא צפויה. אל דאגה, הצוות שלנו כבר מטפל בזה.</p>
                <p className="text-xs font-mono text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-8 break-all">
                    {error.message || 'Unknown Error'}
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-6 py-3 bg-[#4318FF] text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        נסה שוב
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#111C44] text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl border border-slate-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        חזרה הביתה
                    </Link>
                </div>
            </div>
        </main>
    );
}
