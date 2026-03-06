'use client';

import { Rocket, User, Settings, CreditCard, Sparkles, Bell, Shield, Paintbrush, MonitorSmartphone, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'My Profile', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Paintbrush },
        { id: 'ai', label: 'AI Tuning', icon: Sparkles },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    ];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0B1437] text-slate-800 dark:text-white pb-40 transition-colors">


            <div className="max-w-[1400px] mx-auto px-6 pt-36">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-4xl font-black mb-2">
                        Account <label className="text-gradient-primary">Settings</label>
                    </h2>
                    <p className="text-slate-500 font-medium">Manage your personal details, AI preferences, and security.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/30 translate-x-2' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-[#111C44] hover:text-slate-800 dark:hover:text-white'}`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="vibrant-card p-8 md:p-10 min-h-[600px] relative overflow-hidden"
                        >
                            {/* Decorative Glow based on tab */}
                            {activeTab === 'account' && <div className="absolute top-0 right-0 w-80 h-80 bg-[#4318FF]/5 blur-[100px] pointer-events-none rounded-full" />}
                            {activeTab === 'ai' && <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF00E5]/5 blur-[100px] pointer-events-none rounded-full" />}

                            {activeTab === 'account' && <AccountSettings />}
                            {activeTab === 'ai' && <AITuningSettings />}
                            {activeTab !== 'account' && activeTab !== 'ai' && (
                                <div className="h-[400px] flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <MonitorSmartphone className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Module Under Construction</h3>
                                    <p className="text-slate-500 text-sm max-w-sm">This section is currently being upgraded for the 2026 release cycle.</p>
                                </div>
                            )}

                        </motion.div>
                    </div>

                </div>
            </div>
        </main>
    );
}

function AccountSettings() {
    return (
        <div className="space-y-10 relative z-10">
            <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Public Profile</h3>
                <p className="text-sm font-bold text-slate-500">This will be displayed on your workspace.</p>
            </div>

            <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-stat-2 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[#00E5FF]/30 relative group cursor-pointer">
                    I
                    <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <User className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-[#4318FF] text-white font-bold text-sm rounded-xl hover:shadow-[0_10px_20px_rgba(67,24,255,0.3)] hover:-translate-y-0.5 transition-all">Change Avatar</button>
                    <button className="px-6 py-2.5 bg-slate-100 dark:bg-[#111C44] text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Remove</button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                    <input type="text" defaultValue="Idan" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors shadow-inner" />
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                    <input type="text" defaultValue="Developer" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors shadow-inner" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Connection</label>
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="email" defaultValue="idan@ai-task-master.com" className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors shadow-inner" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
                <button className="px-8 py-3.5 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save Changes
                </button>
            </div>
        </div>
    );
}

function AITuningSettings() {
    return (
        <div className="space-y-10 relative z-10">
            <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Gemini AI Brain</h3>
                <p className="text-sm font-bold text-slate-500">Configure how the AI agent interacts with your workspace.</p>
            </div>

            <div className="grid gap-6">

                {/* AI Toggle Card */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-black text-slate-800 dark:text-white mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#FF00E5]" /> Auto-Categorization</h4>
                        <p className="text-xs font-bold text-slate-500">Let AI automatically assign categories and priorities to new tasks.</p>
                    </div>
                    <div className="w-14 h-8 bg-[#4318FF] rounded-full p-1 cursor-pointer flex justify-end transition-colors shadow-lg shadow-[#4318FF]/20">
                        <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                    </div>
                </div>

                {/* AI Tone Select */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">AI Assistant Persona Tone</label>
                    <div className="grid grid-cols-3 gap-4">
                        <button className="p-4 rounded-2xl border-2 border-[#4318FF] bg-[#4318FF]/5 text-center transition-all">
                            <span className="block text-xl mb-1">👔</span>
                            <span className="text-xs font-bold text-[#4318FF]">Professional (Default)</span>
                        </button>
                        <button className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#FF7D00] hover:bg-[#FF7D00]/5 text-center transition-all opacity-60 hover:opacity-100">
                            <span className="block text-xl mb-1">⚡</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Direct & Concise</span>
                        </button>
                        <button className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 text-center transition-all opacity-60 hover:opacity-100">
                            <span className="block text-xl mb-1">🌈</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Friendly & Motivating</span>
                        </button>
                    </div>
                </div>

                {/* API Key Connection */}
                <div className="space-y-2 mt-4">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Google Gemini API Key</label>
                    <input type="password" defaultValue="************************" readOnly className="w-full px-5 py-4 bg-slate-50 dark:bg-[#0B1437]/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 font-mono text-sm focus:outline-none shadow-inner opacity-70" />
                    <p className="text-[10px] font-bold text-[#FF00E5] pl-1">API Key is managed via secure environment variables (.env).</p>
                </div>

            </div>
        </div>
    );
}
