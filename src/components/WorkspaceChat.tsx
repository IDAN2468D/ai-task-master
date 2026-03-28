'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, BrainCircuit, Command } from 'lucide-react';
import { chatWithWorkspace } from '@/actions/taskActions';

export default function WorkspaceChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'Neural Link established. I am your Antigravity Agent, connected to your precision workspace. How shall we optimize your reality today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isLoading, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userQuery = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatWithWorkspace(userQuery);
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Temporal drift detected in the neural uplink. Retrying synchronization...' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Elite Trigger Orb */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 left-10 z-[9999] group/orb"
            >
                <div className="absolute inset-0 bg-indigo-500 rounded-[24px] blur-2xl opacity-40 group-hover/orb:opacity-70 transition-opacity animate-pulse" />
                <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 rounded-[24px] shadow-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/orb:translate-x-full transition-transform duration-1000" />
                    <MessageSquare className="w-8 h-8 relative z-10 group-hover/orb:scale-110 transition-transform duration-500" />
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95, x: -30 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95, x: -30 }}
                        className="fixed bottom-32 left-10 z-[10000] w-[400px] md:w-[460px] elite-card flex flex-col shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border-indigo-500/20"
                        style={{ height: '75vh', maxHeight: '720px' }}
                    >
                        {/* Elite Header */}
                        <div className="p-8 bg-linear-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white flex justify-between items-center relative overflow-hidden group/header">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
                            <motion.div 
                                animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-[60px]" 
                            />
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl group-hover/header:rotate-6 transition-transform duration-700 shadow-inner">
                                    <Sparkles className="w-7 h-7 text-indigo-200 animate-pulse" />
                                </div>
                                <div dir="rtl" className="text-right">
                                    <h3 className="font-black text-xl tracking-tight leading-none mb-1">Neural Assistant</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]" />
                                        <p className="text-[10px] font-black text-indigo-100/60 uppercase tracking-[0.25em]">Cognitive Core Connected</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="p-2.5 hover:bg-white/10 rounded-[14px] transition-all duration-500 group-hover/header:rotate-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Neural Stream */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 dark:bg-black/20 scrollbar-hide" dir="rtl">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx} 
                                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-xl relative z-10 ${
                                        msg.role === 'user' 
                                        ? 'bg-white dark:bg-slate-800 text-indigo-600 border border-slate-100 dark:border-white/10' 
                                        : 'bg-linear-to-br from-indigo-500 to-purple-700 text-white shadow-indigo-500/20'
                                    }`}>
                                        {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                    </div>
                                    <div className={`p-5 rounded-[28px] max-w-[85%] text-[13px] font-bold shadow-sm leading-relaxed relative ${
                                        msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-500/10' 
                                        : 'bg-white/60 dark:bg-white/5 backdrop-blur-xl text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-sm'
                                    }`}>
                                        <div className="absolute top-0 right-0 w-full h-full rounded-[28px] bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                    <div className="p-5 bg-white/40 dark:bg-white/5 rounded-[28px] rounded-tl-sm shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-2">
                                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Nexus */}
                        <div className="p-8 bg-white/50 dark:bg-black/30 border-t border-slate-100 dark:border-white/5 backdrop-blur-3xl">
                            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 px-6 py-4 rounded-[24px] border border-slate-200 dark:border-white/10 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-500 relative group/inputArea" dir="rtl">
                                <Command className="w-5 h-5 text-indigo-500/50 absolute left-6" />
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Enter precision command..."
                                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-black text-slate-800 dark:text-white placeholder:text-slate-400/60"
                                    dir="rtl"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-4 bg-linear-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl hover:shadow-[0_10px_20px_rgba(79,70,229,0.3)] disabled:opacity-30 transition-all active:scale-90 relative overflow-hidden group/sendBtn"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/sendBtn:translate-y-0 transition-transform duration-300" />
                                    <Send className="w-5 h-5 relative z-10" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

