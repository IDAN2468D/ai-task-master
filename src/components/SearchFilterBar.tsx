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
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="חיפוש לפי כותרת משימה..."
                    defaultValue={searchParams.get('q') || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pr-11 pl-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                />
                {isPending && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Priority Toggle */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400 mr-2 hidden md:block" />
                <select
                    onChange={(e) => handlePriorityFilter(e.target.value)}
                    defaultValue={searchParams.get('priority') || 'All'}
                    className="w-full md:w-40 py-3 px-4 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                >
                    <option value="All">כל העדיפויות</option>
                    <option value="High">עדיפות גבוהה</option>
                    <option value="Medium">עדיפות בינונית</option>
                    <option value="Low">עדיפות נמוכה</option>
                </select>
            </div>
        </div>
    );
}
