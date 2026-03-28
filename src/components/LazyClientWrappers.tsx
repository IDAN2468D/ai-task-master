'use client';

'use client';

import dynamic from 'next/dynamic';

// Lazy load these components - they use browser APIs and framer-motion
const SmartReminders = dynamic(() => import('./SmartReminders'), { ssr: false });
const SmartAIPanel = dynamic(() => import('./SmartAIPanel'), { ssr: false });
const KanbanBoard = dynamic(() => import('./KanbanBoard'), { ssr: false });
const DashboardStats = dynamic(() => import('./DashboardStats'), { ssr: false });
const SearchFilterBar = dynamic(() => import('./SearchFilterBar'), { ssr: false });
const AddTaskForm = dynamic(() => import('./AddTaskForm'), { ssr: false });
const StreakTracker = dynamic(() => import('./StreakTracker'), { ssr: false });
const FocusMode = dynamic(() => import('./FocusMode'), { ssr: false });
const TaskExport = dynamic(() => import('./TaskExport'), { ssr: false });
const AchievementBadges = dynamic(() => import('./AchievementBadges'), { ssr: false });

const GoalsTracker = dynamic(() => import('./GoalsTracker'), { ssr: false });
const WellnessWidget = dynamic(() => import('./WellnessWidget'), { ssr: false });
const CollaborativeHub = dynamic(() => import('./CollaborativeHub'), { ssr: false });
const AIManagerReport = dynamic(() => import('./AIManagerReport'), { ssr: false });
const FocusAmbience = dynamic(() => import('./FocusAmbience'), { ssr: false });

const DailyAIBriefing = dynamic(() => import('./DailyAIBriefing'), { ssr: false });
const ZenMode = dynamic(() => import('./ZenMode'), { ssr: false });
const SmartPriorityButton = dynamic(() => import('./SmartPriorityButton'), { ssr: false });

const AIGoalDecomposer = dynamic(() => import('./AIGoalDecomposer'), { ssr: false });
const VoiceEODJournal = dynamic(() => import('./VoiceEODJournal'), { ssr: false });
const EnergyLevelFilter = dynamic(() => import('./EnergyLevelFilter'), { ssr: false });
const WorkspaceChat = dynamic(() => import('./WorkspaceChat'), { ssr: false });
const MeetingToTask = dynamic(() => import('./MeetingToTask'), { ssr: false });
const AIProjectCharter = dynamic(() => import('./AIProjectCharter'), { ssr: false });
const OmniChannelSync = dynamic(() => import('./OmniChannelSync'), { ssr: false });
const VoiceExecution = dynamic(() => import('./VoiceExecution'), { ssr: false });
const AnimatedBeam = dynamic(() => import('./AnimatedBeam'), { ssr: false });
const ShimmerWrapper = dynamic(() => import('./ShimmerWrapper'), { ssr: false });
const BentoContainer = dynamic(() => import('./BentoContainer'), { ssr: false });

import { BentoItem } from './BentoContainer';

export function LazyOmniChannelSync() { return <OmniChannelSync />; }
export function LazyVoiceExecution() { return <VoiceExecution />; }
export function LazyAnimatedBeam(props: any) { return <AnimatedBeam {...props} />; }
export function LazyShimmerWrapper({ children, active }: any) { return <ShimmerWrapper active={active}>{children}</ShimmerWrapper>; }
export function LazyBentoContainer({ children, className }: any) { return <BentoContainer className={className}>{children}</BentoContainer>; }
export function LazyBentoItem(props: any) { return <BentoItem {...props} />; }

export const LazyTaskViewContainer = dynamic(() => import('./TaskViewContainer'), {
    ssr: false,
    loading: () => <div className="h-96 flex justify-center items-center text-slate-400 font-bold animate-pulse">טוען ממשק פעיל...</div>
});


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

export function LazyFocusMode({ tasks, onFocusChange }: { tasks: Task[], onFocusChange?: (isActive: boolean) => void }) {
    return <FocusMode tasks={tasks} onFocusChange={onFocusChange} />;
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

export function LazyKanbanBoard({ tasks }: { tasks: any[] }) {
    return <KanbanBoard tasks={tasks} />;
}

export function LazyDashboardStats({ tasks }: { tasks: any[] }) {
    return <DashboardStats tasks={tasks} />;
}

export function LazySearchFilterBar() {
    return <SearchFilterBar />;
}

export function LazyAddTaskForm() {
    return <AddTaskForm />;
}

export function LazyCollaborativeHub() {
    return <CollaborativeHub />;
}

export function LazyAIManagerReport({ report }: { report: any }) {

    const Component = AIManagerReport as any;
    return <Component report={report} />;
}

export function LazyFocusAmbience() {
    return <FocusAmbience />;
}

export function LazyDailyAIBriefing() {
    return <DailyAIBriefing />;
}

export function LazyZenMode({ tasks }: { tasks: Task[] }) {
    return <ZenMode tasks={tasks} />;
}

export function LazySmartPriorityButton() {
    return <SmartPriorityButton />;
}

export function LazyAIGoalDecomposer() {
    return <AIGoalDecomposer onGoalDecomposed={() => {}} />;
}

export function LazyVoiceEODJournal() {
    return <VoiceEODJournal onJournalProcessed={() => {}} />;
}

export function LazyEnergyLevelFilter({ currentFilter, onFilterChange }: { currentFilter: any, onFilterChange: any }) {
    return <EnergyLevelFilter currentFilter={currentFilter} onFilterChange={onFilterChange} />;
}

export function LazyWorkspaceChat() {
    return <WorkspaceChat />;
}

export function LazyMeetingToTask() {
    return <MeetingToTask />;
}

export function LazyAIProjectCharter() {
    return <AIProjectCharter />;
}

