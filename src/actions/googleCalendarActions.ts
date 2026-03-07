'use server';

import { oauth2Client } from '@/lib/googleAuth';
import { getCurrentUser } from '@/actions/authActions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import { google } from 'googleapis';
import { revalidatePath } from 'next/cache';

/**
 * Synchronizes a single task to Google Calendar.
 */
export async function syncTaskToCalendar(taskId: string) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();

        // 1. Get User and Tokens
        const user = await User.findById(session.userId);
        if (!user || !user.googleTokens?.refreshToken) {
            throw new Error('Google account not connected');
        }

        // 2. Get Task
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (!task.dueDate) throw new Error('Task must have a due date to sync with calendar');

        // 3. Set OAuth Credentials
        oauth2Client.setCredentials({
            access_token: user.googleTokens.accessToken,
            refresh_token: user.googleTokens.refreshToken,
            expiry_date: user.googleTokens.expiryDate,
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // 4. Prepare Event Content
        // Format ISO date for start/end
        const dueDate = new Date(task.dueDate);
        const startDateTime = dueDate.toISOString();
        // End time is 1 hour later by default
        const endDateTime = new Date(dueDate.getTime() + 60 * 60 * 1000).toISOString();

        const event = {
            summary: `🚀 ${task.title}`,
            description: `קטגוריה: ${task.category}\nעדיפות: ${task.priority}\n\nנוצר ע"י AI Task Master`,
            start: {
                dateTime: startDateTime,
                timeZone: 'Asia/Jerusalem',
            },
            end: {
                dateTime: endDateTime,
                timeZone: 'Asia/Jerusalem',
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 30 },
                ],
            },
        };

        let response;

        if (task.googleEventId) {
            // Update existing event
            try {
                response = await calendar.events.update({
                    calendarId: 'primary',
                    eventId: task.googleEventId,
                    requestBody: event,
                });
            } catch (updateError: any) {
                // If event was deleted in Google Calendar, re-create it
                if (updateError.code === 410 || updateError.code === 404) {
                    response = await calendar.events.insert({
                        calendarId: 'primary',
                        requestBody: event,
                    });
                } else {
                    throw updateError;
                }
            }
        } else {
            // Create new event
            response = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: event,
            });
        }

        // 5. Update Task with Event ID
        task.googleEventId = response.data.id || undefined;
        task.googleCalendarLink = response.data.htmlLink || undefined;
        await task.save();

        revalidatePath('/');
        return { success: true, link: response.data.htmlLink };
    } catch (error: any) {
        console.error('Google Calendar Sync Error:', error.message);
        return { success: false, error: error.message };
    }
}
