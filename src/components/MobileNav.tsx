'use client';

import { Rocket, Activity, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#0B1437]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 z-[1000] pb-6 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around h-14 px-6">
                <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-[#4318FF] dark:text-[#00E5FF]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <Rocket className={`w-6 h-6 ${isActive('/') ? 'fill-[#4318FF]/20 dark:fill-[#00E5FF]/20' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tasks</span>
                </Link>
                <Link href="/analytics" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/analytics') ? 'text-[#4318FF] dark:text-[#00E5FF]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <Activity className={`w-6 h-6 ${isActive('/analytics') ? 'fill-[#4318FF]/20 dark:fill-[#00E5FF]/20' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
                </Link>
                <Link href="/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-[#4318FF] dark:text-[#00E5FF]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    <User className={`w-6 h-6 ${isActive('/profile') ? 'fill-[#4318FF]/20 dark:fill-[#00E5FF]/20' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
                </Link>
            </div>
        </div>
    );
}
