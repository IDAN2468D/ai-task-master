/**
 * Utility functions for TaskMaster
 */

/**
 * Formats a date to Israeli format
 */
export function formatDate(date: string | Date): string {
    if (!date) return 'לא הוגדר';
    return new Date(date).toLocaleDateString('he-IL');
}

/**
 * Translates priority to Hebrew
 */
export function translatePriority(priority: string): string {
    const priorities: Record<string, string> = {
        High: 'גבוהה',
        Medium: 'בינונית',
        Low: 'נמוכה'
    };
    return priorities[priority] || priority;
}
