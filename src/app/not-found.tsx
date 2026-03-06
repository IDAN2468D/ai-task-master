import { SearchX, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// NOTE: Do NOT use <html> or <body> tags here. 
// NotFound is rendered inside your RootLayout.
export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-slate-50 dark:bg-[#0B1437]">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4318FF]/8 blur-[150px] rounded-full pointer-events-none" />

            <div className="text-center max-w-md relative z-10">
                <div className="mb-8">
                    <h1 className="text-[120px] font-black text-gradient-primary leading-none">404</h1>
                </div>

                <div className="w-20 h-20 bg-[#4318FF]/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <SearchX className="w-10 h-10 text-[#4318FF]" />
                </div>

                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">הדף לא נמצא</h2>
                <p className="text-slate-500 font-medium mb-8">
                    הדף שחיפשת לא קיים או שהועבר למקום אחר. <br />
                    בוא נחזיר אותך למסלול.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-[0_10px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        חזרה לדשבורד
                    </Link>
                    <Link
                        href="/analytics"
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#111C44] text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl border border-slate-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        אנליטיקס <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
