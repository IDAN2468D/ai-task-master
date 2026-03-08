'use client';

import { X, Eye, FileText, Sparkles, Save, Tag, Clock, MessageSquare, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTaskDescription, addTagToTask, removeTagFromTask, addCommentToTask } from '@/actions/taskActions';
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
    subtasks: any[];
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#4318FF]/10 rounded-2xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-[#4318FF]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{task.title}</h3>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#4318FF]/10 text-[#4318FF] uppercase tracking-wider">{statusHe[task.status]}</span>
                                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 uppercase tracking-wider">{priorityHe[task.priority]}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.category}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex h-[calc(85vh-88px)] flex-col md:flex-row divide-x divide-slate-100 dark:divide-white/5 rtl:divide-x-reverse">
                            {/* Main Scrollable Area */}
                            <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
                                {/* Tags Section */}
                                <section>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Task Archetypes</label>
                                    <div className="flex flex-wrap gap-2.5 mb-4">
                                        {(task.tags || []).map(tag => (
                                            <motion.span
                                                key={tag.name}
                                                whileHover={{ y: -2 }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black text-white shadow-lg shadow-black/5"
                                                style={{ backgroundColor: tag.color }}
                                            >
                                                {tag.name}
                                                <button onClick={() => handleRemoveTag(tag.name)} className="hover:bg-black/10 rounded-full p-0.5 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.span>
                                        ))}
                                        {(!task.tags || task.tags.length === 0) && (
                                            <p className="text-xs font-bold text-slate-400 italic">No archetypes assigned.</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
                                        <input
                                            value={newTag} onChange={e => setNewTag(e.target.value)}
                                            placeholder="Assign new archetype..."
                                            className="flex-1 px-4 py-2 bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none"
                                            onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <button onClick={handleAddTag} disabled={isAddingTag} className="px-5 py-2.5 bg-[#4318FF] text-white rounded-xl text-[10px] font-black hover:bg-[#3614CC] transition-all shadow-md active:scale-95">
                                            Assign
                                        </button>
                                    </div>
                                </section>

                                {/* Intelligence Links */}
                                <section>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Intelligence Assets</label>
                                    <div className="grid gap-3 mb-5">
                                        {(task.links || []).map((link, idx) => (
                                            <motion.div
                                                layout
                                                key={idx}
                                                className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                                            >
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-[#4318FF] hover:text-indigo-600 flex items-center gap-2 mb-2 transition-colors">
                                                    <ExternalLink className="w-3 h-3" />
                                                    {link.url.length > 50 ? link.url.substring(0, 55) + '...' : link.url}
                                                </a>
                                                {link.summary && (
                                                    <div className="flex gap-2">
                                                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic line-clamp-2">
                                                            {link.summary}
                                                        </p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <input
                                            value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                                            placeholder="Paste URL for AI Analysis..."
                                            className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] outline-none transition-all placeholder:text-slate-400"
                                        />
                                        <button onClick={handleAddLink} disabled={isAddingLink || !linkUrl.trim()} className="px-6 py-3.5 bg-gradient-stat-1 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2">
                                            {isAddingLink ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            Analyze
                                        </button>
                                    </div>
                                </section>

                                {/* Tactical Notes */}
                                <section>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Tactical Directives</label>
                                    <div className="relative group">
                                        <textarea
                                            value={description} onChange={e => setDescription(e.target.value)}
                                            rows={5}
                                            placeholder="Briefing details and tactical insights..."
                                            className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[28px] text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] outline-none resize-none transition-all custom-scrollbar"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveDescription}
                                            disabled={isSaving}
                                            className="absolute bottom-4 right-4 px-5 py-2.5 bg-[#4318FF] text-white rounded-xl text-[10px] font-black shadow-xl shadow-indigo-500/30 flex items-center gap-2 hover:bg-[#3614CC] disabled:opacity-50"
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            {isSaving ? 'Synching...' : 'Update Records'}
                                        </motion.button>
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar / Discussions */}
                            <aside className="w-full md:w-[360px] bg-slate-50/30 dark:bg-black/10 border-slate-100 dark:border-white/5 flex flex-col h-full overflow-hidden">
                                <div className="flex-1 p-2">
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
