'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const DEMO_USER_EMAIL = 'demo@taskmaster.ai';
const DEMO_USER_NAME = 'משתמש דמו';

// ========================
// ENSURE DEMO USER EXISTS
// ========================
async function ensureDemoUser() {
    await connectDB();
    let user = await User.findOne({ email: DEMO_USER_EMAIL });

    if (!user) {
        user = await User.create({
            name: DEMO_USER_NAME,
            email: DEMO_USER_EMAIL,
            password: 'demo-password-never-shared', // Dummy password
            xp: 150,
            level: 2,
            currency: 50,
        });
    }
    return user;
}

// ========================
// SET SESSION
// ========================
async function setSession(user: any) {
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || null,
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year (auto-login)
        path: '/',
    });
}

// Simple hash function (for demo purposes - in production use bcrypt)
async function hashPassword(password: string): Promise<string> {
    return password; // For demo, we store plaintext (or a dummy hash)
}

// ========================
// REGISTER
// ========================
export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = (formData.get('email') as string)?.toLowerCase();
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'Please fill in all fields.' };
    }

    try {
        await connectDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'User already exists.' };
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        await setSession(user);
        return { success: true };
    } catch (err: any) {
        console.error('Registration error:', err);
        return { error: 'Something went wrong during registration.' };
    }
}

// ========================
// LOGIN
// ========================
export async function loginUser(formData: FormData) {
    const email = (formData.get('email') as string)?.toLowerCase();
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please provide email and password.' };
    }

    try {
        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
            return { error: 'Invalid credentials.' };
        }

        // Simple check for demo
        if (user.password !== password) {
            return { error: 'Invalid credentials.' };
        }

        await setSession(user);
        return { success: true };
    } catch (err: any) {
        console.error('Login error:', err);
        return { error: 'Something went wrong during login.' };
    }
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
        return session as { userId: string; name: string; email: string; image?: string };
    } catch {
        return null;
    }
}

// ========================
// INITIALIZE DEMO SESSION (Called from Client)
// ========================
export async function initializeDemoSession() {
    const user = await getCurrentUser();
    if (user) return { success: true };

    const demoUser = await ensureDemoUser();
    await setSession(demoUser);
    return { success: true };
}

export async function getFullUser() {
    try {
        const session = await getCurrentUser();
        if (!session) return null;

        await connectDB();
        const user = await User.findById(session.userId).lean();
        if (!user) return null;

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error fetching full user:', error);
        return null;
    }
}

// ========================
// UPDATE PROFILE
// ========================
export async function updateProfile(formData: FormData) {
    const name = formData.get('name') as string;
    const image = formData.get('image') as string;

    try {
        const session = await getCurrentUser();
        if (!session) return { error: 'Not authenticated' };

        await connectDB();
        const user = await User.findById(session.userId);
        if (!user) return { error: 'User not found' };

        if (name) user.name = name;
        if (image !== undefined) user.image = image;

        await user.save();
        await setSession(user);

        return { success: true };
    } catch (err: any) {
        console.error('Update profile error:', err);
        return { error: 'Failed to update profile.' };
    }
}

