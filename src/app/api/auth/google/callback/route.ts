import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/googleAuth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUser } from '@/actions/authActions';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/profile?error=' + error, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/profile?error=No code provided', request.url));
    }

    try {
        const session = await getCurrentUser();
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.refresh_token) {
            // This might happen if the user didn't get a new consent screen
            // or if they already authorized. In production, we'd handle this.
            console.warn('No refresh token received');
        }

        await connectDB();

        const updateData: any = {
            'googleTokens.accessToken': tokens.access_token,
            'googleTokens.expiryDate': tokens.expiry_date,
        };

        if (tokens.refresh_token) {
            updateData['googleTokens.refreshToken'] = tokens.refresh_token;
        }

        await User.findByIdAndUpdate(session.userId, {
            $set: updateData
        });

        // Redirect back to profile or home
        return NextResponse.redirect(new URL('/profile?success=google_connected', request.url));
    } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        return NextResponse.redirect(new URL('/profile?error=failed_to_exchange_token', request.url));
    }
}
