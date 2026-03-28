'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { useTransition } from 'react';

export default function SearchFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set('q', value);
        else params.delete('q');

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handlePriorityFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'All') params.set('priority', value);
        else params.delete('priority');

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <div className="elite-card !p-3 !rounded-[40px] flex flex-col sm:flex-row gap-4 items-center group/search border-white/20 dark:border-white/5 bg-slate-500/5 backdrop-blur-3xl shadow-2xl overflow-visible">
            {/* Neural Search Input */}
            <div className="relative flex-1 w-full group/input">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none group-focus-within/input:scale-125 transition-transform duration-500">
                    <Search className={`w-6 h-6 ${isPending ? 'text-indigo-500 animate-pulse' : 'text-slate-400 dark:text-slate-600'}`} />
                </div>
                <input
                    type="text"
                    placeholder="Search neural matrix..."
                    defaultValue={searchParams.get('q') || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    dir="rtl"
                    className="w-full pr-22 pl-10 py-6 bg-transparent border-none rounded-[32px] focus:ring-0 text-slate-800 dark:text-white font-black text-sm uppercase tracking-tighter placeholder:text-slate-400/50 transition-all"
                />
                
                {/* Advanced Focus Indicator */}
                <div className="absolute inset-x-4 bottom-2 h-[2px] bg-linear-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000 scale-x-0 group-focus-within/input:scale-x-100 origin-center" />
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden sm:block mx-2" />

            {/* Premium Rank Filter */}
            <div className="relative w-full sm:w-auto px-4">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-40">
                    <Filter className="w-4 h-4 text-indigo-500" />
                </div>
                <select
                    onChange={(e) => handlePriorityFilter(e.target.value)}
                    defaultValue={searchParams.get('priority') || 'All'}
                    dir="rtl"
                    className="w-full sm:w-52 py-6 pr-8 pl-12 bg-transparent border-none rounded-[32px] focus:ring-0 text-slate-800 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer appearance-none group-hover/search:text-indigo-600 dark:group-hover/search:text-indigo-400 transition-colors"
                >
                    <option value="All">All_Ranks</option>
                    <option value="High">Overdrive</option>
                    <option value="Medium">Standard</option>
                    <option value="Low">Economic</option>
                </select>
            </div>
            
            <div className="absolute inset-0 shimmer-elite opacity-5 pointer-events-none rounded-[40px]" />
        </div>
    );
}
