'use client';

import { useTransition, useState } from 'react';
import {
    createSmartTask,
    updateTaskStatus,
    deleteTask,
    generateSubtasksWithAI,
    optimizeTaskTitle,
    toggleSubtask,
    addSubtask,
    autoClusterTasks,
    smartBreakdown
} from '@/actions/taskActions';
import { useToast } from '@/components/ToastNotifications';

/**
 * useTaskFlow Hook
 * A centralized hook for managing all task-related operations with built-in loading states and notifications.
 * Designed for AI-First development to keep components clean and modular.
 */
export function useTaskFlow() {
    const { addToast } = useToast();

    // Global Pending States
    const [isPending, startTransition] = useTransition();

    // Function to wrap any action with transitions and toast feedback
    const performAction = async (
        action: (...args: any[]) => Promise<any>,
        args: any[],
        successMessage: string,
        errorMessage: string = "משהו השתבש, נסה שוב."
    ) => {
        return new Promise<void>((resolve, reject) => {
            startTransition(async () => {
                try {
                    await action(...args);
                    addToast(successMessage, 'success');
                    resolve();
                } catch (error) {
                    console.error('Task Action Error:', error);
                    addToast(errorMessage, 'error');
                    reject(error);
                }
            });
        });
    };

    // Simplified API for components
    return {
        isPending,

        // Task Mutations
        createTask: (formData: FormData) =>
            performAction(createSmartTask, [formData], "המשימה נוצרה בהצלחה! 🚀"),

        updateStatus: (id: string, status: string) =>
            performAction(updateTaskStatus, [id, status], `הסטטוס עודכן ל-${status}`),

        removeTask: (id: string) =>
            performAction(deleteTask, [id], "המשימה נמחקה."),

        optimizeTitle: (id: string, title: string) =>
            performAction(optimizeTaskTitle, [id, title], "הכותרת עברה אופטימיזציה ע״י AI Spark! ✨"),

        generateSubtasks: (id: string, title: string) =>
            performAction(generateSubtasksWithAI, [id, title], "תתי-משימות נוצרו בהצלחה."),

        // Subtask Mutations
        toggleSub: (taskId: string, subId: string, current: boolean) =>
            performAction(toggleSubtask, [taskId, subId, current], "המשימה התעדכנה."),

        addInlineSubtask: (taskId: string, title: string) =>
            performAction(addSubtask, [taskId, title], "תת-משימה נוספה."),

        // Advanced AI Actions
        clusterTasks: () =>
            performAction(autoClusterTasks, [], "המשימות אורגנו מחדש לפרויקטים ע״י AI. 📂"),

        getAnalysis: async (id: string): Promise<string> => {
            try {
                const result = await smartBreakdown(id);
                return result || "ניתוח ה-AI הושלם.";
            } catch (error) {
                addToast("נכשלו ניתוח המשימה ע״י AI", 'error');
                return "";
            }
        }
    };
}
