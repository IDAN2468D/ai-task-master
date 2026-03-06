'use client';

import { Rocket, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    const links = [
        { href: '/', label: 'Home' },
        { href: 'http://localhost:3002/dashboard', label: 'Dashboard' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/profile', label: 'Profile' }
    ];

    return (
        <>
            <nav className="fixed top-0 inset-x-0 z-[1000] bg-white/80 dark:bg-[#0B1437]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-stat-1 rounded-xl flex items-center justify-center shadow-lg shadow-[#4318FF]/30">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight"><span className="text-gradient-primary">Task</span>Flow</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Global Hamburger Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Menu Overlay (Global) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        className="fixed inset-0 z-[990] bg-white/95 dark:bg-[#0B1437]/95 backdrop-blur-2xl pt-28 px-8 flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col gap-10 text-center -mt-20">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-4xl md:text-5xl font-black tracking-tight transition-all hover:scale-110 ${isActive(link.href) ? 'text-gradient-primary' : 'text-slate-800 dark:text-white hover:text-[#4318FF] dark:hover:text-[#00E5FF]'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
