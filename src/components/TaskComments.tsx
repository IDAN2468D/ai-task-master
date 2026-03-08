'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface Comment {
    userId: string;
    userName: string;
    text: string;
    createdAt: Date;
}

interface TaskCommentsProps {
    taskId: string;
    comments?: Comment[];
    onAddComment: (text: string) => Promise<void>;
}

export default function TaskComments({ taskId, comments = [], onAddComment }: TaskCommentsProps) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAddComment(newComment);
            setNewComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-black/20 rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white leading-none">דיון במשימה</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{comments.length} תגובות</p>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                        <MessageSquare className="w-12 h-12 mb-3" />
                        <p className="text-xs font-bold">אין עדיין הודעות כאן...</p>
                    </div>
                ) : (
                    comments.map((comment, i) => (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            key={i}
                            className="bg-white dark:bg-[#111C44] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                        <User className="w-3 h-3 text-slate-500" />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">{comment.userName}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: he })}
                                </div>
                            </div>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                {comment.text}
                            </p>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="כתוב תגובה..."
                    className="w-full bg-white dark:bg-[#1B254B] text-xs font-bold text-slate-700 dark:text-white px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
                />
                <button
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-90"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
