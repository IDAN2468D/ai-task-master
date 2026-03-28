'use client';

import { X, Eye, FileText, Sparkles, Save, Tag, Clock, MessageSquare, ExternalLink, Link as LinkIcon, Check, Zap, Target, Share2, MessageCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTaskDescription, addTagToTask, removeTagFromTask, addCommentToTask, generateTaskPrep, cognitiveDecomposeTask, toggleSubtask, delegateTask } from '@/actions/taskActions';
import { summarizeAndAddLink } from '@/actions/aiSummarizerActions';
import TaskComments from './TaskComments';


interface Task {
    _id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    category: string;
    dueDate?: string;
    subtasks: { _id: string; title: string; isCompleted: boolean }[];
    tags?: { name: string; color: string }[];
    links?: { url: string; summary?: string }[];
    comments?: { userId: string; userName: string; text: string; createdAt: Date }[];
    createdAt: string;
}

const TAG_COLORS = [
    { name: 'סגול', color: '#7C3AED' },
    { name: 'ורוד', color: '#EC4899' },
    { name: 'כחול', color: '#3B82F6' },
    { name: 'ירוק', color: '#10B981' },
    { name: 'כתום', color: '#F59E0B' },
    { name: 'אדום', color: '#EF4444' },
    { name: 'ציאן', color: '#06B6D4' },
];

export default function TaskDetailModal({ task, isOpen, onClose }: { task: Task; isOpen: boolean; onClose: () => void }) {
    const [description, setDescription] = useState(task.description || '');
    const [isSaving, startSave] = useTransition();
    const [newTag, setNewTag] = useState('');
    const [selectedColor, setSelectedColor] = useState('#7C3AED');
    const [isAddingTag, startAddTag] = useTransition();
    const [linkUrl, setLinkUrl] = useState('');
    const [isAddingLink, startAddLink] = useTransition();
    const [isGeneratingPrep, startGeneratePrep] = useTransition();
    const [isDecomposing, startDecompose] = useTransition();
    const [isTogglingSubtask, startToggleSubtask] = useTransition();
    const [isDelegating, startDelegating] = useTransition();
    const [delegationDraft, setDelegationDraft] = useState('');

    const statusHe: Record<string, string> = { Todo: 'לביצוע', InProgress: 'בתהליך', Done: 'הושלם' };
    const priorityHe: Record<string, string> = { High: 'גבוהה', Medium: 'בינונית', Low: 'נמוכה' };

    const handleSaveDescription = () => {
        startSave(async () => {
            await updateTaskDescription(task._id, description);
        });
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        startAddTag(async () => {
            await addTagToTask(task._id, newTag.trim(), selectedColor);
            setNewTag('');
        });
    };

    const handleRemoveTag = (tagName: string) => {
        startAddTag(async () => {
            await removeTagFromTask(task._id, tagName);
        });
    };

    const handleAddLink = () => {
        if (!linkUrl.trim()) return;
        startAddLink(async () => {
            await summarizeAndAddLink(task._id, linkUrl.trim());
            setLinkUrl('');
        });
    };

    const handleGeneratePrep = () => {
        startGeneratePrep(async () => {
            const res = await generateTaskPrep(task._id, task.title, description);
            if (res.success && res.content) {
                setDescription(prev => prev + (prev ? '\n\n---\n**🧠 AI Task Prep:**\n' : '**🧠 AI Task Prep:**\n') + res.content);
            }
        });
    };

    const handleDecompose = () => {
        startDecompose(async () => {
            await cognitiveDecomposeTask(task._id, task.title);
        });
    };

    const handleToggleSubtask = (subtaskId: string, currentStatus: boolean) => {
        startToggleSubtask(async () => {
            await toggleSubtask(task._id, subtaskId, currentStatus);
        });
    };

    const handleDelegate = (method: 'whatsapp' | 'email') => {
        startDelegating(async () => {
            const res = await delegateTask(task._id, method);
            if (res.success) {
                setDelegationDraft(res.draft || '');
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[8000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className="elite-card border-white/20 dark:border-white/5 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-white/40 dark:bg-black/40 backdrop-blur-3xl"
                        onClick={e => e.stopPropagation()}
                        dir="rtl"
                    >
                        {/* Elite Scanline & Depth Effects */}
                        <div className="absolute inset-0 elite-scanline opacity-5 pointer-events-none" />

                        {/* Header - Elite V6 Design */}
                        <header className="px-8 py-7 border-b border-white/10 dark:border-white/5 flex items-center justify-between bg-white/30 dark:bg-black/30 sticky top-0 z-20">
                            <div className="flex items-center gap-7">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl group transition-all duration-500 hover:scale-105 active:scale-95">
                                    <FileText className="w-7 h-7 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-3xl font-black font-outfit text-slate-900 dark:text-white leading-tight tracking-tight">
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                            <span className="text-[10px] font-black font-outfit text-indigo-500 uppercase tracking-widest">{statusHe[task.status]}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <span className="text-[10px] font-black font-outfit text-amber-500 uppercase tracking-widest">{priorityHe[task.priority]}</span>
                                        </div>
                                        <span className="text-[10px] font-black font-outfit text-slate-400 uppercase tracking-[0.3em]">{task.category || 'GENERAL'}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="w-12 h-12 flex items-center justify-center glass-panel hover:bg-rose-500/20 hover:text-rose-500 text-slate-400 rounded-2xl transition-all duration-300 border-white/10 hover:border-rose-500/30 active:scale-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex flex-1 overflow-hidden divide-x divide-white/10 dark:divide-white/5 rtl:divide-x-reverse flex-col md:flex-row">
                            {/* Main Scrollable Area */}
                            <main className="flex-1 p-8 sm:p-10 space-y-12 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-black/10">
                                
                                {/* Tags Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-slate-400" />
                                        <label className="text-[11px] font-black font-outfit uppercase tracking-[0.4em] text-slate-400">Neural Classifiers</label>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {(task.tags || []).map(tag => (
                                            <motion.span
                                                key={tag.name}
                                                whileHover={{ y: -3, scale: 1.05 }}
                                                className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-[11px] font-black font-outfit text-white shadow-xl shadow-black/10 border border-white/20 backdrop-blur-md"
                                                style={{ backgroundColor: tag.color }}
                                            >
                                                {tag.name}
                                                <button onClick={() => handleRemoveTag(tag.name)} className="hover:bg-black/20 rounded-lg p-1 transition-colors">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 glass-panel p-2.5 rounded-2xl border-white/10 dark:border-white/5 shadow-inner focus-within:border-indigo-500/30 transition-all">
                                        <input
                                            value={newTag} onChange={e => setNewTag(e.target.value)}
                                            placeholder="Assign neural tag..."
                                            className="flex-1 px-5 py-3 bg-transparent text-sm font-bold font-outfit text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
                                            onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <button 
                                            onClick={handleAddTag} 
                                            disabled={isAddingTag} 
                                            className="px-7 py-3 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-xs font-black font-outfit hover:shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50 tracking-widest uppercase"
                                        >
                                            INITIALIZE
                                        </button>
                                    </div>
                                </section>

                                {/* Intelligence Assets */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <LinkIcon className="w-4 h-4 text-slate-400" />
                                        <label className="text-[11px] font-black font-outfit uppercase tracking-[0.4em] text-slate-400">Knowledge Nodes</label>
                                    </div>
                                    <div className="grid gap-5">
                                        {(task.links || []).map((link, idx) => (
                                            <motion.div
                                                layout
                                                key={idx}
                                                className="p-6 elite-card border-white/10 dark:border-white/5 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
                                            >
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-black font-outfit text-indigo-500 hover:text-indigo-400 flex items-center gap-2.5 mb-4 truncate group-hover:translate-x-1 transition-transform">
                                                    <ExternalLink className="w-4 h-4" />
                                                    {link.url}
                                                </a>
                                                {link.summary && (
                                                    <div className="flex gap-4 bg-indigo-500/5 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/10 dark:border-indigo-500/20">
                                                        <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-1 animate-pulse" />
                                                        <p className="text-[13px] font-semibold font-outfit text-indigo-900 dark:text-indigo-100/80 leading-relaxed italic">
                                                            {link.summary}
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 group/input">
                                        <input
                                            value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                                            placeholder="Sync intelligence URL..."
                                            className="flex-1 px-6 py-4 glass-panel border-white/10 dark:border-white/5 rounded-2xl text-sm font-bold font-outfit text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                                        />
                                        <button 
                                            onClick={handleAddLink} 
                                            disabled={isAddingLink || !linkUrl.trim()} 
                                            className="px-8 py-4 bg-linear-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white rounded-2xl text-[11px] font-black font-outfit shadow-2xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3 uppercase tracking-widest"
                                        >
                                            {isAddingLink ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                            ANALYZE
                                        </button>
                                    </div>
                                </section>

                                {/* AI Decomposer & Subtasks */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-4 h-4 text-slate-400" />
                                            <label className="text-[11px] font-black font-outfit uppercase tracking-[0.4em] text-slate-400">Tactical Directives</label>
                                        </div>
                                        <button
                                            onClick={handleDecompose}
                                            disabled={isDecomposing}
                                            className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-[10px] font-black font-outfit shadow-xl shadow-teal-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2.5 group hover:shadow-emerald-500/30 uppercase tracking-widest"
                                        >
                                            <Sparkles className={`w-4 h-4 transition-transform ${isDecomposing ? 'animate-spin' : 'group-hover:rotate-[30deg]'}`} />
                                            {isDecomposing ? 'INITIALIZING LOGIC...' : 'AI DECOMPOSE'}
                                        </button>
                                    </div>
                                    <div className="grid gap-3.5">
                                        {(task.subtasks || []).map(sub => (
                                            <motion.div
                                                layout
                                                key={sub._id}
                                                onClick={() => handleToggleSubtask(sub._id, sub.isCompleted)}
                                                className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all border-2 ${sub.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-white/40 dark:bg-black/30 border-white/10 dark:border-white/5 hover:border-indigo-500/40 hover:bg-white dark:hover:bg-black/40 hover:shadow-xl hover:shadow-indigo-500/5'} group/sub`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${sub.isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-slate-300 dark:border-white/20 group-hover/sub:border-indigo-500 group-hover/sub:scale-110'}`}>
                                                    {sub.isCompleted && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className={`text-[15px] font-bold font-outfit transition-all ${sub.isCompleted ? 'text-emerald-700 dark:text-emerald-400 line-through italic' : 'text-slate-800 dark:text-white/90'}`}>
                                                    {sub.title}
                                                </span>
                                            </motion.div>
                                        ))}
                                        {(!task.subtasks || task.subtasks.length === 0) && !isDecomposing && (
                                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl opacity-30">
                                                <Target className="w-10 h-10 mb-3 text-slate-400" />
                                                <p className="text-[11px] font-black font-outfit uppercase tracking-[0.3em]">Initialize Tactical Nodes</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Mission Intelligence & Delegation */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-4 h-4 text-slate-400" />
                                            <label className="text-[11px] font-black font-outfit uppercase tracking-[0.4em] text-slate-400">Strategic Ops</label>
                                        </div>
                                        <button
                                            onClick={handleGeneratePrep}
                                            disabled={isGeneratingPrep}
                                            className="px-6 py-3 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl text-[10px] font-black font-outfit shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2.5 group hover:shadow-orange-500/30 uppercase tracking-widest"
                                        >
                                            <Sparkles className={`w-4 h-4 transition-transform ${isGeneratingPrep ? 'animate-spin' : 'group-hover:rotate-[30deg]'}`} />
                                            {isGeneratingPrep ? 'PROCESSING CORE...' : 'GENERATE AI PREP'}
                                        </button>
                                    </div>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleDelegate('whatsapp')} 
                                            disabled={isDelegating} 
                                            className="flex-1 flex items-center justify-center gap-3 px-5 py-4 bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-black font-outfit hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/20 tracking-widest uppercase"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            DELEGATE (WA)
                                        </button>
                                        <button 
                                            onClick={() => handleDelegate('email')} 
                                            disabled={isDelegating} 
                                            className="flex-1 flex items-center justify-center gap-3 px-5 py-4 bg-indigo-500/10 text-indigo-600 rounded-2xl text-[10px] font-black font-outfit hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20 tracking-widest uppercase"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            DELEGATE (MAIL)
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {delegationDraft && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                                className="p-8 glass-panel border-emerald-500/20 rounded-[32px] relative overflow-hidden bg-emerald-500/5 shadow-2xl shadow-emerald-500/5"
                                            >
                                                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-50" />
                                                <span className="text-[10px] font-black font-outfit text-emerald-600 mb-4 block uppercase tracking-widest">Delegation Protocol Draft:</span>
                                                <p className="text-[13px] font-medium font-outfit whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-emerald-50/90 mb-7">{delegationDraft}</p>
                                                <div className="flex justify-end">
                                                    <button 
                                                        onClick={() => { navigator.clipboard.writeText(delegationDraft); setDelegationDraft(''); }} 
                                                        className="text-[10px] font-black font-outfit text-white bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all uppercase tracking-widest"
                                                    >
                                                        Sync to Clipboard
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>

                                {/* Tactical Notes */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4 text-slate-400" />
                                        <label className="text-[11px] font-black font-outfit uppercase tracking-[0.4em] text-slate-400">Mission Briefing</label>
                                    </div>
                                    <div className="relative group">
                                        <textarea
                                            value={description} onChange={e => setDescription(e.target.value)}
                                            rows={8}
                                            placeholder="Enter tactical insights..."
                                            className="w-full px-8 py-8 glass-panel border-white/10 dark:border-white/5 rounded-[40px] text-sm font-semibold font-outfit text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all custom-scrollbar bg-white/20 dark:bg-black/20"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveDescription}
                                            disabled={isSaving}
                                            className="absolute bottom-8 left-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black font-outfit shadow-2xl shadow-indigo-500/40 flex items-center gap-3 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                                        >
                                            <Save className="w-4.5 h-4.5" />
                                            {isSaving ? 'SYNCHRONIZING...' : 'UPDATE BRIEF'}
                                        </motion.button>
                                    </div>
                                </section>
                            </main>

                            {/* Sidebar / Discussions */}
                            <aside className="w-full md:w-[380px] bg-white/30 dark:bg-black/20 border-white/10 dark:border-white/5 flex flex-col h-full overflow-hidden backdrop-blur-xl">
                                <header className="p-7 border-b border-white/10 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                                        <h4 className="text-[13px] font-black font-outfit text-slate-800 dark:text-white uppercase tracking-widest">Neural Discussion</h4>
                                    </div>
                                </header>
                                <div className="flex-1 overflow-hidden p-2">
                                    <TaskComments
                                        taskId={task._id}
                                        comments={task.comments}
                                        onAddComment={async (text) => {
                                            await addCommentToTask(task._id, text);
                                        }}
                                    />
                                </div>
                            </aside>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
