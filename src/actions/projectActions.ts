'use server';

import { model } from '@/lib/gemini';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { getCurrentUser, getFullUser } from '@/actions/authActions';
import { revalidatePath } from 'next/cache';


/**
 * Generates a full project structure from a single description prompt.
 */
export async function generateProjectCharter(description: string) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();
        const user = await getFullUser();

        const prompt = `
        User wants to start a new project: "${description}".
        Generate a structured project plan in JSON format.
        The JSON must contain:
        1. "projectName": A concise, bold project name in Hebrew.
        2. "milestones": An array of 3-5 strings in Hebrew representing major phases.
        3. "tasks": An array of objects, each with:
           - "title": (string, Hebrew) A specific actionable task.
           - "priority": ("Low" | "Medium" | "High")
           - "category": (string, Hebrew, default to "פרויקט")
           - "estimatedHours": (number)
           - "energyLevel": ("Low" | "Medium" | "High")
        
        Return ONLY the JSON. No markdown backticks, no extra text.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, '').trim();
        const data = JSON.parse(text);

        const projectId = `proj_${Date.now()}`;

        // Create tasks in the database
        const taskPromises = data.tasks.map((t: any) => {
            return Task.create({
                ...t,
                userId: session.userId,
                projectId: projectId,
                status: 'Todo',
                description: `חלק מהפרויקט: ${data.projectName}. שלב: ${data.milestones[0] || 'התחלה'}`,
                workspaceCode: user?.workspaceCode || 'default'
            });
        });

        await Promise.all(taskPromises);

        revalidatePath('/');
        return { success: true, projectName: data.projectName, taskCount: data.tasks.length };
    } catch (error: any) {

        console.error('Project Charter Error:', error);
        return { success: false, error: error.message };
    }
}
