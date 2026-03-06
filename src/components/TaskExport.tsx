'use client';

import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

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

        // Add BOM for Hebrew support in Excel
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
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
        </motion.div>
    );
}
