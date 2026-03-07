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
            // Optionally open the file link
            // window.open(result.link, '_blank');
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-500/20 transition-colors"
                    title="ייצוא ל-CSV"
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    CSV
                </button>
                <button
                    onClick={exportJSON}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-500/20 transition-colors"
                    title="ייצוא ל-JSON"
                >
                    <FileText className="w-4 h-4" />
                    JSON
                </button>
                <button
                    onClick={handleGoogleDriveExport}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-4 py-2.5 ${isConnected ? 'bg-[#4318FF]/10 text-[#4318FF]' : 'bg-slate-100 dark:bg-white/5 text-slate-500'} rounded-xl font-bold text-xs hover:bg-[#4318FF]/20 transition-all disabled:opacity-50`}
                    title={isConnected ? "שמור ב-Google Drive" : "חבר את Google Drive"}
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-[#4318FF]/30 border-t-[#4318FF] rounded-full animate-spin" />
                    ) : (
                        <HardDrive className="w-4 h-4" />
                    )}
                    {isConnected ? 'Google Drive' : 'חבר Drive'}
                </button>
            </div>

            {status && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-[10px] font-black flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}
                >
                    {status.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {status.message}
                </motion.div>
            )}
        </motion.div>
    );
}

