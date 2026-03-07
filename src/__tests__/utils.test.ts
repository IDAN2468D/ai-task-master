import { formatDate, translatePriority } from '@/lib/utils';

describe('Utility Functions', () => {
    describe('formatDate', () => {
        it('should format date string correctly', () => {
            const date = '2026-03-07T00:00:00.000Z';
            expect(formatDate(date)).toBe('7.3.2026');
        });

        it('should return default text if date is missing', () => {
            expect(formatDate('')).toBe('לא הוגדר');
        });
    });

    describe('translatePriority', () => {
        it('should translate High to גבוהה', () => {
            expect(translatePriority('High')).toBe('גבוהה');
        });

        it('should return original text if translation not found', () => {
            expect(translatePriority('None')).toBe('None');
        });
    });
});
