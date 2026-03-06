'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check saved preference or system preference
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggle = () => {
        setIsDark(!isDark);
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <button
            onClick={toggle}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105 shadow-sm"
            title={isDark ? 'מצב בהיר' : 'מצב כהה'}
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
