'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatWithWorkspace } from '@/actions/taskActions';

export default function WorkspaceChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'שלום! אני סוכן ה-AI של Antigravity. אני מחובר למשימות, לפרויקטים וללוח הזמנים שלך. איך אוכל לעזור לך לייעל את היום?' }
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
            setMessages(prev => [...prev, { role: 'ai', text: 'מצטער, נראה שיש לי תקלה רגעית בחיבור. נסה שוב בעוד כמה שניות.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 left-8 z-[9999] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-5 rounded-[22px] shadow-2xl shadow-indigo-500/40 flex items-center justify-center border border-white/20"
            >
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageSquare className="w-7 h-7 relative z-10" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8, x: -50 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8, x: -50 }}
                        className="fixed bottom-28 left-8 z-[10000] w-[380px] md:w-[420px] bg-white dark:bg-[#0B1437] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-indigo-500/20 overflow-hidden flex flex-col backdrop-blur-xl"
                        style={{ height: '70vh', maxHeight: '650px' }}
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-[#4318FF] to-indigo-700 text-white flex justify-between items-center relative overflow-hidden">
                            <motion.div 
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -right-20 -top-20 w-40 h-40 bg-white rounded-full blur-[60px]" 
                            />
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-tight">Antigravity AI</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Active Agentic Hub</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-[#0B1437]/50 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx} 
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
                                        msg.role === 'user' 
                                        ? 'bg-white dark:bg-slate-800 text-indigo-600' 
                                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                    }`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`p-4 rounded-[24px] max-w-[80%] text-sm font-bold shadow-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                     <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-[24px] rounded-tl-sm shadow-sm border border-slate-100 dark:border-white/5 flex items-center gap-1.5">
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white dark:bg-[#0B1437] border-t border-slate-100 dark:border-indigo-500/10">
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#111C44] px-4 py-3 rounded-2xl border border-slate-200 dark:border-indigo-500/20 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="הקלד פקודה או שאלה..."
                                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400"
                                    dir="rtl"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
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

