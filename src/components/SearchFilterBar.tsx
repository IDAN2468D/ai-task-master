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
        <div className="vibrant-card p-4 flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="חיפוש משימה..."
                    defaultValue={searchParams.get('q') || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pr-11 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-[var(--primary)] transition-all text-slate-700 dark:text-slate-200"
                />
                {isPending && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Priority Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                    onChange={(e) => handlePriorityFilter(e.target.value)}
                    defaultValue={searchParams.get('priority') || 'All'}
                    className="w-full sm:w-40 py-3 px-4 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-[var(--primary)] transition-all text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
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
