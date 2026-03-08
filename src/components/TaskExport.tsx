'use client';

import { Download, FileSpreadsheet, FileText, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { exportTasksToDrive, isGoogleConnected, getGoogleAuthUrl } from '@/actions/googleDriveActions';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    dueDate?: string;
    subtasks: any[];
    createdAt: string;
}

export default function TaskExport({ tasks }: { tasks: Task[] }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        const connected = await isGoogleConnected();
        setIsConnected(connected);
    };

    const handleGoogleDriveExport = async () => {
        if (!isConnected) {
            const authUrl = await getGoogleAuthUrl();
            window.location.href = authUrl;
            return;
        }

        setIsSaving(true);
        setStatus(null);

        const result = await exportTasksToDrive(tasks);

        if (result.success) {
            setStatus({ type: 'success', message: 'נשמר בהצלחה ב-Google Drive!' });
            if (result.link) {
                window.open(result.link, '_blank');
            }
        } else {
            setStatus({ type: 'error', message: result.error || 'שגיאה בשמירה ל-Drive' });
        }

        setIsSaving(false);
        setTimeout(() => setStatus(null), 5000);
    };

    const statusHe: Record<string, string> = { Todo: 'לביצוע', InProgress: 'בתהליך', Done: 'הושלם' };
    const priorityHe: Record<string, string> = { High: 'גבוהה', Medium: 'בינונית', Low: 'נמוכה' };

    const exportCSV = () => {
        const headers = ['כותרת', 'סטטוס', 'עדיפות', 'קטגוריה', 'תאריך יעד', 'תתי-משימות', 'נוצר'];
        const rows = tasks.map(t => [
            t.title,
            statusHe[t.status] || t.status,
            priorityHe[t.priority] || t.priority,
            t.category || '',
            t.dueDate ? new Date(t.dueDate).toLocaleDateString('he-IL') : 'לא הוגדר',
            t.subtasks?.length || 0,
            new Date(t.createdAt).toLocaleDateString('he-IL'),
        ]);

        const bom = '\uFEFF';
        const csvContent = bom + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        const data = tasks.map(t => ({
            כותרת: t.title,
            סטטוס: statusHe[t.status] || t.status,
            עדיפות: priorityHe[t.priority] || t.priority,
            קטגוריה: t.category,
            'תאריך יעד': t.dueDate || null,
            'תתי-משימות': t.subtasks?.map((s: any) => ({ כותרת: s.title, הושלם: s.isCompleted })) || [],
        }));

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex items-center gap-2 relative">
            <button
                onClick={exportCSV}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-[10px] md:text-xs border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/20 active:scale-95 uppercase tracking-widest"
                title="ייצוא ל-CSV"
            >
                <FileSpreadsheet className="w-5 h-5" />
                <span>CSV</span>
            </button>
            <button
                onClick={exportJSON}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-[10px] md:text-xs border border-blue-500/10 dark:border-blue-500/20 shadow-sm transition-all hover:bg-blue-500/20 active:scale-95 uppercase tracking-widest"
                title="ייצוא ל-JSON"
            >
                <FileText className="w-5 h-5" />
                <span>JSON</span>
            </button>
            <button
                onClick={handleGoogleDriveExport}
                disabled={isSaving}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 ${isConnected ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-slate-100 dark:bg-white/5 text-slate-500'} rounded-2xl font-black text-[10px] md:text-xs border ${isConnected ? 'border-[var(--primary)]/10 dark:border-[var(--primary)]/20 shadow-sm' : 'border-slate-200 dark:border-white/5'} transition-all hover:bg-indigo-500/20 disabled:opacity-50 active:scale-95 uppercase tracking-widest`}
                title={isConnected ? "שמור ב-Google Drive" : "חבר את Google Drive"}
            >
                {isSaving ? (
                    <div className="w-5 h-5 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
                ) : (
                    <HardDrive className="w-5 h-5" />
                )}
                <span>{isConnected ? 'Drive' : 'Connect'}</span>
            </button>

            {status && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -top-12 right-0 whitespace-nowrap z-50 text-[10px] font-black flex items-center gap-2 px-3 py-2 rounded-xl border shadow-xl ${status.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'}`}
                >
                    {status.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {status.message}
                </motion.div>
            )}
        </div>
    );
}

