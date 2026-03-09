'use client';

import { Rocket } from 'lucide-react';
import { initializeDemoSession } from '@/actions/authActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDemoLogin = async () => {
        setLoading(true);
        const result = await initializeDemoSession();
        if (result.success) {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1437] flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center">
            <div className="max-w-md w-full vibrancy-card p-10 text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-stat-1 rounded-2xl flex items-center justify-center shadow-lg shadow-[#4318FF]/30 mx-auto mb-6">
                    <Rocket className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-3xl font-black mb-2">
                    ברוכים הבאים <br />
                    <span className="text-gradient-primary">לטאסקפלו</span>
                </h1>

                <p className="text-slate-500 font-medium mb-8">
                    מנהל המשימות המופעל ע"י בינה מלאכותית המתקדמת ביותר.
                </p>

                <button
                    onClick={handleDemoLogin}
                    disabled={loading}
                    className="w-full py-4 bg-[var(--primary)] text-white font-black text-lg rounded-2xl shadow-xl shadow-[var(--primary)]/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>כניסה למערכת (דמו)</>
                    )}
                </button>

                <p className="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    AI-First Experience
                </p>
            </div>

            <div className="fixed inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-[var(--primary)]/10 pointer-events-none" />
        </div>
    );
}
