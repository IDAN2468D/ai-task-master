'use client';

import { Sparkles, X, Send, Bot, BrainCircuit, LineChart, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AICompanion() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
        { role: 'ai', text: 'Hello! I am your AI TaskFlow Companion. How can I help you optimize your workflow today?' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', text: inputValue }]);
        setInputValue('');

        // Mock AI response for now - we will connect this to Gemini later
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: 'I am analyzing your data. Give me a moment to suggest some optimizations!' }]);
        }, 800);
    };

    return (
        <>
            {/* Sidebar Toggle Button (Floating) */}
            <button
                onClick={toggleSidebar}
                className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-stat-1 rounded-full flex items-center justify-center shadow-2xl shadow-[#4318FF]/40 z-[1000] hover:scale-110 transition-transform group"
            >
                <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-[#4318FF] rounded-full animate-ping opacity-20 group-hover:opacity-40" />
            </button>

            {/* Sidebar Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[400px] z-[2000] bg-white/80 dark:bg-[#0B1437]/80 backdrop-blur-2xl border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-stat-2 rounded-xl flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white">AI Companion</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]">v2.0 Neural Active</span>
                                </div>
                            </div>
                            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="p-4 grid grid-cols-2 gap-3">
                            <QuickActionBtn icon={BrainCircuit} label="Break Down Task" color="text-[#4318FF]" bg="bg-[#4318FF]/10" />
                            <QuickActionBtn icon={LineChart} label="Performance Insight" color="text-[#FF00E5]" bg="bg-[#FF00E5]/10" />
                            <QuickActionBtn icon={Zap} label="Magic Prioritize" color="text-[#00E5FF]" bg="bg-[#00E5FF]/10" />
                            <QuickActionBtn icon={Sparkles} label="Optimize Titles" color="text-[#FF7D00]" bg="bg-[#FF7D00]/10" />
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                            ? 'bg-[#4318FF] text-white rounded-tr-none'
                                            : 'bg-slate-100 dark:bg-[#111C44] text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-200/50 dark:border-white/5'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-white/30 dark:bg-black/20">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about your workflow..."
                                    className="w-full pl-5 pr-14 py-4 bg-white dark:bg-[#111C44] rounded-2xl border border-slate-200 dark:border-white/10 text-sm font-bold shadow-inner focus:outline-none focus:border-[#4318FF] transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4318FF] text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function QuickActionBtn({ icon: Icon, label, color, bg }: any) {
    return (
        <button className={`${bg} ${color} p-3 rounded-2xl flex flex-col items-center gap-2 border border-transparent hover:border-current transition-all group`}>
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
        </button>
    );
}
