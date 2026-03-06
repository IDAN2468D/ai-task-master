'use client';

import { loginUser } from '@/actions/authActions';
import { Rocket, Mail, Lock, ArrowLeft, Zap, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        const result = await loginUser(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF00E5]/8 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4318FF]/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-12 h-12 bg-gradient-stat-1 rounded-2xl flex items-center justify-center shadow-xl shadow-[#4318FF]/30">
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight"><span className="text-gradient-primary">טאסק</span>פלו</h1>
                </div>

                {/* Card */}
                <div className="vibrant-card p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">ברוכים השבים</h2>
                        <p className="text-sm text-slate-500 font-medium">התחבר כדי להמשיך את העבודה שלך</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl text-sm text-red-600 dark:text-red-400 font-bold text-center">
                            {error}
                        </motion.div>
                    )}

                    <form action={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-1">אימייל</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="email" name="email" required placeholder="you@example.com" className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-1">סיסמה</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type={showPassword ? 'text' : 'password'} name="password" required placeholder="הזן את הסיסמה שלך" className="w-full pr-12 pl-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4318FF] transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-stat-1 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:shadow-[0_20px_40px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Zap className="w-4 h-4" />
                                    התחבר
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            אין לך חשבון עדיין?{' '}
                            <Link href="/register" className="text-[#4318FF] dark:text-[#00E5FF] font-bold hover:underline">
                                צור חשבון <ArrowLeft className="w-3 h-3 inline" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
