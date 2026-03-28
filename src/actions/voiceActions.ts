'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


export async function generateProjectFromVoice(transcription: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
            התמלול הבא הוא רשימת משימות או פרויקט שהמשתמש הקליט בקולו:
            "${transcription}"

            הפוך את התמלול למבנה פרויקט מסודר עם:
            1. שם פרויקט (בצורה של כותרת משימה ראשית).
            2. רשימת משימות ספציפיות.
            3. עדיפות לכל משימה.
            4. הערכת זמן (estimatedHours).

            השב בפורמט JSON בלבד:
            {
                "projectName": "string",
                "tasks": [
                    { "title": "string", "priority": "Low | Medium | High", "estimatedHours": number, "description": "string" }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || '{}');

        // Logic to actually save multiple tasks can be added here
        return data;
    } catch (error) {
        console.error('Failed to parse voice project:', error);
        return null;
    }
}
