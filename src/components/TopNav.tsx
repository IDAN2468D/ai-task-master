'use client';

import { Rocket, User, Menu, X, ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser, getCurrentUser } from '@/actions/authActions';
import DarkModeToggle from './DarkModeToggle';
import ThemeSwitcher from './ThemeSwitcher';

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string, image?: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const u = await getCurrentUser();
            setUser(u);
        };
        fetchUser();
    }, [pathname]);

    // Hide nav on auth pages and profile page
    const hiddenPages = ['/login', '/register', '/profile'];
    if (hiddenPages.includes(pathname || '')) {
        return null;
    }

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    const links = [
        { href: '/', label: 'ראשי' },
        { href: '/calendar', label: 'לוח שנה' },
        { href: '/analytics', label: 'אנליטיקס' }
    ];

    return (
        <>
            <nav className="fixed top-0 inset-x-0 z-[1000] bg-white/80 dark:bg-[#0B1437]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-stat-1 rounded-xl flex items-center justify-center shadow-lg shadow-[#4318FF]/30">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight"><span className="text-gradient-primary">טאסק</span>פלו</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Desktop: Show text links */}
                        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`transition-colors ${isActive(link.href) ? 'text-[#4318FF] dark:text-[#00E5FF]' : 'text-slate-500 dark:text-slate-400 hover:text-[#4318FF] dark:hover:text-[#00E5FF]'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* Dark Mode Toggle */}
                        <DarkModeToggle />

                        {/* Desktop: Profile icon */}
                        <Link href="/profile" className="hidden md:flex w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center text-[#4318FF] dark:text-indigo-400 cursor-pointer shadow-[0_0_15px_rgba(67,24,255,0.2)] transition-transform hover:scale-105 overflow-hidden">
                            {user?.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </Link>

                        {/* Mobile: Hamburger only */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        className="fixed inset-0 z-[990] bg-white/95 dark:bg-[#0B1437]/95 backdrop-blur-2xl px-8 flex flex-col items-center justify-center md:hidden"
                    >
                        <div className="flex flex-col gap-8 text-center w-full max-w-md">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-3xl font-black tracking-tight transition-all ${isActive(link.href) ? 'text-gradient-primary' : 'text-slate-800 dark:text-white hover:text-[#4318FF]'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-4"></div>
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-3 text-2xl font-black text-slate-800 dark:text-white hover:text-[#4318FF] transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center overflow-hidden">
                                    {user?.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-[#4318FF]" />
                                    )}
                                </div>
                                הפרופיל שלי <ArrowLeft className="w-5 h-5 text-slate-400" />
                            </Link>
                            <form action={logoutUser}>
                                <button type="submit" className="flex items-center justify-center gap-3 text-lg font-bold text-red-500 hover:text-red-600 transition-colors mx-auto mt-4">
                                    <LogOut className="w-5 h-5" />
                                    התנתק
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
