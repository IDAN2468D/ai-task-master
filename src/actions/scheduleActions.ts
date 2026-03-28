'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

import { ITask } from '@/models/Task';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function optimizeSchedule(tasks: ITask[]) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
            משימות נוכחיות של המשתמש:
            ${tasks.map(t => `- נשלח בתאריך: ${t.createdAt}, כותרת: ${t.title}, עדיפות: ${t.priority}, אנרגיה נדרשת: ${t.energyLevel}, שעות מוערכות: ${t.estimatedHours}`).join('\n')}

            נתח את עומס העבודה והצע "שעות זהב" (Golden Hours) לריכוז מקסימלי.
            בנוסף, חלק את המשימות ל-3 קטגוריות:
            1. קריטי (High Focus - משימות שחייבות להיעשות בשעות השיא).
            2. שגרתי (Routine - משימות שאפשר לעשות מחוץ לשעות השיא).
            3. עבודה קלה (Low Energy - משימות שניתן לעשות בסיום היום).

            השב בפורמט JSON בלבד:
            {
                "goldenHours": "XX:XX - YY:YY",
                "reasoning": "string",
                "optimizedPlan": [
                    { "taskId": "string", "category": "HighFocus | Routine | LowEnergy", "suggestedTime": "string" }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from potential markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        return data;
    } catch (error) {
        console.error('Failed to optimize schedule:', error);
        return {
            goldenHours: "10:00 - 13:00",
            reasoning: "לא ניתן היה לגשת ל-AI, משמש כברירת מחדל.",
            optimizedPlan: []
        };
    }
}
