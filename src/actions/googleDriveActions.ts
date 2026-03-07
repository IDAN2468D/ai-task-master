'use server';

import { oauth2Client, SCOPES } from '@/lib/googleAuth';
import { getCurrentUser } from '@/actions/authActions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { google } from 'googleapis';
import { revalidatePath } from 'next/cache';

/**
 * Generates the Google Auth URL for the user to connect their account.
 */
export async function getGoogleAuthUrl() {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent', // Force consent to get refresh token
    });
    return url;
}

/**
 * Checks if the user is connected to Google Drive and refresh tokens if needed.
 */
export async function isGoogleConnected() {
    const session = await getCurrentUser();
    if (!session) return false;

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user || !user.googleTokens?.refreshToken) return false;

    return true;
}

/**
 * Exports tasks to Google Drive as a CSV file.
 */
export async function exportTasksToDrive(tasks: any[]) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();
        const user = await User.findById(session.userId);
        if (!user || !user.googleTokens?.refreshToken) {
            throw new Error('Google Drive not connected');
        }

        // Set credentials
        oauth2Client.setCredentials({
            access_token: user.googleTokens.accessToken,
            refresh_token: user.googleTokens.refreshToken,
            expiry_date: user.googleTokens.expiryDate,
        });

        // Check if token is expired and refresh if necessary
        oauth2Client.on('tokens', async (tokens) => {
            if (tokens.refresh_token) {
                user.googleTokens.refreshToken = tokens.refresh_token;
            }
            if (tokens.access_token) {
                user.googleTokens.accessToken = tokens.access_token;
                user.googleTokens.expiryDate = tokens.expiry_date || Date.now() + 3600 * 1000;
                await user.save();
            }
        });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Prepare CSV Content
        const statusHe: Record<string, string> = { Todo: 'לביצוע', InProgress: 'בתהליך', Done: 'הושלם' };
        const priorityHe: Record<string, string> = { High: 'גבוהה', Medium: 'בינונית', Low: 'נמוכה' };

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

        const bom = '\uFEFF';
        const csvContent = bom + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        // Create File Metadata
        const fileMetadata = {
            name: `taskflow-export-${new Date().toISOString().split('T')[0]}.csv`,
            mimeType: 'text/csv',
        };

        const media = {
            mimeType: 'text/csv',
            body: csvContent,
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name, webViewLink',
        });

        return { success: true, link: response.data.webViewLink };
    } catch (error: any) {
        console.error('Google Drive Export Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Disconnect Google Drive
 */
export async function disconnectGoogleDrive() {
    const session = await getCurrentUser();
    if (!session) return;

    await connectDB();
    await User.findByIdAndUpdate(session.userId, { $unset: { googleTokens: "" } });
    revalidatePath('/profile');
}
