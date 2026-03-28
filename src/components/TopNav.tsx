'use client';

import { Rocket, User, Menu, X, ArrowLeft, LayoutDashboard, Brain, Sparkles, ShoppingBag, Calendar as CalendarIcon, Diamond, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFullUser } from '@/actions/authActions';
import ThemeSwitcher from './ThemeSwitcher';
import UserStats from './UserStats';
import { getUserStats } from '@/actions/gamificationActions';

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string, image?: string | null } | null>(null);
    const [stats, setStats] = useState<{ xp: number, level: number, currency: number } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [u, s] = await Promise.all([
                getFullUser(),
                getUserStats()
            ]);
            setUser(u);
            setStats(s);
        };
        fetchData();
    }, [pathname]);

    // Hide nav on login and register pages
    const isHiddenPage = pathname === '/login' || pathname === '/register';
    if (isHiddenPage) return null;

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    const links = [
        { href: '/', label: 'ראשי', icon: LayoutDashboard },
        { href: '/calendar', label: 'יומן', icon: CalendarIcon },
        { href: '/analytics', label: 'ניתוח', icon: Brain },
        { href: '/store', label: 'בוטיק', icon: ShoppingBag }
    ];

    return (
        <>
            <nav className="fixed top-8 inset-x-0 z-[1000] px-8 pointer-events-none">
                <div className="max-w-[1400px] mx-auto h-[100px] flex items-center justify-between glass-panel px-12 rounded-[50px] border border-white/30 dark:border-white/10 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.4)] pointer-events-auto overflow-hidden group/nav relative">
                    {/* Platinum Neural Scanner */}
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-1/3 h-[2px] bg-linear-to-r from-transparent via-indigo-400 to-transparent z-20 opacity-30 group-hover/nav:opacity-100 transition-opacity" 
                    />
                    <div className="absolute inset-0 shimmer-elite opacity-5" />
                    
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-6 group/logo shrink-0">
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: -8 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-800 rounded-[28px] flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
                            <Rocket className="w-8 h-8 text-white fill-white/20" />
                        </motion.div>
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-black tracking-[-0.06em] platinum-heading leading-none">TaskMaster</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-black tracking-[0.45em] text-indigo-500 dark:text-indigo-400 uppercase leading-none">V7 PLATINUM</span>
                                <div className="flex gap-2">
                                    <Sparkles size={10} className="text-amber-400 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring neural-pulse relative" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Pills V7 */}
                    <div className="hidden lg:flex items-center gap-4 p-2.5 bg-slate-900/[0.04] dark:bg-white/[0.04] rounded-[40px] border border-black/[0.05] dark:border-white/[0.05] backdrop-blur-3xl shadow-inner">
                        {links.map((link) => {
                            const Active = isActive(link.href);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        relative px-12 py-5 rounded-[30px] text-[11px] font-black transition-all duration-700 flex items-center gap-5 group/link overflow-hidden
                                        ${Active ? 'text-white' : 'text-slate-500 dark:text-white/30 hover:text-indigo-600 dark:hover:text-white'}
                                    `}
                                >
                                    {Active && (
                                        <motion.div
                                            layoutId="nav-pill-active"
                                            className="absolute inset-0 bg-indigo-600 shadow-[0_15px_40px_-10px_rgba(79,70,229,0.7)] rounded-[30px]"
                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                    <Icon size={18} className={`relative z-10 transition-all duration-700 group-hover/link:scale-125 group-hover/link:rotate-12 ${Active ? 'text-white' : 'text-slate-400 dark:text-white/20 group-hover/link:text-indigo-600 dark:group-hover/link:text-white'}`} />
                                    <span className="relative z-10 tracking-[0.45em] uppercase">{link.label}</span>
                                    
                                    {/* Luxe Shine Effect */}
                                    <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent translate-y-full group-hover:translate-y-0 opacity-0 group-hover/link:opacity-100 transition-all duration-700 pointer-events-none" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Interaction Hub V7 */}
                    <div className="flex items-center gap-12">
                        {/* Status Stats */}
                        {stats && (
                            <div className="hidden xl:block">
                                <UserStats xp={stats.xp} level={stats.level} currency={stats.currency} />
                            </div>
                        )}

                        <div className="h-14 w-px bg-slate-200 dark:bg-white/5 mx-1 hidden md:block" />

                        <div className="flex items-center gap-8">
                            <ThemeSwitcher />
                            
                            <Link 
                                href="/profile" 
                                className={`
                                    group/profile relative w-16 h-16 rounded-[30px] p-0.5 bg-linear-to-br from-slate-200 to-white dark:from-white/10 dark:to-transparent border border-white/30 shadow-2xl
                                    flex items-center justify-center cursor-pointer transition-all duration-700 hover:scale-115 active:scale-95
                                    ${pathname === '/profile' ? 'ring-4 ring-indigo-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-950' : ''}
                                `}
                            >
                                <div className="w-full h-full rounded-[28px] overflow-hidden relative shadow-inner">
                                    {user?.image ? (
                                        <Image 
                                            src={user.image} 
                                            alt={user.name} 
                                            width={64} 
                                            height={64} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/profile:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center">
                                            <User className="w-8 h-8 text-slate-400 group-hover/profile:scale-110 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-indigo-500/30 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-700" />
                                </div>
                                <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-emerald-500 border-[3.5px] border-white dark:border-slate-950 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)] neural-pulse" />
                            </Link>
                        </div>

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden w-16 h-16 flex items-center justify-center rounded-[30px] glass-panel text-slate-700 dark:text-white hover:bg-indigo-500/10 transition-all duration-700 border-white/20 active:scale-90 shadow-xl"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                </div>
            </nav>

            {/* Elite Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 z-[990] bg-slate-950/80 px-8 flex flex-col items-center justify-center lg:hidden"
                        dir="rtl"
                    >
                        <div className="flex flex-col gap-5 text-center w-full max-w-sm">
                            <div className="flex flex-col items-center mb-10">
                                <motion.div 
                                    initial={{ scale: 0.8, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[40px] flex items-center justify-center shadow-2xl mb-6"
                                >
                                    <Rocket size={40} className="text-white fill-white/20" />
                                </motion.div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">TaskMaster</h1>
                                <div className="px-4 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                                    <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Elite Protocol 3.0</span>
                                </div>
                            </div>

                            {links.map((link, idx) => {
                                const Icon = link.icon;
                                const Active = isActive(link.href);
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`
                                                flex items-center justify-between p-7 rounded-[32px] border transition-all active:scale-95 group
                                                ${Active ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-500/40' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}
                                            `}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`p-3 rounded-2xl ${Active ? 'bg-white/20 text-white' : 'bg-white/5 text-indigo-400'}`}>
                                                    <Icon size={24} />
                                                </div>
                                                <span className="text-2xl font-black tracking-tight uppercase">{link.label}</span>
                                            </div>
                                            <ArrowLeft size={24} className={Active ? 'text-white' : 'text-white/20'} />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}


