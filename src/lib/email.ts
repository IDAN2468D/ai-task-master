import { Resend } from 'resend';

// Lazy initialization — only create the Resend client when actually needed
let resend: Resend | null = null;

function getResend(): Resend | null {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
        return null;
    }
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

// ========================
// LOGIN NOTIFICATION EMAIL
// ========================
export async function sendLoginEmail(userName: string, userEmail: string) {
    try {
        const client = getResend();
        if (!client) {
            console.log('⚠️ Resend API key not configured — skipping login email');
            return;
        }
        const now = new Date();
        const loginTime = now.toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

        await client.emails.send({
            from: 'TaskFlow <onboarding@resend.dev>',
            to: userEmail,
            subject: '🔐 New Login to TaskFlow',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden;">
                    <div style="padding: 40px 30px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 12px 20px; border-radius: 12px; margin-bottom: 20px;">
                            <span style="font-size: 28px; font-weight: 900; color: white;">🚀 TaskFlow</span>
                        </div>
                    </div>
                    <div style="background: white; padding: 40px 30px; border-radius: 16px 16px 0 0;">
                        <h1 style="font-size: 24px; font-weight: 800; color: #1a1a2e; margin: 0 0 10px;">Hey ${userName}! 👋</h1>
                        <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">We detected a new login to your TaskFlow account.</p>
                        
                        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #4318FF;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">TIME</td>
                                    <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 700; text-align: right;">${loginTime}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">ACCOUNT</td>
                                    <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 700; text-align: right;">${userEmail}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">If this wasn't you, please secure your account immediately.</p>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 11px; margin: 0;">© ${now.getFullYear()} TaskFlow — AI-Powered Productivity</p>
                    </div>
                </div>
            `,
        });
        console.log('✅ Login email sent to:', userEmail);
    } catch (error) {
        console.error('❌ Failed to send login email:', error);
        // Don't throw — email failure should not block login
    }
}

// ========================
// NEW TASK CREATED EMAIL
// ========================
export async function sendTaskCreatedEmail(
    userName: string,
    userEmail: string,
    taskTitle: string,
    priority: string,
    category: string
) {
    try {
        const client = getResend();
        if (!client) {
            console.log('⚠️ Resend API key not configured — skipping task email');
            return;
        }
        const priorityColors: Record<string, string> = {
            High: '#ef4444',
            Medium: '#f59e0b',
            Low: '#22c55e',
        };

        const priorityColor = priorityColors[priority] || '#4318FF';

        await client.emails.send({
            from: 'TaskFlow <onboarding@resend.dev>',
            to: userEmail,
            subject: `✅ New Task Created: "${taskTitle}"`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4318FF 0%, #00E5FF 100%); border-radius: 16px; overflow: hidden;">
                    <div style="padding: 40px 30px; text-align: center;">
                        <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 12px 20px; border-radius: 12px; margin-bottom: 20px;">
                            <span style="font-size: 28px; font-weight: 900; color: white;">🚀 TaskFlow</span>
                        </div>
                    </div>
                    <div style="background: white; padding: 40px 30px; border-radius: 16px 16px 0 0;">
                        <h1 style="font-size: 24px; font-weight: 800; color: #1a1a2e; margin: 0 0 10px;">New Task Added! 🎯</h1>
                        <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">${userName}, you just created a new task in your board.</p>
                        
                        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 30px; border-left: 4px solid #4318FF;">
                            <h2 style="font-size: 20px; font-weight: 800; color: #1a1a2e; margin: 0 0 16px;">"${taskTitle}"</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">PRIORITY</td>
                                    <td style="padding: 8px 0; text-align: right;">
                                        <span style="background: ${priorityColor}20; color: ${priorityColor}; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase;">${priority}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">CATEGORY</td>
                                    <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 700; text-align: right;">${category}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">STATUS</td>
                                    <td style="padding: 8px 0; text-align: right;">
                                        <span style="background: #4318FF20; color: #4318FF; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 800;">TODO</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="http://localhost:3002/" style="display: inline-block; background: linear-gradient(135deg, #4318FF, #7B61FF); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">View Dashboard →</a>
                        </div>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} TaskFlow — AI-Powered Productivity</p>
                    </div>
                </div>
            `,
        });
        console.log('✅ Task creation email sent to:', userEmail);
    } catch (error) {
        console.error('❌ Failed to send task email:', error);
        // Don't throw — email failure should not block task creation
    }
}

// ========================
// WEEKLY SUMMARY EMAIL
// ========================
export async function sendWeeklySummaryEmail(userName: string, userEmail: string, reportText: string) {
    try {
        const client = getResend();
        if (!client) {
            console.log('⚠️ Resend API key not configured — skipping weekly email');
            return { success: false, error: 'No Resend API Key' };
        }
        
        await client.emails.send({
            from: 'TaskFlow <onboarding@resend.dev>',
            to: userEmail,
            subject: '📊 Your Weekly AI Intelligence Report',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #111C44 0%, #0B1437 100%); border-radius: 16px; overflow: hidden; color: white;">
                    <div style="padding: 40px 30px; text-align: center;">
                        <span style="font-size: 28px; font-weight: 900; color: #4318FF;">🧠 AI Intelligence Report</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 40px 30px; border-radius: 16px 16px 0 0; border-top: 1px solid rgba(255,255,255,0.1);">
                        <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 10px;">Hello ${userName},</h1>
                        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">Here is your weekly AI-generated intelligence report based on your tasks and performance.</p>
                        
                        <div style="background: rgba(67, 24, 255, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 30px; border-left: 4px solid #4318FF;">
                            <p style="font-size: 16px; font-weight: 600; font-style: italic; color: #e2e8f0; line-height: 1.5;">"${reportText}"</p>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="http://localhost:3000/" style="display: inline-block; background: linear-gradient(135deg, #4318FF, #7B61FF); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Go to Dashboard →</a>
                        </div>
                    </div>
                </div>
            `,
        });
        return { success: true };
    } catch (error: any) {
        console.error('❌ Failed to send weekly report email:', error);
        return { success: false, error: error.message };
    }
}
