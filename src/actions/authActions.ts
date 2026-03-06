'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendLoginEmail } from '@/lib/email';

// Simple hash function (for demo purposes - in production use bcrypt)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'taskflow-salt-2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hash = await hashPassword(password);
    return hash === hashedPassword;
}

// ========================
// REGISTER
// ========================
export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'All fields are required.' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
    }

    try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return { error: 'An account with this email already exists.' };
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

    } catch (err: any) {
        console.error('Registration error:', err);
        return { error: 'Something went wrong during registration.' };
    }

    redirect('/');
}

// ========================
// LOGIN
// ========================
export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required.' };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return { error: 'Invalid email or password.' };
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return { error: 'Invalid email or password.' };
        }

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        // Send login notification email (non-blocking)
        sendLoginEmail(user.name, user.email);

    } catch (err: any) {
        console.error('Login error:', err);
        return { error: 'Something went wrong during login.' };
    }

    redirect('/');
}

// ========================
// LOGOUT
// ========================
export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}

// ========================
// GET CURRENT USER
// ========================
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie) {
            return null;
        }

        const session = JSON.parse(sessionCookie.value);
        return session as { userId: string; name: string; email: string };
    } catch {
        return null;
    }
}
