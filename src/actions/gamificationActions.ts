'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import { getCurrentUser } from '@/actions/authActions';
import { revalidatePath } from 'next/cache';

/**
 * Award XP and points when a task is completed.
 */
export async function awardTaskCompletion(taskId: string, xpMultiplier: number = 1) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();
        const task = await Task.findById(taskId);
        if (!task || task.status !== 'Done' || task.xpAwarded) {
            return { success: false, message: 'Task already awarded or not done' };
        }

        const user = await User.findById(session.userId);
        if (!user) throw new Error('User not found');

        // Calculate XP based on priority
        const priorityXP: Record<string, number> = { High: 50, Medium: 30, Low: 15 };
        const baseXP = priorityXP[task.priority] || 20;
        const xpToGain = Math.floor(baseXP * xpMultiplier);
        const currencyToGain = Math.floor(xpToGain / 10); // 1 coin per 10 XP

        user.xp += xpToGain;
        user.currency += currencyToGain;

        // Level up logic (e.g., 1000 XP per level)
        const newLevel = Math.floor(user.xp / 1000) + 1;
        const leveledUp = newLevel > user.level;
        user.level = newLevel;

        task.xpAwarded = true;

        await user.save();
        await task.save();

        revalidatePath('/dashboard');
        return {
            success: true,
            xpGained: xpToGain,
            currencyGained: currencyToGain,
            leveledUp,
            currentLevel: user.level
        };
    } catch (error: any) {
        console.error('Gamification Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Buy an item from the shop.
 */
export async function buyShopItem(itemId: string, cost: number) {
    try {
        const session = await getCurrentUser();
        if (!session) throw new Error('Not authenticated');

        await connectDB();
        const user = await User.findById(session.userId);
        if (!user) throw new Error('User not found');

        if (user.currency < cost) {
            return { success: false, message: 'Insufficient currency' };
        }

        if (user.unlockedItems.includes(itemId)) {
            return { success: false, message: 'Item already unlocked' };
        }

        user.currency -= cost;
        user.unlockedItems.push(itemId);

        await user.save();
        revalidatePath('/profile');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get current user stats from DB.
 */
export async function getUserStats() {
    try {
        const session = await getCurrentUser();
        if (!session) return null;

        await connectDB();
        const user = await User.findById(session.userId);
        if (!user) return null;

        return {
            xp: user.xp || 0,
            level: user.level || 1,
            currency: user.currency || 0,
            unlockedItems: user.unlockedItems || []
        };
    } catch {
        return null;
    }
}
