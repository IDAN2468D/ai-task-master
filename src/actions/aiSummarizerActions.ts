'use server';

import { model } from '@/lib/gemini';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { getCurrentUser } from '@/actions/authActions';
import { revalidatePath } from 'next/cache';

/**
 * AI Summarizer: Summarize a given URL and attach it to a task.
 */
export async function summarizeAndAddLink(taskId: string, url: string) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');

        // 1. Fetch the page title or meta description for context
        // (Simple fetch to avoid heavy dependencies, extracting only basic meta)
        let summary = "No summary available";
        try {
            const response = await fetch(url);
            const html = await response.text();

            // Basic regex to find title and description as Gemini input
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : url;

            const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
            const description = descMatch ? descMatch[1] : "No description found in metadata.";

            // 2. Ask Gemini to summarize based on the metadata
            const prompt = `אתה עוזר AI חכם. סכם לי בבקשה בצורה מעניינת (עד 2 משפטים) את התוכן של הקישור הבא המבוסס על הכותרת והתיאור שלו:
            כותרת: ${title}
            תיאור: ${description}
            URL: ${url}
            
            הסיכום צריך להיות בעברית.`;

            const result = await model.generateContent(prompt);
            summary = result.response.text().trim();
        } catch (fetchErr) {
            console.error('Failed to fetch URL for summary:', fetchErr);
            summary = "לא הצלחתי לשאוב מידע מהקישור, אך הוא נוסף לרשימה.";
        }

        // 3. Update task
        task.links.push({ url, summary });
        await task.save();

        revalidatePath('/dashboard');
        return { success: true, link: { url, summary } };
    } catch (error: any) {
        console.error('AI Summarizer Error:', error);
        return { success: false, error: error.message };
    }
}
