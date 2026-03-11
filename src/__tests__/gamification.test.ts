import { awardTaskCompletion, buyShopItem, getUserStats } from '@/actions/gamificationActions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import { getCurrentUser } from '@/actions/authActions';

jest.mock('@/lib/mongodb');
jest.mock('@/actions/authActions');
jest.mock('@/models/User');
jest.mock('@/models/Task');
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

describe('Gamification Actions', () => {
    const mockUserId = 'user123';
    const mockTaskId = 'task123';

    beforeEach(() => {
        jest.clearAllMocks();
        (getCurrentUser as jest.Mock).mockResolvedValue({ userId: mockUserId });
    });

    describe('awardTaskCompletion', () => {
        it('should award XP and currency for a completed task', async () => {
            const mockUser = {
                _id: mockUserId,
                xp: 100,
                currency: 10,
                level: 1,
                save: jest.fn().mockResolvedValue(true),
            };

            const mockTask = {
                _id: mockTaskId,
                status: 'Done',
                priority: 'High',
                xpAwarded: false,
                save: jest.fn().mockResolvedValue(true),
            };

            (User.findById as jest.Mock).mockResolvedValue(mockUser);
            (Task.findById as jest.Mock).mockResolvedValue(mockTask);

            const result = await awardTaskCompletion(mockTaskId);

            expect(result.success).toBe(true);
            expect(mockUser.xp).toBe(150); // 100 + 50 for High
            expect(mockUser.currency).toBe(15); // 10 + 5
            expect(mockTask.xpAwarded).toBe(true);
        });

        it('should not award XP if task is not Done', async () => {
            const mockTask = { status: 'Todo', xpAwarded: false };
            (Task.findById as jest.Mock).mockResolvedValue(mockTask);

            const result = await awardTaskCompletion(mockTaskId);
            expect(result.success).toBe(false);
        });
    });

    describe('buyShopItem', () => {
        it('should allow buying an item if user has enough currency', async () => {
            const mockUser = {
                currency: 500,
                unlockedItems: [],
                save: jest.fn().mockResolvedValue(true),
            };

            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await buyShopItem('theme-ocean', 200);

            expect(result.success).toBe(true);
            expect(mockUser.currency).toBe(300);
            expect(mockUser.unlockedItems).toContain('theme-ocean');
        });

        it('should fail if user has insufficient currency', async () => {
            const mockUser = { currency: 50, unlockedItems: [] };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await buyShopItem('theme-gold', 500);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Insufficient currency');
        });
    });
});
