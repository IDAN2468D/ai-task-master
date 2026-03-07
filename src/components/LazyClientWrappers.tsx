'use client';

import dynamic from 'next/dynamic';

// Lazy load these components - they use browser APIs and framer-motion
const StreakTracker = dynamic(() => import('./StreakTracker'), { ssr: false });
const FocusMode = dynamic(() => import('./FocusMode'), { ssr: false });
const TaskExport = dynamic(() => import('./TaskExport'), { ssr: false });
const AchievementBadges = dynamic(() => import('./AchievementBadges'), { ssr: false });
const GoalsTracker = dynamic(() => import('./GoalsTracker'), { ssr: false });
const WellnessWidget = dynamic(() => import('./WellnessWidget'), { ssr: false });
const SmartReminders = dynamic(() => import('./SmartReminders'), { ssr: false });
const SmartAIPanel = dynamic(() => import('./SmartAIPanel'), { ssr: false });

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    subtasks: any[];
    createdAt: string;
    dueDate?: string;
    tags?: any[];
    description?: string;
}

export function LazyFocusMode({ tasks }: { tasks: Task[] }) {
    return <FocusMode tasks={tasks} />;
}

export function LazyTaskExport({ tasks }: { tasks: Task[] }) {
    return <TaskExport tasks={tasks} />;
}

export function LazyStreakTracker() {
    return <StreakTracker />;
}

export function LazyAchievementBadges({ tasks }: { tasks: any[] }) {
    return <AchievementBadges tasks={tasks} />;
}

export function LazyGoalsTracker({ completedCount }: { completedCount: number }) {
    return <GoalsTracker completedCount={completedCount} />;
}

export function LazyWellnessWidget() {
    return <WellnessWidget />;
}

export function LazySmartReminders({ tasks }: { tasks: Task[] }) {
    return <SmartReminders tasks={tasks} />;
}

export function LazySmartAIPanel({ tasks }: { tasks: any[] }) {
    return <SmartAIPanel tasks={tasks} />;
}
