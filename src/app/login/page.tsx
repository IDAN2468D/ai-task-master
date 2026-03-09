'use client';

import { Rocket, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { loginUser, registerUser } from '@/actions/authActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = isRegister ? await registerUser(formData) : await loginUser(formData);

        if (result?.success) {
            router.push('/');
            router.refresh();
        } else {
            setError(result?.error || 'משהו השתבש. נסה שוב.');
        }
        setLoading(false);
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1437] flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00E5FF]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-gradient-stat-1 rounded-2xl flex items-center justify-center shadow-lg shadow-[#4318FF]/30 mx-auto mb-6"
                    >
                        <Rocket className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-black mb-2"
                    >
                        ברוכים הבאים <br />
                        <span className="text-gradient-primary">לטאסקפלו</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 font-medium"
                    >
                        מנהל המשימות המופעל ע"י בינה מלאכותית המתקדמת ביותר.
                    </motion.p>
                </div>

                <motion.div
                    layout
                    className="vibrancy-card p-8 md:p-10"
                >
                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isRegister ? 'register' : 'login'}
                            initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRegister ? -20 : 20 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-black mb-6 text-slate-800 dark:text-white">
                                {isRegister ? 'יצירת חשבון חדש' : 'כניסה לחשבון'}
                            </h2>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {isRegister && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">שם מלא</label>
                                    <div className="relative">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="ישראל ישראלי"
                                            className="w-full pr-11 pl-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:border-[var(--primary)] text-sm font-bold focus:outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">אימייל</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full pr-11 pl-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:border-[var(--primary)] text-sm font-bold focus:outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">סיסמה</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pr-11 pl-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:border-[var(--primary)] text-sm font-bold focus:outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[var(--primary)] text-white font-black text-sm rounded-xl shadow-xl shadow-[var(--primary)]/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isRegister ? 'צור חשבון' : 'היכנס למערכת'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                            className="w-full text-center text-xs font-bold text-slate-500 hover:text-[var(--primary)] transition-colors"
                        >
                            {isRegister ? 'כבר יש לך חשבון? היכנס' : 'אין לך חשבון? הירשם עכשיו'}
                        </button>
                    </div>
                </motion.div>

                <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    AI-First Experience
                </p>
            </div>
        </div>
    );
}
