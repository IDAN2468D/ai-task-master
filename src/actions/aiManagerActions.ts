'use server';

import { model } from '@/lib/gemini';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { getCurrentUser } from '@/actions/authActions';
import { sendWeeklySummaryEmail } from '@/lib/email';

/**
 * AI Progress Report: Analyzes recent activity and provides high-level coaching
 */
export async function getAIProgressReport() {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();

        // Get tasks from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const tasks = await Task.find({
            userId: session.userId,
            createdAt: { $gte: sevenDaysAgo }
        }).lean();

        if (tasks.length === 0) {
            return "עדיין אין מספיק נתונים לניתוח שבועי. המשך להוסיף משימות!";
        }

        const completed = tasks.filter((t: any) => t.status === 'Done').length;
        const pending = tasks.length - completed;
        const categories = tasks.reduce((acc: any, t: any) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        const prompt = `Analyze this user's productivity for the last 7 days:
        - Total Tasks: ${tasks.length}
        - Completed: ${completed}
        - Pending: ${pending}
        - Top Categories: ${JSON.stringify(categories)}
        
        Role: Senior Productivity Coach.
        Provide a 3-sentence deep insight in Hebrew. 
        Focus on: What is the bottleneck? What is the main win? One high-impact advice for next week.
        Return ONLY the text.`;

        const result = await model.generateContent(prompt);
        const insight = result.response.text().trim();

        // Calculate specific metrics for the dashboard
        const mentalLoad = tasks.reduce((acc: number, t: any) => {
            if (t.status === 'Done') return acc;
            const energyMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
            return acc + (energyMap[t.energyLevel as keyof typeof energyMap] || 2);
        }, 0);

        const highPriorityCount = tasks.filter((t: any) => t.status !== 'Done' && t.priority === 'High').length;
        const totalEstimatedHours = tasks.filter((t: any) => t.status !== 'Done').reduce((acc: number, t: any) => acc + (t.estimatedHours || 1), 0);
        
        // Burnout risk calculation (0-100)
        // High priority tasks and high volume of hours increase risk
        const burnoutRisk = Math.min(100, Math.round((totalEstimatedHours / 20) * 50 + (highPriorityCount * 10)));

        return {
            insight,
            mentalLoad,
            burnoutRisk,
            taskCount: tasks.length
        };
    } catch (error) {
        console.error('AI Progress Report Error:', error);
        return {
            insight: "לא הצלחתי לנתח את ההתקדמות שלך כרגע. נסה שוב מאוחר יותר.",
            mentalLoad: 0,
            burnoutRisk: 0,
            taskCount: 0
        };
    }
}


/**
 * Setup a "Smart Trigger" (Automation)
 * Example: When Task X is Done, suggest/create Task Y
 */
export async function suggestAutomation(taskId: string) {
    try {
        await connectDB();
        const task = await Task.findById(taskId);
        if (!task) return null;

        const prompt = `Task "${task.title}" was just completed. 
        What is the most logical next step? 
        If it's a "Design" task, maybe "Development". If it's "Meeting", maybe "Send follow-up".
        Return ONLY a 2-4 word task title in Hebrew.`;

        const result = await model.generateContent(prompt);
        const suggestedTitle = result.response.text().trim();

        return {
            taskId: task._id,
            suggestedTitle
        };
    } catch (error) {
        return null;
    }
}

export async function sendAIManagerReportEmail(reportText: string) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');
        
        const res = await sendWeeklySummaryEmail(session.name, session.email, reportText);
        if(!res.success) {
            return { success: false, error: res.error };
        }
        
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
