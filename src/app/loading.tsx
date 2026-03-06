import { Rocket } from 'lucide-react';

export default function Loading() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1437]">
            <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-gradient-stat-1 rounded-2xl animate-pulse shadow-xl shadow-[#4318FF]/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Rocket className="w-10 h-10 text-white animate-bounce" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">טוען...</h2>
                    <p className="text-sm font-bold text-slate-400">ה-AI מכין את הכל בשבילך</p>
                </div>

                <div className="flex justify-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4318FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF7D00] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </main>
    );
}
