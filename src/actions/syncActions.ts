'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import Task from "@/models/Task";
import { getFullUser } from "./authActions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function parseOmniChannelText(text: string) {
    try {
        const user = await getFullUser();
        if (!user) throw new Error("Unauthorized");

        const prompt = `
        Analyze the following text from an external source (Slack, Email, etc.) and extract actionable tasks.
        Text: "${text}"

        Return a JSON array of tasks with the following structure:
        [{
            "title": "Short descriptive title",
            "priority": "High" | "Medium" | "Low",
            "category": "Work" | "Personal" | "Urgent" | "Misc",
            "energyLevel": 1 | 2 | 3 | 4 | 5,
            "estimatedHours": number,
            "description": "Short summary or context"
        }]

        Only return the JSON array. If no tasks are found, return [].
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        const extractedTasks = JSON.parse(jsonText);

        if (extractedTasks.length === 0) return { success: true, tasksCreated: 0 };

        const tasksToCreate = extractedTasks.map((t: any) => ({
            ...t,
            user: user._id,
            workspaceCode: user.workspaceCode,
            status: 'Todo'
        }));

        await Task.insertMany(tasksToCreate);

        return { success: true, tasksCreated: tasksToCreate.length };

    } catch (error: any) {
        console.error("OmniChannelSync Error:", error);
        return { success: false, error: error.message };
    }
}
