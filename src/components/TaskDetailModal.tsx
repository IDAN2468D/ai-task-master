'use client';

import { X, Eye, FileText, Sparkles, Save, Tag, Clock, MessageSquare, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTaskDescription, addTagToTask, removeTagFromTask } from '@/actions/taskActions';
import { summarizeAndAddLink } from '@/actions/aiSummarizerActions';

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
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[8000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-[#111C44] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#4318FF]/10 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#4318FF]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{task.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#4318FF]/10 text-[#4318FF]">{statusHe[task.status]}</span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600">{priorityHe[task.priority]}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{task.category}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
                            {/* Tags */}
                            <div>
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                    <Tag className="w-3 h-3" /> תגיות
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(task.tags || []).map(tag => (
                                        <span key={tag.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: tag.color }}>
                                            {tag.name}
                                            <button onClick={() => handleRemoveTag(tag.name)} className="hover:bg-white/20 rounded-full p-0.5">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {(!task.tags || task.tags.length === 0) && (
                                        <span className="text-xs text-slate-400 font-bold">אין תגיות עדיין</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        value={newTag} onChange={e => setNewTag(e.target.value)}
                                        placeholder="תגית חדשה..."
                                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]"
                                        onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                                    />
                                    <div className="flex gap-1 hidden sm:flex">
                                        {TAG_COLORS.map(c => (
                                            <button key={c.color} onClick={() => setSelectedColor(c.color)}
                                                className={`w-6 h-6 rounded-full transition-all ${selectedColor === c.color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                                                style={{ backgroundColor: c.color }} title={c.name} />
                                        ))}
                                    </div>
                                    <button onClick={handleAddTag} disabled={isAddingTag} className="px-4 py-2.5 bg-[#4318FF] text-white rounded-xl text-xs font-black hover:bg-[#3614CC] transition-colors">
                                        הוסף
                                    </button>
                                </div>
                            </div>

                            {/* Smart Links & Web Clipper */}
                            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                    <LinkIcon className="w-3 h-3" /> קישורים חכמים (AI Web Clipper)
                                </label>

                                <div className="space-y-3 mb-4">
                                    {(task.links || []).map((link, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-1">
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#4318FF] flex items-center gap-1 hover:underline break-all">
                                                    {link.url.length > 60 ? link.url.substring(0, 60) + '...' : link.url}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                            {link.summary && (
                                                <div className="flex gap-2">
                                                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 italic">
                                                        {link.summary}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(!task.links || task.links.length === 0) && (
                                        <div className="text-xs text-slate-400 font-bold p-2">אין קישורים מצורפים. הדבק URL למטה וה-AI יסכם אותו!</div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                                        placeholder="הדבק URL לסיכום..."
                                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]"
                                        onKeyDown={e => e.key === 'Enter' && handleAddLink()}
                                    />
                                    <button onClick={handleAddLink} disabled={isAddingLink} className="flex items-center gap-2 px-4 py-2.5 bg-[#4318FF] text-white rounded-xl text-xs font-black hover:bg-[#3614CC] transition-colors disabled:opacity-50">
                                        {isAddingLink ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                                        סכם
                                    </button>
                                </div>
                            </div>

                            {/* Description / Notes */}
                            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> הערות ותיאור
                                </label>
                                <textarea
                                    value={description} onChange={e => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="הוסף הערות, פרטים נוספים..."
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF] resize-none transition-colors"
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-[10px] font-bold text-slate-400">{description.length} תווים</span>
                                    <button onClick={handleSaveDescription} disabled={isSaving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-stat-1 text-white rounded-xl text-xs font-black hover:shadow-lg transition-all disabled:opacity-50">
                                        <Save className="w-3 h-3" />
                                        {isSaving ? 'שומר...' : 'שמור הערות'}
                                    </button>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    נוצר: {new Date(task.createdAt).toLocaleDateString('he-IL')}
                                </div>
                                {task.dueDate && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                                        <Clock className="w-3 h-3" />
                                        יעד: {new Date(task.dueDate).toLocaleDateString('he-IL')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
